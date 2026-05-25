// app/seo/SeoHead.tsx
// Drop-in <SeoHead> for the index route — renders JSON-LD in the document head
// Usage: add <SeoHead /> anywhere inside your index route component

export function SeoHead() {
    const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Tshepo Matlou",
        url: "https://www.tshepomatlou.com",
        image: "https://res.cloudinary.com/dg1g6ctku/image/upload/v1751214264/tshepo-matlou_d4hpnq.jpg",
        description:
            "Mindfulness facilitator, life and leadership coach, author, and speaker with over 20 years of experience in South Africa.",
        jobTitle: "Mindfulness Coach & Life Coach",
        sameAs: [
            "https://www.linkedin.com/in/tshepo-matlou-b5357969/",
            "https://www.freedom27.co.za",
        ],
        address: {
            "@type": "PostalAddress",
            addressCountry: "ZA",
            addressRegion: "Gauteng",
            addressLocality: "Johannesburg",
        },
        knowsAbout: [
            "Mindfulness",
            "Life Coaching",
            "Leadership Coaching",
            "Trauma Healing",
            "Emotional Intelligence",
            "Wellness Retreats",
        ],
    };

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Tshepo Matlou",
        url: "https://www.tshepomatlou.com",
        description:
            "Mindfulness coaching, life coaching, healing retreats and wellness programmes by Tshepo Matlou.",
        potentialAction: {
            "@type": "SearchAction",
            target: "https://www.tshepomatlou.com/blog?q={search_term_string}",
            "query-input": "required name=search_term_string",
        },
    };

    const bookSchema = {
        "@context": "https://schema.org",
        "@type": "Book",
        name: "Freedom – In Pursuit of Liberty (Mind, Body, and Soul)",
        author: { "@type": "Person", name: "Tshepo Matlou" },
        url: "https://www.tshepomatlou.com/#shop",
        image: "https://res.cloudinary.com/dg1g6ctku/image/upload/v1751621135/book_hexyzz.svg",
        description:
            "A roadmap for those seeking to heal from trauma, overcome limiting beliefs, and embrace a more intentional, balanced life.",
        offers: {
            "@type": "Offer",
            price: "350",
            priceCurrency: "ZAR",
            availability: "https://schema.org/InStock",
            url: "https://www.tshepomatlou.com/checkout/book",
        },
    };

    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        serviceType: "Life Coaching & Mindfulness",
        provider: { "@type": "Person", name: "Tshepo Matlou" },
        areaServed: {
            "@type": "Country",
            name: "South Africa",
        },
        hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Coaching & Wellness Services",
            itemListElement: [
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Mindfulness & Wellbeing Coaching" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Leadership Coaching" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Trauma Healing" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Couples Coaching" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Team Alignment Workshops" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Mindfulness Hikes" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Healing Retreats" } },
            ],
        },
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "What services does Tshepo Matlou offer?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Tshepo Matlou offers mindfulness coaching, life and leadership coaching, trauma healing, couples coaching, team alignment workshops, healing retreats, mindfulness hikes, and masterclasses across South Africa.",
                },
            },
            {
                "@type": "Question",
                name: "How do I book a coaching session with Tshepo Matlou?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "You can book a session by filling in the contact form at tshepomatlou.com or emailing me@tshepomatlou.com.",
                },
            },
            {
                "@type": "Question",
                name: "Where are the mindfulness retreats and hikes held?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Retreats and mindfulness hikes are held across South Africa including Gauteng, the Drakensberg, and the Magaliesberg.",
                },
            },
            {
                "@type": "Question",
                name: "What is the Freedom book about?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Freedom – In Pursuit of Liberty (Mind, Body, and Soul) explores the liberating power of self-awareness, emotional release, and mindset shifts. It offers a roadmap for overcoming limiting beliefs, healing from trauma, and embracing a more intentional life.",
                },
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
        </>
    );
}