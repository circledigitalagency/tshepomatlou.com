import { MetaFunction } from "@remix-run/node";
import { useState } from "react";
import MainLayout from "~/components/_layout/main";
import GalleryGrid from "~/components/gallery/gallery-grid";
import { galleryItems } from "~/lib/@data";

export const meta: MetaFunction = () => {
    const title = "Gallery | Speaking, Workshops & Journey — Tshepo Matlou";
    const description =
        "Explore moments from Tshepo Matlou’s journey including speaking engagements, workshops, book launches, media features, and personal reflections.";
    const url = "https://www.tshepomatlou.com/gallery";
    const image =
        "https://res.cloudinary.com/dg1g6ctku/image/upload/v1750939353/IMG_5103_sfs7ui.jpg";

    return [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "index, follow" },

        { tagName: "link", rel: "canonical", href: url },

        // Open Graph
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: image },
        { property: "og:site_name", content: "Tshepo Matlou" },

        // Twitter
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
    ];
};

export default function GalleryPage() {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleImageClick = (index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    return (
        <MainLayout>
            <div className="min-h-screen mt-20">
                <div className="container mx-auto px-4 py-8">
                    <GalleryGrid items={galleryItems} onImageClick={handleImageClick} />
                </div>
            </div>
        </MainLayout>
    );
}
