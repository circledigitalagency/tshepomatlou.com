import { ShoppingCartIcon } from "@heroicons/react/24/outline"; // ← use the same import your header already has
import { useCart } from "~/context/CartContext";

/** Header cart icon: opens the cart and shows how many books are in it. */
export default function CartButton() {
	const { count, open } = useCart();

	return (
		<button
			type="button"
			onClick={open}
			aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
			className="relative rounded-full border border-sage px-5 py-2 transition-colors hover:bg-sage-pale"
		>
			<ShoppingCartIcon className="h-4 w-4 text-sage" />
			{count > 0 && (
				<span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-[#3D3328] px-1 text-[11px] font-medium text-white">
					{count}
				</span>
			)}
		</button>
	);
}
