import { selectionsFromQuoteAndVerseObjects, normalizeString } from "../src/core/selections/selections";
import path from 'path';
import usfmJS from 'usfm-js';
import deepEqual from 'deep-equal';
import ugnt_tit from './fixtures/books/ugnt_tit.js';
import ugnt_3jn from './fixtures/books/ugnt_3jn.js';
import ugnt_php from './fixtures/books/ugnt_php.js';

describe('selectionHelpers.selectionsFromQuoteAndVerseObjects PHP', () => {
  it('should have all words highlighted PHP 2:1', () => {
    generateTest('php/2-1');
  })
  it('should have all words highlighted PHP 2:1 2', () => {
    generateTest('php/2-1-2');
  })
  it('should have all words highlighted PHP 2:1 3', () => {
    generateTest('php/2-1-3');
  })
  it('should have all words highlighted PHP 2:1 4', () => {
    generateTest('php/2-1-4');
  })
  it('should have all words highlighted PHP 2:1 5', () => {
    generateTest('php/2-1-5');
  })
  it('should have all words highlighted PHP 2:1 6', () => {
    generateTest('php/2-1-6');
  })
  it('should have all words highlighted PHP 2:1 7', () => {
    generateTest('php/2-1-7');
  })
})

const normalizedText = (arr) => arr.map( obj => {
return {
    ...obj,
    text: normalizeString(obj.text),
}
})

describe('selectionHelpers.selectionsFromQuoteAndVerseObjects Titus', () => {
    it('should have all words highlighted Titus 1:1', () => {
        generateTest('tit/1-1');
    })
    it('should have all words highlighted Titus 1:1 (2)', () => {
        generateTest('tit/1-1-2');
    })
    it('should have all words highlighted Titus 1:1 (3)', () => {
        generateTest('tit/1-1-3');
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
    it('should have all words highlighted Titus 1:4-2 with double ellipsis', () => {
      generateTest('tit/1-4-2');
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

describe('selectionHelpers.selectionsFromQuoteAndVerseObjects 3JN', () => {
    it('should have all words highlighted 3JN 1:10', () => {
        generateTest('3jn/1-10');
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

const UGNT_TIT = usfmJS.toJSON(ugnt_tit);
const UGNT_3JN = usfmJS.toJSON(ugnt_3jn);
const UGNT_PHP = usfmJS.toJSON(ugnt_php);
const books = {
    'tit': UGNT_TIT,
    '3jn': UGNT_3JN,
    'php': UGNT_PHP,
};

function generateTest(fileName) {
  const [bookName, reference] = fileName.split('/');
  const [chapter, verse] = reference.split('-');
  const { quote, occurrence, expected } = require(path.join(__dirname, './fixtures/highlighting', fileName));

  if (expected && expected.length) { // make sure expected text is normalized
    for (let i = 0; i < expected.length; i++) {
      const expectedSelection = expected[i];
      const selectionText = expectedSelection.text;
      if (selectionText) {
        const normalizedText = normalizeString(selectionText);
        if (normalizedText !== selectionText) {
          expectedSelection.text = normalizedText;
        }
      }
    }
  }

  const { verseObjects } = books[bookName].chapters[chapter][verse];
  const selections = selectionsFromQuoteAndVerseObjects({ quote, verseObjects, occurrence, reference: {chapter, verse} });

  // log details to console if there is a miscompare of data
  if (!deepEqual(selections, expected)) {
    for (let i = 0; i < expected.length; i++) {
      const selection = selections[i];
      const expected_ = expected[i];
      if (!deepEqual(selection, expected_)) {
        console.warn(`For file ${fileName}, selectionsFromQuoteAndVerseObjects() results do not match expected`);
        console.warn(`For expected selection ${i}, results do not match expected`);
      }
    }
  }
  expect(selections).toMatchObject(expected);
}
