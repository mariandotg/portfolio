const useDate = (dateObject: Date) => {
  const day = dateObject.getDate().toString().padStart(2, '0');
  const month = dateObject.getMonth().toString().padStart(2, '0');
  const year = dateObject.getFullYear();

  const formattedDate = {
    es: `${day}/${month}/${year}`,
    en: `${month}/${day}/${year}`,
  };

  return { day, month, year, formattedDate };
};

export default useDate;
