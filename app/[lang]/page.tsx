import PageLayout from '../../components/PageLayout';
import { PageContentSections } from '@/models/PageContentSections';
import { getDictionary } from './dictionaries';
import { fetchArticles } from '@/services/content/articles';
import { fetchPageByPath } from '@/services/content/pages';
import { fetchSocialMedia } from '@/services/content/social-media';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { metadataAdapter } from '@/adapters/metadataAdapter';
import AboutMe from '@/components/Sections/AboutMe';
import { fetchProjects } from '@/services/content/projects';
import FeaturedProjects from '@/components/Sections/FeaturedProjects';
import Skills from '@/components/Sections/Skills';
import JobExperience from '@/components/Sections/JobExperience';
import LatestArticles from '@/components/Sections/LatestArticles';
import BrandLogo from '../../public/public/logo-v2-4.svg';

interface Props {
  params: {
    lang: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await fetchPageByPath<PageContentSections>('home', params.lang);
  if (!data) return redirect(`../../not-found`);
  console.log({ TESTSF: data.seo });
  const test = metadataAdapter(data.seo);
  console.log({ AAAAAAAAAAAAAAAAA: test });
  return test;
}

const HomePage = async ({ params }: Props) => {
  const data = await fetchPageByPath<PageContentSections>('home', params.lang);

  if (!data) return redirect(`../../not-found`);

  const social = await fetchSocialMedia();

  const projects = await fetchProjects(params.lang);
  const featuredProjects = projects?.slice(0, 4);

  const articles = await fetchArticles(params.lang);
  const latestArticles = articles?.slice(0, 4);

  const dict = await getDictionary(params.lang);
  console.log(params.lang);

  return (
    <PageLayout className='py-32'>
      <AboutMe data={data.about} social={social} />
      <FeaturedProjects
        data={data.featuredProjects}
        locale={params.lang}
        featuredProjects={featuredProjects}
        dict={dict}
      />
      <Skills data={data.skills} dict={dict} />
      <JobExperience data={data.jobExperience} />
      <LatestArticles
        locale={params.lang}
        latestArticles={latestArticles}
        dict={dict}
        basePath={`/${params.lang}/blog/`}
      />
    </PageLayout>
  );
};

export default HomePage;
