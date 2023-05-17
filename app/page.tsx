import { pageContentAdapter } from '@/adapters/pageContentAdapter';
import { IPage } from '@/models/contentful/generated/contentful';
import { getContentfulData } from '@/services/contentful';
import Section from './components/Section';
import Button from './components/Button';

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
  return (
    <Section>
      <div className='col-span-3'>
        <Button variant='primary'>Test button</Button>
        <Button variant='secondary'>Test button</Button>
        <Button variant='tertiary'>Test button</Button>
      </div>
    </Section>
  );
};

export default HomePage;
