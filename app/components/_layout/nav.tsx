import { Link } from "@remix-run/react";
import BurgerMenu from "./burger";
import { Book, BookCopy, ShoppingCartIcon } from "lucide-react";
import CartButton from "../ui/CartButton";

export default function Navbar() {
	return (
		<nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between sm:px-16 px-4 py-5 bg-[rgba(254,252,250,0.92)] backdrop-blur-md border-b border-[rgba(107,124,90,0.1)]">
			<Link
				to="/"
				className="font-serif text-[1.3rem] font-normal tracking-[0.04em] text-earth no-underline"
			>
				Tshepo Matlou
			</Link>
			<div className="sm:flex items-center gap-10 hidden">
				<Link
					to="/"
					className="no-underline text-[0.85rem] font-normal tracking-[0.08em] uppercase text-earth opacity-70 hover:opacity-100 transition-opacity"
				>
					Home
				</Link>
				<Link
					to="/gallery"
					className="no-underline text-[0.85rem] font-normal tracking-[0.08em] uppercase text-earth opacity-70 hover:opacity-100 transition-opacity"
				>
					Gallery
				</Link>
				<Link
					to="/blog"
					className="no-underline text-[0.85rem] font-normal tracking-[0.08em] uppercase text-earth opacity-70 hover:opacity-100 transition-opacity"
				>
					Blog
				</Link>
				<div className="flex space-x-2">
					<CartButton />
					<Link
						to="#contact"
						className="no-underline bg-sage text-cream px-5 py-2 rounded-full text-[0.82rem] tracking-[0.06em] uppercase font-normal hover:bg-earth transition-colors"
					>
						<span></span>Book a Session
					</Link>
				</div>
			</div>
			<div className="flex items-center space-x-2 sm:hidden">
				<CartButton />

				<BurgerMenu />
			</div>
		</nav>
	);
}
