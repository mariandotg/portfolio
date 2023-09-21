import PageLayout from '../../components/PageLayout';
import { MdArrowForward, MdArrowOutward } from 'react-icons/md';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import Section from '../../components/Section';
import SectionTitle from '../../components/SectionTitle';
import SkillItem from '../../components/SkillItem';
import { PageContentSections } from '@/models/PageContentSections';
import ArticleCard from '@/components/ArticleCard';
import { getDictionary } from './dictionaries';
import FeaturedProjects from '@/components/FeaturedProjects';
import { fetchArticles } from '@/services/content/articles';
import { fetchPageByPath } from '@/services/content/pages';
import { fetchSocialMedia } from '@/services/content/social-media';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { metadataAdapter } from '@/adapters/metadataAdapter';
import Chip from '@/components/Chip';

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
  const articles = await fetchArticles(params.lang);
  const latestArticles = articles?.slice(0, 3);
  const dict = await getDictionary(params.lang);

  data!.latestArticles.content.articles = latestArticles!;

  return (
    <PageLayout>
      <Section>
        <div className='flex flex-col col-span-4 gap-y-4 mt-36'>
          <div className='flex items-center gap-x-4'>
            <h1 className='flex italic font-medium text-title text-light-headlines dark:text-dark-headlines font-monospace'>
              {data.about.title}
            </h1>
            <ul className='flex gap-x-4'>
              {social!.map((social) => (
                <li key={social.id} className='flex'>
                  <a
                    href={social.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label={social.alt}
                  >
                    <Icon
                      value={social.icon.toLocaleLowerCase()}
                      className='h-5 w-5 duration-[0ms] fill-light-text dark:fill-dark-text hover:fill-primary dark:hover:fill-primary'
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className='font-display text text-light-text dark:text-dark-text'>
            {data.about.content.description.text}
          </p>
        </div>
        <div className='flex flex-col gap-4 tablet:col-start-3 tablet:gap-4 mobile:col-span-2 mobile:grid mobile:grid-cols-2'>
          <Button
            variant={data.about.content.secondaryCta.variant}
            url={data.about.content.secondaryCta.url}
            className='tablet:col-span-1'
          >
            {data.about.content.secondaryCta.label}
            <MdArrowOutward />
          </Button>
          <Button
            variant={data.about.content.cta.variant}
            url={data.about.content.cta.url}
            className='tablet:col-span-1'
          >
            {data.about.content.cta.label}
            <Icon value='mail' />
          </Button>
        </div>
      </Section>

      <Section>
        <SectionTitle
          emoji={data.featuredProjects.emoji}
          additionalLink={{
            href: `${params.lang}/projects`,
            label: 'See all my projects',
          }}
        >
          {data.featuredProjects.title}
        </SectionTitle>
        <div className='flex flex-col items-center tablet:col-span-4 gap-y-4'>
          <div className='flex flex-col w-full gap-y-8 mobile:grid mobile:grid-cols-2 mobile:gap-4 tablet:grid-cols-3 tablet:grid-rows-1'>
            {/* @ts-expect-error Async Server Component */}
            <FeaturedProjects params={params} />
          </div>
        </div>
      </Section>

      <Section>
        <SectionTitle
          emoji={data.skills.emoji}
          additionalLink={{
            href: `https://www.linkedin.com/in/marianoguillaume/`,
            label: 'See my certificates on LinkedIn',
          }}
        >
          {data.skills.title}
        </SectionTitle>
        <p className='col-span-4 text text-light-text dark:text-dark-text'>
          {data.skills.content.skillsDescription.text}
        </p>
        <div className='flex flex-col items-center tablet:col-span-4 gap-y-4'>
          <div className='flex flex-col w-full gap-4 mobile:grid mobile:grid-cols-2 tablet:gap-4 tablet:grid-cols-3 tablet:col-span-4 '>
            {data.skills.content.skillCards.map((skillCard, index) => {
              return (
                <div
                  key={skillCard.id}
                  className='flex flex-col p-4 rounded gap-y-2 mobile:col-span-1 bg-dark-headlines/30 dark:bg-light-headlines/50'
                >
                  <span className='p-2 border rounded-full w-fit dark:border-light-text/30 border-dark-text/30 bg-light dark:bg-dark'>
                    <Icon
                      value={skillCard.title.toLocaleLowerCase()}
                      className='duration-[0ms] dark:text-dark-headlines text-light-headlines'
                    />
                  </span>
                  <h3 className='font-medium dark:text-dark-headlines text text-light-headlines'>
                    {skillCard.title}
                  </h3>
                  <ul className='flex flex-wrap gap-2'>
                    {skillCard.skills.map((skill, index) => (
                      <Chip key={index}>{skill}</Chip>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      <Section>
        <SectionTitle emoji={data.jobExperience.emoji}>
          {data.jobExperience.title}
        </SectionTitle>
        <ol className='relative flex flex-col border-l tablet:border-none gap-y-4 tablet:col-span-4 tablet:grid-cols-3 border-primary tablet:gap-0'>
          {data.jobExperience.content.jobCards.map((jobCard) => (
            <li
              className='flex tablet:grid tablet:grid-cols-3 tablet:col-span-3'
              key={jobCard.id}
            >
              <div className='hidden p-4 mb-1 leading-none tablet:m-0 text text-light-text dark:text-dark-text tablet:flex tablet:border-r tablet:border-primary tablet:col-span-1 tablet:justify-end tablet:mr-[2px]'>
                <p className='tablet:mr-1'>{jobCard.period}</p>
              </div>
              <div className='p-4 ml-4 rounded tablet:relative bg-dark-headlines/30 dark:bg-light-headlines/50 tablet:col-span-2 tablet:mb-4'>
                <div className='absolute w-[13px] h-[13px] text-light-text rounded-[50px] tablet:mt-1.5 -left-[7px] border tablet:-left-[25px] border-light dark:border-dark bg-primary'></div>
                <p className='mb-1 leading-none text-secondary text-light-text dark:text-dark-text tablet:hidden'>
                  {jobCard.period}
                </p>
                <h3 className='flex font-medium text gap-x-4 dark:text-dark-headlines font-display text-light-headlines'>
                  {jobCard.position} - {jobCard.company}
                </h3>
                <p className='mb-4 text text-light-text dark:text-dark-text'>
                  {jobCard.responsabilities}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <SectionTitle
          emoji={data.latestArticles.emoji}
          additionalLink={{
            href: `${params.lang}/blog`,
            label: 'See my blog',
          }}
        >
          {data.latestArticles.title}
        </SectionTitle>
        <div className='flex w-full snap-x tablet:col-span-4'>
          <ul className='flex flex-col w-full gap-4 mobile:grid mobile:grid-cols-2 tablet:grid-cols-3'>
            {data.latestArticles.content.articles.length !== 0 ? (
              data.latestArticles.content.articles.map((article, index) => (
                <ArticleCard
                  article={article}
                  path={`${params.lang}/blog/${article.path}`}
                  locale={params.lang}
                />
              ))
            ) : (
              <p className='col-span-1 dark:text-dark-text text-light-text'>
                {dict.latestArticles.notFound}
              </p>
            )}
          </ul>
        </div>
      </Section>
    </PageLayout>
  );
};

export default HomePage;
