import React, { useState } from 'react';
import useEffect from 'use-deep-compare-effect';

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';
import {
  TableCell,
  TableRow,
} from '@material-ui/core';
import { Waypoint } from 'react-waypoint';

import { Verse } from '..';

function Row({
  columns,
  referenceId,
  verses,
  renderOffscreen,
  getLexiconData,
  translate,
}) {

  const classes = useStyles();

  const onVisibility = (isVisible) => {
    if (isVisible) {
      console.log('waypoint hit')
      setViewed(true);
    }
  };

  const skeleton = (
    <TableCell colSpan={columns.length} className={classes.cell}>
      <Waypoint onEnter={onVisibility}>
        <Skeleton height={110} width='100%' />
      </Waypoint>
    </TableCell>
  );

  const [cells, setCells] = useState(skeleton);
  const [viewed, setViewed] = useState(!renderOffscreen);

  useEffect(() => {
    if (viewed) {
      const _cells = columns.filter(col => !col.hidden).map(column => {
        const _verse = verses[column.id];
        const verse = _verse ? _verse.verseData : undefined;
        const verseTitle = _verse ? _verse.verseTitle : "";
        const verseObjects = verse ? verse.verseObjects : [];

        // WARNING: This Bible version does not include text for this reference.

        return (
          <TableCell key={column.id} className={classes.cell} dir='auto'>
            {verse ? (<Verse
                verseObjects={verseObjects}
                verseKey={verseTitle}
                direction='auto'
                renderOffscreen
                disableWordPopover
                getLexiconData={getLexiconData}
                translate={translate}
                reference={{
                  chapter: referenceId.split(':')[0],
                  verse: referenceId.split(':')[1],
                }}
              />
            ) : (
              <span>&nbsp;</span>
            )}
          </TableCell>
        );
      });
      setCells(_cells);
    }
  }, [classes, columns, verses, referenceId, viewed]);

  return (
    <TableRow
      className={classes.row}
      key={referenceId}
      id={referenceId}
      data-test={'verse-' + referenceId.replace(':', '-')}
      tabIndex={-1}
      role="checkbox"
      hover
    >
      {cells}
    </TableRow>

  );
}

Row.propTypes = {
  /** bypass rendering only when visible */
  renderOffscreen: PropTypes.bool,
  /** optional function to lookup lexicon data */
  getLexiconData: PropTypes.func,
  /** optional function for localization */
  translate: PropTypes.func,
};

const useStyles = makeStyles(theme => ({
  row: {
  },
  cell: {
    padding: theme.spacing(1),
    paddingRight: 0,
    verticalAlign: 'top',
    minWidth: '15rem',
    border: 'none',
    textAlign: 'auto',
  },
}));

export default Row
