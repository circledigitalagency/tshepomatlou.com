export default function Hero() {
    return (
        <section className="min-h-screen grid grid-cols-2 align-top">
            {/* Text Side */}
            <div className="flex flex-col justify-center px-16">
                <p className="animate-fade-up-1 text-[0.78rem] tracking-[0.16em] uppercase text-[#6B7C5A] mb-6 font-medium">
                    Mindfulness · Coaching · Healing
                </p>
                <h1 className="animate-fade-up-2 font-serif hero-title-size font-light leading-[1.05] text-earth mb-6">
                    Heal.<br />
                    <em className="italic text-[#6B7C5A]">Grow.</em><br />
                    Thrive.
                </h1>
                <p className="animate-fade-up-3 text-[1.05rem] text-earth opacity-65 max-w-[420px] leading-[1.75] mb-10 font-light">
                    A wellness journey rooted in mindfulness, self-awareness, coaching and inner freedom. You are not alone — let us help you break free and achieve greatness.
                </p>
                <div className="animate-fade-up-4 flex gap-4 items-center">
                    <a
                        href="#contact"
                        className="bg-[#6B7C5A] text-[#FEFCFA] px-8 py-[0.85rem] rounded-full text-[0.9rem] font-medium tracking-[0.04em] no-underline hover:bg-earth hover:-translate-y-px transition-all duration-200"
                    >
                        Book a Session
                    </a>
                    <a
                        href="#about"
                        className="text-earth text-[0.88rem] font-normal tracking-[0.04em] opacity-70 border-b border-current no-underline hover:opacity-100 transition-opacity"
                    >
                        Learn about Tshepo
                    </a>
                </div>
            </div>

            {/* Image Side */}
            <div className="relative overflow-hidden">
                <img
                    src="https://res.cloudinary.com/dg1g6ctku/image/upload/v1751216704/pexels-gareth-davies-230510-910411_sr8uek.jpg"
                    alt="Nature landscape for mindfulness"
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-10 left-8 right-8 bg-[rgba(254,252,250,0.92)] backdrop-blur-md px-7 py-6 border-l-[3px] border-[#6B7C5A]">
                    <p className="font-serif text-[1.15rem] font-normal italic text-earth leading-[1.5]">
                        "You are not alone, let me help you break free and achieve greatness"
                    </p>
                    <span className="block font-sans text-[0.78rem] tracking-[0.1em] uppercase text-[#6B7C5A] mt-2 not-italic">
                        — Tshepo Matlou
                    </span>
                </div>
            </div>
        </section>
    );
}