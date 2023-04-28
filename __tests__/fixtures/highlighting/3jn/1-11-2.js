module.exports = {
  book: '3jn',
  chapter: 1,
  verse: 11,
  quote: 'ἀλλὰ τὸ ἀγαθόν',
  occurrence: 1,
  expected: [
    {
      text: 'ἀλλὰ',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 11 },
    },
    {
      text: 'τὸ',
      occurrence: 2,
      occurrences: 2,
      reference: { chapter: 1, verse: 11 },
    },
    {
      text: 'ἀγαθόν',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 11 },
    },
  ],
};
