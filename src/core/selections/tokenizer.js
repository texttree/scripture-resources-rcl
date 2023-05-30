import { tokenize } from 'string-punctuation-tokenizer';

export const tokenizer = (text) => {
  const options = {
    text,
    includeWords: true,
    includeNumbers: true,
    includePunctuation: true,
    includeWhitespace: true,
    greedy: true,
    verbose: true,
    occurrences: true,
  };
  const tokens = tokenize(options);
  return tokens;
};