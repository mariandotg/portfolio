import React from 'react';

const ProjectsListFallback = () => {
  return (
    <>
      <li className='grid h-32 grid-cols-1 col-span-4 gap-4 mobile:grid-cols-5 mobile:col-span-5'>
        <div className='h-4 col-span-1 bg-warning'></div>
        <div className='col-span-1 rounded-sm bg-tertiary animate-pulse mobile:col-span-4'></div>
      </li>
      <li className='grid h-32 grid-cols-1 col-span-4 gap-4 mobile:grid-cols-5 mobile:col-span-5'>
        <div className='h-4 col-span-1 bg-warning'></div>
        <div className='col-span-1 rounded-sm bg-tertiary animate-pulse mobile:col-span-4'></div>
      </li>
      <li className='grid h-32 grid-cols-1 col-span-4 gap-4 mobile:grid-cols-5 mobile:col-span-5'>
        <div className='h-4 col-span-1 bg-warning'></div>
        <div className='col-span-1 rounded-sm bg-tertiary animate-pulse mobile:col-span-4'></div>
      </li>
      <li className='grid h-32 grid-cols-1 col-span-4 gap-4 mobile:grid-cols-5 mobile:col-span-5'>
        <div className='h-4 col-span-1 bg-warning'></div>
        <div className='col-span-1 rounded-sm bg-tertiary animate-pulse mobile:col-span-4'></div>
      </li>
    </>
  );
};

export default ProjectsListFallback;
