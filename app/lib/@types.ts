export interface GalleryItem {
	id: number;
	title?: string;
	image: string;
	category: string;
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

export interface Blog {
	title: string;
	excerpt: string;
	blogText: string;
	author: string;
	date: string;
	readTime: string;
	image: string;
	category: string;
}
