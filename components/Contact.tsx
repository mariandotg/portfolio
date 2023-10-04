'use client';
import { useEffect } from 'react';
import { useFormik } from 'formik';

import * as Yup from 'yup';
import Button from './Button';
import Input from './Input';
import { NEXT_PUBLIC_BASE_FETCH_URL } from '@/config';

export interface IInitialValues {
  subject: string;
  from: string;
  message: string;
}

interface Props {
  lang: string;
}

const Contact = ({ lang }: Props) => {
  const initialValues: IInitialValues = {
    subject: '',
    from: '',
    message: '',
  };

  const validationSchema = Yup.object().shape({
    subject: Yup.string()
      .min(4, 'feedback.error.minCant')
      .required('feedback.required'),
    from: Yup.string()
      .email('feedback.error.validEmail')
      .required('feedback.required'),
    message: Yup.string().required('feedback.required'),
  });

  const onSubmit = () => {
    fetch(`./api/contact`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    }).then((res) => {
      resetForm();
      console.log(res);
      if (res.status === 200) {
        console.log('Response succeeded!');
      }
    });
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    resetForm,
    errors,
    touched,
  } = formik;

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  return (
    <section className='flex flex-col items-end gap-4 tablet:col-span-2'>
      <h2 className='self-start font-bold text text-light-headlines dark:text-dark-headlines'>
        Contact
      </h2>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col items-end w-full gap-4'
      >
        <Input
          errors={errors}
          handleBlur={handleBlur}
          handleChange={handleChange}
          label='Asunto'
          name='subject'
          touched={touched}
          type='text'
          values={values}
          placeholder='¡Hola mundo!'
        />
        <Input
          errors={errors}
          handleBlur={handleBlur}
          handleChange={handleChange}
          label='Email'
          name='from'
          touched={touched}
          type='text'
          values={values}
          placeholder='darthvader@deathstar.com'
        />
        <Input
          errors={errors}
          handleBlur={handleBlur}
          handleChange={handleChange}
          label='Mensaje'
          name='message'
          touched={touched}
          type='textarea'
          values={values}
          placeholder='Escribe tu mensaje aquí'
        />
        <Button variant='primary'>Submit</Button>
      </form>
    </section>
  );
};

export default Contact;
