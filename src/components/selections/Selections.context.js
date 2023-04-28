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
    verseObjects,
    children,
    reference
}) {

  let {state, actions} = useSelections({
      selections,
      onSelections,
      occurrence,
      quote,
      onQuote,
      verseObjects,
      reference
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
  /** the verses where quote may be found */
  verseObjects: PropTypes.array,
  /** if quote occurs mulitple times, this is the occurence of the one selected */
  occurrence: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** action taken when quote is provided */
  onQuote: PropTypes.func,
  /** reference */
  reference: PropTypes.object,
};

export default SelectionsContextProvider;
