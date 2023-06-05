import { IConstantsFields } from '@/models/contentful/generated/contentful';
import { PageSocial } from '@/models/PageSocial';

export function pageSocialAdapter(data: IConstantsFields): PageSocial {
  const social = data.socialMedia.reduce<PageSocial>((acc, curr) => {
    const fields = { ...curr.fields, id: curr.sys.id };
    return [...acc, fields];
  }, []);

  return social;
}
