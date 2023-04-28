module.exports = {
  book: 'tit',
  chapter: 1,
  verse: 5,
  quote: 'ἵνα τὰ λείποντα ἐπιδιορθώσῃ',
  occurrence: 1,
  expected: [
    {
      text: 'ἵνα',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 5 },
    },
    {
      text: 'τὰ',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 5 },
    },
    {
      text: 'λείποντα',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 5 },
    },
    {
      text: 'ἐπιδιορθώσῃ',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 5 },
    },
  ],
};
