'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Props {}

const FilterByTag = ({}: Props) => {
  const [tags, setTags] = useState<Set<string>>(new Set());
  const [uiTags, setUiTags] = useState<
    { label: string; value: string; added: boolean }[]
  >([
    { label: 'Kotlin', value: 'Kotlin', added: false },
    { label: 'Java', value: 'Java', added: false },
    { label: 'React', value: 'React', added: false },
    { label: 'TypeScript', value: 'TypeScript', added: false },
    { label: 'Tailwindcss', value: 'Tailwindcss', added: false },
    { label: 'Styled-components', value: 'Styled-components', added: false },
  ]);
  const [forceUpdate, setForceUpdate] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const updateTags = () => {
    setForceUpdate((prevState) => !prevState);
  };

  const updateSearchParams = (params: string) => {
    setTags((prev) => {
      const newTags = prev;

      if (!newTags.has(params)) {
        newTags.add(params);
      } else {
        newTags.delete(params);
      }

      updateTags();
      return newTags;
    });
  };

  useEffect(() => {
    const searchParams = Array.from(tags).join(',');
    const newSearchParams = tags.size !== 0 ? `?tags=${searchParams}` : '';

    router.push(`${pathname}${newSearchParams}`);
  }, [tags, updateTags]);

  return (
    <div className='sidebar'>
      <ul className='flex flex-wrap gap-2'>
        {uiTags.map((uiTag) => {
          return (
            <button
              className={uiTag.added ? 'bg-[#FF0000]' : 'bg-primary'}
              onClick={() => updateSearchParams(uiTag.value)}
            >
              {uiTag.label}
            </button>
          );
        })}
      </ul>
    </div>
  );
};

export default FilterByTag;
