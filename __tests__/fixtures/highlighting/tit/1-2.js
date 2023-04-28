module.exports = {
  book: 'tit',
  chapter: 1,
  verse: 2,
  quote: 'ἐπ’ ἐλπίδι ζωῆς αἰωνίου',
  occurrence: 1,
  expected: [
    {
      text: 'ἐπ’',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 2 },
    },
    {
      text: 'ἐλπίδι',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 2 },
    },
    {
      text: 'ζωῆς',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 2 },
    },
    {
      text: 'αἰωνίου',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 2 },
    },
  ],
};
