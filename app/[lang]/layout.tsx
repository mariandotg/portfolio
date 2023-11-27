import Navbar from '../../components/NavBar';
import Footer from '../../components/Footer';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'es' }];
}
export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    lang: string;
  };
}) {
  return (
    <div className='flex flex-col gap-y-[0px] justify-center'>
      {/* @ts-expect-error Async Server Component */}
      <Navbar locale={params.lang} />
      {children}
      {/* @ts-expect-error Async Server Component */}
      <Footer locale={params.lang} />
    </div>
  );
}
