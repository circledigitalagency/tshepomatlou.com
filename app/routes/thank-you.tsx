import { Form, Link, useNavigation, useSearchParams } from "@remix-run/react";
import { CheckCircleIcon } from "lucide-react";
import { sendEmail } from "~/utils/email.server";
import { json, redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import Loader from "~/components/animated/loader";

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
                </div>
            </div>
        </div>
    );
}