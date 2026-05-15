"use client";

import Link from "next/link";
import {
    Link2,
} from "lucide-react";

export default function Footer() {
    return (
        <footer className="mt-16 border-t border-neutral-200 bg-[#f5f5f5] text-[#555]">
            {/* TOP */}
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-4 py-14 md:grid-cols-3 lg:grid-cols-5">
                {/* COLUMN */}
                <div>
                    <h3 className="mb-5 text-xs font-bold uppercase text-black">
                        Dịch vụ khách hàng
                    </h3>

                    <div className="flex flex-col gap-3 text-sm">
                        <Link href="#" className="hover:text-[#ee4d2d]">
                            Trung Tâm Trợ Giúp
                        </Link>

                        <Link href="#" className="hover:text-[#ee4d2d]">
                            Shopee Blog
                        </Link>

                        <Link href="#" className="hover:text-[#ee4d2d]">
                            Hướng Dẫn Mua Hàng
                        </Link>

                        <Link href="#" className="hover:text-[#ee4d2d]">
                            Hướng Dẫn Bán Hàng
                        </Link>

                        <Link href="#" className="hover:text-[#ee4d2d]">
                            Ví ShopeePay
                        </Link>

                        <Link href="#" className="hover:text-[#ee4d2d]">
                            Trả Hàng & Hoàn Tiền
                        </Link>
                    </div>
                </div>

                {/* COLUMN */}
                <div>
                    <h3 className="mb-5 text-xs font-bold uppercase text-black">
                        Shopee Việt Nam
                    </h3>

                    <div className="flex flex-col gap-3 text-sm">
                        <Link href="#" className="hover:text-[#ee4d2d]">
                            Về Shopee
                        </Link>

                        <Link href="#" className="hover:text-[#ee4d2d]">
                            Tuyển Dụng
                        </Link>

                        <Link href="#" className="hover:text-[#ee4d2d]">
                            Điều Khoản
                        </Link>

                        <Link href="#" className="hover:text-[#ee4d2d]">
                            Chính Sách Bảo Mật
                        </Link>

                        <Link href="#" className="hover:text-[#ee4d2d]">
                            Flash Sale
                        </Link>

                        <Link href="#" className="hover:text-[#ee4d2d]">
                            Liên Hệ Truyền Thông
                        </Link>
                    </div>
                </div>

                {/* PAYMENT */}
                <div>
                    <h3 className="mb-5 text-xs font-bold uppercase text-black">
                        Thanh toán
                    </h3>

                    <div className="grid grid-cols-3 gap-2">
                        {[
                            "VISA",
                            "MasterCard",
                            "JCB",
                            "SPay",
                            "COD",
                            "Trả Góp",
                        ].map((item) => (
                            <div
                                key={item}
                                className="flex h-10 items-center justify-center rounded border border-neutral-200 bg-white text-xs font-medium"
                            >
                                {item}
                            </div>
                        ))}
                    </div>

                    <h3 className="mb-5 mt-8 text-xs font-bold uppercase text-black">
                        Đơn vị vận chuyển
                    </h3>

                    <div className="grid grid-cols-3 gap-2">
                        {[
                            "SPX",
                            "J&T",
                            "Viettel",
                            "GHN",
                            "Ninja Van",
                            "Ahamove",
                        ].map((item) => (
                            <div
                                key={item}
                                className="flex h-10 items-center justify-center rounded border border-neutral-200 bg-white text-xs font-medium"
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                {/* SOCIAL */}
                <div>
                    <h3 className="mb-5 text-xs font-bold uppercase text-black">
                        Theo dõi Shopee
                    </h3>

                    <div className="flex flex-col gap-4 text-sm">
                        <Link
                            href="#"
                            className="flex items-center gap-2 hover:text-[#ee4d2d]"
                        >
                            <Link2 size={16} />
                            Facebook
                        </Link>

                        <Link
                            href="#"
                            className="flex items-center gap-2 hover:text-[#ee4d2d]"
                        >
                            <Link2 size={16} />
                            Instagram
                        </Link>

                        <Link
                            href="#"
                            className="flex items-center gap-2 hover:text-[#ee4d2d]"
                        >
                            <Link2 size={16} />
                            LinkedIn
                        </Link>
                    </div>
                </div>

                {/* QR */}
                <div>
                    <h3 className="mb-5 text-xs font-bold uppercase text-black">
                        Tải ứng dụng Shopee
                    </h3>

                    <div className="flex gap-3">
                        {/* QR */}
                        <div className="flex h-28 w-28 items-center justify-center rounded border border-neutral-200 bg-white text-xs">
                            QR CODE
                        </div>

                        {/* STORE */}
                        <div className="flex flex-col gap-2">
                            {[
                                "App Store",
                                "Google Play",
                                "App Gallery",
                            ].map((item) => (
                                <button
                                    key={item}
                                    className="flex h-10 w-28 items-center justify-center rounded border border-neutral-200 bg-white text-xs font-medium"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* COUNTRY */}
            <div className="border-t border-neutral-200">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-neutral-500 lg:flex-row">
                    <p>
                        © 2026 Shopee. Tất cả các quyền được bảo lưu.
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                        {[
                            "Singapore",
                            "Indonesia",
                            "Thái Lan",
                            "Malaysia",
                            "Việt Nam",
                            "Philippines",
                            "Brazil",
                        ].map((item) => (
                            <button
                                key={item}
                                className="hover:text-[#ee4d2d]"
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* BOTTOM */}
            <div className="border-t border-neutral-200 bg-[#fbfbfb]">
                <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-10 text-center">
                    {/* POLICY */}
                    <div className="flex flex-wrap items-center justify-center gap-6 text-xs uppercase text-neutral-500">
                        <button className="hover:text-[#ee4d2d]">
                            Chính sách bảo mật
                        </button>

                        <button className="hover:text-[#ee4d2d]">
                            Quy chế hoạt động
                        </button>

                        <button className="hover:text-[#ee4d2d]">
                            Chính sách vận chuyển
                        </button>

                        <button className="hover:text-[#ee4d2d]">
                            Chính sách trả hàng
                        </button>
                    </div>

                    {/* CERTIFICATION */}
                    <div className="mt-8 flex items-center gap-5">
                        <div className="flex h-12 w-36 items-center justify-center rounded border border-red-200 bg-white text-xs font-semibold text-red-500">
                            ĐÃ ĐĂNG KÝ
                        </div>

                        <div className="flex h-12 w-36 items-center justify-center rounded border border-red-200 bg-white text-xs font-semibold text-red-500">
                            BỘ CÔNG THƯƠNG
                        </div>
                    </div>

                    {/* COMPANY */}
                    <div className="mt-8 space-y-2 text-xs leading-6 text-neutral-500">
                        <p>Công ty TNHH Shopee</p>

                        <p>
                            Địa chỉ: Tầng 4-5-6, Tòa nhà Capital Place,
                            Hà Nội, Việt Nam
                        </p>

                        <p>
                            Chăm sóc khách hàng: Gọi tổng đài Shopee
                        </p>

                        <p>
                            Mã số doanh nghiệp: 0106773786 cấp lần đầu
                            ngày 10/02/2015
                        </p>

                        <p>
                            © 2015 - 2026 Bản quyền thuộc về Công ty
                            TNHH Shopee
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}