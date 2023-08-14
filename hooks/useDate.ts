interface FormattedDate {
  [key: string]: string;
}

const useDate = (dateObject: Date) => {
  const day = dateObject.getDate().toString().padStart(2, '0');
  const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObject.getFullYear();

  const formattedDate: FormattedDate = {
    es: `${day}/${month}/${year}`,
    en: `${month}/${day}/${year}`,
  };

  return { day, month, year, formattedDate };
};

export default useDate;
