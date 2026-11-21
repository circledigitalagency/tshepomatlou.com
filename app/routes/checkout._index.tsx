import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { AnimatePresence, motion } from "framer-motion";
import { MinusIcon, PlusIcon, ShieldCheckIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { shopData } from "~/lib/@data";
import MainLayout from "~/components/_layout/main";
import { AnimatedPrice } from "~/components/animated/price";
import Loader from "~/components/animated/loader";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { generateRef } from "~/lib/utils";
import { useCart } from "~/context/CartContext";

/* ─────────────────────────────── Delivery (PAXI via PEP) ─────────────────────────────── */

/** Books that fit in one PAXI Standard bag (45×37cm, 5kg). Bigger orders use the Large bag. */
const BOOKS_PER_STANDARD_BAG = 6;

const DELIVERY_METHODS = {
	standard: {
		label: "Standard",
		detail: "Collect at a PEP store · 7–9 business days",
		fee: { standardBag: 70, largeBag: 130 },
		toStore: true,
	},
	express: {
		label: "Express",
		detail: "Collect at a PEP store · 3–5 business days",
		fee: { standardBag: 120, largeBag: 150 },
		toStore: true,
	},
	home: {
		label: "Home delivery",
		detail: "Delivered to your door · 3–5 business days",
		fee: { standardBag: 130, largeBag: 160 },
		toStore: false,
	},
} as const;

type DeliveryMethod = keyof typeof DELIVERY_METHODS;

function deliveryFee(method: DeliveryMethod, bookCount: number) {
	if (bookCount <= 0) return 0;
	const { fee } = DELIVERY_METHODS[method];
	return bookCount <= BOOKS_PER_STANDARD_BAG ? fee.standardBag : fee.largeBag;
}

/* ─────────────────────────────── Validation ─────────────────────────────── */

type ActionData = {
	success: boolean;
	errors?: Record<string, string[] | undefined>;
	formErrors?: string;
};

type PaymentErrorResponse = { description: string };

const itemsSchema = z
	.array(
		z.object({ id: z.string(), qty: z.coerce.number().int().min(1).max(99) }),
	)
	.min(1, "Your cart is empty");

const required = (msg: string) => z.string().trim().min(1, msg);

const baseSchema = z.object({
	items: z.string(),
	name: required("Please enter your full name"),
	email: z.string().trim().email("Please enter a valid email address"),
	phone: z
		.string()
		.transform((v) => v.replace(/[\s()-]/g, ""))
		.refine(
			(v) => /^(\+27|0)[1-8]\d{8}$/.test(v),
			"Please enter a valid SA cellphone number",
		),
});

const formSchema = z.discriminatedUnion("delivery", [
	baseSchema.extend({
		delivery: z.literal("standard"),
		store: required("Please tell us which PEP store to send it to"),
	}),
	baseSchema.extend({
		delivery: z.literal("express"),
		store: required("Please tell us which PEP store to send it to"),
	}),
	baseSchema.extend({
		delivery: z.literal("home"),
		street: required("Please enter your street address"),
		suburb: required("Please enter your suburb"),
		city: required("Please enter your city or town"),
		postalCode: z
			.string()
			.trim()
			.regex(/^\d{4}$/, "Please enter a 4-digit postal code"),
	}),
]);

/* ─────────────────────────────── Server ─────────────────────────────── */

export async function action({ request }: { request: Request }) {
	const formData = await request.formData();
	const parsed = formSchema.safeParse(Object.fromEntries(formData));

	if (!parsed.success) {
		return json<ActionData>({
			success: false,
			errors: parsed.error.flatten().fieldErrors,
		});
	}
	const form = parsed.data;

	// The browser only tells us WHICH books and HOW MANY.
	// Book prices and the delivery fee are always worked out here on the server.
	let items: z.infer<typeof itemsSchema>;
	try {
		items = itemsSchema.parse(JSON.parse(form.items));
	} catch {
		return json<ActionData>({
			success: false,
			formErrors: "Your cart looks empty or invalid. Please try again.",
		});
	}

	const order = items.map(({ id, qty }) => {
		const book = shopData.find((b) => b.id === id);
		return book ? { book, qty } : null;
	});
	if (order.some((l) => l === null)) {
		return json<ActionData>({
			success: false,
			formErrors: "One of the books in your cart is no longer available.",
		});
	}
	const lines = order as { book: (typeof shopData)[number]; qty: number }[];

	const subtotal = lines.reduce((sum, l) => sum + l.book.price * l.qty, 0);
	const bookCount = lines.reduce((n, l) => n + l.qty, 0);
	const delivery = deliveryFee(form.delivery, bookCount);
	const amountInCents = Math.round((subtotal + delivery) * 100);

	const method = DELIVERY_METHODS[form.delivery];
	const deliverTo =
		form.delivery === "home"
			? `${form.street}, ${form.suburb}, ${form.city}, ${form.postalCode}`
			: `PEP store: ${form.store}`;

	const reference = generateRef();
	const secretKey = process.env.YOCO_SECRET_API_KEY;
	const web_url = process.env.WEB_URL;

	const response = await fetch("https://payments.yoco.com/api/checkouts", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${secretKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			amount: amountInCents,
			currency: "ZAR",
			successUrl: `${web_url}thank-you?email=${encodeURIComponent(
				form.email,
			)}&ref=${reference}`,
			failureUrl: `${web_url}checkout`,
			cancelUrl: `${web_url}checkout`,
			customer: { email: form.email },
			// Everything needed to send the PAXI parcel
			metadata: {
				reference,
				name: form.name,
				email: form.email,
				phone: form.phone,
				items: lines.map((l) => `${l.book.name} x${l.qty}`).join(", "),
				delivery: `${method.label} (R${delivery})${
					bookCount > BOOKS_PER_STANDARD_BAG ? " · Large bag" : ""
				}`,
				deliverTo,
			},
		}),
	});

	if (!response.ok) {
		const error = (await response.json()) as PaymentErrorResponse;
		return json<ActionData>({ success: false, formErrors: error.description });
	}

	const data = await response.json();
	return redirect(data.redirectUrl);
}

/* ─────────────────────────────── Page ─────────────────────────────── */

export default function Checkout() {
	const {
		lines,
		total: subtotal,
		count,
		setQty,
		remove,
		add,
		ready,
	} = useCart();
	const actionData = useActionData<typeof action>();
	const navigation = useNavigation();
	const submitting = navigation.state !== "idle";
	const errors = actionData?.errors;

	const [method, setMethod] = useState<DeliveryMethod>("standard");
	const delivery = deliveryFee(method, count);
	const grandTotal = subtotal + delivery;
	const itemsJson = JSON.stringify(
		lines.map((l) => ({ id: l.book.id, qty: l.qty })),
	);
	const missing = shopData.filter(
		(b) => !lines.some((l) => l.book.id === b.id),
	);

	return (
		<MainLayout>
			<div className="container mx-auto px-4 pb-16 pt-28">
				<div className="mb-8">
					<p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-sage">
						Checkout
					</p>
					<h1 className="font-serif text-4xl font-light text-[#3D3328]">
						Your <em className="italic text-sage">order</em>
					</h1>
				</div>

				{!ready ? (
					<div className="grid place-items-center py-24">
						<Loader />
					</div>
				) : lines.length === 0 ? (
					<EmptyCart />
				) : (
					<Form
						method="post"
						noValidate
						className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_400px]"
					>
						{/* which books + how many — the server works out the price */}
						<input type="hidden" name="items" value={itemsJson} />

						{/* ───────── LEFT ───────── */}
						<div className="space-y-6">
							{/* Items */}
							<Card className="border-0 bg-white/90 shadow-lg backdrop-blur-sm">
								<CardContent className="p-0">
									<ul className="divide-y divide-gray-100">
										<AnimatePresence initial={false}>
											{lines.map(({ book, qty }) => (
												<motion.li
													key={book.id}
													layout
													initial={{ opacity: 0, height: 0 }}
													animate={{ opacity: 1, height: "auto" }}
													exit={{ opacity: 0, height: 0 }}
													className="overflow-hidden"
												>
													<div className="flex gap-5 p-5 sm:p-6">
														<img
															src={book.cover.front}
															alt={`${book.name} cover`}
															className="h-28 w-[78px] shrink-0 rounded-sm object-cover shadow-md sm:h-32 sm:w-[90px]"
														/>
														<div className="flex min-w-0 flex-1 flex-col">
															<div className="flex items-start justify-between gap-4">
																<div className="min-w-0">
																	<h2 className="font-serif text-xl leading-tight text-[#3D3328]">
																		{book.name}
																	</h2>
																	<p className="mt-1 font-serif text-sm italic text-gray-500">
																		{book.subtitle}
																	</p>
																</div>
																<p className="shrink-0 font-serif text-xl text-[#3D3328]">
																	R{(book.price * qty).toFixed(2)}
																</p>
															</div>

															<div className="mt-auto flex items-center justify-between pt-4 font-sans">
																<div className="flex items-center rounded-full border border-gray-200 bg-white">
																	<button
																		type="button"
																		onClick={() => setQty(book.id, qty - 1)}
																		disabled={qty <= 1}
																		aria-label={`One less ${book.name}`}
																		className="grid h-9 w-9 place-items-center rounded-full text-gray-600 transition hover:bg-gray-100 disabled:opacity-30"
																	>
																		<MinusIcon className="h-4 w-4" />
																	</button>
																	<motion.span
																		key={qty}
																		initial={{ scale: 0.8, opacity: 0 }}
																		animate={{ scale: 1, opacity: 1 }}
																		className="w-8 text-center font-semibold tabular-nums text-gray-900"
																	>
																		{qty}
																	</motion.span>
																	<button
																		type="button"
																		onClick={() => setQty(book.id, qty + 1)}
																		aria-label={`One more ${book.name}`}
																		className="grid h-9 w-9 place-items-center rounded-full text-gray-600 transition hover:bg-gray-100"
																	>
																		<PlusIcon className="h-4 w-4" />
																	</button>
																</div>
																<div className="flex items-center gap-4">
																	<span className="hidden text-sm text-gray-500 sm:inline">
																		R{book.price.toFixed(2)} each
																	</span>
																	<button
																		type="button"
																		onClick={() => remove(book.id)}
																		aria-label={`Remove ${book.name}`}
																		className="grid h-9 w-9 place-items-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-500"
																	>
																		<Trash2Icon className="h-4 w-4" />
																	</button>
																</div>
															</div>
														</div>
													</div>
												</motion.li>
											))}
										</AnimatePresence>
									</ul>
								</CardContent>
							</Card>

							{/* Complete the set */}
							<AnimatePresence>
								{missing.map((book) => (
									<motion.div
										key={book.id}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										className="flex items-center gap-5 rounded-xl border border-dashed border-sage/40 bg-sage-pale/60 p-5"
									>
										<img
											src={book.cover.front}
											alt=""
											className="h-24 w-[68px] shrink-0 rounded-sm object-cover shadow"
										/>
										<div className="min-w-0 flex-1">
											<p className="text-xs font-medium uppercase tracking-[0.16em] text-sage">
												Complete the set
											</p>
											<p className="font-serif text-lg leading-tight text-[#3D3328]">
												{book.name}
											</p>
											<p className="text-sm text-gray-500">
												R{book.price.toFixed(2)} · ships in the same parcel
											</p>
										</div>
										<button
											type="button"
											onClick={() => add(book.id)}
											className="flex shrink-0 items-center gap-1.5 rounded-full border border-sage px-4 py-2 text-sm text-sage transition hover:bg-sage hover:text-white"
										>
											<PlusIcon className="h-4 w-4" /> Add
										</button>
									</motion.div>
								))}
							</AnimatePresence>

							{/* Delivery */}
							<Card className="border-0 bg-white/90 shadow-lg backdrop-blur-sm">
								<CardContent className="space-y-6 p-5 font-sans sm:p-6">
									<SectionTitle step={1}>Delivery</SectionTitle>

									<fieldset className="grid gap-3 sm:grid-cols-3">
										<legend className="sr-only">Delivery method</legend>
										{(Object.keys(DELIVERY_METHODS) as DeliveryMethod[]).map(
											(key) => {
												const m = DELIVERY_METHODS[key];
												const selected = method === key;
												return (
													<label
														key={key}
														className={`relative flex cursor-pointer flex-col rounded-xl border-2 p-4 transition ${
															selected
																? "border-sage bg-sage-pale/50"
																: "border-gray-200 hover:border-gray-300"
														}`}
													>
														<input
															type="radio"
															name="delivery"
															value={key}
															checked={selected}
															onChange={() => setMethod(key)}
															className="sr-only"
														/>
														<span className="flex items-center justify-between">
															<span className="font-semibold text-gray-900">
																{m.label}
															</span>
															<span
																className={`grid h-4 w-4 place-items-center rounded-full border-2 ${
																	selected ? "border-sage" : "border-gray-300"
																}`}
															>
																{selected && (
																	<span className="h-2 w-2 rounded-full bg-sage" />
																)}
															</span>
														</span>
														<span className="mt-1 text-xs leading-5 text-gray-500">
															{m.detail}
														</span>
														<span className="mt-3 font-serif text-xl text-[#3D3328]">
															R{deliveryFee(key, count)}
														</span>
													</label>
												);
											},
										)}
									</fieldset>

									<AnimatePresence mode="wait" initial={false}>
										{DELIVERY_METHODS[method].toStore ? (
											<motion.div
												key="store"
												initial={{ opacity: 0, y: 6 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -6 }}
												className="space-y-2"
											>
												<FieldLabel htmlFor="store">
													PEP store for collection
												</FieldLabel>
												<Input
													id="store"
													name="store"
													placeholder="e.g. PEP Mall of the South, Johannesburg"
													className="w-full"
													error={errors?.store}
												/>
												<p className="text-xs text-gray-500">
													Any PEP store that offers PAXI. Not sure which?{" "}
													<a
														href="https://www.paxi.co.za/paxi-points"
														target="_blank"
														rel="noreferrer"
														className="text-sage underline underline-offset-2"
													>
														Find a PAXI point
													</a>
													. We'll SMS you when it's ready to collect.
												</p>
											</motion.div>
										) : (
											<motion.div
												key="home"
												initial={{ opacity: 0, y: 6 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -6 }}
												className="grid gap-4 sm:grid-cols-2"
											>
												<div className="space-y-2 sm:col-span-2">
													<FieldLabel htmlFor="street">
														Street address
													</FieldLabel>
													<Input
														id="street"
														name="street"
														autoComplete="street-address"
														placeholder="House number, street name, complex / unit"
														className="w-full"
														error={errors?.street}
													/>
												</div>
												<div className="space-y-2">
													<FieldLabel htmlFor="suburb">Suburb</FieldLabel>
													<Input
														id="suburb"
														name="suburb"
														autoComplete="address-level3"
														className="w-full"
														error={errors?.suburb}
													/>
												</div>
												<div className="space-y-2">
													<FieldLabel htmlFor="city">City / town</FieldLabel>
													<Input
														id="city"
														name="city"
														autoComplete="address-level2"
														className="w-full"
														error={errors?.city}
													/>
												</div>
												<div className="space-y-2">
													<FieldLabel htmlFor="postalCode">
														Postal code
													</FieldLabel>
													<Input
														id="postalCode"
														name="postalCode"
														inputMode="numeric"
														autoComplete="postal-code"
														maxLength={4}
														className="w-full"
														error={errors?.postalCode}
													/>
												</div>
											</motion.div>
										)}
									</AnimatePresence>
								</CardContent>
							</Card>

							{/* Contact */}
							<Card className="border-0 bg-white/90 shadow-lg backdrop-blur-sm">
								<CardContent className="space-y-6 p-5 font-sans sm:p-6">
									<SectionTitle step={2}>Your details</SectionTitle>
									<div className="grid gap-4 sm:grid-cols-2">
										<div className="space-y-2 sm:col-span-2">
											<FieldLabel htmlFor="name">Full name</FieldLabel>
											<Input
												id="name"
												name="name"
												autoComplete="name"
												className="w-full"
												error={errors?.name}
											/>
										</div>
										<div className="space-y-2">
											<FieldLabel htmlFor="phone">Cellphone</FieldLabel>
											<Input
												id="phone"
												name="phone"
												type="tel"
												autoComplete="tel"
												placeholder="082 123 4567"
												className="w-full"
												error={errors?.phone}
											/>
										</div>
										<div className="space-y-2">
											<FieldLabel htmlFor="email">Email</FieldLabel>
											<Input
												id="email"
												name="email"
												type="email"
												autoComplete="email"
												placeholder="you@example.com"
												className="w-full"
												error={errors?.email}
											/>
										</div>
									</div>
									<p className="text-xs text-gray-500">
										PAXI sends collection and tracking updates by SMS. Your
										receipt goes to your email.
									</p>
								</CardContent>
							</Card>
						</div>

						{/* ───────── RIGHT: summary ───────── */}
						<Card className="border-0 bg-white/90 shadow-lg backdrop-blur-sm lg:sticky lg:top-28">
							<CardContent className="space-y-6 p-6 sm:p-8">
								<h2 className="font-serif text-2xl font-light text-[#3D3328]">
									Summary
								</h2>

								<div className="space-y-3 rounded-xl bg-gray-50 p-5 font-sans text-sm text-gray-600">
									{lines.map(({ book, qty }) => (
										<div key={book.id} className="flex justify-between gap-4">
											<span className="truncate">
												{book.title} {book.titleEm}{" "}
												<span className="text-gray-400">× {qty}</span>
											</span>
											<span className="shrink-0">
												R{(book.price * qty).toFixed(2)}
											</span>
										</div>
									))}

									<div className="flex justify-between border-t border-gray-200 pt-3">
										<span>
											Subtotal ({count} {count === 1 ? "book" : "books"})
										</span>
										<span>R{subtotal.toFixed(2)}</span>
									</div>
									<div className="flex justify-between gap-4">
										<span>
											Delivery
											<span className="block text-xs text-gray-400">
												{DELIVERY_METHODS[method].label} · PAXI
											</span>
										</span>
										<motion.span
											key={delivery}
											initial={{ opacity: 0, y: -4 }}
											animate={{ opacity: 1, y: 0 }}
										>
											R{delivery.toFixed(2)}
										</motion.span>
									</div>

									<div className="flex items-center justify-between border-t border-gray-200 pt-3">
										<span className="text-lg font-semibold text-gray-900">
											Total
										</span>
										<span className="text-2xl font-bold text-primary">
											<AnimatedPrice amount={grandTotal} />
										</span>
									</div>
								</div>

								{(actionData?.formErrors || errors) && (
									<p className="text-sm text-red-500">
										{actionData?.formErrors ??
											"Please check the highlighted fields."}
									</p>
								)}

								<motion.button
									type="submit"
									disabled={submitting}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									className="grid h-14 w-full place-items-center rounded-full bg-sage font-sans text-lg font-semibold text-white shadow-lg transition-shadow hover:shadow-xl disabled:opacity-80"
								>
									{submitting ? <Loader /> : `Pay R${grandTotal.toFixed(2)}`}
								</motion.button>

								<div className="flex items-center justify-center gap-6 border-t border-gray-200 pt-4 font-sans">
									<div className="flex items-center gap-2 text-sm text-gray-600">
										<ShieldCheckIcon className="h-4 w-4 text-green-600" />
										<span>Secure Payment</span>
									</div>
									<div className="flex items-center gap-2 text-sm text-gray-600">
										<span>Powered by</span>
										<img src="/logo_yoco.png" alt="Yoco" className="h-8 w-16" />
									</div>
								</div>
							</CardContent>
						</Card>
					</Form>
				)}
			</div>
		</MainLayout>
	);
}

/* ─────────────────────────────── Small bits ─────────────────────────────── */

function SectionTitle({
	step,
	children,
}: {
	step: number;
	children: React.ReactNode;
}) {
	return (
		<h2 className="flex items-center gap-3 font-serif text-2xl font-light text-[#3D3328]">
			<span className="grid h-7 w-7 place-items-center rounded-full bg-sage font-sans text-sm font-medium text-white">
				{step}
			</span>
			{children}
		</h2>
	);
}

function FieldLabel({
	htmlFor,
	children,
}: {
	htmlFor: string;
	children: React.ReactNode;
}) {
	return (
		<label
			htmlFor={htmlFor}
			className="block text-sm font-medium text-gray-700"
		>
			{children}
		</label>
	);
}

function EmptyCart() {
	return (
		<Card className="border-0 bg-white/90 shadow-lg">
			<CardContent className="flex flex-col items-center gap-4 px-6 py-20 text-center">
				<p className="font-serif text-2xl font-light text-[#3D3328]">
					Your cart is empty
				</p>
				<p className="max-w-sm text-gray-500">
					Have a look at the books and add one (or both) to your cart.
				</p>
				<Link
					to="/#shop"
					className="mt-2 rounded-full bg-sage px-6 py-3 font-sans text-white transition hover:bg-[#3D3328]"
				>
					Browse the books
				</Link>
			</CardContent>
		</Card>
	);
}
