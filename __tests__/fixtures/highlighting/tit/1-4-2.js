module.exports = {
  book: 'tit',
  chapter: 1,
  verse: 4,
  quote: 'κατὰ…καὶ…καὶ',
  occurrence: 1,
  expected: [
    {
      text: 'κατὰ',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 4 },
    },
    {
      text: 'καὶ',
      occurrence: 1,
      occurrences: 2,
      reference: { chapter: 1, verse: 4 },
    },
    {
      text: 'καὶ',
      occurrence: 2,
      occurrences: 2,
      reference: { chapter: 1, verse: 4 },
    },
  ],
};
