import React, { useState, useMemo } from 'react';
import useEffect from 'use-deep-compare-effect';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  ShortText,
  Subject,
  ViewColumn,
  UnfoldMore,
  UnfoldLess,
} from '@material-ui/icons';
import { Table, TableBody } from '@material-ui/core';
import deepFreeze from 'deep-freeze';
import { localString } from '../../core/localStrings';

import { Row, Headers, Toolbar, ColumnsMenu } from '..';
import { SelectionsContextProvider } from '../selections/Selections.context';
import {
  referenceIdsFromBooks,
  referenceIdFromReference,
  referenceIdsFromBcvQuery,
  versesFromReferenceIdAndBooks,
} from './helpers';

function ScriptureTable({
  title,
  titles,
  books,
  height,
  reference,
  quote,
  occurrence,
  buttons,
  renderOffscreen = {},
  open = true,
  onOpen,
}) {
  const classes = useStyles();
  const [filter, setFilter] = useState(!!reference);
  const [referenceIds, setReferenceIds] = useState([]);
  const [_columns, setColumns] = useState([]);
  const columns = deepFreeze(_columns);
  const [selections, setSelections] = useState([]);
  const [columnsMenuAnchorEl, setColumnsMenuAnchorEl] = useState();

  let verseObjectsArray = [];

  if (
    reference &&
    reference.verse &&
    books &&
    books[0] &&
  ((books[0].chapters &&
		books[0].chapters[reference.chapter]) ||
  ((books[0].json.chapters &&
	    books[0].json.chapters[reference.chapter]) ))
  ) {
    const book = books[0].json ? books[0].json : books[0];
    const chapter = book.chapters[reference.chapter]
    const _verse = reference?.verse
    if (!reference?.bcvQuery) {
      const verse = chapter[reference.verse];
      const _verseObjects = verse ? verse.verseObjects : []
      verseObjectsArray.push(_verseObjects)
} else {
      const bookObjList = reference?.bcvQuery.book
      const bookResult = bookObjList ? Object.values(bookObjList)[0] : {}
      Object.entries(bookResult?.ch).forEach(([chapter, { v }]) => {
        Object.entries(v).forEach(([verse, vEntry]) => {
          if (vEntry) {
            const vObj = book.chapters[chapter][verse]
            const _verseObjects = vObj ? vObj.verseObjects : [];
            verseObjectsArray.push(_verseObjects)
          }
        })
      })
    }
  }

  useEffect(() => {
    const _columns = titles.map((title, index) => ({
      id: index,
      label: title,
    }));
    setColumns(_columns);
  }, [titles]);

  useEffect(() => {
    if ( !books ) return;
    const _referenceIds = referenceIdsFromBooks({ books });
    setReferenceIds(_referenceIds);
  }, [books]);

  const actions = [
    {
      icon: open ? (
        <UnfoldLess fontSize="small" />
      ) : (
        <UnfoldMore fontSize="small" />
      ),
      tooltip: open
        ? localString('CloseScripturePane')
        : localString('ExpandScripturePane'),
      onClick: () => onOpen && onOpen(!open),
    },
    {
      icon: <ViewColumn fontSize="small" />,
      tooltip: localString('ManageVersions'),
      onClick: (event) => setColumnsMenuAnchorEl(event.currentTarget),
      menu: (
        <ColumnsMenu
          columns={columns}
          onColumns={setColumns}
          anchorEl={columnsMenuAnchorEl}
          onAnchorEl={setColumnsMenuAnchorEl}
        />
      ),
    },
    {
      icon: filter ? (
        <ShortText fontSize="small" />
      ) : (
        <Subject fontSize="small" />
      ),
      tooltip: filter
        ? localString('ExpandChapter')
        : localString('CollapseChapter'),
      onClick: () => setFilter(!filter),
    },
  ];

  let _referenceIds = referenceIds;

  if (filter) {
    if (reference?.bcvQuery) {
      _referenceIds = referenceIdsFromBcvQuery(reference?.bcvQuery);
    } else if (reference.chapter && reference.verse) {
      _referenceIds = [referenceIdFromReference(reference)];
    }
  }

  const rows = useMemo(
    () => () =>
      _referenceIds.map((referenceId) => {
        const verses = versesFromReferenceIdAndBooks({ referenceId, books });

        const row = (
          <Row
            renderOffscreen={open && renderOffscreen[referenceId]}
            key={referenceId}
            verses={verses}
            referenceId={referenceId}
            reference={reference}
            filter={filter}
            columns={columns}
          />
        );
        return row;
      }),
    [_referenceIds, books, open, renderOffscreen, reference, filter, columns],
  );

  useEffect(() => {
    const scrollReferenceId = referenceIdFromReference(reference);

    if (!filter) {
      const element = document.getElementById(scrollReferenceId);

      if (element) {
        element.scrollIntoView(true);
        document.getElementById('wrapY').scrollTop -= 30;
      }
    }
  }, [filter, reference]);

  return (
    <SelectionsContextProvider
      quote={quote}
      // onQuote={onQuote} // disable until round trip is working
      occurrence={occurrence}
      hasSingleVerse={!reference?.bcvQuery}
      verseObjectsArray={verseObjectsArray}
      selections={selections}
      onSelections={setSelections}
    >
      <Toolbar title={title} actions={actions} buttons={buttons} />
      <div id="wrapY" className={classes.wrapY} style={{ maxHeight: height }}>
        {open && (
          <Table className={classes.table}>
            <Headers columns={columns} />
            <TableBody className={classes.tableBody}>{rows()}</TableBody>
          </Table>
        )}
      </div>
    </SelectionsContextProvider>
  );
}

ScriptureTable.propTypes = {
  titles: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  ).isRequired,
  books: PropTypes.arrayOf(
    PropTypes.shape({
      headers: PropTypes.array,
      chapters: PropTypes.object,
    }),
  ).isRequired,
  /** the reference to scroll into view */
  reference: PropTypes.shape({
    bookId: PropTypes.string,
    chapter: PropTypes.number,
    verse: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    bcvQuery: PropTypes.any
  }),
  /** bypass rendering only when visible */
  renderOffscreen: PropTypes.object,
  /** render unsupported usfm markers */

  showUnsupported: PropTypes.bool,
  /** override text direction detection */
  direction: PropTypes.string,
  /** disable popovers for aligned and original language words */
  disableWordPopover: PropTypes.bool,
  /** filter the view to the reference */
  filter: PropTypes.bool,
  /** pass the quote in from parent state */
  quote: PropTypes.string,
  /** callback to return the quote when selections made */
  onQuote: PropTypes.func,
  /** set the default open state */
  open: PropTypes.bool,
  /** callback to update open state */
  onOpen: PropTypes.func,
};

const useStyles = makeStyles(() => ({
  root: {},
  wrapY: {
    overflowY: 'auto',
    overflowX: 'auto',
  },
  table: {},
  tableBody: {},
}));

export default ScriptureTable;
