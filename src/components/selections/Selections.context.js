import React, { createContext } from 'react';
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
}) {
  let { state, actions } = useSelections({
    selections: selections,
    onSelections: onSelections,
    occurrence: occurrence,
    quote: quote,
    onQuote: onQuote,
    verseObjects: verseObjects,
  });

  return (
    <SelectionsContext.Provider value={{ state, actions }}>
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
  occurrence: PropTypes.number,
  /** action taken when quote is provided */
  onQuote: PropTypes.func,
  children: PropTypes.any,
};

export default SelectionsContextProvider;
