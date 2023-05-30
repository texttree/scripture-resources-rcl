import { useCallback } from 'react';
import PropTypes from 'prop-types';

import deepFreeze from 'deep-freeze';

function useReferenceSelected({
  referenceSelected,
  onReferenceSelected,
}) {
  const update = useCallback(
    (_referenceSelected) => {
      const __referenceSelected = _referenceSelected && deepFreeze(_referenceSelected);
      onReferenceSelected(__referenceSelected);
    },
    [onReferenceSelected],
  );

  return {
    state: referenceSelected,
    actions:
    { update },
  };
}

useReferenceSelected.propTypes = {
  /** references: chapter and verse */
  referenceSelected: PropTypes.object,
  /** action taken after a resource is acquired */
  onReferenceSelected: PropTypes.func.isRequired,
};

export default useReferenceSelected;
