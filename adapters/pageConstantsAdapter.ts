import { IConstantsFields } from '@/models/contentful/generated/contentful';
import { PageConstants } from '@/models/PageConstants';

export function pageConstantsAdapter(data: IConstantsFields): PageConstants {
  const social = data.socialMedia.reduce<PageConstants>((acc, curr) => {
    const fields = { ...curr.fields, id: curr.sys.id };
    return [...acc, fields];
  }, []);

  return social;
}
