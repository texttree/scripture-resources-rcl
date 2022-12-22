import React, { createContext } from 'react'
import PropTypes from 'prop-types';

import { useSelections } from '..';

export const SelectionsContext = createContext();

export function SelectionsContextProvider({
    selections,
    onSelections,
    occurrence,
    quote,
    onQuote,
    hasSingleVerse,
    verseObjectsArray,
    children,
}) {
  
  let {state, actions} = useSelections({
      selections: selections,
      onSelections: onSelections,
      occurrence: occurrence,
      quote: quote,
      onQuote: onQuote,
      hasSingleVerse: hasSingleVerse,
      verseObjectsArray: verseObjectsArray,
  });

  return (
    <SelectionsContext.Provider value={{state, actions}}>
      {children}
    </SelectionsContext.Provider>
  );
};

SelectionsContextProvider.propTypes = {
  /** words in a selection */
  selections: PropTypes.array,
  /** action taken after a selection is made */
  onSelections: PropTypes.func.isRequired,
  /** the quote to be selected */
  quote: PropTypes.string.isRequired,
  /** indicate single verse in verseObjectsArray (or else multiple verses) **/
  hasSingleVerse: PropTypes.bool,
  /** all verses where quote may be found */
  verseObjectsArray: PropTypes.array,
  /** if quote occurs mulitple times, this is the occurence of the one selected */
  occurrence: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** action taken when quote is provided */
  onQuote: PropTypes.func,
};

export default SelectionsContextProvider;
