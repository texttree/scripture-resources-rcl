import React, { useCallback, useMemo, useEffect } from "react";
import PropTypes from 'prop-types';
import deepFreeze from 'deep-freeze';

import helpers, {parsify, selectionsFromQuote, quoteFromVerse} from './helpers';

function useSelections({
  selections,
  onSelections,
  occurrence,
  quote,
  onQuote,
  verseObjects,
}) {

  // - this level of indirection is needed because objects and arrays
  // cannot be reliable compared for equality. In this case,
  // making the verse object array a string will solve the problem
  // - doing this means it has to be undone inside useEffect(). Here, 
  // parse the string back out into an array and map it to the argument.
  //const verseObjectsMemo = JSON.stringify(verseObjects);
  const verseObjectsMemo = useMemo(() => {verseObjects}, [verseObjects]);
  useEffect(() => {
    //const _verseObjects = JSON.parse(verseObjectsMemo);
    
    const _selections = selectionsFromQuote({
      quote,
      verseObjects: verseObjectsMemo,
      occurrence,
    });

    update(_selections);
  }, [quote, occurrence, verseObjectsMemo]);

  useEffect(() => {
    if (verseObjects && onQuote) {
      const _quote = quoteFromVerse({selections, verseObjects});
      onQuote(_quote);
    }
  }, [selections, onQuote, verseObjects]);

  const update = useCallback((_selections) => {
    const __selections = _selections && deepFreeze(parsify(_selections));
    onSelections(__selections);
  }, [onSelections]);

  const isSelected = (word) => helpers.isSelected({word, selections});

  const areSelected = (words) => helpers.areSelected({words, selections});

  const addSelection = (word) => {
    let _selections = helpers.addSelection({word, selections});
    update(_selections);
  };

  const addSelections = (words) => {
    let _selections = helpers.addSelections({words, selections});
    update(_selections);
  };

  const removeSelection = (word) => {
    const _selections = helpers.removeSelection({word, selections});
    update(_selections);
  };

  const removeSelections = (words) => {
    let _selections = helpers.removeSelections({words, selections});
    update(_selections);
  };

  return {
    state: selections,
    actions: {
      update,
      isSelected,
      areSelected,
      addSelection,
      addSelections,
      removeSelection,
      removeSelections,
    },
  };
};

useSelections.propTypes = {
  /** words in a selection */
  selections: PropTypes.array,
  /** action taken after a selection is made */
  onSelections: PropTypes.func.isRequired,
  /** the quote to be selected */
  quote: PropTypes.string.isRequired,
  /** the verses where quote may be found */
  verseObjects: PropTypes.array,
  /** if quote occurs mulitple times, this is the occurence of the one selected */
  occurrence: PropTypes.number,
  /** action taken when quote is provided */
  onQuote: PropTypes.func,
};

export default useSelections;
