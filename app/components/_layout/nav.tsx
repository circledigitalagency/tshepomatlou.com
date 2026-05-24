import { Link } from "@remix-run/react";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-16 py-5 bg-[rgba(254,252,250,0.92)] backdrop-blur-md border-b border-[rgba(107,124,90,0.1)]">
            <Link to="/" className="font-serif text-[1.3rem] font-normal tracking-[0.04em] text-earth no-underline">
                Tshepo Matlou
            </Link>
            <ul className="flex gap-10 list-none">
                <li>
                    <Link to="/" className="no-underline text-[0.85rem] font-normal tracking-[0.08em] uppercase text-earth opacity-70 hover:opacity-100 transition-opacity">
                        Home
                    </Link>
                </li>
                {/* <li>
                    <Link to="/services" className="no-underline text-[0.85rem] font-normal tracking-[0.08em] uppercase text-earth opacity-70 hover:opacity-100 transition-opacity">
                        Services
                    </Link>
                </li> */}
                <li>
                    <Link to="/gallery" className="no-underline text-[0.85rem] font-normal tracking-[0.08em] uppercase text-earth opacity-70 hover:opacity-100 transition-opacity">
                        Gallery
                    </Link>
                </li>
                <li>
                    <Link to="/blog" className="no-underline text-[0.85rem] font-normal tracking-[0.08em] uppercase text-earth opacity-70 hover:opacity-100 transition-opacity">
                        Blog
                    </Link>
                </li>
                <li>
                    <Link
                        to="#contact"
                        className="no-underline bg-sage text-cream px-5 py-2 rounded-full text-[0.82rem] tracking-[0.06em] uppercase font-normal hover:bg-earth transition-colors"
                    >
                        Book a Session
                    </Link>
                </li>
            </ul>
        </nav>
    );
}