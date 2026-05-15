"use client";

import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

const banners = [
    {
        id: 1,
        image:
            "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1600&auto=format&fit=crop",
        title: "iPhone 17 Pro Max",
        description: "Thiết kế titan mới mạnh mẽ hơn",
    },
    {
        id: 2,
        image:
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1600&auto=format&fit=crop",
        title: "MacBook Pro 16-inch M1 Pro",
        description: "Hiệu năng mạnh mẽ cho công việc",
    },
    {
        id: 3,
        image:
            "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1600&auto=format&fit=crop",
        title: "Apple Watch Series",
        description: "Thiết kế tối giản hiện đại",
    },
];

export default function Slide() {
    return (
        <section className="mx-auto mt-6 max-w-7xl px-4">
            <Carousel
                plugins={[
                    Autoplay({
                        delay: 3000,
                    }),
                ]}
                opts={{
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent>
                    {banners.map((banner) => (
                        <CarouselItem key={banner.id}>
                            <div className="relative overflow-hidden rounded-sm">
                                {/* IMAGE */}
                                <div className="relative h-[420px] w-full">
                                    <Image
                                        src={banner.image}
                                        alt={banner.title}
                                        fill
                                        priority
                                        className="object-cover"
                                    />
                                </div>

                                {/* OVERLAY */}
                                <div className="absolute inset-0 bg-black/25" />

                                {/* CONTENT */}
                                <div className="absolute left-16 top-1/2 -translate-y-1/2 text-white">
                                    <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-white/80">
                                        Shopee Mall
                                    </p>

                                    <h2 className="max-w-xl text-5xl font-bold leading-tight">
                                        {banner.title}
                                    </h2>

                                    <p className="mt-4 text-lg text-white/90">
                                        {banner.description}
                                    </p>

                                    <button className="mt-8 rounded-sm bg-[#ee4d2d] px-8 py-3 text-sm font-semibold transition hover:bg-[#d73211]">
                                        Mua ngay
                                    </button>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* BUTTONS */}
                <CarouselPrevious className="left-5 border-0 bg-white/90 hover:bg-white" />

                <CarouselNext className="right-5 border-0 bg-white/90 hover:bg-white" />
            </Carousel>
        </section>
    );
}