'use client';

import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

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
                className={`back-control mb-6 w-fit ${className}`}
            >
                <FiArrowLeft aria-hidden="true" />
                <span>{label}</span>
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
            type="button"
            onClick={handleBack}
            className={`back-control mb-6 w-fit ${className}`}
        >
            <FiArrowLeft aria-hidden="true" />
            <span>{label}</span>
        </button>
    );
}