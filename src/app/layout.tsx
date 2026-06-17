import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
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
    <html lang="en">
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
      <body className={`${inter.className} body-color`}>
        {children}
      </body>
    </html>
  );
}