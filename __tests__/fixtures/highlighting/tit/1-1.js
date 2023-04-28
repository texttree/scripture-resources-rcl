module.exports = {
  book: 'tit',
  chapter: 1,
  verse: 1,
  quote: 'τῆς κατ’ εὐσέβειαν',
  occurrence: 1,
  expected: [
    {
      text: 'τῆς',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 1 },
    },
    {
      text: 'κατ’',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 1 },
    },
    {
      text: 'εὐσέβειαν',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 1 },
    },
  ],
};
