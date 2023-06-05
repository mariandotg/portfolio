const Loading = () => {
  return (
    <>
      <div className='flex flex-col gap-y-4 tablet:col-span-2'>
        <div className='flex flex-col gap-y-2'>
          <div className='w-full rounded h-7 bg-tertiary animate-pulse'></div>
          <div className='w-24 h-6 rounded bg-tertiary animate-pulse'></div>
        </div>
        <div className='flex flex-col gap-y-2'>
          {[...Array(5).keys()].map((item) => (
            <div
              key={item}
              className={`${
                item === 4 ? 'w-1/3' : 'w-full'
              } h-4 rounded bg-tertiary animate-pulse`}
            ></div>
          ))}
        </div>
        {[...Array(4).keys()].map((item) => (
          <div key={item} className='flex flex-col gap-y-4'>
            <div className='w-1/2 h-6 rounded bg-tertiary animate-pulse'></div>
            <div className='flex flex-col gap-y-2'>
              {[...Array(5).keys()].map((item) => (
                <div
                  key={item}
                  className={`${
                    item === 4 ? 'w-1/3' : 'w-full'
                  } h-4 rounded bg-tertiary animate-pulse`}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className='sidebar'>
        <div className='sidebar-group'>
          <span className='w-full h-6 rounded bg-tertiary animate-pulse'></span>
          <div className='flex flex-wrap gap-2'>
            {[...Array(3).keys()].map((item) => (
              <span
                key={item}
                className='h-6 rounded w-28 bg-tertiary animate-pulse'
              ></span>
            ))}
          </div>
        </div>
        <div className='sidebar-group'>
          <div className='w-full h-6 rounded bg-tertiary animate-pulse'></div>
          <ul className='flex flex-col w-full gap-y-2'>
            {[...Array(5).keys()].map((item) => (
              <li
                key={item}
                className='w-full h-[14px] rounded bg-tertiary animate-pulse'
              ></li>
            ))}
          </ul>
        </div>
        <div className='sidebar-group'>
          <div className='w-full h-6 rounded bg-tertiary animate-pulse'></div>
          <span className='w-full h-6 rounded bg-tertiary animate-pulse'></span>
        </div>
      </div>
    </>
  );
};

export default Loading;
