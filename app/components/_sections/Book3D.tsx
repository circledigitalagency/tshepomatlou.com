import type { CSSProperties } from "react";
import type { Shop } from "../data/shopData";

type Props = {
	book: Shop;
	flipped: boolean;
	onToggle: () => void;
};

/**
 * A real 3D book built from the front, spine and back cover images.
 * Click (or press Enter/Space) to turn it over and see the back.
 * Size is responsive: --w drives everything else.
 */
export default function Book3D({ book, flipped, onToggle }: Props) {
	const { cover } = book;

	const vars = {
		// parent can set --book-w to size the book; otherwise this default is used
		"--w": "var(--book-w, clamp(180px, 52vw, 250px))",
		"--h": `calc(var(--w) / ${cover.aspect})`,
		"--d": `calc(var(--w) * ${cover.spineRatio})`,
	} as CSSProperties;

	const face: CSSProperties = {
		position: "absolute",
		backfaceVisibility: "hidden",
		WebkitBackfaceVisibility: "hidden",
	};

	const pages: CSSProperties = {
		background: `repeating-linear-gradient(90deg, #f7f1e6 0 1px, #e2d8c6 1px 2px), #f3ecdf`,
	};

	return (
		<div className="relative flex flex-col items-center" style={vars}>
			<button
				type="button"
				onClick={onToggle}
				aria-pressed={flipped}
				aria-label={
					flipped
						? `Show the front cover of ${book.name}`
						: `Turn ${book.name} over to see the back cover`
				}
				className="group relative cursor-pointer rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A882] focus-visible:ring-offset-8 focus-visible:ring-offset-[#3D3328]"
				style={{ perspective: "1800px", width: "var(--w)", height: "var(--h)" }}
			>
				<div
					className={[
						"relative h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] motion-reduce:transition-none",
						flipped
							? "[--ry:155deg] group-hover:[--ry:165deg]"
							: "[--ry:25deg] group-hover:[--ry:12deg]",
					].join(" ")}
					style={{
						transformStyle: "preserve-3d",
						transform: "rotateX(4deg) rotateY(var(--ry))",
					}}
				>
					{/* FRONT */}
					<div
						style={{
							...face,
							inset: 0,
							transform: "translateZ(calc(var(--d) / 2))",
						}}
						className="overflow-hidden rounded-r-[3px]"
					>
						<img
							src={cover.front}
							alt={`${book.name} front cover`}
							className="h-full w-full object-cover"
							loading="lazy"
							draggable={false}
						/>
						{/* hinge crease + soft light */}
						<div
							className="pointer-events-none absolute inset-0"
							style={{
								background:
									"linear-gradient(90deg, rgba(0,0,0,.35) 0, rgba(255,255,255,.18) 2.5%, rgba(0,0,0,.12) 5%, transparent 9%), linear-gradient(105deg, transparent 40%, rgba(255,255,255,.12) 55%, transparent 70%)",
							}}
						/>
					</div>

					{/* BACK */}
					<div
						style={{
							...face,
							inset: 0,
							transform: "rotateY(180deg) translateZ(calc(var(--d) / 2))",
						}}
						className="overflow-hidden rounded-l-[3px]"
					>
						<img
							src={cover.back}
							alt={`${book.name} back cover`}
							className="h-full w-full object-cover"
							loading="lazy"
							draggable={false}
						/>
						<div
							className="pointer-events-none absolute inset-0"
							style={{
								background:
									"linear-gradient(270deg, rgba(0,0,0,.35) 0, rgba(255,255,255,.14) 2.5%, transparent 8%)",
							}}
						/>
					</div>

					{/* SPINE */}
					<div
						style={{
							...face,
							top: 0,
							height: "100%",
							width: "var(--d)",
							left: "calc((var(--w) - var(--d)) / 2)",
							transform: "rotateY(-90deg) translateZ(calc(var(--w) / 2))",
						}}
					>
						<img
							src={cover.spine}
							alt=""
							className="h-full w-full object-fill"
							draggable={false}
						/>
						<div
							className="pointer-events-none absolute inset-0"
							style={{
								background:
									"linear-gradient(90deg, rgba(0,0,0,.25), rgba(255,255,255,.08) 50%, rgba(0,0,0,.25))",
							}}
						/>
					</div>

					{/* PAGE EDGE (fore-edge) */}
					<div
						style={{
							...face,
							...pages,
							top: "1.5%",
							height: "97%",
							width: "calc(var(--d) - 2px)",
							left: "calc((var(--w) - var(--d)) / 2 + 1px)",
							transform: "rotateY(90deg) translateZ(calc(var(--w) / 2 - 3px))",
						}}
					/>

					{/* PAGE EDGES top + bottom */}
					{[90, -90].map((deg) => (
						<div
							key={deg}
							style={{
								...face,
								...pages,
								left: "1px",
								width: "calc(var(--w) - 4px)",
								height: "calc(var(--d) - 2px)",
								top: "calc((var(--h) - var(--d)) / 2 + 1px)",
								transform: `rotateX(${deg}deg) translateZ(calc(var(--h) / 2 - 3px))`,
								background: `repeating-linear-gradient(0deg, #f7f1e6 0 1px, #e2d8c6 1px 2px)`,
							}}
						/>
					))}
				</div>
			</button>

			{/* floor shadow */}
			<div
				aria-hidden
				className="pointer-events-none -mt-3 h-6 w-[115%] rounded-[50%] bg-black/45 blur-xl"
			/>
		</div>
	);
}
