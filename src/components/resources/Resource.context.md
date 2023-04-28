## useRsrc

A custom hook to retrieve resources from DCS. Unlike useResource it allows to retrieve files that are in a subfolder through the filePath value.

```js
import React, { useEffect, useState } from "react";
import { BlockEditable } from "markdown-translatable";
import useRsrc from "./useRsrc";
const reference = {
  projectId: "tit",
  chapter: 1,
  verse: 1,
};
const resourceLink = "unfoldingWord/en/ult/master";
const config = {
  server: "https://git.door43.org",
  cache: {
    maxAge: 1 * 1 * 1 * 60 * 1000, // override cache to 1 minute
  },
};
function Component() {
  const {
    state: { content, bibleJson },
    actions,
  } = useRsrc({
    resourceLink,
    reference,
    config,
    options: {
      getBibleJson: true,
    },
  });
  // The BlockEditable needs a string - not json content
  // so we just stringify the first characters here
  // - as a stop-gap measure
  return (
    <BlockEditable
      markdown={(content && JSON.stringify(content).slice(0, 1000)) || ""}
    />
    //  return <BlockEditable markdown={content || ""} />;
  );
}

<Component />;
```

## useBcvQuery

A custom hook to retrieve resources from DCS through a structured query. The result is in a tree structure, which can be transformed to any other format as needed.

```js
import React from "react";
import {Verses} from "../verses/Verses.js";
import useBcvQuery from './useBcvQuery.js';

const query = {
  title: "unfoldingWord® Simplified Text",
  version: "38",
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
}

const options = {
  cache: {
    maxAge: 1 * 1 * 1 * 60 * 1000, // override cache to 1 minute
  },
}

const arrayToObject = (array, keyField) =>
  array.reduce((obj, item) => {
    let iCopy = Object.assign({}, item);
    delete iCopy[keyField];
    obj[item[keyField]] = iCopy;
    return obj;
  }, {});

const resourceLink = "unfoldingWord/en/ust/master"
const server = "https://git.door43.org"

function Component() {
  const result = useBcvQuery(
    server, resourceLink, query, options
  );
  const bookResult = 
          result.state && result.state.resultTree && result.state.resultTree.book;

  // transform tree result to flat array
  const vObjArray = [];
  if (bookResult) {
    Object.entries(bookResult).forEach(([bookKey, { ch }]) => {
      Object.entries(ch).forEach(([chNum, { v }]) => {
        Object.entries(v).forEach(([vNum, { verseObjects }]) => {
          if (verseObjects && verseObjects.length>0) {
            vObjArray.push({ id: `${chNum}:${vNum}`, verseObjects });
          }
        })
      })
    })
  }

  // transform array to single non-hierarchical object
  const verses = arrayToObject(vObjArray,"id");
  return (
    <>
     {(verses 
        && (Object.keys(verses).length>0)) 
        && <Verses verses={verses} paragraphs showUnsupported />}
    </>
  );
}

<Component />;
```
