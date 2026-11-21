import { useEffect, useState } from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import Book3D from "./Book3D";
import BackCoverDialog from "./BackCoverDialog";
import { Shop, shopData } from "~/lib/@data";
import { useCart } from "~/context/CartContext";

export default function ShopSection() {
	const [reading, setReading] = useState<Shop | null>(null);

	return (
		<section id="shop" className="bg-sage-pale px-6 py-24 lg:px-16">
			<div className="mx-auto max-w-4xl">
				{/* HEADER */}
				<div className="mb-14 text-center">
					<p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-[#6B7C5A]">
						From the Shop
					</p>
					<h2 className="font-serif text-5xl font-light text-[#3D3328]">
						The <em className="italic text-[#6B7C5A]">Books</em>
					</h2>
				</div>

				{/* BOOKS */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{shopData.map((book) => (
						<BookCard
							key={book.id}
							book={book}
							onReadBack={() => setReading(book)}
						/>
					))}
				</div>
			</div>

			<BackCoverDialog book={reading} onClose={() => setReading(null)} />
		</section>
	);
}

type CardProps = {
	book: Shop;
	onReadBack: () => void;
};

function BookCard({ book, onReadBack }: CardProps) {
	const [flipped, setFlipped] = useState(false);
	const [added, setAdded] = useState(false);
	const { add } = useCart();

	useEffect(() => {
		if (!added) return;
		const t = setTimeout(() => setAdded(false), 1600);
		return () => clearTimeout(t);
	}, [added]);

	const handleAdd = () => {
		add(book.id);
		setAdded(true);
	};

	return (
		<article className="flex flex-col overflow-hidden rounded-xl bg-white/60 shadow-sm ring-1 ring-[#3D3328]/5">
			{/* VISUAL */}
			<div className="relative flex h-[340px] flex-col items-center justify-center overflow-hidden bg-[#3D3328] px-6 pt-4">
				<div className="absolute top-1/2 h-[220px] w-[220px] -translate-y-[58%] rounded-full border border-[#C4A882]/20"></div>
				<div className="absolute top-1/2 h-[320px] w-[320px] -translate-y-[56%] rounded-full border border-[#C4A882]/10"></div>

				<div className="relative z-10 [--book-w:clamp(130px,36vw,160px)]">
					<Book3D
						book={book}
						flipped={flipped}
						onToggle={() => setFlipped((f) => !f)}
					/>
				</div>

				<button
					type="button"
					onClick={() => setFlipped((f) => !f)}
					className="relative z-10 mt-4 rounded-full border border-[#C4A882]/40 px-4 py-1.5 text-xs text-[#F3EBDD] transition hover:border-[#C4A882] hover:bg-[#C4A882]/10"
				>
					{flipped ? "↺ Show front" : "↻ Turn it over"}
				</button>
			</div>

			{/* DETAILS */}
			<div className="flex flex-1 flex-col px-5 py-5 lg:px-6">
				<h3 className="mb-1 font-serif text-2xl font-light text-[#3D3328]">
					{book.title} <em className="italic text-[#6B7C5A]">{book.titleEm}</em>
				</h3>

				<p className="mb-3 font-serif text-sm italic text-[#3D3328]/60">
					{book.subtitle}
				</p>

				<p className="mb-3 text-sm leading-6 text-[#3D3328]/70">
					{book.description}
				</p>

				<button
					type="button"
					onClick={onReadBack}
					className="mb-5 w-fit text-xs font-medium text-[#6B7C5A] underline decoration-[#6B7C5A]/40 underline-offset-4 transition hover:decoration-[#6B7C5A]"
				>
					Read the back cover →
				</button>

				{/* price + button pinned to the bottom so both cards line up */}
				<div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-[#3D3328]/10 pt-4">
					<div className="font-serif text-2xl font-light text-[#3D3328]">
						R {book.price}
					</div>
					<button
						type="button"
						onClick={handleAdd}
						aria-live="polite"
						className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm text-white transition ${
							added ? "bg-[#3D3328]" : "bg-[#6B7C5A] hover:bg-[#3D3328]"
						}`}
					>
						<ShoppingCartIcon className="h-4 w-4" />
						{added ? "Added ✓" : "Add to cart"}
					</button>
				</div>
			</div>
		</article>
	);
}
