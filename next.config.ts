import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'pbs.twimg.com' },
      { protocol: 'https', hostname: 'www.nekowawolf.xyz' },
      { protocol: 'https', hostname: 'nekowawolf.xyz' },
      { protocol: 'https', hostname: 's3.coinmarketcap.com' },
      { protocol: 'https', hostname: 'nekowawolf.github.io' },
      { protocol: 'https', hostname: 'cdn.discordapp.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'admin.nekowawolf.xyz' },
      { protocol: 'https', hostname: 'cmty.nekowawolf.xyz' },
      { protocol: 'https', hostname: 'cdn.motor1.com' },
      { protocol: 'https', hostname: 'static.wixstatic.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'loremflickr.com' },
      { protocol: 'https', hostname: 'imgur.com' },
      { protocol: 'https', hostname: 'i.imgur.com' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
    ],
  },
};

export default nextConfig;