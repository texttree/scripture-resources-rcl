export const isHebrew = (string) => {
  const hebrewChars = string.match(/[\u0590-\u05FF]/g) || [];
  const percent = hebrewChars.length / string.length;
  return percent > 0.75;
};
