import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    images: string[]; // Array de URLs de Cloudinary
}

export const ProductGallery = ({ images }: Props) => {
    const [selectedImage, setSelectedImage] = useState(images[0]);

    return (
        <div className="flex flex-col md:flex-row-reverse gap-4">
            {/* main image */}
            <div className="relative aspect-square w-full overflow-hidden bg-obsidian-black border border-[#181818]">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={selectedImage}
                        src={selectedImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="h-full w-full object-cover"
                    />
                </AnimatePresence>
            </div>

            {/* thumbnails */}
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto no-scrollbar">
                {images.map((img, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(img)}
                        className={`relative aspect-square w-20 flex-shrink-0 border-2 transition-all ${selectedImage === img ? 'border-white' : 'border-transparent opacity-50 hover:opacity-100'
                            }`}
                    >
                        <img src={img} className="h-full w-full object-cover" alt={`Thumbnail ${index}`} />
                    </button>
                ))}
            </div>
        </div>
    );
};