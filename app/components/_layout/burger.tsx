import { MenuIcon } from "lucide-react";
import { useState } from "react";
import {
	Sheet,
	SheetTrigger,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
} from "../ui/sheet";
import { Link, useNavigate } from "@remix-run/react";

const BurgerMenu = () => {
	const navigation = useNavigate();
	const [openOptions, setOpenOptions] = useState<boolean>();
	const [openDrawer, setOpenDrawer] = useState<boolean>();

	const closeDrawer = () => {};

	const menuItemClick = (id: string) => {
		setOpenDrawer(!openDrawer);

		setTimeout(() => {
			const element = document.querySelector(id);

			if (element) {
				element.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			}
		}, 100);
	};

	return (
		<Sheet open={openDrawer} onOpenChange={() => setOpenDrawer(!openDrawer)}>
			<SheetTrigger className="sm:hidden block">
				<MenuIcon size={30} className="text-sage" />
			</SheetTrigger>
			<SheetContent side="right" className="bg-sage-pale">
				<SheetHeader>
					<SheetTitle>
						<Link
							to="/"
							className="font-serif text-[1.3rem] font-normal tracking-[0.04em] text-earth no-underline"
						>
							Tshepo Matlou
						</Link>
					</SheetTitle>
					<SheetDescription className="flex flex-col space-y-2 p-2 w-full items-start h-[12rem] justify-between border-t border-t-earth">
						<ul className="flex flex-col gap-10 list-none items-start mt-6">
							<li>
								<Link
									to="/"
									className="no-underline text-[0.85rem] font-normal tracking-[0.08em] uppercase text-earth opacity-70 hover:opacity-100 transition-opacity"
								>
									Home
								</Link>
							</li>
							<li>
								<Link
									to="/gallery"
									className="no-underline text-[0.85rem] font-normal tracking-[0.08em] uppercase text-earth opacity-70 hover:opacity-100 transition-opacity"
								>
									Gallery
								</Link>
							</li>
							<li>
								<Link
									to="/blog"
									className="no-underline text-[0.85rem] font-normal tracking-[0.08em] uppercase text-earth opacity-70 hover:opacity-100 transition-opacity"
								>
									Blog
								</Link>
							</li>
							<li>
								<Link
									to="#contact"
									className="no-underline bg-sage text-cream px-5 py-2 rounded-full text-[0.82rem] tracking-[0.06em] uppercase font-normal hover:bg-earth transition-colors"
								>
									Book a Session
								</Link>
							</li>
						</ul>
					</SheetDescription>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	);
};

export default BurgerMenu;
