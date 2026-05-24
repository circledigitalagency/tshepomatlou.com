import React from "react";
import Navbar from "./nav";


export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col overflow-y-auto">
            <Navbar />
            <main>
                {children}
            </main>
            {/* FOOTER */}
            <footer className="bg-[#3D3328] text-white/60 px-8 lg:px-16 py-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="font-serif text-xl text-[#C4A882]">
                    Tshepo Matlou
                </div>

                <ul className="flex flex-wrap justify-center gap-8 text-sm">
                    <li>
                        <a href="#">About</a>
                    </li>
                    <li>
                        <a href="#">Services</a>
                    </li>
                    <li>
                        <a href="#">Blog</a>
                    </li>
                </ul>

                <div className="text-xs opacity-50">© 2026 Tshepo Matlou</div>
            </footer>
        </div>
    )
}