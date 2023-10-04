import { metadataAdapter } from '@/adapters/metadataAdapter';
import Contact from '@/components/Contact';
import PageLayout from '@/components/PageLayout';
import Section from '@/components/Section';
import { Meta } from '@/models/blog/blog.models';
import { fetchPageByPath } from '@/services/content/pages';
import { Metadata } from 'next';

interface Props {
  params: {
    path: string;
    lang: string;
  };
  searchParams: {
    tags: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await fetchPageByPath<{ seo: Meta }>('projects', params.lang);
  return metadataAdapter(data!.seo);
}

const ContactPage = async ({ params }: Props) => {
  return (
    <PageLayout>
      <Section>
        <Contact lang={params.lang} />
      </Section>
    </PageLayout>
  );
};

export default ContactPage;
