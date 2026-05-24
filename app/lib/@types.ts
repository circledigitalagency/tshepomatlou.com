export interface GalleryItem {
	id: number;
	title?: string;
	image: string;
	category: string;
}

export interface Shop {
	id: "book" | "oneOnone" | "couple";
	image: string;
	name: string;
	price?: number;
	description: string;
	packages?: [
		{
			id: "4sessions" | "12sessions" | "8sessions";
			name: string;
			price: number;
		},
	];
}

export interface LogoCarouselProps {
	className?: string;
	logos: {
		src: string;
		alt: string;
		width?: number;
		height?: number;
	}[];
	autoplaySpeed?: number;
}
