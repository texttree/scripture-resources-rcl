import React from 'react';
import PropTypes from 'prop-types';

import { normalizeString } from '../../../../core/selections/selections';

import { ResourcesContextProvider } from '../../../resources/Resources.context';
import ParallelScripture from '../../../parallel-scripture/ParallelScripture';

export const charactersExample1 = [
  'טֵּ֕',
  'טֵּ֕',
  'טֵּ֕',
  'טֵּ֕',
  'טֵּ֕',
  'טֵּ֕',
];

// ALL application default resourceLinks:
const hebrewResourceLink = 'unfoldingWord/hbo/uhb/master';
const greekResourceLink = 'unfoldingWord/el-x-koine/ugnt/master';
const enUltResourceLink = 'unfoldingWord/en/ult/master';
const enUstResourceLink = 'unfoldingWord/en/ust/master';

const generateResourceLinks = ({ bookId, testament }) => {
  let originalLink =
    testament === 'old' ? hebrewResourceLink : greekResourceLink;

  // need to add reference bookId to resource links
  const allResourceLinks = [originalLink, enUltResourceLink, enUstResourceLink];

  // Add bookId to all resource paths:
  const allResourceLinksWithBookId = allResourceLinks.map((link) => link + '/' + bookId);

  return allResourceLinksWithBookId;
};

export function ParallelScriptureMock({
  bookId,
  testament,
  chapter,
  verse,
  selections,
}) {
  const _defaultResourceLinks = generateResourceLinks({ bookId, testament });

  const [resourceLinks, setResourceLinks] = React.useState(
    _defaultResourceLinks,
  );
  const [resources, setResources] = React.useState([]);

  const reference = {
    bookId, chapter, verse,
  };

  const config = { server: 'https://git.door43.org' };

  return (
    <>
      <table style={{ borderSpacing: '0px', borderCollapse: 'separate' }}>
        <tr>
          <th>String</th>
          <th style={{ borderRight: '1px solid black' }}>===</th>
          <th colSpan="2" style={{ borderRight: '1px solid black' }}>
            string.normalize('NFKC')
          </th>
          <th colSpan="2" style={{ borderRight: '1px solid black' }}>
            string-punctuation-tokenizer
          </th>
        </tr>
        {selections.map((currentSelection, index) => (
          <tr key={index}>
            <td>{currentSelection}</td>
            <td style={{ borderRight: '1px solid black' }}>
              {selections[0] === currentSelection ? 'Match' : 'No match'}
            </td>
            <td>{currentSelection.normalize('NFKC')}</td>
            <td style={{ borderRight: '1px solid black' }}>
              {selections[0].normalize('NFKC') ===
              currentSelection.normalize('NFKC')
                ? 'Match'
                : 'No match'}
            </td>
            <td>{normalizeString(currentSelection)}</td>
            <td style={{ borderRight: '1px solid black' }}>
              {normalizeString(selections[0]) ===
              normalizeString(currentSelection)
                ? 'Match'
                : 'No match! ☹️'}
            </td>
          </tr>
        ))}
      </table>

      <br />

      <ResourcesContextProvider
        resourceLinks={resourceLinks}
        defaultResourceLinks={[...resourceLinks]}
        onResourceLinks={setResourceLinks}
        resources={resources}
        onResources={setResources}
        config={config}
      >
        {selections.map((currentSelection, index) => (
          <ParallelScripture
            reference={reference}
            quote={currentSelection}
            occurrence={1}
            height="250px"
            key={index}
          />
        ))}
      </ResourcesContextProvider>
    </>
  );
}

ParallelScriptureMock.propTypes = {
  bookId: PropTypes.any,
  testament: PropTypes.any,
  chapter: PropTypes.any,
  verse: PropTypes.any,
  selections: PropTypes.any,
};
