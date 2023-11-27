'use client';
import { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';

import * as Yup from 'yup';
import Button from './Button';
import Input from './Input';
import { Dictionary } from '@/app/[lang]/dictionaries';
import { Icon } from './icons';
import { NavBarContext } from '@/lib/NavBarContext';

export interface IInitialValues {
  subject: string;
  from: string;
  message: string;
}

interface Props {
  dict: Dictionary;
}

const Contact = ({ dict }: Props) => {
  const { setToast } = useContext(NavBarContext);

  const initialValues: IInitialValues = {
    subject: '',
    from: '',
    message: '',
  };

  const validationSchema = Yup.object().shape({
    subject: Yup.string()
      .min(4, dict.contact.feedback.error.minCant)
      .required(dict.contact.feedback.required),
    from: Yup.string()
      .email(dict.contact.feedback.error.validEmail)
      .required(dict.contact.feedback.required),
    message: Yup.string().required(dict.contact.feedback.required),
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
        setToast({
          label: dict.utils.messageSent,
          icon: 'miniSuccess',
          variant: 'success',
        });
      } else {
        setToast({
          label: 'ERROR',
          icon: 'miniError',
          variant: 'error',
        });
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
    <section className='flex flex-col items-end gap-4 tablet:col-span-4'>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col items-end w-full gap-4 tablet:grid tablet:grid-cols-2'
      >
        <Input
          errors={errors}
          handleBlur={handleBlur}
          handleChange={handleChange}
          label={dict.contact.subject.label}
          name='subject'
          touched={touched}
          type='text'
          values={values}
          placeholder={dict.contact.subject.placeholder}
        />
        <Input
          errors={errors}
          handleBlur={handleBlur}
          handleChange={handleChange}
          label={dict.contact.email.label}
          name='from'
          touched={touched}
          type='text'
          values={values}
          placeholder={dict.contact.email.placeholder}
        />
        <Input
          errors={errors}
          handleBlur={handleBlur}
          handleChange={handleChange}
          label={dict.contact.message.label}
          name='message'
          touched={touched}
          type='textarea'
          values={values}
          placeholder={dict.contact.message.placeholder}
          className='tablet:col-span-2'
        />
        <Button variant='primary'>
          {dict.utils.submit}
          <Icon value='miniEnvelopeOpen' width={20} height={20} />
        </Button>
      </form>
    </section>
  );
};

export default Contact;
