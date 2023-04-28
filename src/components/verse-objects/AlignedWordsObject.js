import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Popover } from '@material-ui/core';

// TRICKY - importing from direct path gets around exported css styles which crashes nextjs
import { lookupStrongsNumbers } from 'tc-ui-toolkit/lib/ScripturePane/helpers/lexiconHelpers';
import { default as WordLexiconDetails } from 'tc-ui-toolkit/lib/WordLexiconDetails/index';

import { SelectionsContext } from '../selections/Selections.context';
import { WordObject, OriginalWordObject } from '.';

function AlignedWordsObject({
  children,
  originalWords,
  disableWordPopover,
  getLexiconData,
  translate,
  reference,
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  let selected;
  const _selectionsContext = useContext(SelectionsContext);

  if (_selectionsContext) {
    const {
      actions: { areSelected },
    } = _selectionsContext;
    selected = areSelected(originalWords, reference);
  }

  const words = children.map((verseObject, index) => (
    <span
      data-test="aligned-word-object"
      data-testselected={selected}
      key={index}
      className={selected ? classes.selected : undefined}
    >
      <WordObject
        verseObject={verseObject}
        disableWordPopover={disableWordPopover}
        getLexiconData={getLexiconData}
      />
    </span>
  ));

  let component = words;

  function getOriginalWordObject(index, wordObject) {
    let message = null;
    const strong = wordObject?.strong || wordObject?.strongs;

    if (getLexiconData) {
      if (strong) {
        const lexiconData = lookupStrongsNumbers(strong, getLexiconData);

        if (lexiconData) {
          const isHebrew = lexiconData['uhl'];
          return (
            <WordLexiconDetails
              key={index}
              lexiconData={lexiconData}
              wordObject={wordObject}
              translate={translate || translate_}
              isHebrew={!!isHebrew}
            />
          );
        }
      }
      message = `Lexicon Data not found !`;
    }

    // show basic word data if getLexiconData not defined
    return <OriginalWordObject key={index} verseObject={wordObject} message={message}/>;
  }

  if (!disableWordPopover) {
    const open = Boolean(anchorEl);
    const id = open ? 'popover' : undefined;
    const _originalWords = originalWords.map((verseObject, index) => getOriginalWordObject(index, verseObject));

    component = (
      <>
        <span
          aria-describedby={id}
          aria-haspopup="true"
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
          className={open ? classes.open : classes.closed}
        >
          {words}
        </span>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          className={classes.popover}
          classes={{ paper: classes.paper }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          disableRestoreFocus
        >
          <>{_originalWords}</>
        </Popover>
      </>
    );
  }

  return <>{component}</>;
}

AlignedWordsObject.propTypes = {
  children: PropTypes.arrayOf(PropTypes.object).isRequired,
  originalWords: PropTypes.arrayOf(PropTypes.object),
  /** disable popovers for aligned and original language words */
  disableWordPopover: PropTypes.bool,
  /** optional function to lookup lexicon data */
  getLexiconData: PropTypes.func,
  /** optional function for localization */
  translate: PropTypes.func,
  /** reference for verse (bookId, chapter, verse) */
  reference: PropTypes.object,
};

const useStyles = makeStyles((theme) => ({
  open: { backgroundColor: 'lightgoldenrodyellow' },
  closed: {},
  popover: { pointerEvents: 'none' },
  paper: { padding: theme.spacing(1) },
  selected: { backgroundColor: 'yellow' },
}));

// fallback translate function
function translate_(key) {
  return key;
}

export default AlignedWordsObject;
