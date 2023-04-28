module.exports = {
  book: '3jn',
  chapter: 1,
  verse: 14,
  quote: 'στόμα πρὸς στόμα',
  occurrence: 1,
  expected: [
    {
      text: 'στόμα',
      occurrence: 1,
      occurrences: 2,
      reference: { chapter: 1, verse: 14 },
    },
    {
      text: 'πρὸς',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 14 },
    },
    {
      text: 'στόμα',
      occurrence: 2,
      occurrences: 2,
      reference: { chapter: 1, verse: 14 },
    },
  ],
};
