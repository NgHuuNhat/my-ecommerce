import React from "react";
import Header from "./components/header/page";
import Footer from "./components/footer/page";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            {/* content */}
            <main className="min-h-screen flex-1">
                {children}
            </main>

            <Footer />
        </div>
    );
}