import PageLayout from '@/components/PageLayout';
import Section from '@/components/Section';

const Loading = () => {
  return (
    <PageLayout>
      <Section>
        <div className='flex flex-col justify-end col-span-4 gap-y-4 mt-36'>
          <div className='flex items-center gap-x-4'>
            <div className='w-64 h-6 rounded bg-tertiary animate-pulse'></div>
            <div className='h-6 rounded aspect-square bg-tertiary animate-pulse'></div>
            <div className='h-6 rounded aspect-square bg-tertiary animate-pulse'></div>
            <div className='h-6 rounded aspect-square bg-tertiary animate-pulse'></div>
          </div>
          <div className='flex flex-col gap-y-2'>
            {[...Array(4).keys()].map((item) => (
              <div
                key={item}
                className={`${
                  item === 3 ? 'w-1/3' : 'w-full'
                } h-4 rounded bg-tertiary animate-pulse`}
              ></div>
            ))}
          </div>
        </div>
        <div className='flex flex-col gap-4 mobile:flex-row tablet:col-span-2 tablet:col-start-2'>
          <div className='w-full h-10 rounded bg-tertiary animate-pulse'></div>
          <div className='w-full h-10 rounded bg-tertiary animate-pulse'></div>
        </div>
      </Section>

      <Section>
        <div className='flex items-center gap-4 tablet:col-span-4'>
          <div className='h-6 rounded aspect-square bg-tertiary animate-pulse'></div>
          <div className='w-64 h-4 rounded bg-tertiary animate-pulse'></div>
        </div>
        <div className='flex flex-col gap-y-8 mobile:grid mobile:grid-cols-2 mobile:gap-4 tablet:col-span-4 tablet:grid-cols-3 tablet:grid-rows-2'>
          <span className='col-span-1 h-[135px] tablet:h-full rounded tablet:col-span-1 tablet:row-span-2 bg-tertiary animate-pulse'></span>
          <span className='col-span-1 h-[135px] tablet:h-[200px] rounded bg-tertiary animate-pulse'></span>
          <span className='col-span-1 h-[135px] tablet:h-[200px] rounded bg-tertiary animate-pulse'></span>
          <span className='col-span-1 h-[135px] tablet:col-span-2 tablet:row-span-1 tablet:h-[200px] rounded bg-tertiary animate-pulse'></span>
        </div>
      </Section>

      <Section>
        <div className='flex items-center gap-4 tablet:col-span-4'>
          <div className='h-6 rounded aspect-square bg-tertiary animate-pulse'></div>
          <div className='w-64 h-4 rounded bg-tertiary animate-pulse'></div>
        </div>
        <div className='h-4 rounded bg-tertiary animate-pulse'></div>
        <div className='relative flex flex-col w-full gap-4 mobile:grid mobile:grid-cols-2 tablet:gap-4 tablet:grid-cols-3 tablet:col-span-4 '>
          {[...Array(3).keys()].map((item) => (
            <div
              key={item}
              className='flex flex-col border border-transparent rounded gap-y-2 mobile:col-span-1 tablet:col-span-1'
            >
              <div className='flex items-center gap-2 tablet:col-span-4'>
                <div className='h-4 rounded aspect-square bg-tertiary animate-pulse'></div>
                <div className='w-32 h-4 rounded bg-tertiary animate-pulse'></div>
              </div>
              <div className='flex flex-wrap gap-2'>
                {[...Array(5).keys()].map((item) => (
                  <div className='w-24 h-6 rounded bg-tertiary animate-pulse'></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className='flex items-center gap-4 tablet:col-span-4'>
          <div className='h-6 rounded aspect-square bg-tertiary animate-pulse'></div>
          <div className='w-64 h-4 rounded bg-tertiary animate-pulse'></div>
        </div>
        <div className='flex flex-col gap-y-8 relative tablet:col-span-4 tablet:gap-0 border-l-[1px] tablet:border-none border-primary '>
          {[...Array(5).keys()].map((item) => (
            <div
              key={item}
              className='relative flex flex-col pl-4 tablet:grid gap-y-2 tablet:grid-cols-3 tablet:pl-0 tablet:gap-4'
            >
              <div className='tablet:col-span-1'>
                <div className='flex h-4 rounded tablet:ml-auto tablet:mr-2 tablet:justify-end w-28 bg-tertiary animate-pulse'></div>
              </div>
              <div className='flex flex-col tablet:ml-2 tablet:pb-8 tablet:border-none tablet:relative gap-y-1 tablet:col-span-2 '>
                <div className='w-64 h-4 mb-1 rounded bg-tertiary animate-pulse'></div>
                {[...Array(4).keys()].map((item) => (
                  <div
                    key={item}
                    className={`${
                      item === 3 ? 'w-1/3' : 'w-full'
                    } h-4 rounded bg-tertiary animate-pulse`}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className='flex items-center gap-4 tablet:col-span-4'>
          <div className='h-6 rounded aspect-square bg-tertiary animate-pulse'></div>
          <div className='w-64 h-4 rounded bg-tertiary animate-pulse'></div>
        </div>
        <div className='flex w-full snap-x tablet:col-span-4'>
          <ul className='flex flex-col w-full gap-4 mobile:grid mobile:grid-cols-2 tablet:grid-cols-3'>
            {[...Array(3).keys()].map((item) => (
              <li
                key={item}
                className={`bg-tertiary w-full h-[135px] animate-pulse rounded cursor-pointer ${
                  item === 0
                    ? 'mobile:col-span-2 tablet:col-span-1'
                    : 'mobile:col-span-1'
                }`}
              ></li>
            ))}
          </ul>
        </div>
      </Section>
    </PageLayout>
  );
};

export default Loading;
