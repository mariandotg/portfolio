import './globals.css';
import Navbar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { pageSeoAdapter } from '@/adapters/pageSeoAdapter';
import { queryNotionDatabase } from '@/services/notion';
import { Metadata } from 'next';

interface Props {
  params: {
    lang: string;
    path: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const databaseId = process.env.NEXT_PUBLIC_NOTION_PAGES_DATABASE_ID!;

  const seoResponse = await queryNotionDatabase({
    databaseId,
    filter: {
      property: 'SeoPath',
      formula: {
        string: {
          equals: 'home',
        },
      },
    },
  });

  const seo = pageSeoAdapter(seoResponse[0]);

  return {
    title: seo.title,
    category: 'technology',
    description: seo.description,
    twitter: {
      card: 'summary_large_image',
      site: '@site',
      creator: '@creator',
      images: {
        url: seo.image,
        alt: seo.imageAlt,
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.url,
      siteName: seo.title,
      type: 'website',
      images: [
        {
          url: seo.image,
          alt: seo.imageAlt,
        },
      ],
    },
  };
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
