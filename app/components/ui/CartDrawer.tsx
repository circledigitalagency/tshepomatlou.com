import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "~/context/CartContext";

/** Slide-out cart panel. Render once, e.g. in your layout next to the header. */
export default function CartDrawer() {
	const { lines, total, count, setQty, remove, isOpen, close } = useCart();

	useEffect(() => {
		if (!isOpen) return;
		const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
		document.addEventListener("keydown", onKey);
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = "";
		};
	}, [isOpen, close]);

	return (
		<div
			className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}
			aria-hidden={!isOpen}
		>
			{/* backdrop */}
			<div
				onClick={close}
				className={`absolute inset-0 bg-[#1E1912]/50 transition-opacity duration-300 ${
					isOpen ? "opacity-100" : "opacity-0"
				}`}
			/>

			{/* panel */}
			<aside
				role="dialog"
				aria-modal="true"
				aria-label="Your cart"
				className={`absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-[#FAF7F1] shadow-2xl transition-transform duration-300 motion-reduce:transition-none ${
					isOpen ? "translate-x-0" : "translate-x-full"
				}`}
			>
				<div className="flex items-center justify-between border-b border-[#3D3328]/10 px-5 py-4">
					<h2 className="font-serif text-2xl font-light text-[#3D3328]">
						Your cart{" "}
						{count > 0 && (
							<span className="text-base text-[#3D3328]/50">({count})</span>
						)}
					</h2>
					<button
						type="button"
						onClick={close}
						aria-label="Close cart"
						className="grid h-9 w-9 place-items-center rounded-full text-2xl leading-none text-[#3D3328]/70 transition hover:bg-[#3D3328]/10"
					>
						×
					</button>
				</div>

				{lines.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
						<p className="text-[#3D3328]/60">Your cart is empty.</p>
						<Link
							to="/#shop"
							onClick={close}
							className="rounded-full border border-[#6B7C5A] px-5 py-2 text-sm text-[#6B7C5A] transition hover:bg-[#6B7C5A] hover:text-white"
						>
							Browse the books
						</Link>
					</div>
				) : (
					<>
						<ul className="flex-1 divide-y divide-[#3D3328]/10 overflow-y-auto px-5">
							{lines.map(({ book, qty }) => (
								<li key={book.id} className="flex gap-4 py-4">
									<img
										src={book.cover.front}
										alt=""
										className="h-24 w-[68px] shrink-0 rounded-sm object-cover shadow"
									/>
									<div className="flex flex-1 flex-col">
										<p className="font-serif text-lg leading-tight text-[#3D3328]">
											{book.name}
										</p>
										<p className="text-sm text-[#3D3328]/60">R {book.price}</p>

										<div className="mt-auto flex items-center justify-between">
											<div className="flex items-center rounded-full border border-[#3D3328]/15">
												<button
													type="button"
													onClick={() => setQty(book.id, qty - 1)}
													aria-label={`Remove one ${book.name}`}
													className="h-8 w-8 rounded-full text-[#3D3328]/70 hover:bg-[#3D3328]/10"
												>
													−
												</button>
												<span className="w-6 text-center text-sm tabular-nums">
													{qty}
												</span>
												<button
													type="button"
													onClick={() => setQty(book.id, qty + 1)}
													aria-label={`Add one ${book.name}`}
													className="h-8 w-8 rounded-full text-[#3D3328]/70 hover:bg-[#3D3328]/10"
												>
													+
												</button>
											</div>
											<button
												type="button"
												onClick={() => remove(book.id)}
												className="text-xs text-[#3D3328]/50 underline-offset-2 hover:text-[#3D3328] hover:underline"
											>
												Remove
											</button>
										</div>
									</div>
								</li>
							))}
						</ul>

						<div className="border-t border-[#3D3328]/10 px-5 py-5">
							<div className="mb-4 flex items-baseline justify-between">
								<span className="text-sm text-[#3D3328]/60">Total</span>
								<span className="font-serif text-3xl font-light text-[#3D3328]">
									R {total}
								</span>
							</div>
							<Link
								to="/checkout"
								onClick={close}
								className="block rounded-full bg-[#6B7C5A] py-3 text-center text-white transition hover:bg-[#3D3328]"
							>
								Checkout
							</Link>
						</div>
					</>
				)}
			</aside>
		</div>
	);
}
