const truncateString = (string: string, maxLength: number) => {
  if (string.length >= maxLength) {
    return string.slice(0, maxLength - 3) + '...';
  }
  return string;
};

export default truncateString;
