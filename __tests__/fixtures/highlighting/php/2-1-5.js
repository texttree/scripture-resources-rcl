module.exports = {
  book: 'php',
  chapter: 2,
  verse: 1,
  quote: 'εἴ τι',
  occurrence: -1,
  expected: [
    {
      text: 'εἴ',
      occurrence: 2,
      occurrences: 4,
      reference: { chapter: 2, verse: 1 },
    },
    {
      text: 'τι',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 2, verse: 1 },
    },
  ],
};
