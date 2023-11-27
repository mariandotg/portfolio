import { metadataAdapter } from '@/adapters/metadataAdapter';
import Contact from '@/components/Contact';
import PageLayout from '@/components/PageLayout';
import Section from '@/components/Sections/Section/Section';
import { Meta } from '@/models/blog/blog.models';
import { fetchPageByPath } from '@/services/content/pages';
import { Metadata } from 'next';
import { getDictionary } from '../dictionaries';

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
  const dict = await getDictionary(params.lang);
  return (
    <PageLayout className='py-32'>
      <Section>
        <div className='flex flex-col col-span-4 gap-4 mobile:col-span-5 min-h-[96px]'>
          <h1 className='self-start italic font-semibold text-article text-light-headlines dark:text-dark-headlines font-monospace'>
            Contact
          </h1>
          <p className='font-display text text-light-text dark:text-dark-text'>
            {dict.projects.description}
          </p>
        </div>
        <Contact dict={dict} />
      </Section>
    </PageLayout>
  );
};

export default ContactPage;
