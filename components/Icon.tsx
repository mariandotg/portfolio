import { DiJava } from 'react-icons/di';
import { AiOutlineLink } from 'react-icons/ai';
import {
  MdBuild,
  MdCode,
  MdMail,
  MdOutlineScience,
  MdSettings,
} from 'react-icons/md';
import {
  SiJavascript,
  SiAdobeillustrator,
  SiAdobephotoshop,
  SiBootstrap,
  SiContentful,
  SiCss3,
  SiCypress,
  SiExpress,
  SiFigma,
  SiGit,
  SiHtml5,
  SiJest,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPostman,
  SiKotlin,
  SiReact,
  SiRedux,
  SiSpringboot,
  SiStrapi,
  SiStyledcomponents,
  SiTailwindcss,
  SiTypescript,
  SiNpm,
  SiYarn,
  SiMongodb,
  SiGithub,
  SiLinkedin,
  SiTwitter,
  SiYoutube,
  SiMedium,
  SiInstagram,
  SiTiktok,
  SiFacebook,
  SiReddit,
} from 'react-icons/si';

interface Icons {
  [key: string]: any;
}

interface Props {
  value: string;
  className?: string;
}

const icons: Icons = {
  es6: SiJavascript,
  illustrator: SiAdobeillustrator,
  photoshop: SiAdobephotoshop,
  bootstrap: SiBootstrap,
  contentful: SiContentful,
  css3: SiCss3,
  cypress: SiCypress,
  express: SiExpress,
  figma: SiFigma,
  facebook: SiFacebook,
  git: SiGit,
  github: SiGithub,
  html5: SiHtml5,
  instagram: SiInstagram,
  java: DiJava,
  jest: SiJest,
  kotlin: SiKotlin,
  linkedin: SiLinkedin,
  mongodb: SiMongodb,
  medium: SiMedium,
  mail: MdMail,
  'next.js': SiNextdotjs,
  node: SiNodedotjs,
  npm: SiNpm,
  postgresql: SiPostgresql,
  postman: SiPostman,
  react: SiReact,
  redux: SiRedux,
  reddit: SiReddit,
  'spring boot': SiSpringboot,
  strapi: SiStrapi,
  'styled-components': SiStyledcomponents,
  tailwindcss: SiTailwindcss,
  typescript: SiTypescript,
  url: AiOutlineLink,
  yarn: SiYarn,
  'front end': MdCode,
  'back end': MdSettings,
  testing: MdOutlineScience,
  twitter: SiTwitter,
  tiktok: SiTiktok,
  'other tools': MdBuild,
  youtube: SiYoutube,
  default: SiReact,
};

const Icon = ({ value, className }: Props) => {
  const SelectedIcon = icons[value] || icons.default;
  return <SelectedIcon className={className} stroke='currentColor' />;
};

export default Icon;
