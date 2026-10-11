import '@/styles/globals.css';
import { Metadata } from 'next';
import { Toaster } from 'sonner';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL('https://github.nekowawolf.xyz'),
  icons: {
    icon: [
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function() {
              try {
                if (localStorage.getItem("darkmode") === "active") {
                  document.documentElement.classList.add("darkmode");
                }
              } catch (e) {}
            })();`,
          }}
        />
      </head>
      <body className="body-color">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}