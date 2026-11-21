import { useLoaderData, useNavigate } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useEffect, useRef } from "react";
import { shopData } from "~/lib/@data";
import MainLayout from "~/components/_layout/main";
import Loader from "~/components/animated/loader";
import { useCart } from "~/context/CartContext";

/**
 * Old single-book checkout links (/checkout/book, /checkout/healing-trauma)
 * now put that book in the cart and go to the cart checkout at /checkout.
 */
export async function loader({ params }: { params: { id?: string } }) {
	const product = shopData.find((p) => p.id === params.id);
	if (!product) throw new Response("Product Not Found", { status: 404 });
	return json({ id: product.id });
}

export default function CheckoutRedirect() {
	const { id } = useLoaderData<typeof loader>();
	const { ready, lines, add } = useCart();
	const navigate = useNavigate();
	const done = useRef(false);

	useEffect(() => {
		if (!ready || done.current) return;
		done.current = true;
		if (!lines.some((l) => l.book.id === id)) add(id);
		navigate("/checkout", { replace: true });
	}, [ready, lines, id, add, navigate]);

	return (
		<MainLayout>
			<div className="grid min-h-[60vh] place-items-center">
				<Loader />
			</div>
		</MainLayout>
	);
}
