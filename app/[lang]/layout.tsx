import './globals.css';
import Navbar from '../../components/NavBar';
import Footer from '../../components/Footer';

export const metadata = {
  icons: {
    icon: '/public/favicon.ico',
  },
};
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
      </head>
      <body>
        <div className='flex flex-col gap-y-[160px] justify-center'>
          {/* @ts-expect-error Async Server Component */}
          <Navbar locale={params.lang} />
          {children}
          {/* @ts-expect-error Async Server Component */}
          <Footer locale={params.lang} />
        </div>
      </body>
    </html>
  );
}
