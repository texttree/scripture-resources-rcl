module.exports = {
  book: 'tit',
  chapter: 1,
  verse: 4,
  quote: 'Χριστοῦ Ἰησοῦ τοῦ Σωτῆρος ἡμῶν',
  occurrence: 1,
  expected: [
    {
      text: 'Χριστοῦ',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 4 },
    },
    {
      text: 'Ἰησοῦ',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 4 },
    },
    {
      text: 'τοῦ',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 4 },
    },
    {
      text: 'Σωτῆρος',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 4 },
    },
    {
      text: 'ἡμῶν',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 4 },
    },
  ],
};
