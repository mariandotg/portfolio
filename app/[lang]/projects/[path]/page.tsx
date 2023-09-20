import React from 'react';
import SkillItem from '@/components/SkillItem';
import Button from '@/components/Button';
import { Metadata } from 'next';
import PageIndexes from '@/components/PageIndexes';
import Share from '@/components/Share';
import { getDictionary } from '../../dictionaries';
import { getProjectMetadata } from '@/services/api';
import { fetchProjectByPath } from '@/services/content/projects';
import { redirect } from 'next/navigation';
import CustomLink from '@/components/CustomLink';
import useDate from '@/hooks/useDate';
import LinkButton from '@/components/LinkButton';
import { MdArrowOutward } from 'react-icons/md';

export const revalidate = 86400;

interface Props {
  params: {
    path: string;
    lang: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return await getProjectMetadata(params.lang, params.path);
}

const ProjectPage = async ({ params }: Props) => {
  const dict = await getDictionary(params.lang);
  const project = await fetchProjectByPath(params.path, params.lang);

  if (!project) return redirect(`../../${params.lang}/projects/not-found`);

  const { long } = useDate(new Date(project.publishedAt));

  const renderTags = () =>
    project.tags.map((tag, index) => (
      <li>
        <SkillItem key={tag.id} skill={tag.name} variant='base' />
      </li>
    ));

  return (
    <>
      <CustomLink
        href={`../../${params.lang}/projects`}
        icon={{ position: 'before' }}
      >
        go Back
      </CustomLink>
      <div className='flex flex-col col-span-4 gap-y-2'>
        <div className='relative h-64 overflow-hidden rounded tablet:col-span-4'>
          <img
            src={project.image}
            alt='page header'
            className='object-cover w-full'
            placeholder='blur'
          />
        </div>
      </div>
      <div className='flex flex-col gap-y-4 tablet:col-span-3'>
        <div className='flex flex-col gap-y-2'>
          <h1 className='font-medium text-title dark:text-dark-headlines text-light-headlines'>
            {project.title}
          </h1>
          <p className='dark:text-dark-text text-light-text'>
            {project.description}
          </p>
          <p className='dark:text-dark-text text-light-text'>
            {dict.pageIndex.published} {long[params.lang]}
          </p>
        </div>
        <div>
          <h3 className=''>{dict.pageIndex.tags}</h3>
          <ul className='flex flex-row flex-wrap items-center w-full gap-2'>
            {renderTags()}
          </ul>
        </div>
        <div className='flex gap-4'>
          <LinkButton href={project.repository} endContent={<MdArrowOutward />}>
            {dict.project.repository}
          </LinkButton>
          <LinkButton href={project.live} endContent={<MdArrowOutward />}>
            {dict.project.live}
          </LinkButton>
        </div>
        <div className=''>
          <h3 className=''>{dict.pageIndex.content}</h3>
          <PageIndexes />
        </div>
        <article className='flex flex-col gap-4'>{project.content}</article>
        <div className=''>
          <h3 className=''>{dict.pageIndex.share}</h3>
          <Share />
        </div>
      </div>
    </>
  );
};

export default ProjectPage;

{
  /*
<div className='sidebar'>
        <div className='sidebar-group'>
          <h3 className='sidebar-group-title'>{dict.pageIndex.tags}</h3>
          <ul className='flex flex-row flex-wrap items-center w-full gap-2'>
            {renderTags()}
          </ul>
        </div>
        <div className='sticky top-[73px] flex flex-col gap-y-4'>
          <div className='hidden tablet:sidebar-group'>
            <h3 className='sidebar-group-title'>{dict.pageIndex.content}</h3>
            <PageIndexes />
          </div>
          <div className='sidebar-group'>
            <h3 className='sidebar-group-title'>{dict.pageIndex.share}</h3>
            <Share />
          </div>
        </div>
      </div>
*/
}
