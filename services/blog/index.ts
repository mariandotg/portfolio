/*
TODO: Método para obtener latest articles (minified: Title, Image, Category, Path, Id)
TODO: Método para obtener los articles (paginados) (minified: Title, Image, Category, Path, Id)
TODO: Método para obtener el article individual (todo)
*/

const url = 'http://127.0.0.1:1337/';

export const getArticles = async () => {
  const response = await fetch(
    `${url}api/articles?locale=en&populate[image]=*&fields[0]=title&fields[1]=publishedAt&fields[2]=category&fields[3]=path`
  );
  if (!response.ok) {
    throw new Error('test error');
  }
  const { data } = await response.json();
  return data;
};
