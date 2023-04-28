import { ScriptureTable } from "../src";
import usfmJS from 'usfm-js';
import { selectionsFromQuote } from '../src/components/selections/helpers';
import ugnt_tit from './fixtures/books/ugnt_tit.js';
import ugnt_3jn from './fixtures/books/ugnt_3jn.js';
import { mount } from 'enzyme';
import React from 'react';
import path from 'path';

const UGNT_BOOKS = {
  'tit': ugnt_tit,
  '3jn': ugnt_3jn
}

// To do: The <ScriptureTable/> syntax probably needs to be updated to work with the latest version
describe.skip('Checking highlights from rendered component in Titus', () => {
  it('should have all words highlighted Titus 1:1', () => {
    generateTest('tit/1-1');
  })
  it('should have all words highlighted Titus 1:1 (2)', () => {
    generateTest('tit/1-1-2');
  })
  it('should have all words highlighted Titus 1:2', () => {
    generateTest('tit/1-2');
  })
  it('should have all words highlighted Titus 1:3', () => {
    generateTest('tit/1-3');
  })
  it('should have all words highlighted Titus 1:4', () => {
    generateTest('tit/1-4');
  })
  it('should have all words highlighted Titus 1:5', () => {
    generateTest('tit/1-5');
  })
  it('should have all words highlighted Titus 1:9', () => {
    generateTest('tit/1-9');
  })
  it('should have all words highlighted Titus 1:12', () => {
    generateTest('tit/1-12');
  })
  it('should have all words highlighted Titus 2:2', () => {
    generateTest('tit/2-2');
  })
  it('should have all words highlighted Titus 2:10', () => {
    generateTest('tit/2-10');
  })
  it('should have all words highlighted Titus 2:13', () => {
    generateTest('tit/2-13');
  })
  it('should have all words highlighted Titus 3:4', () => {
    generateTest('tit/3-4');
  })
  it('should have all words highlighted Titus 3:4 (2)', () => {
    generateTest('tit/3-4-2');
  })
  it('should have all words highlighted Titus 3:6', () => {
    generateTest('tit/3-6');
  })
  it('should have all words highlighted Titus 3:6 (2)', () => {
    generateTest('tit/3-6-2');
  })
  it('should have all words highlighted Titus 3:7', () => {
    generateTest('tit/3-7');
  })
  it('should have all words highlighted Titus 3:13', () => {
    generateTest('tit/3-13');
  })
})

// To do: The <ScriptureTable/> syntax probably needs to be updated to work with the latest version
describe.skip('Checking highlights from rendered component in 3 John', () => {
  it('should have all words highlighted 3JN 1:10', () => {
    generateTest('3jn/1-10');
  })
  it('should highlight και, all occurences', () => {
    generateTest('3jn/1-10-2');
  })
  it('should have all words highlighted 3JN 1:11', () => {
    generateTest('3jn/1-11');
  })
  it('should have all words highlighted 3JN 1:11 (2)', () => {
    generateTest('3jn/1-11-2');
  })
  it('should have all words highlighted 3JN 1:12', () => {
    generateTest('3jn/1-12');
  })
  it('should have all words highlighted 3JN 1:14', () => {
    generateTest('3jn/1-14');
  })
  it('should have all words highlighted 3JN 1:15', () => {
    generateTest('3jn/1-15');
  })
})

function generateTest(fileName) {
  const fixturePath = path.join(__dirname, './fixtures/highlighting', `${fileName}.js`);
  const { book, chapter, verse, quote, occurrence } = require(fixturePath);
  const reference = {
    bookId: book,
    chapter,
    verse,
  };
  const UGNT = usfmJS.toJSON(UGNT_BOOKS[book]);
  const books = [
    UGNT
  ];
  let expected = [];
  const { verseObjects } = UGNT.chapters[reference.chapter][reference.verse];
  const highlightedWordsFromVerseComponent = getHighlightedWordsFromVerseComponent(reference, occurrence, quote, books);
  const expectedHighlightedWords = selectionsFromQuote({ verseObjects, occurrence, quote });
  expectedHighlightedWords.forEach((selectionStringified, index) => {
    const { text } = JSON.parse(selectionStringified);
    expected.push(JSON.parse(selectionStringified));
    expect(highlightedWordsFromVerseComponent[index]).toBe(text);
  })
  // fs.writeFileSync(fixturePath, `module.exports = {
  //   book:"${book}",
  //   chapter:${chapter},
  //   verse:${verse},
  //   quote:"${quote}",
  //   occurrence:${occurrence || 1},
  //   verseObjects: ${JSON.stringify(verseObjects)},
  //   expected: ${JSON.stringify(expected)}
  // }`)
}

function getHighlightedWordsFromVerseComponent(reference, occurrence, quote, books) {
  const words = [];
  const titles = [
    'UGNT - Greek',
  ];
  const wrapper = mount(<ScriptureTable
    renderOffscreen={{
      [`${reference.chapter}:${reference.verse}`]: true
    }}
    titles={titles}
    books={books}
    title='Book'
    reference={reference}
    quote={quote}
    occurrence={occurrence}
    height='250px'
  />);
  const verseComponent = wrapper.find(`[data-test="verse-${reference.chapter}-${reference.verse}"]`).first();
  verseComponent.find('[data-test="aligned-word-object"]').forEach((wordObject) => {
    const className = wordObject.prop('className');
    if (className && className.match(/selected/)) {
      words.push(wordObject.text())
    }
  })
  return words;
}
