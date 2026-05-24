import { useNavigation, useSearchParams } from "@remix-run/react";
import MainLayout from "~/components/_layout/main";

export default function ThankYou() {
    const navigation = useNavigation();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email") || "";
    const reference = searchParams.get("ref") || "";

    return (
        <MainLayout>
            <p>{email}</p>
            <p>{reference}</p>
        </MainLayout>
    )

}