export default function NotFound() {
  return (
    <div className='flex items-center justify-center w-full h-full'>
      {/*
        No support for metadata in not-found.tsx yet
        https://github.com/vercel/next.js/pull/47328#issuecomment-1488891093
      */}
      <title>Not Found | example.com</title>
      <h1 className='text-center text-light-headlines dark:text-dark-headlines'>
        404 - Not Found
      </h1>
    </div>
  );
}
