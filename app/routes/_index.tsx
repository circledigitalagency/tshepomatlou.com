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
    { name: "keywords", content: "mindfulness coach South Africa, life coach Johannesburg, leadership coaching, trauma healing, wellness retreats South Africa, Tshepo Matlou, Freedom 27, mindfulness hikes, executive coach" },
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
    image: "https://res.cloudinary.com/dg1g6ctku/image/upload/v1751214264/tshepo-matlou_d4hpnq.jpg",
    description:
      "Mindfulness facilitator, life and leadership coach, author, and speaker with over 20 years of experience.",
    jobTitle: "Mindfulness Coach & Life Coach",
    sameAs: [
      "https://www.linkedin.com/in/tshepomatlou",
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
    image: "https://res.cloudinary.com/dg1g6ctku/image/upload/v1751621135/book_hexyzz.svg",
    description:
      "A guide through healing old wounds, embracing change, and finding peace through mindfulness and self-awareness.",
    offers: {
      "@type": "Offer",
      price: "350",
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
          text: "You can book a session by filling in the contact form at tshepomatlou.com/#contact or emailing me@tshepomatlou.com.",
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

<SeoHead />

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const name = formData.get("name");
  const email = formData.get("email");
  const service = formData.get("service");
  const message = formData.get("message");

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof service !== "string" ||
    typeof message !== "string"
  ) {
    return json<ActionData>(
      { error: "Invalid form submission." },
      { status: 400 }
    );
  }

  if (!name || !email || !message) {
    return json<ActionData>(
      { error: "Please fill in all required fields." },
      { status: 400 }
    );
  }

  try {

    await sendEmail({
      to: "me@tshepomatlou.com",
      replyTo: email,
      subject: `New Coaching Enquiry from ${name}`,
      html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>New Enquiry</title>
        </head>
      
        <body
          style="
            margin: 0;
            padding: 40px 20px;
            background: #FAF6F1;
            font-family: 'DM Sans', Arial, sans-serif;
            color: #1A1814;
          "
        >
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="
              max-width: 620px;
              margin: 0 auto;
              background: #FEFCFA;
              border: 1px solid #EDE3D6;
            "
          >
            <!-- HEADER -->
            <tr>
              <td style="padding: 48px 48px 32px;">
                <p
                  style="
                    margin: 0 0 12px;
                    font-size: 11px;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    color: #6B7C5A;
                  "
                >
                  Tshepo Matlou Website
                </p>
      
                <h1
                  style="
                    margin: 0;
                    font-family: Georgia, serif;
                    font-size: 42px;
                    line-height: 1.1;
                    font-weight: 400;
                    color: #3D3328;
                  "
                >
                  New Enquiry
                </h1>
              </td>
            </tr>
      
            <!-- CONTENT -->
            <tr>
              <td style="padding: 0 48px 48px;">
                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  style="
                    border-top: 1px solid #EDE3D6;
                    border-bottom: 1px solid #EDE3D6;
                    padding: 32px 0;
                  "
                >
                  <tr>
                    <td style="padding-bottom: 24px;">
                      <p
                        style="
                          margin: 0 0 6px;
                          font-size: 11px;
                          letter-spacing: 2px;
                          text-transform: uppercase;
                          color: #8C9BA8;
                        "
                      >
                        Name
                      </p>
      
                      <p
                        style="
                          margin: 0;
                          font-size: 18px;
                          color: #1A1814;
                        "
                      >
                        ${name}
                      </p>
                    </td>
                  </tr>
      
                  <tr>
                    <td style="padding-bottom: 24px;">
                      <p
                        style="
                          margin: 0 0 6px;
                          font-size: 11px;
                          letter-spacing: 2px;
                          text-transform: uppercase;
                          color: #8C9BA8;
                        "
                      >
                        Email
                      </p>
      
                      <p
                        style="
                          margin: 0;
                          font-size: 18px;
                          color: #1A1814;
                        "
                      >
                        ${email}
                      </p>
                    </td>
                  </tr>
      
                  <tr>
                    <td style="padding-bottom: 24px;">
                      <p
                        style="
                          margin: 0 0 6px;
                          font-size: 11px;
                          letter-spacing: 2px;
                          text-transform: uppercase;
                          color: #8C9BA8;
                        "
                      >
                        Seeking
                      </p>
      
                      <p
                        style="
                          margin: 0;
                          font-size: 18px;
                          color: #1A1814;
                        "
                      >
                        ${service || "Not specified"}
                      </p>
                    </td>
                  </tr>
      
                  <tr>
                    <td>
                      <p
                        style="
                          margin: 0 0 12px;
                          font-size: 11px;
                          letter-spacing: 2px;
                          text-transform: uppercase;
                          color: #8C9BA8;
                        "
                      >
                        Message
                      </p>
      
                      <p
                        style="
                          margin: 0;
                          font-size: 16px;
                          line-height: 1.9;
                          color: #3D3328;
                          white-space: pre-wrap;
                        "
                      >
                        ${message}
                      </p>
                    </td>
                  </tr>
                </table>
      
                <!-- BUTTON -->
                <table
                  cellpadding="0"
                  cellspacing="0"
                  style="margin-top: 32px;"
                >
                  <tr>
                    <td
                      bgcolor="#6B7C5A"
                      style="border-radius: 999px;"
                    >
                      <a
                        href="mailto:${email}"
                        style="
                          display: inline-block;
                          padding: 14px 28px;
                          color: #FEFCFA;
                          text-decoration: none;
                          font-size: 13px;
                          letter-spacing: 1px;
                        "
                      >
                        Reply to ${name}
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
      `
    })

    return json<ActionData>({ success: true });
  } catch (error) {
    console.error(error);

    return json<ActionData>(
      { error: "Something went wrong sending your message." },
      { status: 500 }
    );
  }
}

type ActionData = {
  success?: boolean;
  error?: string;
};

export default function Index() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  return (
    <MainLayout>
      <Hero />
      <About />
      <Services />
      <Offerings />
      <Shop />
      {/* CONTACT */}
      <section
        id="contact"
        className="px-8 lg:px-16 py-28 text-center bg-white"
      >
        <div className="max-w-2xl mx-auto">
          <p className="uppercase tracking-[0.18em] text-[#6B7C5A] text-xs font-medium mb-4">
            Start Your Journey
          </p>

          <h2 className="font-serif text-5xl font-light text-[#3D3328] mb-6">
            Book a <em className="italic text-[#6B7C5A]">Session</em>
          </h2>

          <p className="text-[#3D3328]/70 leading-8 mb-10">
            Ready to begin? Reach out and let's find the right path for you. Whether it's one-on-one coaching, a workshop, or a retreat — your transformation starts with a conversation.
          </p>

          <Form method="post" className="flex flex-col gap-4 font-sans">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                className="bg-[#F0F4EC] border border-[#6B7C5A]/20 px-5 py-4 outline-none focus:border-[#6B7C5A]"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                className="bg-[#F0F4EC] border border-[#6B7C5A]/20 px-5 py-4 outline-none focus:border-[#6B7C5A]"
              />
            </div>

            <input
              type="text"
              name="service"
              placeholder="What are you seeking?"
              className="bg-[#F0F4EC] border border-[#6B7C5A]/20 px-5 py-4 outline-none focus:border-[#6B7C5A]"
            />

            <textarea
              name="message"
              placeholder="Tell us a little about yourself..."
              required
              className="bg-[#F0F4EC] border border-[#6B7C5A]/20 px-5 py-4 min-h-[140px] outline-none focus:border-[#6B7C5A]"
            />

            {actionData?.error && (
              <p className="text-red-600 text-sm">{actionData.error}</p>
            )}

            {actionData?.success && (
              <p className="text-green-700 text-sm">
                Your message has been sent successfully.
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#6B7C5A] hover:bg-[#3D3328] transition text-white px-10 py-4 rounded-full w-fit mx-auto mt-4 disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </Form>
        </div>
      </section>
    </MainLayout>
  );
}

