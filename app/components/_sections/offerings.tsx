import { programs } from "~/lib/@data";

export default function Offerings() {
    return (

        <section id="offerings" className="bg-[#FAF6F1] px-8 lg:px-16 py-28">
            <div className="text-center mb-16">
                <p className="uppercase tracking-[0.18em] text-[#6B7C5A] text-xs font-medium mb-4">
                    Wellness Experiences
                </p>

                <h2 className="font-serif text-5xl font-light text-[#3D3328]">
                    Offerings &{" "}
                    <em className="italic text-[#6B7C5A]">Programmes</em>
                </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {programs.map((offering, index) => (
                    <div
                        key={index}
                        className="bg-white overflow-hidden hover:-translate-y-1 transition"
                    >
                        <img
                            src={offering.img}
                            alt={offering.label}
                            className="w-full h-[220px] object-cover"
                        />

                        <div className="p-6">
                            <h3 className="font-serif text-2xl text-[#3D3328] mb-3">
                                {offering.label}
                            </h3>

                            <p className="text-sm text-[#3D3328]/60 leading-7">
                                {offering.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}