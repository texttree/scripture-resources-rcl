import { tokenizer } from './tokenizer';

test('tokenizer tokenizes', () => {
  const input = 'ὁ λόγος,';
  const output = tokenizer(input);
  const expected = [
    {
      'occurrence': 1,
      'occurrences': 1,
      'token': 'ὁ',
      'type': 'word',
    },
    {
      'occurrence': 1,
      'occurrences': 1,
      'token': ' ',
      'type': 'whitespace',
    },
    {
      'occurrence': 1,
      'occurrences': 1,
      'token': 'λόγος',
      'type': 'word',
    },
    {
      'occurrence': 1,
      'occurrences': 1,
      'token': ',',
      'type': 'punctuation',
    },
  ];
  expect(output).toStrictEqual(expected);
});