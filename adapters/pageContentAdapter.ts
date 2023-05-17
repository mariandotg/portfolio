import { ISection } from '@/models/contentful/generated/contentful';
import { Input } from '@/models/domain/Input';
import { JobCard } from '@/models/domain/JobCards';
import { SkillCard } from '@/models/domain/SkillCard';
import { PageContentSections } from '@/models/PageContentSections';

export function pageContentAdapter(data: Array<ISection>): PageContentSections {
  return data.reduce<PageContentSections>((acc, section) => {
    const { slug, ...sectionFields } = section.fields;

    const content = sectionFields.content!.reduce((acc, contentObj) => {
      const { slug, ...contentFields } = contentObj.fields;

      if ('content' in contentFields) {
        const content = contentFields!.content!.reduce<
          Partial<Array<JobCard | SkillCard | Input | any>>
        >((acc, content) => {
          const { slug, ...fields } = content!.fields;
          const id = content!.sys.id;

          return [...acc, { ...fields, id }];
        }, []);

        return { ...acc, [slug!]: content };
      }

      return { ...acc, [slug!]: contentFields };
    }, {});

    const fields = { ...sectionFields, content };
    return { ...acc, [slug]: fields };
  }, {} as PageContentSections);
}
