import PageLayout from '../../components/PageLayout';
import { PageContentSections } from '@/models/PageContentSections';
import { getDictionary } from './dictionaries';
import { fetchArticles } from '@/services/content/articles';
import { fetchPageByPath } from '@/services/content/pages';
import { fetchSocialMedia } from '@/services/content/social-media';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { metadataAdapter } from '@/adapters/metadataAdapter';
import AboutMe from '@/components/sections/AboutMe';
import { fetchProjects } from '@/services/content/projects';
import FeaturedProjects from '@/components/sections/FeaturedProjects';
import Skills from '@/components/sections/Skills';
import JobExperience from '@/components/sections/JobExperience';
import LatestArticles from '@/components/sections/LatestArticles';

interface Props {
  params: {
    lang: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await fetchPageByPath<PageContentSections>('home', params.lang);

  //@ts-ignore
  return metadataAdapter(data!.seo);
}

const HomePage = async ({ params }: Props) => {
  const data = await fetchPageByPath<PageContentSections>('home', params.lang);

  if (!data) return redirect(`../../not-found`);

  const social = await fetchSocialMedia();

  const projects = await fetchProjects(params.lang);
  const featuredProjects = projects?.slice(0, 4);

  const articles = await fetchArticles(params.lang);
  const latestArticles = articles?.slice(0, 3);

  const dict = await getDictionary(params.lang);

  return (
    <PageLayout>
      <AboutMe data={data.about} social={social} />
      <FeaturedProjects
        data={data.featuredProjects}
        locale={params.lang}
        featuredProjects={featuredProjects}
      />
      <Skills data={data.skills} />
      <JobExperience data={data.jobExperience} />
      <LatestArticles
        data={data.latestArticles}
        locale={params.lang}
        latestArticles={latestArticles}
        dict={dict}
      />
    </PageLayout>
  );
};

export default HomePage;
