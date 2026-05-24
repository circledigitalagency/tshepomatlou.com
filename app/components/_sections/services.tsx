const services = [
    {
        icon: (
            <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] stroke-[#6B7C5A] fill-none" strokeWidth={1.5}>
                <circle cx="12" cy="12" r="9" /><path d="M12 8v4l3 3" />
            </svg>
        ),
        name: "Mindfulness & Wellbeing",
        desc: "Stress management, resilience sessions, burnout prevention, emotional regulation, and meditation practices tailored to your journey.",
        tag: "For Individuals",
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] stroke-[#6B7C5A] fill-none" strokeWidth={1.5}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
        name: "Leadership Coaching",
        desc: "Build executive presence, lead with emotional intelligence, improve decision-making clarity, and strengthen accountability.",
        tag: "For Leaders",
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] stroke-[#6B7C5A] fill-none" strokeWidth={1.5}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        ),
        name: "Healing & Therapy",
        desc: "Trauma healing, emotional regulation, and therapy referrals through our network of independent therapists and coaches.",
        tag: "For Healing",
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] stroke-[#6B7C5A] fill-none" strokeWidth={1.5}>
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9,22 9,12 15,12 15,22" />
            </svg>
        ),
        name: "Change & Transition",
        desc: "Navigate life transitions with resilience. Coaching for emotional responses to change, uncertainty, and personal reinvention.",
        tag: "For Transition",
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] stroke-[#6B7C5A] fill-none" strokeWidth={1.5}>
                <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
        ),
        name: "Team Alignment",
        desc: "Psychological safety, trust rebuilding, cross-functional alignment, and team emotional intelligence for high-performing teams.",
        tag: "For Teams",
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] stroke-[#6B7C5A] fill-none" strokeWidth={1.5}>
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
        ),
        name: "Couples Coaching",
        desc: "Focused one-on-one or couples coaching on emotional healing, life alignment, and practical wellness tools for relationships.",
        tag: "For Couples",
    },
];

export default function Services() {
    return (
        <section id="services" className="md:px-16 px-4 py-28 bg-[#FEFCFA]">
            <div className="text-center mb-16">
                <p className="text-[0.75rem] tracking-[0.18em] uppercase text-[#6B7C5A] mb-5 font-medium">
                    How We Work
                </p>
                <h2 className="font-serif section-title-size font-light text-earth leading-[1.15]">
                    Pathways to <em className="italic text-[#6B7C5A]">Wholeness</em>
                </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-[2px] bg-[rgba(107,124,90,0.12)]">
                {services.map((service) => (
                    <div
                        key={service.name}
                        className="bg-[#FEFCFA] px-9 py-11 hover:bg-[#F0F4EC] transition-colors duration-300"
                    >
                        <div className="w-12 h-12 bg-[#D4DFCA] rounded-full flex items-center justify-center mb-6">
                            {service.icon}
                        </div>
                        <div className="font-serif text-[1.4rem] font-normal text-earth mb-3 leading-[1.25]">
                            {service.name}
                        </div>
                        <p className="text-[0.9rem] text-earth opacity-60 font-light leading-[1.7]">
                            {service.desc}
                        </p>
                        <span className="inline-block mt-5 text-[0.75rem] tracking-[0.1em] uppercase text-[#6B7C5A] font-medium">
                            {service.tag}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}