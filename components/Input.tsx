import { FormikErrors, FormikTouched } from 'formik';
import React, { ChangeEvent, FocusEvent } from 'react';
import { IInitialValues } from './Contact';
import { Icon } from './icons';

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
  className?: string;
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
  className,
}: Props) => {
  return (
    <div
      className={`flex flex-col w-full gap-1 text-light-text dark:text-dark-text focus-within:text-primary ${className}`}
    >
      <label
        className={`font-medium text-secondary ${
          errors[name] && touched[name] && 'text-error'
        }`}
      >
        {label}
      </label>
      {type === 'textarea' ? (
        <div
          className={`${
            errors[name] && touched[name]
              ? 'border-error'
              : 'dark:border-dark-subtle-edges border-light-subtle-edges'
          } h-[156px] px-4 py-2 rounded-[8px] focus:outline-none border focus-within:border-primary`}
        >
          <textarea
            name={name}
            placeholder={placeholder || 'placeholder text'}
            value={values[name]}
            onChange={handleChange}
            onBlur={handleBlur}
            className='w-full h-full bg-transparent outline-none resize-none text-light-text dark:text-dark-text '
          ></textarea>
        </div>
      ) : (
        <div className='relative h-fit'>
          <input
            name={name}
            type='text'
            placeholder={placeholder || 'placeholder text'}
            value={values[name]}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${
              errors[name] && touched[name]
                ? 'border-error'
                : touched[name]
                ? 'border-success'
                : 'dark:border-dark-subtle-edges border-light-subtle-edges'
            } w-full px-4 py-2 rounded-[8px] bg-transparent border focus:outline-none focus:border-primary text-light-text dark:text-dark-text placeholder:text-light-secondary/60 dark:placeholder:text-dark-secondary/60`}
          ></input>
          {errors[name] && touched[name] ? (
            <Icon
              value='miniError'
              width={20}
              height={20}
              className='absolute top-3 right-3 text-error'
            />
          ) : (
            touched[name] && (
              <Icon
                value='miniSuccess'
                width={20}
                height={20}
                className='absolute top-3 right-3 text-success'
              />
            )
          )}
        </div>
      )}
      <div className='h-5'>
        {errors[name] && touched[name] && (
          <span className='text-error'>{errors[name]}</span>
        )}
      </div>
    </div>
  );
};

export default Input;
