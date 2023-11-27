interface FormattedDate {
  day: number;
  paddedDay: string;
  month: number;
  paddedMonth: string;
  year: number;
  short: {
    [index: string]: string;
  };
  long: {
    [index: string]: string;
  };
}

const useDate = (dateObject: Date) => {
  const day = dateObject.getDate();
  const paddedDay = day.toString().padStart(2, '0');
  const month = dateObject.getMonth() + 1;
  const paddedMonth = month.toString().padStart(2, '0');
  const year = dateObject.getFullYear();

  const monthsArrays = {
    es: [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ],
    en: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
  };

  const formattedDate: FormattedDate = {
    day,
    paddedDay,
    month,
    paddedMonth,
    year,
    short: {
      es: `${day}/${month}/${year}`,
      en: `${month}/${day}/${year}`,
    },
    long: {
      es: `${monthsArrays.es[month - 1]} ${day}, ${year}`,
      en: `${monthsArrays.en[month - 1]} ${day}, ${year}`,
    },
  };

  return formattedDate;
};

export default useDate;
