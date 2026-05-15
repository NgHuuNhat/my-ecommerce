"use client";

import Image from "next/image";
import Link from "next/link";

const brands = [
  {
    name: "Apple",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  },
  {
    name: "Samsung",
    image:
      "https://1000logos.net/wp-content/uploads/2017/06/Samsung-Logo.png",
  },
  {
    name: "ASUS",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg",
  },
  {
    name: "Dell",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg",
  },
  {
    name: "MSI",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/9/91/Micro-Star_International_logo.svg",
  },
  {
    name: "Logitech",
    image:
      "https://cdn.worldvectorlogo.com/logos/logitech-2.svg",
  },
  {
    name: "Sony",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg",
  },
  {
    name: "Intel",
    image:
      "https://img.idesign.vn/2020/09/snag_bbbda5.png",
  },
  {
    name: "AMD",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/7/7c/AMD_Logo.svg",
  },
  {
    name: "NVIDIA",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg",
  },
];

export default function Brand() {
  return (
    <section className="mx-auto mt-6 max-w-7xl px-4">
      <div className="overflow-hidden rounded-sm bg-white shadow-sm">
        {/* HEADER */}
        <div className="flex h-16 items-center border-b border-neutral-100 px-5">
          <h2 className="text-base font-medium uppercase text-[#ee4d2d]">
            Danh mục công nghệ
          </h2>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              href={`/brands/${brand.name.toLowerCase()}`}
              className="group flex flex-col items-center justify-center border-b border-r border-neutral-100 bg-white p-5 transition hover:z-10 hover:shadow-md"
            >
              {/* LOGO */}
              <div className="relative flex h-16 w-16 items-center justify-center">
                <Image
                  src={brand.image}
                  alt={brand.name}
                  fill
                  className="object-contain p-1"
                />
              </div>

              {/* NAME */}
              <span className="mt-4 text-center text-sm font-medium text-neutral-700 transition group-hover:text-[#ee4d2d]">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}