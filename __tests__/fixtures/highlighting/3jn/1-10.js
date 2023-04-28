module.exports = {
  book: '3jn',
  chapter: 1,
  verse: 10,
  quote: 'ἐκ τῆς ἐκκλησίας ἐκβάλλει',
  occurrence: 1,
  expected: [
    {
      text: 'ἐκ',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 10 },
    },
    {
      text: 'τῆς',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 10 },
    },
    {
      text: 'ἐκκλησίας',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 10 },
    },
    {
      text: 'ἐκβάλλει',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 10 },
    },
  ],
};
