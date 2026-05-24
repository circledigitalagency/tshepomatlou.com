import { Loader2 } from "lucide-react";

export default function Loader() {
    return (
        <div className="flex w-full justify-center">
            <Loader2 className="animate-spin" />
        </div>
    );
}
