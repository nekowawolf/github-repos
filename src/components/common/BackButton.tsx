'use client';

import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";

interface BackButtonProps {
    fallbackUrl?: string;
    label?: string;
    className?: string;
    forceFallback?: boolean;
}

export default function BackButton({
    fallbackUrl = "/",
    label = "Back",
    className = "",
    forceFallback = false
}: BackButtonProps) {
    const router = useRouter();

    if (forceFallback) {
        return (
            <Link
                href={fallbackUrl}
                className={`cursor-pointer flex items-center gap-2 mb-6 text-fill-color/70 hover:text-fill-color transition-colors w-fit px-4 py-2 rounded-lg hover:bg-card-color border border-transparent hover:border-color ${className}`}
            >
                <FaArrowLeft className="w-4 h-4" />
                <span className="font-medium">{label}</span>
            </Link>
        );
    }

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
            className={`cursor-pointer flex items-center gap-2 mb-6 text-fill-color/70 hover:text-fill-color transition-colors w-fit px-4 py-2 rounded-lg hover:bg-card-color border border-transparent hover:border-color ${className}`}
        >
            <FaArrowLeft className="w-4 h-4" />
            <span className="font-medium">{label}</span>
        </button>
    );
}