import { media, qualifications } from "~/lib/@data";
import LogoCarousel from "../carousel/logo-carousel";

export default function About() {
    return (
        <section id="about" className=" bg-[#F0F4EC]">
            <div className="grid sm:grid-cols-2">
                {/* Image */}
                <div className="relative min-h-[260px] overflow-hidden order-2 md:order-1">
                    <img
                        src="https://res.cloudinary.com/dg1g6ctku/image/upload/v1751214264/tshepo-matlou_d4hpnq.jpg"
                        alt="Tshepo Matlou"
                        className="w-full h-full object-cover object-top"
                    />
                </div>

                {/* Content */}
                <div className="sm:px-14 px-4 py-24 flex flex-col justify-center order-1 md:order-2">
                    <p className="text-[0.75rem] tracking-[0.18em] uppercase text-[#6B7C5A] mb-5 font-medium">
                        Meet Your Guide
                    </p>
                    <h2 className="font-serif section-title-size font-light text-earth leading-[1.15] mb-6">
                        Tshepo
                        <em className="italic text-[#6B7C5A]"> Matlou</em>
                    </h2>
                    <p className="text-earth opacity-70 font-light mb-4 text-base">
                        <span><a className="text-sage italic underline" target="_blank" href="https://www.linkedin.com/in/tshepo-matlou-b5357969/">Tshepo Matlou</a></span> is a mindfulness facilitator, life and leadership
                        coach, author, and speaker with over 20 years of experience in
                        executive leadership and personal transformation. With a calm,
                        grounded presence, Tshepo brings a unique blend of strategic
                        insight and emotional intelligence to every session and
                        experience.
                    </p>
                    <p className="text-earth opacity-70 font-light mb-4 text-base">
                        His career started in hospitality, travel and tourism, technology,
                        consulting before joining Government and eventually and
                        independent.
                    </p>
                    <div className="flex flex-col space-y-2 mb-4">
                        <p className="text-earth opacity-70 font-light mb-2 text-base">
                            His book, <span><a className="text-sage italic underline" href="#shop">Freedom – In Pursuit of Liberty (Mind, Body, and
                                Soul)</a></span>, forms the philosophical foundation of Freedom 27. The
                            work explores the liberating power of self-awareness, emotional
                            release, and mindset shifts, offering a roadmap for those
                            seeking to:
                        </p>
                        <ul className="list-disc flex flex-col gap-2 px-5 text-sm text-earth opacity-70 font-light">
                            <li>Overcome limiting beliefs</li>
                            <li>Heal from personal and generational trauma</li>
                            <li>Strengthen mental and emotional well-being</li>
                            <li>Enhance relationships, both personal and professional</li>
                            <li>Embrace a more intentional, balanced life</li>
                        </ul>
                    </div>
                    <p className="text-earth opacity-70 font-light mb-4 text-base">
                        With a commitment to presence, Tshepo and the Freedom 27 team hold
                        space for people to reconnect with their truth, and move forward
                        with clarity, courage, and compassion.
                    </p>
                </div>
            </div>
            {/* <div className="flex flex-col gap-10 mt-10 pt-8 border-t border-[rgba(107,124,90,0.2)]">
                <p className="font-serif section-title-size">Qualifications</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                    {qualifications.map((quali, index) => (
                        <div className="flex-col space-y-2" key={index}>
                            <p className="text-earth opacity-70 text-sm">{quali.degree}</p>
                            <p className="text-earth opacity-70 text-xs font-light">
                                {quali.school}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <section className="flex flex-col w-full justify-between items-start space-y-10">
                <p className="font-serif section-title-size">Media Exposure</p>
                <LogoCarousel logos={media} />
            </section> */}
        </section>
    );
}