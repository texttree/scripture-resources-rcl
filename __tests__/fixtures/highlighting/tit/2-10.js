module.exports = {
  book: 'tit',
  chapter: 2,
  verse: 10,
  quote: 'τὴν διδασκαλίαν τὴν τοῦ Σωτῆρος ἡμῶν, Θεοῦ, κοσμῶσιν',
  occurrence: 1,
  expected: [
    {
      text: 'τὴν',
      occurrence: 1,
      occurrences: 2,
      reference: { chapter: 2, verse: 10 },
    },
    {
      text: 'διδασκαλίαν',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 2, verse: 10 },
    },
    {
      text: 'τὴν',
      occurrence: 2,
      occurrences: 2,
      reference: { chapter: 2, verse: 10 },
    },
    {
      text: 'τοῦ',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 2, verse: 10 },
    },
    {
      text: 'Σωτῆρος',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 2, verse: 10 },
    },
    {
      text: 'ἡμῶν',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 2, verse: 10 },
    },
    {
      text: 'Θεοῦ',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 2, verse: 10 },
    },
    {
      text: 'κοσμῶσιν',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 2, verse: 10 },
    },
  ],
};
