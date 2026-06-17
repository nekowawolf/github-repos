'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

export const FALLBACK_IMAGE_URL = 'https://nekowawolf.github.io/cdn-images/images/2026/1780148714_image-unavailable.png';

export const FallbackImage = ({ src, alt, ...props }: ImageProps) => {
    const [imgSrc, setImgSrc] = useState(src);

    return (
        <Image
            {...props}
            src={imgSrc ? imgSrc : FALLBACK_IMAGE_URL}
            alt={alt || 'Image'}
            onError={() => {
                if (imgSrc !== FALLBACK_IMAGE_URL) {
                    setImgSrc(FALLBACK_IMAGE_URL);
                }
            }}
        />
    );
};

export const FallbackNativeImage = ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const [imgSrc, setImgSrc] = useState(src);

    return (
        <img
            {...props}
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