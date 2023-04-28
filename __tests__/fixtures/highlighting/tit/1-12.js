module.exports = {
  book: 'tit',
  chapter: 1,
  verse: 12,
  quote: 'τις ἐξ αὐτῶν, ἴδιος αὐτῶν προφήτης',
  occurrence: 1,
  expected: [
    {
      text: 'τις',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 12 },
    },
    {
      text: 'ἐξ',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 12 },
    },
    {
      text: 'αὐτῶν',
      occurrence: 1,
      occurrences: 2,
      reference: { chapter: 1, verse: 12 },
    },
    {
      text: 'ἴδιος',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 12 },
    },
    {
      text: 'αὐτῶν',
      occurrence: 2,
      occurrences: 2,
      reference: { chapter: 1, verse: 12 },
    },
    {
      text: 'προφήτης',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 1, verse: 12 },
    },
  ],
};
