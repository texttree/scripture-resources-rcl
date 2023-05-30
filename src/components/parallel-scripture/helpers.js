import { occurrenceInjectVerseObjects } from '../../core/selections/verseObjects';

export const referenceIdsFromBooks = ({ books }) => {
  const referenceIds = new Set([]);

  books.forEach((book) => {
    if (book) {
      Object.keys(book.chapters).forEach((chapterKey) => {
        const chapter = book.chapters[chapterKey];

        Object.keys(chapter).forEach((verseKey) => {
          const referenceId = chapterKey + ':' + verseKey;
          referenceIds.add(referenceId);
        });
      });
    }
  });
  return [...referenceIds];
};

export const isVerseKeyInRange = ({ range, verseKey }) => {
  verseKey = typeof verseKey === 'string' ? parseInt(verseKey) : verseKey;
  let [first, last] = range.split('-');
  first = parseInt(first);
  last = parseInt(last);
  const inRange = first <= verseKey && verseKey <= last;
  return inRange;
};

export const rangeFromVerseAndVerseKeys = ({ verseKeys, verseKey }) => {
  const range = verseKeys.find((_verseKey) => {
    if (_verseKey.includes('-')) {
      // if the verseKey includes - it is a range
      return isVerseKeyInRange({ range: _verseKey, verseKey });
    }
    return false;
  });
  return range;
};

export const versesFromReferenceIdAndBooks = ({ referenceId, books }) => {
  const versesData = books.map((book, index) => {
    const reference = referenceFromReferenceId(referenceId);

    if (!book) {
      return null;
    }
    //if (book && book.chapters && book.chapters.length > reference.chapter) {

    const chapterData = book.json.chapters[reference.chapter];
    let verseData = chapterData && chapterData[reference.verse];
    let range;

    if (!verseData && chapterData) {
      const verseKeys = Object.keys(chapterData);

      range = rangeFromVerseAndVerseKeys({
        verseKeys,
        verseKey: reference.verse,
      });
      verseData = chapterData[range];
    }

    if (
      index === 0 &&
        verseData &&
        verseData.verseObjects &&
        verseData.verseObjects.length
    ) {
      const _verseData = { ...verseData };

      _verseData.verseObjects = occurrenceInjectVerseObjects(
        _verseData.verseObjects,
      );
      verseData = _verseData;
    }

    let verseTitle = reference.verse;

    if (!(verseTitle === 'front' || verseTitle === 'back')) {
      verseTitle = range
        ? reference.chapter + ':' + range
        : reference.chapter + ':' + reference.verse;
    }
    return { verseData, verseTitle };
  });
  return versesData;
};

export const dataFromBooks = ({ books }) => {
  const referenceIds = referenceIdsFromBooks({ books });
  const data = referenceIds.map((referenceId) => {
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

export const dataFromReference = ({ books, reference }) => {
  const referenceId = referenceIdFromReference(reference);
  let row = { referenceId };

  books.forEach((_, index) => {
    const chapterData = books[index].chapters[reference.chapter];
    const verseData = chapterData[reference.verse];
    let verse = false;

    if (!verseData) {
      const verseKeys = Object.keys(chapterData);
      const range = rangeFromVerseAndVerseKeys({
        verseKeys,
        verseKey: reference.verse,
      });
      verse = chapterData[range];
    }

    if (verse) {
      row[index] = JSON.stringify({ referenceId, ...verse });
    }
  });

  const data = [row];
  return data;
};

export const referenceIdFromReference = (reference) =>
  reference.chapter + ':' + reference.verse;

export const referenceFromReferenceId = (referenceId) => {
  const [chapter, verse] = referenceId.split(':');
  return { chapter, verse };
};
