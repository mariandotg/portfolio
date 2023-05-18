import { IConstantsFields } from '@/models/contentful/generated/contentful';
import { SocialMedia } from '@/models/domain/SocialMedia';
import { Text } from '@/models/domain/Text';
import { PageConstants } from '@/models/PageConstants';

export function pageConstantsAdapter(
  data: IConstantsFields
): PageConstants {
  const social = data.socialMedia.reduce<Array<SocialMedia>>((acc, curr) => {
    const fields = { ...curr.fields, id: curr.sys.id };
    return [...acc, fields];
  }, []);

  const text = data.headlines.reduce<Text>((acc, curr) => {
    const { slug, ...otherFields } = curr.fields;
    const fields = { ...otherFields, id: curr.sys.id };
    return { ...acc, [slug]: fields };
  }, {});

  return {
    text,
    social,
  };
}
