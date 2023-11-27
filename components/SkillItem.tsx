import React from 'react';
import { Icon } from './icons';

interface Props {
  skill: string;
  illuminate?: boolean;
  variant: 'base' | 'mono';
}

const SkillItem = ({ skill, illuminate, variant }: Props) => {
  return (
    <span
      className={`relative whitespace-nowrap flex text ${
        illuminate &&
        'hover:after:bg-primary/40 hover:after:brightness-150 hover:after:blur-[8px] hover:after:content-[""] hover:after:absolute hover:after:h-[12px] hover:after:w-[12px] hover:after:z-[999]'
      } text-secondary ${
        variant === 'base'
          ? 'bg-primary/25 text-light-headlines dark:text-dark-headlines'
          : 'dark:text-light-headlines text-dark-headlines bg-dark dark:bg-light'
      } px-2 py-1 rounded-[50px] items-center justify-center group/item gap-x-2`}
    >
      <Icon
        value={skill?.toLocaleLowerCase()}
        className={`duration-[0ms] ${
          illuminate && 'group-hover/item:fill-primary'
        } ${
          variant === 'base'
            ? 'fill-light-headlines dark:fill-dark-headlines'
            : 'dark:fill-light-headlines fill-dark-headlines'
        }`}
      />
      {skill}
    </span>
  );
};

export default SkillItem;
