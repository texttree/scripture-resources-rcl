import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import { VerseObjects } from '..';

export const BookHeaders = ({
  headers,
  showUnsupported,
  direction,
}) => {
  const classes = useStyles();

  const bookHeaders = <VerseObjects verseObjects={headers} showUnsupported={showUnsupported} />;
  const bookName = headers.filter(header => header.tag === 'h')[0].content;

  return (
    <div className={classes.bookHeaders} dir={direction || 'auto'}>
      <Typography variant='h2' className={classes.bookName}>{bookName}</Typography>
      {bookHeaders}
    </div>
  );
};

BookHeaders.propTypes = {
  headers: PropTypes.array.isRequired,
  /** render unsupported usfm markers */
  showUnsupported: PropTypes.bool,
  /** override text direction detection */
  direction: PropTypes.string,
};

const useStyles = makeStyles(() => ({
  bookHeaders: {},
  bookName: {},
}));

export default BookHeaders;
