import { FormikErrors, FormikTouched } from 'formik';
import React, { ChangeEvent, FocusEvent } from 'react';
import { IInitialValues } from './Contact';

interface Props {
  type: 'textarea' | 'text';
  errors: FormikErrors<IInitialValues>;
  touched: FormikTouched<IInitialValues>;
  values: IInitialValues;
  handleBlur: {
    (e: FocusEvent<any, Element>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
  handleChange: {
    (e: ChangeEvent<any>): void;
    <T_1 = string | ChangeEvent<any>>(field: T_1): T_1 extends ChangeEvent<any>
      ? void
      : (e: string | ChangeEvent) => void;
  };
  name: keyof IInitialValues;
  label: string;
  placeholder?: string;
}

const Input = ({
  type,
  errors,
  touched,
  handleBlur,
  handleChange,
  values,
  name,
  label,
  placeholder,
}: Props) => {
  return (
    <div className='flex flex-col w-full gap-1 text-light-text dark:text-dark-text focus-within:text-primary'>
      <label
        className={`font-bold ${
          errors[name] && touched[name] && 'text-[#FF0000]'
        }`}
      >
        {label}
      </label>
      {type === 'textarea' ? (
        <div
          className={`${
            errors[name] && touched[name]
              ? 'border-[#FF0000]'
              : 'border-light-headlines dark:border-dark-headlines'
          } h-[192px] px-4 py-3 rounded-[8px] focus:outline-none border focus-within:border-primary`}
        >
          <textarea
            name={name}
            placeholder={placeholder || 'placeholder text'}
            value={values[name]}
            onChange={handleChange}
            onBlur={handleBlur}
            className='w-full h-full bg-transparent outline-none resize-none text-light-text dark:text-dark-text'
          ></textarea>
        </div>
      ) : (
        <input
          name={name}
          type='text'
          placeholder={placeholder || 'placeholder text'}
          value={values[name]}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`${
            errors[name] && touched[name]
              ? 'border-[#FF0000]'
              : 'border-light-headlines dark:border-dark-headlines'
          } w-full px-4 py-3 rounded-[8px] bg-transparent border focus:outline-none focus:border-primary text-light-text dark:text-dark-text`}
        ></input>
      )}
      {errors[name] && touched[name] && (
        <span className='text-[#FF0000]'>{errors[name]}</span>
      )}
    </div>
  );
};

export default Input;
