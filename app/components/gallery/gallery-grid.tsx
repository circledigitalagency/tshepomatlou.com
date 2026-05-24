import { GalleryItem } from "~/lib/@types";

interface GalleryGridProps {
    items: GalleryItem[];
    onImageClick: (index: number) => void;
}

export default function GalleryGrid({ items, onImageClick }: GalleryGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {items.map((item, index) => (
                <div
                    key={item.id}
                    className="group cursor-pointer overflow-hidden bg-gray-100 aspect-square"
                    onClick={() => onImageClick(index)}
                >
                    <div className="relative w-full h-full">
                        <img
                            src={item.image}
                            alt=""
                            className="object-cover w-full h-full transition-all duration-300 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300">
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="font-semibold text-sm mb-1 truncate">
                                    {item.title}
                                </h3>

                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs bg-white/20 px-2 py-1 rounded">
                                        {item.category}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
