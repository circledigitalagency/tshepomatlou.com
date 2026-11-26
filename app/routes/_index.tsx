import { ActionFunctionArgs, json, type MetaFunction } from "@remix-run/node";
import MainLayout from "~/components/_layout/main";
import About from "~/components/_sections/about";
import Shop from "~/components/_sections/book";
import Hero from "~/components/_sections/hero";
import Offerings from "~/components/_sections/offerings";
import Services from "~/components/_sections/services";
import { useActionData, useNavigation, Form } from "@remix-run/react";
import { sendEmail } from "~/utils/email.server";
import { SeoHead } from "~/seo/seohead";

// ─── SEO Meta ─────────────────────────────────────────────────────────────────

export const meta: MetaFunction = () => {
	const title = "Tshepo Matlou | Mindfulness Coach, Life Coach & Speaker";
	const description =
		"Tshepo Matlou is a mindfulness facilitator, life and leadership coach, author, and speaker based in South Africa. Book coaching sessions, retreats, workshops, and mindfulness hikes.";
	const url = "https://www.tshepomatlou.com";
	const image =
		"https://res.cloudinary.com/dg1g6ctku/image/upload/v1751214264/tshepo-matlou_d4hpnq.jpg";

	return [
		// ── Core ──────────────────────────────────────────────────────────────
		{ title },
		{ name: "description", content: description },
		{
			name: "keywords",
			content:
				"mindfulness coach South Africa, life coach Johannesburg, leadership coaching, trauma healing, wellness retreats South Africa, Tshepo Matlou, Freedom 27, mindfulness hikes, executive coach",
		},
		{ name: "author", content: "Tshepo Matlou" },
		{ name: "robots", content: "index, follow" },
		{ tagName: "link", rel: "canonical", href: url },

		// ── Open Graph (Facebook, LinkedIn, WhatsApp) ─────────────────────────
		{ property: "og:type", content: "website" },
		{ property: "og:url", content: url },
		{ property: "og:title", content: title },
		{ property: "og:description", content: description },
		{ property: "og:image", content: image },
		{ property: "og:image:width", content: "1200" },
		{ property: "og:image:height", content: "630" },
		{ property: "og:site_name", content: "Tshepo Matlou" },
		{ property: "og:locale", content: "en_ZA" },

		// ── Twitter Card ──────────────────────────────────────────────────────
		{ name: "twitter:card", content: "summary_large_image" },
		{ name: "twitter:title", content: title },
		{ name: "twitter:description", content: description },
		{ name: "twitter:image", content: image },
		{ name: "twitter:creator", content: "@tshepomatlou" },

		// ── Additional ────────────────────────────────────────────────────────
		{ name: "theme-color", content: "#6B7C5A" },
		{ name: "geo.region", content: "ZA-GP" },
		{ name: "geo.placename", content: "Johannesburg, South Africa" },
	];
};

// ─── Structured Data (JSON-LD) ────────────────────────────────────────────────
// Add this component inside your index page component, in the <head> via <script>

export function StructuredData() {
	const personSchema = {
		"@context": "https://schema.org",
		"@type": "Person",
		name: "Tshepo Matlou",
		url: "https://www.tshepomatlou.com",
		image:
			"https://res.cloudinary.com/dg1g6ctku/image/upload/v1751214264/tshepo-matlou_d4hpnq.jpg",
		description:
			"Mindfulness facilitator, life and leadership coach, author, and speaker with over 20 years of experience.",
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
			"Wellness",
			"Emotional Intelligence",
		],
		offers: [
			{
				"@type": "Offer",
				name: "1-on-1 Life Coaching",
				url: "https://www.tshepomatlou.com/#contact",
			},
			{
				"@type": "Offer",
				name: "Mindfulness Hikes",
				url: "https://www.tshepomatlou.com/#offerings",
			},
			{
				"@type": "Offer",
				name: "Healing Retreats",
				url: "https://www.tshepomatlou.com/#offerings",
			},
		],
	};

	const websiteSchema = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "Tshepo Matlou",
		url: "https://www.tshepomatlou.com",
		description:
			"Mindfulness coaching, life coaching, healing retreats, and wellness programmes by Tshepo Matlou.",
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
		author: {
			"@type": "Person",
			name: "Tshepo Matlou",
		},
		url: "https://www.tshepomatlou.com/#shop",
		image:
			"https://res.cloudinary.com/dg1g6ctku/image/upload/v1751621135/book_hexyzz.svg",
		description:
			"A guide through healing old wounds, embracing change, and finding peace through mindfulness and self-awareness.",
		offers: {
			"@type": "Offer",
			price: "300",
			priceCurrency: "ZAR",
			availability: "https://schema.org/InStock",
			url: "https://www.tshepomatlou.com/checkout/book",
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
					text: "Tshepo Matlou offers mindfulness coaching, life and leadership coaching, trauma healing, couples coaching, team alignment workshops, healing retreats, mindfulness hikes, and masterclasses.",
				},
			},
			{
				"@type": "Question",
				name: "How do I book a coaching session with Tshepo Matlou?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "You can book a session by emailing me@tshepomatlou.com.",
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
				dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
			/>
		</>
	);
}

<SeoHead />;

type ActionData = {
	success?: boolean;
	error?: string;
};

export default function Index() {
	const navigation = useNavigation();

	const isSubmitting = navigation.state === "submitting";

	return (
		<MainLayout>
			<Hero />
			<About />
			<Services />
			<Offerings />
			<Shop />
		</MainLayout>
	);
}
