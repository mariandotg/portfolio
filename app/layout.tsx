import CursorBlob from '@/components/CursorBlob';
import '../styles/globals.css';
import { LogoContextProvider } from '@/lib/Context';

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    lang: string;
  };
}) {
  const codeToRunOnClient = `
  (function initTheme() {
    const theme =
      typeof window !== 'undefined'
        ? localStorage.theme !== undefined
          ? localStorage.theme
          : 'dark'
        : 'dark';
          document
        .querySelector('html')
        .classList.replace(theme === 'dark' ? 'light' : 'dark', theme);
  })();`;

  return (
    <html lang={params.lang} className='dark'>
      <head>
        <script
          id='theme-init'
          dangerouslySetInnerHTML={{ __html: codeToRunOnClient }}
        />
        <link rel='icon' href='/public/favicon.ico' sizes='any' />
      </head>
      <body>
        <LogoContextProvider>{children}</LogoContextProvider>
      </body>
    </html>
  );
}
