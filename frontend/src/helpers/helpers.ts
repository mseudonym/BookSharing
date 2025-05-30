export const getNounForm = (number: number, formOne: string, formTwo: string, formFive: string): string => {
  if (number % 10 === 1 && number % 100 !== 11) {
    return formOne;
  }
  else if (number % 10 >= 2 && number % 10 <= 4 && (number % 100 < 10 || number % 100 >= 20)) {
    return formTwo;
  }
  else {
    return formFive;
  }
};