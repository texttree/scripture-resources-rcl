import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
} from '@material-ui/core';
import { senses as getSenses } from '../../core/lexiconHelpers';

function OriginalWordObject ({
  verseObject,
  verseObject: {
    content,
    text,
    strong,
    lemma,
    morph,
  }
}) {

  const _text = text || content;
  const _lemma = lemma ? <><br/><em>lemma:</em> {lemma}</> : '';
  const _strong = strong ? <><br/><em>strong:</em> {strong}</> : '';
  const _morph = morph ? <><br/><em>morph:</em> {morph}</> : '';
  const [ senses, setSenses ] = useState([]);
  useEffect(() => {
    if (strong) {
      getSenses({strong}).then((_senses) => {
        setSenses(_senses);
      });
    }
  }, [strong]);
  return (
    <Typography>
      <strong>{_text}</strong>
      {_lemma}
      {_strong}
      {_morph}
      {
        senses.map((sense, index) =>
          <Typography key={index}>
            <sup>{index + 1}</sup>
            {
              sense.gloss ?
              <span> <em>Gloss:</em> {sense.gloss}</span>
              : ''
            }
            {
              sense.definition ?
              <span> <em>Definition:</em> {sense.definition}</span>
              : ''
            }
          </Typography>
        )
      }
    </Typography>
  );
};

OriginalWordObject.propTypes = {
  verseObject: PropTypes.shape({
    tag: PropTypes.string,
    type: PropTypes.string,
    content: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.object),
    strong: PropTypes.string,
    lemma: PropTypes.string,
    morph: PropTypes.string,
    occurrence: PropTypes.string,
    occurrences: PropTypes.string,
  }).isRequired,
};

export default OriginalWordObject;
