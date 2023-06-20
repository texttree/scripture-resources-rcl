import {
  selectionsFromQuoteAndVerseObjects,
  normalizeString,
} from '../../core/selections/selections';

// const stringify = (array) => array.map(object => JSON.stringify(object));
//export const parsify = (array) => array.map(string => JSON.parse(string));

export const selectionsFromQuote = ({
  quote, verseObjects, occurrence,
}) => {
  let selections = [];

  if (quote && verseObjects && occurrence) {
    selections = selectionsFromQuoteAndVerseObjects({
      quote,
      verseObjects,
      occurrence,
    }).map((selection) => JSON.stringify(selection));
  }
  return selections;
};

export const quoteFromVerse = ({ selections, verseObjects }) => {
  let quotedWords = new Array(verseObjects.length);
  const _selections = selections.map((selection) => JSON.parse(selection).text);

  verseObjects.forEach((verseObject) => {
    const { type, text } = verseObject;

    if (type === 'word') {
      const match = _selections.includes(text);
      const quotedWord = match ? text : '…';
      quotedWords.push(quotedWord);
    }
  });

  const quote = quotedWords
    .join(' ')
    .replace(/( ?… ?)+/g, ' … ')
    .replace(/(^[… ]+|[… ]+$)/g, '');
  return quote;
};

// const wordsFromMilestone = ({milestone, quotedWords=[]}) => {
//   const _selections = selections.map(selection => selection.text);
//   if (_selections.include(milestone.content)) {
//     if (milestone.children[0].type === 'word') {
//       const words = milestone.children;
//       words.forEach(word => quotedWords.push(word.text));
//     }
//   }
// };

export const selectionFromWord = (word) => {
  const {
    content, text, occurrence, occurrences,
  } = word;
  const selectionObject = {
    text: content || text,
    occurrence: parseInt(occurrence),
    occurrences: parseInt(occurrences),
  };
  const selection = JSON.stringify(selectionObject);
  return selection;
};

export const isSelected = ({ word, selections }) => {
  const selection = selectionFromWord(word);
  const selected = selections.includes(selection);
  return selected;
};

export const areSelected = ({
  words,
  selections,
  reference = { chapter: 100, verse: 100 },
}) => {
  let selected = false;

  const _selections = words.map((word) => selectionFromWord(word));

  _selections.forEach((selection) => {
    const _selection = JSON.parse(selection);
    let _text = normalizeString(_selection.text);
    let _occ = _selection.occurrence;
    let _occs = _selection.occurrences;
    let { chapter: _ch = 100, verse: _v = 100 } = reference;

    for (let i = 0; i < selections.length; i++) {
      const text = selections[i].text; //already normalized.
      const occ = selections[i].occurrence;
      const occs = selections[i].occurrences;
      const { chapter: ch = 100, verse: v = 100 } = selections[i]?.reference ?? {chapter: 100, verse: 100};

      if (
        text === _text &&
        occ === _occ &&
        occs === _occs &&
        parseInt(ch) === parseInt(_ch) &&
        parseInt(v) === parseInt(_v)
      ) {
        selected = true;
        break;
      }
    }
  });
  return selected;
};

export const addSelection = ({ word, selections }) => {
  let _selections = new Set(selections);
  const selection = selectionFromWord(word);
  _selections.add(selection);
  return [..._selections];
};

export const addSelections = ({ words, selections }) => {
  let _selections = new Set(selections);

  words.forEach((word) => {
    const selection = selectionFromWord(word);
    _selections.add(selection);
  });
  return [..._selections];
};

export const removeSelection = ({ word, selections }) => {
  const selection = selectionFromWord(word);
  const selectionStringified = selections.map((_selection) =>
    selectionFromWord(_selection),
  );
  const _selections = new Set(selectionStringified);
  _selections.delete(selection);
  return [..._selections];
};

export const removeSelections = ({ words, selections }) => {
  const selectionStringified = selections.map((selection) =>
    selectionFromWord(selection),
  );
  const _selections = new Set(selectionStringified);

  words.forEach((word) => {
    const selection = selectionFromWord(word);
    _selections.delete(selection);
  });
  return [..._selections];
};

export default {
  selectionFromWord,
  isSelected,
  areSelected,
  addSelection,
  addSelections,
  removeSelection,
  removeSelections,
};
