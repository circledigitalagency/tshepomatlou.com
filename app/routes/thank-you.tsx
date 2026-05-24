import { Form, Link, useNavigation, useSearchParams } from "@remix-run/react";
import { CheckCircleIcon } from "lucide-react";
import { sendEmail } from "~/utils/email.server";
import { json, redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import Loader from "~/components/animated/loader";


export async function action({ request }: ActionFunctionArgs) {
    try {
        const formData = await request.formData();
        const email = formData.get("email");
        const reference = formData.get("ref");

        console.log("Action triggered");

        if (typeof email !== "string" || typeof reference !== "string") {
            console.error("Invalid form data:", { email, reference });
            return json(
                { success: false, error: "Invalid form data" },
                { status: 400 }
            );
        }

        if (!email || !reference) {
            console.error("Missing required fields:", { email, reference });
            return json(
                { success: false, error: "Email and reference are required" },
                { status: 400 }
            );
        }

        console.log("Sending emails for:", { email, reference });

        // Send customer email
        try {
            await sendEmail({
                to: email,
                subject: "Your Payment Confirmation",
                html: `
					<p>Hi there,</p>
					<p>Thank you for your payment of R350.00</p>
					<p>Your payment reference is <strong>${reference}</strong>.</p>
					<p>Regards,<br/>Freedom 27</p>
				`,
            });
            console.log("Customer email sent successfully");
        } catch (error) {
            console.error("Failed to send customer email:", error);
            // Don't throw here - try to send the notification email anyway
        }

        // Send notification email
        try {
            await sendEmail({
                to: "payments@freedom27.co.za",
                subject: "📘 Book Purchase Notification",
                html: `
					<p>A new payment has been received.</p>
					<p><strong>Customer Email:</strong> ${email}</p>
					<p><strong>Amount:</strong> R350.00</p>
					<p><strong>Reference:</strong> ${reference}</p>
					<hr />
					<p>Please follow up with the customer to deliver the book.</p>
				`,
            });
            console.log("Notification email sent successfully");
        } catch (error) {
            console.error("Failed to send notification email:", error);
            // This is more critical - you might want to throw here
        }

        console.log("Emails sent successfully");

        // Redirect to home page after successful email sending
        return redirect("/");
    } catch (error) {
        console.error("Action error:", error);
        return json(
            {
                success: false,
                error: "Failed to send emails. Please try again.",
            },
            { status: 500 }
        );
    }
}

export default function ThankYou() {
    const navigation = useNavigation();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email") || "";
    const reference = searchParams.get("ref") || "";

    return (
        <div className="w-full h-screen flex justify-center items-center sm:p-0 p-5">
            <div className="text-center p-8 space-y-5 border border-primary">
                <div className="w-full flex justify-center">
                    <CheckCircleIcon className="text-sage h-10 w-10" />
                </div>

                <h1 className="text-2xl font-bold font-serif">Thank You 🌿</h1>
                <p>Your payment was successful. We'll be in touch soon.</p>

                <div className="text-sm text-gray-500">
                    <p>Email: {email}</p>
                    <p>Reference: {reference}</p>
                </div>

                <div className="w-full flex justify-center">
                    <Link to="/" className="rounded-full border border-earth p-2">
                        Return Home
                    </Link>
                    {/* <Form method="post" className="space-y-8">
						<input type="hidden" name="email" value={email} />
						<input type="hidden" name="ref" value={reference} />
						<button
							type="submit"
							disabled={navigation.state === "submitting"}
							className="px-4 py-2 border border-primary rounded hover:bg-primary hover:text-white transition-colors"
						>
							{navigation.state === "submitting" ? (
								<Loader />
							) : (
								"Send Confirmation & Return Home"
							)}
						</button>
					</Form> */}
                </div>
            </div>
        </div>
    );
}