import { ActionFunctionArgs, json, type MetaFunction } from "@remix-run/node";
import MainLayout from "~/components/_layout/main";
import About from "~/components/_sections/about";
import Shop from "~/components/_sections/book";
import Hero from "~/components/_sections/hero";
import Offerings from "~/components/_sections/offerings";
import Services from "~/components/_sections/services";
import nodemailer from "nodemailer";
import { useActionData, useNavigation, Form } from "@remix-run/react";


export const meta: MetaFunction = () => {
  return [
    { title: "Tshepo Matlou" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

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
    const transporter = nodemailer.createTransport({
      host: "mail.tshepomatlou.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Tshepo Matlou Website" <${process.env.EMAIL_USER}>`,
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
    });

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

