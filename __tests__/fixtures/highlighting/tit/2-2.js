module.exports = {
  book: 'tit',
  chapter: 2,
  verse: 2,
  quote: 'ὑγιαίνοντας τῇ πίστει, τῇ ἀγάπῃ, τῇ ὑπομονῇ',
  occurrence: 1,
  expected: [
    {
      text: 'ὑγιαίνοντας',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 2, verse: 2 },
    },
    {
      text: 'τῇ',
      occurrence: 1,
      occurrences: 3,
      reference: { chapter: 2, verse: 2 },
    },
    {
      text: 'πίστει',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 2, verse: 2 },
    },
    {
      text: 'τῇ',
      occurrence: 2,
      occurrences: 3,
      reference: { chapter: 2, verse: 2 },
    },
    {
      text: 'ἀγάπῃ',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 2, verse: 2 },
    },
    {
      text: 'τῇ',
      occurrence: 3,
      occurrences: 3,
      reference: { chapter: 2, verse: 2 },
    },
    {
      text: 'ὑπομονῇ',
      occurrence: 1,
      occurrences: 1,
      reference: { chapter: 2, verse: 2 },
    },
  ],
};
