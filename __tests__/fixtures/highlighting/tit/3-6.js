module.exports = {
  book: 'tit',
  chapter: 3,
  verse: 6,
  quote: 'οὗ ἐξέχεεν ἐφ’ ἡμᾶς πλουσίως',
  occurrence: 1,
  expected: [
    {
      text: 'οὗ',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 3, verse: 6 },
    },
    {
      text: 'ἐξέχεεν',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 3, verse: 6 },
    },
    {
      text: 'ἐφ’',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 3, verse: 6 },
    },
    {
      text: 'ἡμᾶς',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 3, verse: 6 },
    },
    {
      text: 'πλουσίως',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 3, verse: 6 },
    },
  ],
};
