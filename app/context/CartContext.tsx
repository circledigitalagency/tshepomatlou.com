import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
	type ReactNode,
} from "react";
import { shopData, type Shop } from "~/lib/@data";

export type CartLine = { book: Shop; qty: number };

type CartContextValue = {
	lines: CartLine[];
	count: number;
	total: number;
	/** false during server render / first paint, true once the saved cart has loaded */
	ready: boolean;
	add: (id: string, qty?: number) => void;
	setQty: (id: string, qty: number) => void;
	remove: (id: string) => void;
	clear: () => void;
	isOpen: boolean;
	open: () => void;
	close: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "tm-cart";

function load(): Record<string, number> {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
}

export function CartProvider({ children }: { children: ReactNode }) {
	// { [bookId]: quantity } — starts empty so server and client render the same
	const [qtys, setQtys] = useState<Record<string, number>>({});
	const [ready, setReady] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	// load the saved cart after mount (avoids SSR hydration mismatch)
	const loaded = useRef(false);
	useEffect(() => {
		if (loaded.current) return; // Strict Mode runs effects twice in dev
		loaded.current = true;
		setQtys(load());
		setReady(true);
	}, []);

	// save on change, but only once the saved cart has been loaded
	useEffect(() => {
		if (!ready) return;
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(qtys));
		} catch {
			/* storage unavailable — cart still works for this visit */
		}
	}, [qtys, ready]);

	const value = useMemo<CartContextValue>(() => {
		const lines = shopData
			.filter((b) => (qtys[b.id] ?? 0) > 0)
			.map((book) => ({ book, qty: qtys[book.id] }));

		const setQty = (id: string, qty: number) =>
			setQtys((q) => {
				const next = { ...q };
				if (qty <= 0) delete next[id];
				else next[id] = Math.min(qty, 99);
				return next;
			});

		return {
			lines,
			count: lines.reduce((n, l) => n + l.qty, 0),
			total: lines.reduce((n, l) => n + l.qty * l.book.price, 0),
			ready,
			add: (id, qty = 1) =>
				setQtys((q) => ({ ...q, [id]: Math.min((q[id] ?? 0) + qty, 99) })),
			setQty,
			remove: (id) => setQty(id, 0),
			clear: () => setQtys({}),
			isOpen,
			open: () => setIsOpen(true),
			close: () => setIsOpen(false),
		};
	}, [qtys, isOpen, ready]);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
	const ctx = useContext(CartContext);
	if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
	return ctx;
}
