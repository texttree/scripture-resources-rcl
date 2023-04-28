import { occurrenceInjectVerseObjects } from '../../core/selections/verseObjects';

export const referenceIdsFromBooks = ({ books }) => {
  const referenceIds = new Set([]);

  books.forEach((book) => {
    if (book) {
      let _chapters;
      if ( book.chapters ) {
        _chapters = book.chapters;
      } else if ( book.json.chapters ) {
        _chapters = book.json.chapters;
      } else {
        return;
      }
      Object.keys(_chapters).forEach((chapterKey) => {
        const chapter = _chapters[chapterKey];

        Object.keys(chapter).forEach((verseKey) => {
          const referenceId = chapterKey + ':' + verseKey;
          referenceIds.add(referenceId);
        });
      });
    }
  });
  return [...referenceIds];
};

export const isVerseKeyInRange = (({ range, verseKey }) => {
  verseKey = (typeof verseKey === 'string') ? parseInt(verseKey) : verseKey;
  let [first, last] = range.split('-');
  first = parseInt(first);
  last = parseInt(last);
  const inRange = first <= verseKey && verseKey <= last;
  return inRange;
});

export const rangeFromVerseAndVerseKeys = (({ verseKeys, verseKey }) => {
  const range = verseKeys.find(_verseKey => {
    if (_verseKey.includes('-')) { // if the verseKey includes - it is a range
      return isVerseKeyInRange({ range: _verseKey, verseKey });
    }
    return false;
  });
  return range;
});

export const versesFromReferenceIdAndBooks = ({ referenceId, books }) => {
  // console.log("versesFromReferenceIdAndBooks() referenceId,books=", referenceId,books)
  const versesData = books.map((book, index) => {
    const reference = referenceFromReferenceId(referenceId);
    //if (book && book.chapters && book.chapters.length > reference.chapter) {
    if (book) {
      // this is odd... book is coming in with two different formats.
      // One kind looks like this:
      // {headers: Array(2), chapters: {…}}
      // chapters: {1: {…}, 2: {…}, 3: {…}}
      // headers: (2) [{…}, {…}]
      //
      // the other, which does not match the expected shape:
      // {json: {…}, response: {…}}
      // json:
      // chapters:
      // 1: {1: {…}, 2: {…}, 3: {…}, 4: {…}, 5: {…}, 6: {…}, 7: {…}, 8: {…}, 9: {…}, 10: {…}, 11: {…}, 12: {…}, 13: {…}, 14: {…}, 15: {…}, front: {…}}
      // [[Prototype]]: Object
      // headers: []
      // [[Prototype]]: Object
      // response: {data: {…},
      //
      // So doing a bit of manipulation to provide the expected shape
      // that does not have the "json" and "response" intermediate attributes
      let _chapters;
      if ( book.chapters ) {
        _chapters = book.chapters;
      } else if ( book.json.chapters ) {
        _chapters = book.json.chapters;
      } else {
        return;
      }
      // console.log("index, book, and reference=", index, book, reference);
      // console.log("chapterData=", _chapters[reference.chapter]);
      const chapterData = _chapters[reference.chapter];
      let verseData = chapterData && chapterData[reference.verse];
      let range;

      if (!verseData && chapterData) {
        const verseKeys = Object.keys(chapterData);
        range = rangeFromVerseAndVerseKeys({ verseKeys, verseKey: reference.verse });
        verseData = chapterData[range];
      }

      if (index === 0 && verseData && verseData.verseObjects && verseData.verseObjects.length) {
        const _verseData = { ...verseData };
        _verseData.verseObjects = occurrenceInjectVerseObjects(_verseData.verseObjects);
        verseData = _verseData;
      }

      let verseTitle = reference.verse;

      if (!(verseTitle === 'front' || verseTitle === 'back')) {
        verseTitle = range ? reference.chapter + ':' + range : reference.chapter + ':' + reference.verse;
      }
      return { verseData, verseTitle };
    }
  });
  return versesData;
};

export const dataFromBooks = ({ books }) => {
  const referenceIds = referenceIdsFromBooks({ books });
  const data = referenceIds.map(referenceId => {
    let row = { referenceId };

    books.forEach((_, index) => {
      const [chapterKey, verseKey] = referenceId.split(':');
      const chapterData = books[index].chapters[chapterKey];
      let verseData = chapterData[verseKey];

      if (!verseData) {
        const verseKeys = Object.keys(chapterData);
        const range = rangeFromVerseAndVerseKeys({ verseKeys, verseKey });
        verseData = chapterData[range];
      }

      if (verseData) {
        row[index] = JSON.stringify({ referenceId, ...verseData });
      }
    });
    return row;
  });
  return data;
};

export const referenceIdFromReference = (reference) => reference.chapter + ':' + reference.verse;

export const referenceIdsFromBcvQuery = (bcvQuery) => {
  const resArray = []
  if (bcvQuery?.book) {
    Object.entries(bcvQuery?.book).forEach(([bookKey, { ch }]) => {
      Object.entries(ch).forEach(([chNum, { v }]) => {
        Object.entries(v).forEach(([vNum]) => {
          resArray.push(`${chNum}:${vNum}`);
        })
      })
    })
  }
  return resArray
}

export const referenceFromReferenceId = (referenceId) => {
  const [chapter, verse] = referenceId.split(':');
  return { chapter, verse };
};
