import React from 'react';
import PropTypes from 'prop-types';

import {
  MilestoneObject,
  TextObject,
  WordObject,
  AlignedWordsObject,
  SectionObject,
  FootnoteObject,
  UnsupportedObject,
} from '.';

function VerseObject({
  verseObject,
  originalWords = [],
  paragraphs,
  showUnsupported,
  disableWordPopover,
  getLexiconData,
  translate,
  reference,
}) {
  const { type, tag } = verseObject;
  let component;

  switch (type) {
    case 'text':
      component = (
        <TextObject verseObject={verseObject} paragraphs={paragraphs} />
      );
      break;
    case 'quote':
        if(verseObject.children){
          component = (
            <MilestoneObject
              verseObject={verseObject}
              originalWords={originalWords}
              disableWordPopover={disableWordPopover}
              getLexiconData={getLexiconData}
              translate={translate}
              reference={reference}
            />
          );
        }else{
          component = <TextObject verseObject={verseObject} />;
        }

      break;
    case 'milestone':
      component = (
        <MilestoneObject
          verseObject={verseObject}
          originalWords={originalWords}
          disableWordPopover={disableWordPopover}
          getLexiconData={getLexiconData}
          translate={translate}
          reference={reference}
        />
      );
      break;
    case 'word':
      if (verseObject.strong) {
        component = (
          <AlignedWordsObject
            children={[verseObject]}
            originalWords={[verseObject]}
            disableWordPopover={disableWordPopover}
            getLexiconData={getLexiconData}
            translate={translate}
            reference={reference}
          />
        );
      } else {
        component = (
          <WordObject
            verseObject={verseObject}
            disableWordPopover={disableWordPopover}
          />
        );
      }
      break;
    case 'section':
      component = <SectionObject verseObject={verseObject} />;
      break;
    case 'paragraph':
      component = <div />;
      break;
    case 'footnote':
      component = <FootnoteObject verseObject={verseObject} />;
      break;
    default:
      if (tag === 'it') {
        component = <i>{verseObject.text}</i>;
      } else if (tag === 'add') {
        component = <span style={{ color: 'DimGray' }}>{verseObject.text}</span>;
      } else {
        if (showUnsupported) {
          component = <UnsupportedObject verseObject={verseObject} />;
        }
      }
      break;
  }

  return (
    <>
      {component}
      {verseObject.nextChar}
    </>
  );
}

VerseObject.propTypes = {
  verseObject: PropTypes.shape({
    tag: PropTypes.string,
    type: PropTypes.string,
    content: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.object),
    strong: PropTypes.string,
    lemma: PropTypes.string,
    morph: PropTypes.string,
    occurrence: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    occurrences: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
  originalWords: PropTypes.array,
  /** render verses paragraphs, use explicit paragraphs */
  paragraphs: PropTypes.bool,
  /** render unsupported usfm markers */
  showUnsupported: PropTypes.bool,
  /** disable popovers for aligned and original language words */
  disableWordPopover: PropTypes.bool,
  /** optional function to lookup lexicon data */
  getLexiconData: PropTypes.func,
  /** reference for verse (bookId, chapter, verse) */
  reference: PropTypes.object,
  /** optional function for localization */
  translate: PropTypes.func,
};

export default VerseObject;
