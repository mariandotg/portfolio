import './globals.css';
import Navbar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { Metadata } from 'next';
import { metadataAdapter } from '@/adapters/metadataAdapter';
import { PageSeo } from '@/models/PageSeo';
import { PageContentSections } from '@/models/PageContentSections';

interface Props {
  params: {
    lang: string;
    path: string;
  };
}

interface HomeData extends PageContentSections {
  seo: Omit<PageSeo, 'loading'>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const homeFetch = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/en/api/pages/home`,
    { cache: 'no-cache' }
  );

  const homeResponse: HomeData = await homeFetch.json();

  return metadataAdapter(homeResponse.seo);
}

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
          <Navbar locale={params.lang} />
          {children}
          {/* @ts-expect-error Async Server Component */}
          <Footer locale={params.lang} />
        </div>
      </body>
    </html>
  );
}
