import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';

import { Verse } from '.';
import {isHebrew} from '../../core';

export const Verses = ({
  verses,
  paragraphs,
  showUnsupported,
  direction,
  disableWordPopover,
  reference,
  renderOffscreen
}) => {
  const classes = useStyles();
  let [_verses, setVerses] = useState();
  let [_front, setFront] = useState();
  let [_back, setBack] = useState();
  let [dir, setDir] = useState(direction);

  useEffect(() => {
    if (!direction) {
      const verseText = verses['1'].verseObjects.map(verseObject => verseObject.text).join('');
      const hebrew = isHebrew(verseText);
      if (hebrew) setDir('rtl');
      else setDir('auto');
    }
  }, [verses, direction]);

  useEffect(() => {
    let __verses = [];
    Object.keys(verses).forEach((verseKey, index) => {
      const {verseObjects} = verses[verseKey];
      const verse = (
        <Verse
          key={index}
          verseKey={verseKey}
          verseObjects={verseObjects}
          paragraphs={paragraphs}
          showUnsupported={showUnsupported}
          disableWordPopover={disableWordPopover}
          reference={ {...reference, verse: verseKey} }
          renderOffscreen={renderOffscreen}
        />
      );
      if (verseKey === 'front') setFront(verse);
      else if (verseKey === 'back') setBack(verse);
      else __verses.push(verse);
    });

    setVerses(__verses);
  }, [verses, paragraphs, showUnsupported, disableWordPopover]);

  return (
    <div className={classes.verses} dir={dir}>
      {_front}
      {_verses}
      {_back}
    </div>
  );
};

Verses.propTypes = {
  verses: PropTypes.object.isRequired,
  /** render verses paragraphs, use explicit paragraphs */
  paragraphs: PropTypes.bool,
  /** bypass rendering only when visible */
  renderOffscreen: PropTypes.bool,
  /** render unsupported usfm markers */ 
  showUnsupported: PropTypes.bool,
  /** override text direction detection */
  direction: PropTypes.string,
  /** disable popovers for aligned and original language words */
  disableWordPopover: PropTypes.bool,
};

const useStyles = makeStyles(theme => ({
  verses: {
  },
}));

export default Verses;
