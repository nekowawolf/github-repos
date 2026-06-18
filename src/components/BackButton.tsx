'use client';

import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";

interface BackButtonProps {
    fallbackUrl?: string;
    label?: string;
    className?: string;
}

export default function BackButton({
    fallbackUrl = "/",
    label = "Back",
    className = ""
}: BackButtonProps) {
    const router = useRouter();

    const handleBack = () => {
        if (window.history.length > 2) {
            router.back();
        } else {
            router.push(fallbackUrl);
        }
    };

    return (
        <button
            onClick={handleBack}
            className={`flex items-center gap-2 mb-6 text-fill-color/70 hover:text-fill-color transition-colors w-fit px-4 py-2 rounded-lg hover:bg-card-color border border-transparent hover:border-color ${className}`}
        >
            <FaArrowLeft className="w-4 h-4" />
            <span className="font-medium">{label}</span>
        </button>
    );
}