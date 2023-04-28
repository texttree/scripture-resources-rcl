module.exports = {
  book: '3jn',
  chapter: 1,
  verse: 12,
  quote: 'ὑπὸ αὐτῆς τῆς ἀληθείας',
  occurrence: 1,
  expected: [
    {
      text: 'ὑπὸ',
      occurrence: 2,
      occurrences: 2,
      reference: { chapter: 1, verse: 12 },
    },
    {
      text: 'αὐτῆς',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 12 },
    },
    {
      text: 'τῆς',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 12 },
    },
    {
      text: 'ἀληθείας',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 12 },
    },
  ],
};
