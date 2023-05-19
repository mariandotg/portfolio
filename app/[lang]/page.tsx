import Image from 'next/image';
import PageLayout from '../components/PageLayout';

import AboutSection from '../components/AboutSection';
import FeaturedProjectsSection from '../components/FeaturedProjectsSection';
import SkillsSection from '../components/SkillsSection';
import JobExperienceSection from '../components/JobExperienceSection';
import LatestArticlesSection from '../components/LatestArticlesSection';

import { MdArrowOutward } from 'react-icons/md';
import Button from '../components/Button';
import Icon from '../components/Icon';
import Section from '../components/Section';
import { pageConstantsAdapter } from '@/adapters/pageConstantsAdapter';
import { pageContentAdapter } from '@/adapters/pageContentAdapter';
import { IPage, IConstants } from '@/models/contentful/generated/contentful';
import { getContentfulData } from '@/services/contentful';
import ProjectCard from '../components/ProjectCard';
import SectionTitle from '../components/SectionTitle';
import { CompoundFilterObj } from '@/models/notion/Filters';
import { projectsAdapter } from '@/adapters/projectsAdapter';
import { queryNotionDatabase } from '@/services/notion';
import SkillItem from '../components/SkillItem';
import Link from 'next/link';
import { articlesAdapter } from '@/adapters/articlesAdapter';

const HomePage = async ({ params: { lang } }: { params: { lang: string } }) => {
  const databaseId = process.env.NEXT_PUBLIC_NOTION_PAGES_DATABASE_ID!;

  const data = await getContentfulData<IPage>({
    locale: lang,
    type: 'page',
  }).then((data) => pageContentAdapter(data[0].fields.sections));

  const social = await getContentfulData<IConstants>({
    locale: lang,
    type: 'constants',
  }).then((data) => pageConstantsAdapter(data[0].fields));

  const projectsFilter: CompoundFilterObj = {
    and: [
      {
        property: 'Stage',
        select: {
          equals: 'Published',
        },
      },
      {
        property: 'Database',
        select: {
          equals: 'Projects Database',
        },
      },
    ],
  };

  const articlesFilter: CompoundFilterObj = {
    and: [
      {
        property: 'Stage',
        select: {
          equals: 'Published',
        },
      },
      {
        property: 'LatestArticle',
        checkbox: {
          equals: true,
        },
      },
      {
        property: 'Database',
        select: {
          equals: 'Articles Database',
        },
      },
    ],
  };

  const projectsResponse = await queryNotionDatabase({
    databaseId,
    filter: projectsFilter,
  });

  const articlesResponse = await queryNotionDatabase({
    databaseId,
    filter: articlesFilter,
  });

  data.featuredProjects.content.projects = projectsAdapter(projectsResponse);
  data.latestArticles.content.articles = articlesAdapter(articlesResponse);

  return (
    <>
      <PageLayout>
        <div className='flex flex-col gap-8 mt-[57px]'>
          <div className='relative h-64'>
            <Image
              src='/header-web.webp'
              alt='page header'
              className='absolute object-cover'
              fill={true}
              priority
              quality={90}
            />
          </div>
        </div>
        <Section>
          <div className='flex flex-col col-span-3 gap-y-4'>
            <div className='flex flex-col gap-y-2'>
              <h1 className='flex italic font-medium text-title text-light-headlines dark:text-dark-headlines font-monospace'>
                {data.about.title}
              </h1>
              <ul className='flex gap-x-4'>
                {social.social.map((social) => (
                  <li key={social.id} className='flex'>
                    <a
                      href={social.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      aria-label={social.alt}
                    >
                      <Icon
                        value={social.icon.toLocaleLowerCase()}
                        className='duration-[0ms] fill-light-text dark:fill-dark-text hover:fill-primary dark:hover:fill-primary'
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
          <div className='flex flex-col gap-4 tablet:col-start-2 tablet:gap-4 mobile:col-span-2 mobile:grid mobile:grid-cols-2'>
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
            button={{
              label: 'See all my projects',
              variant: 'secondary',
            }}
            emoji={data.featuredProjects.emoji}
          >
            {data.featuredProjects.title}
          </SectionTitle>
          <div className='flex flex-col gap-y-8 mobile:grid mobile:grid-cols-2 mobile:gap-4 tablet:col-span-3 tablet:grid-cols-3 tablet:grid-rows-3 tablet:gap-4'>
            {data.featuredProjects.content.projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                className={
                  index === 0 ? 'mobile:col-span-2' : 'mobile:col-span-1'
                }
              />
            ))}
          </div>
        </Section>

        <Section>
          <SectionTitle emoji={data.skills.emoji}>
            {data.skills.title}
          </SectionTitle>
          <p className='col-span-3 text text-light-text dark:text-dark-text'>
            {data.skills.content.skillsDescription.text}
          </p>
          <div className='relative flex flex-col w-full gap-4 mobile:grid mobile:grid-cols-2 tablet:gap-4 tablet:grid-cols-3 tablet:col-span-3 '>
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
                  <h3 className='flex items-center font-medium gap-x-2 dark:text-dark-headlines text-title text-light-headlines'>
                    <Icon
                      value={skillCard.title.toLocaleLowerCase()}
                      className='duration-[0ms] dark:text-dark-headlines text-light-headlines'
                    />
                    {skillCard.title}
                  </h3>
                  <div className='flex flex-wrap gap-2'>
                    {skillCard.skills.map((skill, index) => {
                      return <SkillItem key={index} skill={skill} illuminate />;
                    })}
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
          <div className='flex flex-col gap-y-8 relative tablet:col-span-3 tablet:gap-0 border-l-[1px] tablet:border-none border-primary '>
            {data.jobExperience.content.jobCards.map((jobCard) => {
              return (
                <div
                  key={jobCard.id}
                  id='this'
                  className='relative flex flex-col pl-4 tablet:grid gap-y-2 tablet:grid-cols-3 tablet:pl-0 tablet:gap-8'
                >
                  <div className='relative tablet:col-span-1'>
                    <span
                      className={`text-secondary tablet:text tablet:justify-end flex font-light text-light-text dark:text-dark-text tablet:after:top-0 tablet:after:-right-[16px] tablet:after:content-[""] tablet:after:h-full tablet:after:w-[1px] tablet:after:absolute tablet:after:bg-primary `}
                    >
                      {jobCard.period}
                    </span>
                  </div>
                  <div className='flex tablet:pb-8 tablet:border-none tablet:relative flex-col gap-y-2 tablet:col-span-2 before:content-[""] before:rounded before:w-[7px] before:h-[7px] before:bg-primary before:absolute before:top-1 tablet:before:top-2 before:right-auto tablet:before:-left-5 before:-left-1'>
                    <div>
                      <span className='italic font-medium underline underline-offset-2 text font-monospace text-light-text dark:text-dark-text'>
                        {jobCard.company}
                      </span>
                      <h3 className='flex font-medium text-title gap-x-4 dark:text-dark-headlines font-display text-light-headlines'>
                        {jobCard.position}
                      </h3>
                    </div>
                    <p className='text text-light-text dark:text-dark-text'>
                      {jobCard.responsabilities}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        <Section>
          <SectionTitle
            button={{
              label: 'See all my articles',
              variant: 'secondary',
            }}
            emoji={data.latestArticles.emoji}
          >
            {data.latestArticles.title}
          </SectionTitle>
          <div className='flex w-full snap-x tablet:col-span-3'>
            <ul className='flex flex-col w-full gap-4 mobile:grid mobile:grid-cols-2 tablet:grid-cols-3'>
              {data.latestArticles.content.articles.map((article, index) => (
                <li
                  key={article.id}
                  className={`cursor-pointer group ${
                    index === 0
                      ? 'mobile:col-span-2 tablet:col-span-1'
                      : 'mobile:col-span-1'
                  }`}
                >
                  <Link
                    href={`${lang}/projects/${article.path}`}
                    className='flex flex-col gap-y-2'
                  >
                    <span className='font-light text-secondary text-light-text dark:text-dark-text'>
                      {article.date.start}
                    </span>
                    <div
                      className={`relative flex w-full overflow-hidden h-[135px]  ${
                        index === 0 ? 'mobile:h-[135px]' : 'mobile:h-[100px]'
                      } tablet:h-[135px] rounded`}
                    >
                      <h3 className='absolute z-20 font-medium bottom-2 left-2 text-article text-dark-headlines font-display'>
                        {article.name}
                      </h3>
                      <div className='absolute top-0 left-0 z-10 flex items-end justify-center w-full h-full p-4 opacity-100 tablet:opacity-0 group-hover:opacity-100 tablet:bg-dark/25'>
                        <MdArrowOutward className='absolute w-5 h-5 opacity-100 tablet:opacity-0 right-2 top-2 text-dark-headlines group-hover:opacity-100' />
                      </div>
                      <Image
                        src={article.image}
                        alt={`${article.name} image`}
                        className='top-0 left-0 object-cover rounded aspect-video'
                        fill={true}
                      />
                    </div>
                    <div className='flex flex-row items-center w-full gap-2'>
                      <SkillItem
                        key={article.tags[0].id}
                        skill={article.tags[0].name}
                      />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      </PageLayout>
    </>
  );
};

export default HomePage;
