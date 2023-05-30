import React, { useCallback } from 'react';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { Tooltip } from '@material-ui/core';

import PropTypes from 'prop-types';

export const License = ({
  rights,
  licenseLink,
  ...iconProps
}) => {
  const openLink = useCallback((link) => window.open(link, '_blank'), []);

  const onClickLicense = (e) => {
    e.stopPropagation(); openLink(licenseLink);
  };

  let _iconProps = {
    onClick: onClickLicense,
    ...iconProps,
  };

  let rightsIcon = <Tooltip title={rights} arrow><InfoOutlinedIcon {..._iconProps} /></Tooltip> ;

  return (
    <>{rightsIcon}</>
  );
};

License.propTypes = {
  /** @ignore */
  classes: PropTypes.object,
  /** rights string from manifest, such as "CC BY-SA 4.0" */
  rights: PropTypes.string.isRequired,
  /** number of iterations before timing out */
  licenseLink: PropTypes.string.isRequired,
  /** The overriding CSS for this component */
  style: PropTypes.object,
};

export default License;
