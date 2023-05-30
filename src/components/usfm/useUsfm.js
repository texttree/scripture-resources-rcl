import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import deepFreeze from 'deep-freeze';
import usfmJS from 'usfm-js';

export function useUsfm({ usfm }) {
  const [json, setJson] = useState();

  useEffect(() => {
    const _usfmJson = usfm && deepFreeze(usfmJS.toJSON(usfm));
    setJson(_usfmJson);
  }, [usfm]);

  return json;
};

useUsfm.propTypes = {
  /** The usfm string to parse */
  usfm: PropTypes.string.isRequired,
};

export default useUsfm;
