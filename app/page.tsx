import { pageContentAdapter } from '@/adapters/pageContentAdapter';
import { IPage } from '@/models/contentful/generated/contentful';
import { getContentfulData } from '@/services/contentful';

async function fetchTest() {
  const response = await getContentfulData<IPage>({
    locale: 'en',
    type: 'page',
  });
  return response;
}

const HomePage = async () => {
  const data = await fetchTest();
  console.log(pageContentAdapter(data[0].fields.sections));
  return <div className='bg-primary'>test</div>;
};

export default HomePage;
