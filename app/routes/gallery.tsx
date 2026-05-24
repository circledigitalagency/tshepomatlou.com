import { useState } from "react";
import MainLayout from "~/components/_layout/main";
import GalleryGrid from "~/components/gallery/gallery-grid";
import { galleryItems } from "~/lib/@data";

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
