import { Link } from "@remix-run/react";
import { shopData } from "~/lib/@data";
import { cn } from "~/lib/utils";

export default function Shop() {
	return (
		<section
			id="shop"
			className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]"
		>
			{/* LEFT VISUAL */}
			<div className="bg-[#3D3328] relative flex items-center justify-center px-10 py-24 overflow-hidden">
				<div className="absolute w-[300px] h-[300px] rounded-full border border-[#C4A882]/20"></div>
				<div className="absolute w-[450px] h-[450px] rounded-full border border-[#C4A882]/10"></div>

				<div className="relative z-10 w-[220px] h-[300px] rounded-sm shadow-2xl overflow-hidden">
					<img
						src="https://res.cloudinary.com/dg1g6ctku/image/upload/v1751621135/book_hexyzz.svg"
						alt="Freedom - Holistic offering for healing and clarity"
						className="w-full h-full object-cover"
						loading="lazy"
					/>
				</div>
			</div>

			{/* RIGHT CONTENT */}
			<div className="bg-sage-pale flex flex-col justify-center px-8 lg:px-16 py-24">
				<p className="uppercase tracking-[0.18em] text-[#6B7C5A] text-xs font-medium mb-4">
					From the Shop
				</p>

				<h2 className="font-serif text-5xl font-light text-[#3D3328] mb-6">
					The <em className="italic text-[#6B7C5A]">Book</em>
				</h2>

				<p className="text-[#3D3328]/70 leading-8 mb-8 max-w-xl">
					Discover the strength in surrender. This book guides you through
					healing old wounds, embracing change, and finding peace through
					mindfulness and self-awareness.
				</p>

				<div className="font-serif text-5xl text-[#3D3328] font-light mb-8">
					R 300
				</div>

				<Link
					to={`/checkout/${shopData[0].id}`}
					className="bg-[#6B7C5A] hover:bg-[#3D3328] transition text-white px-8 py-4 rounded-full w-fit"
				>
					Buy Your Copy
				</Link>
			</div>
		</section>
	);
}
