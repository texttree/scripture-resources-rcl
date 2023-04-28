## Base example

```js
import ReactJson from 'react-json-view';
import { SelectionsContext, SelectionsContextProvider } from "scripture-resources-rcl";

function Component () {
  // - Note how this component is able to access data that is not
  // directly provided to it. The data is stored elsewhere in an
  // enclosing component -- the "context". This component might
  // have multiple contexts.
  // - Note further that the data is NOT copied to this component; it
  // is only stored once and when it changes all enclosed components
  // are able to respond, re-render, etc.
  const selectionsContext = React.useContext(SelectionsContext);

  return (
    <div>
      <ReactJson src={selectionsContext} />
    </div>
  );
};


const quote = "ὁ λόγος,";
const occurrence = 1;
const verseObjects = [
  {
    "text": "ἐν",
    "type": "word",
  },
  {
    "type": "text",
    "text": " "
  },
  {
    "text": "ἀρχῇ",
    "type": "word",
  },
  {
    "type": "text",
    "text": " "
  },
  {
    "text": "ἦν",
    "type": "word",
  },
  {
    "type": "text",
    "text": " "
  },
  {
    "text": "ὁ",
    "type": "word",
  },
  {
    "type": "text",
    "text": " "
  },
  {
    "text": "λόγος",
    "type": "word",
  },
  {
    "type": "text",
    "text": ", "
  },
  {
    "text": "καὶ",
    "type": "word",
  },
  {
    "type": "text",
    "text": " "
  },
  {
    "text": "ὁ",
    "type": "word",
  },
  {
    "type": "text",
    "text": " "
  },
  {
    "text": "λόγος",
    "type": "word",
  },
  {
    "type": "text",
    "text": " "
  },
  {
    "text": "ἦν",
    "type": "word",
  },
  {
    "type": "text",
    "text": " "
  },
  {
    "text": "πρὸς",
    "type": "word",
  },
  {
    "type": "text",
    "text": " "
  },
  {
    "text": "τὸν",
    "type": "word",
  },
  {
    "type": "text",
    "text": " "
  },
  {
    "text": "Θεόν",
    "type": "word",
  },
  {
    "type": "text",
    "text": ", "
  },
  {
    "text": "καὶ",
    "type": "word",
  },
  {
    "type": "text",
    "text": " "
  },
  {
    "text": "Θεὸς",
    "type": "word",
  },
  {
    "type": "text",
    "text": " "
  },
  {
    "text": "ἦν",
    "type": "word",
  },
  {
    "type": "text",
    "text": " "
  },
  {
    "text": "ὁ",
    "type": "word",
  },
  {
    "type": "text",
    "text": " "
  },
  {
    "text": "λόγος",
    "type": "word",
  },
  {
    "type": "text",
    "text": ".\n\n"
  }
];

const [ selections, setSelections ] = React.useState([]);

<div style={{height: '250px', overflow: 'auto'}}>
  <SelectionsContextProvider
    selections={selections}
    onSelections={setSelections}
    quote={quote}
    //onQuote=
    occurrence={occurrence}
    verseObjects={verseObjects}
    reference={{chapter:1, verse:1, bookId: 'tit'}}
  >
    <Component />
  </SelectionsContextProvider>
</div>
```

## Support bcvQuery

```js
import ReactJson from 'react-json-view';
import { SelectionsContext, SelectionsContextProvider } from "scripture-resources-rcl";

function Component () {
  // - Note how this component is able to access data that is not
  // directly provided to it. The data is stored elsewhere in an
  // enclosing component -- the "context". This component might
  // have multiple contexts.
  // - Note further that the data is NOT copied to this component; it
  // is only stored once and when it changes all enclosed components
  // are able to respond, re-render, etc.
  const selectionsContext = React.useContext(SelectionsContext);

  return (
    <div>
      <ReactJson src={selectionsContext} />
    </div>
  );
};


const quote = "λόγος καὶ";
const occurrence = 1;
const verseObjects = [
  [{
    "text": "ἐν",
    "type": "word",
  },
  {
    "type": "text",
    "text": " "
  },
  {
    "text": "ἀρχῇ",
    "type": "word",
  },
  {
    "type": "text",
    "text": " "
  },
  {
    "text": "ἦν",
    "type": "word",
  },],
  [{
    "type": "text",
    "text": " "
  },
  {
    "text": "ὁ",
    "type": "word",
  },
  {
    "type": "text",
    "text": " "
  },
  {
    "text": "λόγος",
    "type": "word",
  },
  {
    "type": "text",
    "text": ", "
  },],
  [{
    "text": "καὶ",
    "type": "word",
  },
  {
    "type": "text",
    "text": " "
  },
  {
    "text": "ὁ",
    "type": "word",
  },
  {
    "type": "text",
    "text": " "
  },
  {
    "text": "λόγος",
    "type": "word",
  },
  {
    "type": "text",
    "text": " "
  },
  {
    "text": "ἦν",
    "type": "word",
  },
  {
    "type": "text",
    "text": " "
  },
  {
    "text": "πρὸς",
    "type": "word",
  },
  {
    "type": "text",
    "text": " "
  },
  {
    "text": "τὸν",
    "type": "word",
  },
  {
    "type": "text",
    "text": " "
  },
  {
    "text": "Θεόν",
    "type": "word",
  },
  {
    "type": "text",
    "text": ", "
  },
  {
    "text": "καὶ",
    "type": "word",
  },
  {
    "type": "text",
    "text": " "
  },
  {
    "text": "Θεὸς",
    "type": "word",
  },
  {
    "type": "text",
    "text": " "
  },
  {
    "text": "ἦν",
    "type": "word",
  },
  {
    "type": "text",
    "text": " "
  },
  {
    "text": "ὁ",
    "type": "word",
  },
  {
    "type": "text",
    "text": " "
  },
  {
    "text": "λόγος",
    "type": "word",
  },
  {
    "type": "text",
    "text": ".\n\n"
  }]
];
const bcvQuery = {
    book: {
      "tit": {
        ch: {
          1: {
            v: {
              1: { },
              2: { },
              3: { },
            }
          },
        },
      },
    },
  }
const reference = {chapter:1, verse:'1-3', bookId: 'tit', bcvQuery};

const [ selections, setSelections ] = React.useState([]);

<div style={{height: '250px', overflow: 'auto'}}>
  <SelectionsContextProvider
    selections={selections}
    onSelections={setSelections}
    quote={quote}
    //onQuote=
    occurrence={occurrence}
    verseObjects={verseObjects}
    reference={reference}
  >
    <Component />
  </SelectionsContextProvider>
</div>
```
