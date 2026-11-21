import { useEffect, useRef, useState } from "react";
import type { Shop } from "../data/shopData";

type Props = {
	book: Shop | null;
	onClose: () => void;
};

/** Full-size, readable back cover: the printed cover image, or the same words as plain text. */
export default function BackCoverDialog({ book, onClose }: Props) {
	const ref = useRef<HTMLDialogElement>(null);
	const [view, setView] = useState<"image" | "text">("image");

	useEffect(() => {
		const dialog = ref.current;
		if (!dialog) return;
		if (book && !dialog.open) {
			setView(window.matchMedia("(max-width: 640px)").matches ? "text" : "image");
			dialog.showModal();
			document.body.style.overflow = "hidden";
		} else if (!book && dialog.open) {
			dialog.close();
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [book]);

	return (
		<dialog
			ref={ref}
			onClose={onClose}
			onClick={(e) => e.target === ref.current && onClose()}
			aria-labelledby="back-cover-title"
			className="m-auto w-[min(94vw,760px)] max-h-[92vh] overflow-hidden rounded-2xl bg-[#FAF7F1] p-0 text-[#3D3328] shadow-2xl backdrop:bg-[#1E1912]/75 backdrop:backdrop-blur-sm"
		>
			{book && (
				<div className="flex max-h-[92vh] flex-col">
					{/* header */}
					<div className="flex items-center justify-between gap-4 border-b border-[#3D3328]/10 px-5 py-4 sm:px-7">
						<div>
							<p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#6B7C5A]">
								Back cover
							</p>
							<h3 id="back-cover-title" className="font-serif text-2xl font-light">
								{book.name}
							</h3>
						</div>
						<button
							type="button"
							onClick={onClose}
							aria-label="Close"
							className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-2xl leading-none text-[#3D3328]/70 transition hover:bg-[#3D3328]/10 hover:text-[#3D3328]"
						>
							×
						</button>
					</div>

					{/* view switch */}
					<div className="flex gap-1 px-5 pt-4 sm:px-7" role="tablist">
						{(["image", "text"] as const).map((v) => (
							<button
								key={v}
								type="button"
								role="tab"
								aria-selected={view === v}
								onClick={() => setView(v)}
								className={`rounded-full px-4 py-1.5 text-sm transition ${
									view === v
										? "bg-[#6B7C5A] text-white"
										: "text-[#3D3328]/70 hover:bg-[#3D3328]/10"
								}`}
							>
								{v === "image" ? "Cover" : "Easy-read text"}
							</button>
						))}
					</div>

					{/* body */}
					<div className="overflow-y-auto px-5 pb-6 pt-4 sm:px-7">
						{view === "image" ? (
							<img
								src={book.cover.backFull}
								alt={`Back cover of ${book.name}`}
								className="mx-auto w-full max-w-[560px] rounded shadow-lg"
							/>
						) : (
							<div className="mx-auto max-w-prose space-y-4 leading-7 text-[#3D3328]/85">
								{book.backCover.map((block, i) => {
									if (block.type === "heading")
										return (
											<p
												key={i}
												className="pt-2 font-serif text-xl italic text-[#6B7C5A]"
											>
												{block.text}
											</p>
										);
									if (block.type === "list")
										return (
											<ul key={i} className="list-disc space-y-2 pl-5 marker:text-[#C4A882]">
												{block.items.map((item) => (
													<li key={item}>{item}</li>
												))}
											</ul>
										);
									return <p key={i}>{block.text}</p>;
								})}
								<p className="pt-2 text-sm text-[#3D3328]/50">ISBN {book.isbn}</p>
							</div>
						)}
					</div>
				</div>
			)}
		</dialog>
	);
}
