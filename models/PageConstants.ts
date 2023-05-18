import { SocialMedia } from '@/models/domain/SocialMedia';
import { Text } from '@/models/domain/Text';

export interface PageConstants {
  text: Text;
  social: Array<SocialMedia>;
}
