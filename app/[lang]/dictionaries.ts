import 'server-only';

interface Dictionary {
  [key: string]: { [index: string]: string };
}

interface Dictionaries {
  [index: string]: () => Promise<Dictionary>;
}

const dictionaries: Dictionaries = {
  en: () =>
    import('./../../dictionaries/en.json').then((module) => module.default),
  es: () =>
    import('./../../dictionaries/es.json').then((module) => module.default),
};

export const getDictionary = async (locale: string) => dictionaries[locale]();
