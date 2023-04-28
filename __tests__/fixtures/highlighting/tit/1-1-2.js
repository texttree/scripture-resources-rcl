module.exports = {
  book: 'tit',
  chapter: 1,
  verse: 1,
  quote: 'Θεοῦ',
  occurrence: -1,
  expected: [
    {
      text: 'Θεοῦ',
      occurrence: 1,
      occurrences: 2,
      reference: { chapter: 1, verse: 1 },
    },
    {
      text: 'Θεοῦ',
      occurrence: 2,
      occurrences: 2,
      reference: { chapter: 1, verse: 1 },
    },
  ],
};
