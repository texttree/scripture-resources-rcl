import React, {useCallback, useContext, useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import {Skeleton} from '@material-ui/lab';
import {Waypoint} from 'react-waypoint';

import {VerseObjects} from '../verse-objects';
import { useHandleCopy } from './helpers';
import { ReferenceSelectedContext } from '../reference/ReferenceSelectedContext';

import {isHebrew} from '../../core';

export const Verse = ({
  verseKey,
  verseObjects,
  paragraphs,
  showUnsupported,
  disableWordPopover,
  direction,
  renderOffscreen,
  reference,
  getLexiconData,
  translate,
}) => {
  const referenceSelectedContext = useContext(ReferenceSelectedContext);
  const update = referenceSelectedContext?.actions?.update;

  const verseRef = useRef(null);
  useHandleCopy(verseRef.current)

  const classes = useStyles();

  const onVisibility = (isVisible) => {
    if (isVisible) setViewed(true);
  };
  const width = `${((Math.random() +1)/2 * 100).toFixed(0)}%`;
  const skeleton = (
    <>
      <Waypoint onEnter={onVisibility} />
      <Skeleton height={6} width={width} />
    </>
  );
  const [verse, setVerse] = useState(skeleton);
  const [viewed, setViewed] = useState(!renderOffscreen);

  useEffect(() => {
    if (viewed) {
      let verseNumber;
      if (!['front','back'].includes(verseKey)) {
        verseNumber = <sup>{verseKey} </sup>;
      }

      const _verse = (
        <>
          {verseNumber}
          <VerseObjects
            verseObjects={verseObjects}
            paragraphs={paragraphs}
            showUnsupported={showUnsupported}
            disableWordPopover={disableWordPopover}
            getLexiconData={getLexiconData}
            translate={translate}
            reference={reference}
          />
        </>
      );
      setVerse(_verse);
    }
  }, [verseKey, verseObjects, paragraphs, showUnsupported, disableWordPopover, viewed]);

  const handleClick = useCallback(reference => {
    const _reference = {...reference, verse: parseInt(verseKey) };
    if (update) update(_reference);
    /** WARN: ReferenceSelectedContext is not part of useCallback dependencies! */
  }, [update]);

  const verseText = verseObjects.map(verseObject => verseObject.text).join('');
  const hebrew = isHebrew(verseText);
  let _dir = direction || 'auto';
  if (hebrew) {
    _dir = 'rtl';
  }

  const style = _dir === 'rtl'
    ? { fontSize: `1.7em`, fontFamily: `EzraSILSRRegular` }
    : { fontSize: `1.2em`,}

  //const style = {};
  if (paragraphs) style.display = 'inline';

  return (
    <div ref={verseRef} className={classes.verse} style={style} dir={_dir} onClick={() => handleClick(reference)}>
      {verse}
    </div>
  );
};

Verse.propTypes = {
  verseKey: PropTypes.string.isRequired,
  verseObjects: PropTypes.array.isRequired,
  /** render verses paragraphs, use explicit paragraphs */
  paragraphs: PropTypes.bool,
  /** bypass rendering only when visible */
  renderOffscreen: PropTypes.bool,
  /** render unsupported usfm markers */
  showUnsupported: PropTypes.bool,
  /** disable popovers for aligned and original language words */
  disableWordPopover: PropTypes.bool,
  /** override text direction detection */
  direction: PropTypes.string,
  /** reference for verse (bookId, chapter, verse) */
  reference: PropTypes.object,
  /** optional function to lookup lexicon data */
  getLexiconData: PropTypes.func,
  /** optional function for localization */
  translate: PropTypes.func,
};

const useStyles = makeStyles(theme => ({
  verse: {
  },
}));

export default Verse;
