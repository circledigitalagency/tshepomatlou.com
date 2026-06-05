import {
	Form,
	useActionData,
	useLoaderData,
	useNavigation,
} from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { shopData } from "~/lib/@data";
import { useEffect, useRef, useState } from "react";
import MainLayout from "~/components/_layout/main";
import { MinusCircleIcon, PlusCircleIcon, ShieldCheckIcon } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedPrice } from "~/components/animated/price";
import Header from "~/components/text/header";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { z } from "zod";
import { generateRef } from "~/lib/utils";
import Loader from "~/components/animated/loader";

export async function loader({ params }: { params: { id: string } }) {
	const product = shopData.find((p) => p.id === params.id);
	if (!product) throw new Response("Product Not Found", { status: 404 });
	return json(product);
}

type ActionData = {
	success: boolean;
	errors?: Record<string, string[]>;
	formErrors?: string;
};

type PaymentErrorResponse = {
	description: string;
};

export async function action({ request }: { request: Request }) {
	const formData = await request.formData();
	const entriesData = Object.fromEntries(formData);
	const result = formSchema.safeParse(entriesData);
	//puhsing to test live keys + url

	if (!result.success) {
		return json<ActionData>({
			success: false,
			errors: result.error.flatten().fieldErrors,
		});
	}

	const email = formData.get("email")?.toString();
	const amount = formData.get("amount")?.toString();

	const amountInCents = Math.round(Number(amount) * 100);
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
				email ?? "",
			)}&ref=${reference}`,
			failureUrl: `${web_url}checkout/book`,
			cancelUrl: `${web_url}checkout/book`,
			customer: {
				email,
			},
			metadata: {
				reference,
				email,
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

const formSchema = z.object({
	email: z.string().email(),
	amount: z.string(),
});

export default function Checkout() {
	const product = useLoaderData<typeof loader>();
	const [quantity, setQuantity] = useState<number>(1);
	const $form = useRef<HTMLFormElement>(null);
	const actionData = useActionData<ActionData>();

	const navigation = useNavigation();

	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://js.yoco.com/sdk/v1/yoco-sdk-web.js";
		script.async = true;
		document.body.appendChild(script);
	}, []);

	return (
		<MainLayout>
			<div className="container mx-auto pt-28 pb-12">
				<div className="">
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
					>
						<Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
							<CardContent className="grid grid-cols-1 sm:grid-cols-2 p-8 space-y-6">
								<div className="aspect-square relative overflow-hidden">
									<img
										src={product.image}
										alt={product.name}
										className="w-full h-full object-contain p-4"
									/>
								</div>
								<div className="space-y-8">
									<div className="space-y-4">
										<h2 className="font-serif text-2xl font-bold text-sage leading-tight">
											{product.name}
										</h2>
										<p className="font-sans text-gray-600 leading-relaxed">
											{product.description}
										</p>
									</div>

									{product.id === "book" && product.price && (
										<>
											<Form method="post" className="space-y-8" ref={$form}>
												<div className="space-y-3 font-sans">
													<label className="text-sm font-medium text-gray-700">
														Quantity
													</label>
													<div className="flex items-center space-x-4">
														<motion.button
															onClick={() =>
																setQuantity((prev) => Math.max(1, prev - 1))
															}
															whileTap={{ scale: 0.95 }}
															whileHover={{ scale: 1.05 }}
															className="p-2 rounded-full bg-sage-light hover:bg-gray-200 transition-colors"
															disabled={quantity <= 1}
														>
															<MinusCircleIcon className="w-5 h-5 text-white" />
														</motion.button>

														<div className="flex items-center justify-center w-16 h-10 border-2 border-gray-200 rounded-lg bg-white">
															<motion.span
																key={quantity}
																initial={{ scale: 0.8, opacity: 0 }}
																animate={{ scale: 1, opacity: 1 }}
																className="text-lg font-semibold text-gray-900"
															>
																{quantity}
															</motion.span>
														</div>

														<motion.button
															onClick={() => setQuantity((prev) => prev + 1)}
															whileTap={{ scale: 0.95 }}
															whileHover={{ scale: 1.05 }}
															className="p-2 rounded-full bg-sage-light hover:bg-gray-200 transition-colors"
														>
															<PlusCircleIcon className="w-5 h-5 text-white" />
														</motion.button>
													</div>
												</div>

												<div className="space-y-3">
													<label className="text-sm font-medium text-gray-700">
														Your Details
													</label>

													<Input
														className="w-full sm:w-1/2"
														name="email"
														placeholder="Enter your email address"
														error={actionData?.errors?.email}
													/>
												</div>

												<div className="bg-gray-50 rounded-xl p-6 space-y-3">
													<div className="flex justify-between items-center text-sm text-gray-600">
														<span>Unit Price</span>
														<span>R{product.price.toFixed(2)}</span>
													</div>
													<div className="flex justify-between items-center text-sm text-gray-600">
														<span>Quantity</span>
														<span>{quantity}</span>
													</div>
													<p className="flex justify-end text-xs text-gray-600">
														+ R20 delivery fee via Pargo or PEP (depending on
														your location)
													</p>
													<div className="border-t border-gray-200 pt-3">
														<div className="flex justify-between items-center">
															<span className="text-lg font-semibold text-gray-900">
																Total
															</span>
															<motion.span
																key={quantity}
																initial={{ opacity: 0, y: -10 }}
																animate={{ opacity: 1, y: 0 }}
																className="text-2xl font-bold text-primary"
															>
																<AnimatedPrice
																	amount={product.price * quantity + 20}
																/>
															</motion.span>
															<motion.input
																value={(product.price * quantity).toFixed(2)}
																name="amount"
																type="hidden"
															/>
														</div>
													</div>
												</div>
												{!actionData?.success && (
													<span className="text-red-500 text-sm">
														{actionData?.formErrors}
													</span>
												)}

												<motion.div
													whileHover={{ scale: 1.02 }}
													whileTap={{ scale: 0.98 }}
												>
													<button
														type="submit"
														className="font-sans rounded-full w-full h-14 text-lg text-white font-semibold bg-sage shadow-lg hover:shadow-xl transition-all duration-200"
													>
														{navigation.state === "submitting" ? (
															<Loader />
														) : (
															"Complete Purchase"
														)}
													</button>
												</motion.div>
											</Form>

											<div className="flex items-center justify-center space-x-6 pt-4 border-t border-gray-200 font-sans">
												<div className="flex items-center space-x-2 text-sm text-gray-600">
													<ShieldCheckIcon className="w-4 h-4 text-green-600" />
													<span>Secure Payment</span>
												</div>

												<div className="flex items-center space-x-2 text-sm text-gray-600">
													<span>Powered by</span>
													<img
														src="/logo_yoco.png"
														alt="yoco"
														className="w-16 h-8"
													/>
												</div>
											</div>
										</>
									)}
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</div>
			</div>
		</MainLayout>
	);
}
