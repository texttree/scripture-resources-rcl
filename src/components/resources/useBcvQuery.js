import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import deepFreeze from 'deep-freeze';
import useEffect from 'use-deep-compare-effect';
import { resourceFromResourceLink } from '../../core';

const bcvErrorCodes = Object.freeze({
  NoBook: Symbol('no book specified'),
  TooManyBooks: Symbol('too many books specified'),
});

const arrayToObject = (array, keyField) =>
  array.reduce((obj, item) => {
    let iCopy = Object.assign({}, item);
    delete iCopy[keyField];
    obj[item[keyField]] = iCopy;
    return obj;
  }, {});

// the query parameter is a tree with four levels: root, book, ch (chapter) and v (verse)

/*
Here is an example query:

cexport const queryTit2_15_3_1 = {
  title: "unfoldingWord® Simplified Text",
  version: "38",
  resourceLink: "unfoldingWord/en/ust/master",
  server: "https://git.door43.org",
  owner: "unfoldingWord",
  languageId: "en",
  projectId: "ust",
  branch: "master",
  book: {
    tit: {
      ch: {
        2: { v: { 15: { verseObjects: [] } } },
        3: { v: { 1: { verseObjects: [] } } },
      },
    },
  },
*/

function useBcvQuery(server, resourceLink, query, options = {}) {
  const [bookId, setBookId] = useState(undefined);
  const [resource, setResource] = useState({});
  const [resultTree, setResultTree] = useState({ ...query });
  const [errorCode, setErrorCode] = useState(undefined);
  const [success, setSuccess] = useState(false);
  const [content, setContent] = useState(null);
  const [loadingResource, setLoadingResource] = useState(null); // flag for when loading resource
  const [loadingContent, setLoadingContent] = useState(null); // flag for when loading content from resource
  const [fetchResponse, setFetchResponse] = useState(null);
  const [triggeredReloadCount, setReloadCount] = useState(0);
  const [curBook, setCurBook] = useState(undefined);

  const maxBooksAllowed = 1; // To do later: Multiple books is not yet implemented

  useEffect(() => {
    const bookLevel = query && query.book;

    if (!bookLevel) {
      setErrorCode(bcvErrorCodes.NoBook);
    } else {
      const allBooks = Object.keys(bookLevel);

      if (allBooks.length === 0) {
        setErrorCode(bcvErrorCodes.NoBook);
      } else if (allBooks.length > maxBooksAllowed) {
        setErrorCode(bcvErrorCodes.TooManyBooks);
      } else {
        const _bookId = allBooks[0];
        setBookId(_bookId);
        setCurBook(bookLevel[_bookId]);

        const reference = { projectId: _bookId };
        const resourceTag = JSON.stringify({
          resourceLink,
          reference,
          server,
        });
        setLoadingResource(resourceTag);
        setLoadingContent(null);
        setFetchResponse(null);
        setResource({});
        resourceFromResourceLink({
          resourceLink,
          reference,
          config: {
            server,
            cache: options.cache,
          },
        })
          .then((_resource) => {
            let __resource = _resource && deepFreeze(_resource);
            __resource = __resource || {}; //TRICKY prevents 'use-deep-compare-effect' from crashing when resource not found (is null)

            if (_resource) {
              // if successful loading resource, we move to getting content
              setLoadingContent(resourceTag);
            }
            setResource(__resource);
            setLoadingResource(null); // done
          })
          .catch((error) => {
            console.warn(
              `useBcvQuery() - error fetching resource for: ${resourceTag}`,
              error,
            );
            setLoadingResource(null); // done
          });
      }
    }
  }, [query, options.cache, triggeredReloadCount, resourceLink, server]);

  useEffect(() => {
    const insertParsedUsfmInResult = async () => {
      if (!resource?.project?.parseUsfm) {
        // if no project found or no usfm
        return null;
      }

      const { project } = resource;
      const { json: bibleJson, response } = await project.parseUsfm();
      setContent(bibleJson); // Deprecated - use resultTree instead
      setFetchResponse(response);
      const _chObj = Object.keys(curBook.ch).map(chapter => {
        const _vObj = Object.keys(curBook.ch[chapter].v).map(verse => ({
          verse,
          ...curBook.ch[chapter].v[verse],
          ...bibleJson.chapters[chapter][verse],
        }));
        return {
          chapter,
          v: arrayToObject(_vObj, 'verse'),
        };
      });

      return {
        ...query,
        ...resource,
        book: { [bookId]: { ch: arrayToObject(_chObj, 'chapter') } },
      };
    };

    insertParsedUsfmInResult().then(function (res) {
      setResultTree(res);
      setSuccess(true);
      setLoadingContent(null); // done
    });
  }, [resource, curBook, bookId, query]);

  const reloadResource = useCallback(() => {
    setReloadCount(triggeredReloadCount + 1);
  }, [triggeredReloadCount]);

  return {
    state: {
      loadingResource,
      loadingContent,
      success,
      resultTree,
      content,
      resource,
      errorCode,
      fetchResponse,
    },
    actions: { reloadResource },
  };
}

useBcvQuery.propTypes = {
  props: PropTypes.shape({
    /** The server for fetching */
    server: PropTypes.string.isRequired,
    /** The link to parse and fetch the resource manifest */
    resourceLink: PropTypes.string.isRequired,
    query: PropTypes.shape({
      book: PropTypes.objectOf(
        PropTypes.shape({
          ch: PropTypes.objectOf(
            PropTypes.shape({ v: PropTypes.objectOf(PropTypes.shape({})) }),
          ),
        }),
      ),
    }),
    options: PropTypes.shape({
      /** the overriding cache settings */
      cache: PropTypes.shape({
        /** cache age in ms */
        maxAge: PropTypes.number,
      }),
    }),
  }),
};

/* optional (in options)
// the overriding cache settings
cache: PropTypes.shape({
  // cache age in ms
  maxAge: PropTypes.number,
}),
*/

export default useBcvQuery;
