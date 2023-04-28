import xre from 'xregexp';
import _ from 'lodash';
import { tokenize } from 'string-punctuation-tokenizer';
import { verseObjectsToString } from './verseObjects';
import { referenceIdsFromBcvQuery } from '../../components/parallel-scripture/helpers';

/**
 * This function takes a search string and create a regex search string to match a whole word
 * @param {string} string - string to search for
 * @returns {RegExp} regex expression
 */
export const getRegexForWord = (string) => {
  const START_WORD_REGEX = '(?<=[\\s,.:;“"\'‘({]|^)';
  const END_WORD_REGEX = '(?=[\\s,.:;“"\'‘!?)}]|$)';
  const search = `${START_WORD_REGEX}${string}${END_WORD_REGEX}`;
  const regex = xre(search, 'u');
  return regex;
};

/**
 * The function will find the quote in the verse object
 * @param {string} quote - The orignal quote to find
 * @param {object} verseObjects - verse ojects to search
 * @param {number} occurrence - The occurence to match
 * @returns {[]} - The quotes we found
 */
export const selectionsFromQuoteAndVerseObjects = ({
  quote,
  verseObjects,
  occurrence,
  reference = { chapter: 100, verse: 100 },
}) => {
  let selections = [];
  if (quote && verseObjects.length > 0) {
    if (reference?.bcvQuery) {
      const referenceArr = referenceIdsFromBcvQuery(reference.bcvQuery);
      const _verseObjects = verseObjects.reduce(
        (prev, curr) => [...prev, ...curr],
        []
      );
      const string = verseObjectsToString(_verseObjects);
      selections = selectionsFromQuoteAndString({ quote, string, occurrence });
      const newSelections = [];
      for (let id = 0; id < selections.length; id++) {
        const sel = { ...selections[id] };
        for (let index = 0; index < verseObjects.length; index++) {
          const tmpSelections = selectionsFromQuoteAndVerseObjects({
            quote: sel.text,
            verseObjects: verseObjects[index],
            occurrence: -1,
            reference: { chapter: 1, verse: 1 },
          });
          if (tmpSelections.length === 0) {
            continue;
          }
          if (sel.occurrence > tmpSelections[0].occurrences) {
            sel.occurrence -= tmpSelections[0].occurrences;
          } else {
            newSelections.push({
              text: sel.text,
              occurrence: sel.occurrence,
              reference: {
                chapter: parseInt(referenceArr[index].split(':')[0]),
                verse: parseInt(referenceArr[index].split(':')[1]),
              },
              occurrences: tmpSelections[0].occurrences,
            });
            break;
          }
        }
      }
      selections = [...newSelections];
    } else {
      const string = verseObjectsToString(verseObjects);
      selections = selectionsFromQuoteAndString({
        quote,
        string,
        occurrence,
      }).map((el) => ({
        ...el,
        reference: {
          chapter: parseInt(reference.chapter),
          verse: parseInt(reference.verse),
        },
      }));
    }
  }
  return selections;
};

/**
 * This counts the number of subquotes in the string
 * @param {string} string - string we are searching in
 * @param {string} subquote - string we are searching for
 * @returns {number} number
 */
export const getPrecedingOccurrences = (string, subquote) => {
  if (!string || !subquote) {
    return 0;
  }
  const regex = getRegexForWord(subquote);
  const matches = xre.match(string, regex, 'all');
  const count = (matches && matches.length) || 0;
  return count;
};

/**
 * The function will find the quote inside the string
 * @param {string} quote - The orignal quote to find
 * @param {string} string - orignal text to search
 * @param {number} occurrence - The occurence to match
 * @returns {[]} - The quotes we found
 */
export const selectionsFromQuoteAndString = ({
  quote,
  string: rawString,
  occurrence,
}) => {
  let string = normalizeString(rawString);
  // Calculate hasAmpersand before normalizing quote.
  let _subquotes = quote.replace(/( ?… ?)+/g, ' & '); //replace elipse with '&'
  let subquotes = _subquotes.split('&').map(normalizeString);
  let selections = [];
  const hasAmpersand = subquotes.length > 1;
  quote = normalizeString(quote);

  if (hasAmpersand && occurrence === -1) {
    return [];
  }

  if (occurrence === -1 && subquotes.length === 1) {
    const occurrences = occurrencesInString(string, quote); // TODO getPrecedingOccurrences(string, quote)
    subquotes = new Array(occurrences).fill(quote);
  }

  let precedingOccurrences = 0;
  let precedingText = '';
  subquotes.forEach((subquote, index) => {
    precedingOccurrences = getPrecedingOccurrences(precedingText, subquote);
    const currentOccurrence = getCurrentOccurrenceFromPrecedingText(
      occurrence,
      index,
      precedingOccurrences
    );
    precedingText = getPrecedingText(
      string,
      subquote,
      currentOccurrence,
      precedingOccurrences
    );

    const subSelections = subSelectionsFromSubquote({
      subquote,
      precedingText,
      string,
    });

    subSelections.forEach((subSelection) => selections.push(subSelection));
    /** Adding the previous subquote to account for repeated ampersand words i.e. Θεοῦ&Θεοῦ */
    precedingText += subquote;
  });
  return selections;
};

/**
 * This function gets the correct amount of occurrences to provide the function getPrecedingText
 *
 * @param {number} occurrence - The occurrence of the subquote in the string
 * @param {number} index - The current index of the subquotes
 * @param {number} precedingOccurrences - The number of occurrences before the current subquote in the string
 */
export const getCurrentOccurrenceFromPrecedingText = (
  occurrence,
  index,
  precedingOccurrences
) => {
  if (occurrence === -1 || index === 0) {
    return occurrence;
  } else {
    return precedingOccurrences + 1;
  }
};

/**
 *
 * @param {string} string - The entire string to use to find the preceding text
 * @param {string} subquote - The subquote to find the preceding text of
 * @param {number} occurrence - The occurrence of the string in the entire string
 * @param {number} index - The index of the subquote
 */
export const getPrecedingText = (string, subquote, occurrence, index = 0) => {
  const regex = getRegexForWord(subquote);
  let splitString = xre.split(string, regex);
  if (occurrence === -1) {
    //Need every occurrence of the subquote
    //Using the index instead of the occurrence
    return splitString.slice(0, index + 1).join(subquote);
  } else {
    //Return the subquote at the specified occurrence
    //of the entire string
    return splitString.slice(0, occurrence).join(subquote);
  }
};

export const subSelectionsFromSubquote = ({
  subquote,
  precedingText: _precedingText,
  string,
}) => {
  //Splitting by tokenization here causes issues because we are still
  //comparing those characters at this level
  const selectedTokens = subquote.split(' ');
  const subSelections = [];
  selectedTokens.forEach((_selectedText) => {
    //Adding the preceding text from the subSelections to ensure that
    //Repeated words are accounted for
    const precedingTextInSubselections = subSelections
      .map(({ text }) => text)
      .join(' ');
    let subSelection = generateSelection({
      selectedText: _selectedText,
      precedingText: _precedingText + precedingTextInSubselections,
      entireText: string,
    });

    subSelections.push(subSelection);
  });
  return subSelections;
};

/**
 * Most everything below this is borrowed and adapted from
 * https://github.com/unfoldingWord/selections/blob/master/src/js/selections.js
 * and
 * https://github.com/unfoldingWord/tc-strings/blob/master/src/js/strings.js
 */

/**
 * @description - generates a selection object from the selected text, precedingText and whole text
 * @param {String} selectedText - the text that is selected
 * @param {String} precedingText - the text that prescedes the selection
 * @param {String} entireText - the text that the selection should be in
 * @return {Object} - the selection object to be used
 */
export const generateSelection = ({
  selectedText,
  precedingText,
  entireText,
}) => {
  // replace more than one contiguous space with a single one since HTML/selection only renders 1
  const _entireText = normalizeString(entireText);
  // Getting the occurrences before the current token
  const precedingTokens = tokenizer(precedingText);
  let precedingOccurrencesInPreviousString = precedingTokens.reduce(function (
    n,
    val
  ) {
    return n + (val === selectedText);
  },
  0);
  // calculate this occurrence number by adding it to the preceding ones
  let occurrence = precedingOccurrencesInPreviousString + 1;
  // get the total occurrences from the verse
  const allTokens = tokenizer(_entireText);
  let allOccurrences = allTokens.reduce(function (n, val) {
    return n + (val === selectedText);
  }, 0);

  return {
    text: selectedText,
    occurrence: occurrence,
    occurrences: allOccurrences,
  };
};

/**
 *
 * @param {string} string - Entire string to search within 'Blessed be the name of the Lord'
 * @param {string} subString - substring to search for inside of entire string i.e. 'bless, blessed, blessing'
 * @return {number}
 */
export const getQuoteOccurrencesInVerse = (string, subString) => {
  let n = 0;
  if (subString.length <= 0) return 0;
  if (subString.split(',').length > 1) {
    let stringArray = subString.split(',');
    stringArray.forEach((element) => {
      n += getQuoteOccurrencesInVerse(string, element.trim());
    });
    return n;
  }
  if (subString.includes('...')) subString = subString.replace('...', '.*');
  const regex = new RegExp(`\\W+${subString}\\W+`, 'g');
  let matchedSubstring;
  while ((matchedSubstring = regex.exec(string)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matchedSubstring
    if (matchedSubstring.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    n++;
  }
  return n;
};

/**
 * @description Function that count occurrences of a substring in a string
 * @param {String} string - The string to search in
 * @param {String} subString - The sub string to search for
 * @return {Integer} - the count of the occurrences
 * @see http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240
 * modified to fit our use cases, return zero for '' substring, and no use case for overlapping.
 */
export const occurrencesInString = (string, subString) => {
  return getPrecedingOccurrences(string, subString);
};

const tokenizer = (text) => {
  return tokenize({
    text: text,
    greedy: true,
    normalize: true,
  });
};

export const normalizeString = (string) => {
  const normalized = tokenizer(string).join(' ');
  return normalized;
};
