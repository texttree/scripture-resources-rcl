module.exports = {
  book: 'tit',
  chapter: 3,
  verse: 13,
  quote: 'σπουδαίως πρόπεμψον',
  occurrence: 1,
  expected: [
    {
      text: 'σπουδαίως',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 3, verse: 13 },
    },
    {
      text: 'πρόπεμψον',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 3, verse: 13 },
    },
  ],
};
