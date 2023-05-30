import React from 'react';
import PropTypes from 'prop-types';

export const WordObject = ({ verseObject }) => (
  <>
    {verseObject.text || verseObject.content}
  </>
);

WordObject.propTypes = {
  verseObject: PropTypes.shape({
    tag: PropTypes.string,
    type: PropTypes.string,
    content: PropTypes.string,
  }).isRequired,
};

export default WordObject;
