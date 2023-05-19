import React from 'react';

import Icon from './Icon';

interface Props {
  skill: string;
  illuminate?: boolean;
}

const SkillItem = ({ skill, illuminate }: Props) => {
  return (
    <span
      className={`relative whitespace-nowrap flex text ${
        illuminate &&
        'hover:after:bg-primary/40 hover:after:brightness-150 hover:after:blur-[8px] hover:after:content-[""] hover:after:absolute hover:after:h-[12px] hover:after:w-[12px] hover:after:z-[999]'
      } text-secondary bg-primary/25 px-2 py-1 rounded-[50px] items-center justify-center text-light-headlines dark:text-dark-headlines group/item gap-x-2`}
    >
      <Icon
        value={skill.toLocaleLowerCase()}
        className={`duration-[0ms] ${
          illuminate && 'group-hover/item:fill-primary'
        } fill-light-headlines dark:fill-dark-headlines`}
      />
      {skill}
    </span>
  );
};

export default SkillItem;
