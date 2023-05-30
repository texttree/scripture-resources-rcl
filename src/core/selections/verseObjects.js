import tokenizer from 'string-punctuation-tokenizer';

/**
 * Borrowed and adapted from:
 * https://github.com/unfoldingWord/word-aligner/blob/develop/src/js/utils/verseObjects.js
 */

/**
 * @description flatten verse objects from nested format to flat array
 * @param {array} verseObjects - source array of nested verseObjects
 * @param {array} flat - output array that will be filled with flattened verseObjects
 */
export const flattenVerseObjects = (verseObjects, flat = []) => {
  let _verseObjects = [...verseObjects];

  while (_verseObjects.length > 0) {
    const object = _verseObjects.shift();

    if (object) {
      if (object.type === 'milestone') { // get children of milestone
        const _flat = flattenVerseObjects(object.children);
        _flat.forEach(_object => flat.push(_object));
      } else {
        flat.push(object);
      }
    }
  }
  return flat;
};

export const verseObjectsToString = (verseObjects) => {
  const flattenedVerseObjects = flattenVerseObjects(verseObjects);
  const string = flattenedVerseObjects.map(verseObject => verseObject.text).join(' ');
  return string;
};

/**
 * Below borrowed and adapted from:
 * https://github.com/unfoldingWord/word-aligner/blob/develop/src/js/utils/verseObjects.js
 */

/**
 * get text from word type verse object or word object
 * @param {WordObject} wordObject - an object containing information about the word
 * @return {string|undefined} text from word object
 */
export const getWordText = (wordObject) => {
  if (wordObject && (wordObject.type === 'word')) {
    return wordObject.text;
  }
  return wordObject ? wordObject.word : undefined;
};

/**
 * Gets the occurrence of a subString in words by counting up to subString index
 * @param {String|Array} words - word list or string to search
 * @param {Number} currentWordIndex - index of desired word in words
 * @param {String} subString - The sub string to search for
 * @return {Integer} - the occurrence of the word at currentWordIndex
 */
export const getOccurrence = (words, currentWordIndex, subString) => {
  if (typeof words === 'string') {
    return tokenizer.occurrenceInString(words, currentWordIndex, subString);
  }

  let occurrence = 0;

  if (Array.isArray(words)) {
    words.forEach((word, index) => {
      if (index <= currentWordIndex && getWordText(word) === subString) {
        occurrence++;
      }
    });
  }
  return occurrence;
};

/**
 * Function that count occurrences of a substring in words
 * @param {String|Array} words - word list or string to search
 * @param {String} subString - The sub string to search for
 * @return {Integer} - the count of the occurrences
 */
export const getOccurrences = (words, subString) => {
  if (typeof words === 'string') {
    return tokenizer.occurrencesInString(words, subString);
  }

  let occurrences = 0;

  if (Array.isArray(words)) {
    words.forEach(word => {
      if (getWordText(word) === subString) {
        occurrences++;
      }
    });
  }
  return occurrences;
};

/**
 * @description verseObjects with occurrences from verseObjects
 * @param {Array} verseObjects - Word list to add occurrence(s) to
 * @return {verseObjects: Array} - clone of verseObjects and word map
 */
export const occurrenceInjectVerseObjects = (verseObjects) => {
  let _verseObjects = [];

  if (verseObjects && verseObjects.length > 0) {
    const flattenedVerseObjects = flattenVerseObjects(verseObjects);

    _verseObjects = flattenedVerseObjects.map((verseObject, index) => {
      let _verseObject = { ...verseObject };

      if (verseObject.type === 'word') {
        const occurrence = getOccurrence(flattenedVerseObjects, index, verseObject.text);
        const occurrences = getOccurrences(flattenedVerseObjects, verseObject.text);

        _verseObject = {
          ...verseObject, occurrence, occurrences,
        };
      }
      return _verseObject;
    });
  }
  return _verseObjects;
};
