module.exports = {
  book: 'tit',
  chapter: 1,
  verse: 3,
  quote: 'τοῦ Σωτῆρος ἡμῶν, Θεοῦ',
  occurrence: 1,
  expected: [
    {
      text: 'τοῦ',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 3 },
    },
    {
      text: 'Σωτῆρος',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 3 },
    },
    {
      text: 'ἡμῶν',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 3 },
    },
    {
      text: 'Θεοῦ',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 3 },
    },
  ],
};
