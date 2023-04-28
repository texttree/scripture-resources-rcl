module.exports = {
  book: '3jn',
  chapter: 1,
  verse: 11,
  quote: 'μὴ μιμοῦ τὸ κακὸν,',
  occurrence: 1,
  expected: [
    {
      text: 'μὴ',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 11 },
    },
    {
      text: 'μιμοῦ',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 11 },
    },
    {
      text: 'τὸ',
      occurrence: 1,
      occurrences: 2,
      reference: { chapter: 1, verse: 11 },
    },
    {
      text: 'κακὸν',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 11 },
    },
  ],
};
