import React from 'react';
import PropTypes from 'prop-types';

import { useUsfm } from '..';

export const UsfmContext = React.createContext();

export function UsfmContextProvider({
  usfm,
  children,
}) {
  const json = useUsfm({ usfm });

  return (
    <UsfmContext.Provider value={json}>
      {children}
    </UsfmContext.Provider>
  );
};

UsfmContextProvider.propTypes = {
  /** The usfm string to parse */
  usfm: PropTypes.string.isRequired,
  children: PropTypes.any,
};
