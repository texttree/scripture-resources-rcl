module.exports = {
  book: 'tit',
  chapter: 1,
  verse: 9,
  quote: 'τῇ διδασκαλίᾳ τῇ ὑγιαινούσῃ',
  occurrence: 1,
  expected: [
    {
      text: 'τῇ',
      occurrence: 1,
      occurrences: 2,
      reference: { chapter: 1, verse: 9 },
    },
    {
      text: 'διδασκαλίᾳ',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 9 },
    },
    {
      text: 'τῇ',
      occurrence: 2,
      occurrences: 2,
      reference: { chapter: 1, verse: 9 },
    },
    {
      text: 'ὑγιαινούσῃ',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 9 },
    },
  ],
};
