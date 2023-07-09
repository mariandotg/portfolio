import PageLayout from '../../components/PageLayout';
import { MdArrowOutward } from 'react-icons/md';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import Section from '../../components/Section';
import SectionTitle from '../../components/SectionTitle';
import SkillItem from '../../components/SkillItem';
import { PageContentSections } from '@/models/PageContentSections';
import { PageSocial } from '@/models/PageSocial';
import { Article } from '@/models/domain/Article';
import ArticleCard from '@/components/ArticleCard';

import { metadataAdapter } from '@/adapters/metadataAdapter';
import { Metadata } from 'next';
import { getDictionary } from './dictionaries';
import FeaturedProjects from '@/components/FeaturedProjects';

interface Props {
  params: {
    lang: string;
    path: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const homeFetch = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/${params.lang}/api/pages/home`,
    { cache: 'force-cache' }
  );

  const homeResponse: PageContentSections = await homeFetch.json();

  return metadataAdapter(homeResponse.seo);
}

const HomePage = async ({ params }: Props) => {
  const dataFetch = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/${params.lang}/api/pages/home`,
    { cache: 'force-cache' }
  );
  const socialFetch = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/${params.lang}/api/social`,
    { next: { revalidate: 86400 } }
  );
  const articlesFetch = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/${params.lang}/api/articles/latest`,
    { next: { revalidate: 86400 } }
  );

  const data: PageContentSections = await dataFetch.json();
  const social: PageSocial = await socialFetch.json();
  const articles: Article[] = await articlesFetch.json();

  data.latestArticles.content.articles = articles;

  const dict = await getDictionary(params.lang);

  return (
    <PageLayout>
      <Section>
        <div className='flex flex-col col-span-4 gap-y-4 mt-36'>
          <div className='flex items-center gap-x-4'>
            <h1 className='flex italic font-medium text-title text-light-headlines dark:text-dark-headlines font-monospace'>
              {data.about.title}
            </h1>
            <ul className='flex gap-x-4'>
              {social.map((social) => (
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
        <SectionTitle emoji={data.featuredProjects.emoji}>
          {data.featuredProjects.title}
        </SectionTitle>
        <div className='flex flex-col gap-y-8 mobile:grid mobile:grid-cols-2 mobile:gap-4 tablet:col-span-4 tablet:grid-cols-4 tablet:grid-rows-2'>
          {/* @ts-expect-error Async Server Component */}
          <FeaturedProjects params={params} />
        </div>
      </Section>

      <Section>
        <SectionTitle emoji={data.skills.emoji}>
          {data.skills.title}
        </SectionTitle>
        <p className='col-span-4 text text-light-text dark:text-dark-text'>
          {data.skills.content.skillsDescription.text}
        </p>
        <div className='relative flex flex-col w-full gap-4 mobile:grid mobile:grid-cols-2 tablet:gap-4 tablet:grid-cols-3 tablet:col-span-4 '>
          {data.skills.content.skillCards.map((skillCard, index) => {
            return (
              <div
                key={skillCard.id}
                className={`flex flex-col border border-transparent rounded gap-y-2 ${
                  index === data.skills.content.skillCards.length - 1
                    ? 'mobile:col-span-2 tablet:col-span-1'
                    : 'mobile:col-span-1'
                }`}
              >
                <h3 className='flex items-center font-medium gap-x-2 dark:text-dark-headlines text text-light-headlines'>
                  <Icon
                    value={skillCard.title.toLocaleLowerCase()}
                    className='duration-[0ms] dark:text-dark-headlines text-light-headlines'
                  />
                  {skillCard.title}
                </h3>
                <div className='flex flex-wrap gap-2'>
                  {skillCard.skills.map((skill, index) => (
                    <SkillItem key={index} skill={skill} variant='base' />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section>
        <SectionTitle emoji={data.jobExperience.emoji}>
          {data.jobExperience.title}
        </SectionTitle>
        <div className='flex flex-col gap-y-8 relative tablet:col-span-4 tablet:gap-0 border-l-[1px] tablet:border-none border-primary '>
          {data.jobExperience.content.jobCards.map((jobCard) => (
            <div
              key={jobCard.id}
              className='relative flex flex-col pl-4 tablet:grid gap-y-2 tablet:grid-cols-3 tablet:pl-0 tablet:gap-4'
            >
              <div className='relative tablet:col-span-1'>
                <span className='tablet:mr-2 text-secondary tablet:text tablet:justify-end flex font-light text-light-text dark:text-dark-text tablet:after:top-0 tablet:after:-right-[8px] tablet:after:content-[""] tablet:after:h-full tablet:after:w-[1px] tablet:after:absolute tablet:after:bg-primary'>
                  {jobCard.period}
                </span>
              </div>
              <div className='tablet:ml-2 flex tablet:pb-8 tablet:border-none tablet:relative flex-col gap-y-1 tablet:col-span-2 before:content-[""] before:rounded before:w-[7px] before:h-[7px] before:bg-primary before:absolute before:top-1 tablet:before:top-2 before:right-auto tablet:before:-left-5 before:-left-1'>
                <h3 className='flex font-medium text gap-x-4 dark:text-dark-headlines font-display text-light-headlines'>
                  {jobCard.position} - {jobCard.company}
                </h3>
                <p className='text text-light-text dark:text-dark-text'>
                  {jobCard.responsabilities}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionTitle emoji={data.latestArticles.emoji}>
          {data.latestArticles.title}
        </SectionTitle>
        <div className='flex w-full snap-x tablet:col-span-4'>
          <ul className='flex flex-col w-full gap-4 mobile:grid mobile:grid-cols-2 tablet:grid-cols-3'>
            {data.latestArticles.content.articles.length !== 0 ? (
              data.latestArticles.content.articles.map((article, index) => (
                <li
                  key={article.id}
                  className={`cursor-pointer group ${
                    index === 0
                      ? 'mobile:col-span-2 tablet:col-span-1'
                      : 'mobile:col-span-1'
                  }`}
                >
                  <ArticleCard
                    article={article}
                    path={`${params.lang}/blog/${article.path}`}
                    locale={params.lang}
                  />
                </li>
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
