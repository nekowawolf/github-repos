'use client';

import React, { useState, useEffect } from 'react';

export const FALLBACK_IMAGE_URL = 'https://cdn.nekowawolf.xyz/image/2026/1787424585_image-unavailable.webp';

export interface FallbackImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fill?: boolean;
    sizes?: string;
    unoptimized?: boolean;
    priority?: boolean;
    quality?: number | string;
}

export const FallbackImage = ({ src, alt, fill, sizes, unoptimized, priority, quality, className, ...props }: FallbackImageProps) => {
    const [imgSrc, setImgSrc] = useState(src);

    useEffect(() => {
        setImgSrc(src);
    }, [src]);

    const combinedClassName = fill 
        ? ('absolute inset-0 w-full h-full ' + (className || '')).trim()
        : className;

    return (
        <img
            {...props}
            sizes={sizes}
            className={combinedClassName}
            src={imgSrc ? (imgSrc as string) : FALLBACK_IMAGE_URL}
            alt={alt || 'Image'}
            onError={() => {
                if (imgSrc !== FALLBACK_IMAGE_URL) {
                    setImgSrc(FALLBACK_IMAGE_URL);
                }
            }}
        />
    );
};

export const FallbackNativeImage = ({ src, alt, fill, sizes, unoptimized, priority, quality, className, ...props }: FallbackImageProps) => {
    const [imgSrc, setImgSrc] = useState(src);

    useEffect(() => {
        setImgSrc(src);
    }, [src]);

    const combinedClassName = fill 
        ? ('absolute inset-0 w-full h-full ' + (className || '')).trim()
        : className;

    return (
        <img
            {...props}
            sizes={sizes}
            className={combinedClassName}
            src={imgSrc ? (imgSrc as string) : FALLBACK_IMAGE_URL}
            alt={alt || 'Image'}
            onError={(e) => {
                if (imgSrc !== FALLBACK_IMAGE_URL) {
                    setImgSrc(FALLBACK_IMAGE_URL);
                }
            }}
        />
    );
};
