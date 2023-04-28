### Using Contexts

To add resources to the RCL, please see the following sample paths:
`Door43-Catalog/hi/ulb/master/1jn`
`STR/hi/irv/master/1jn`
To add resources to the app, please omit bookId from the end:
`Door43-Catalog/hi/ulb/master`
`STR/hi/irv/master`

```js
import { TextField } from '@material-ui/core';
import {
  ParallelScripture,
  ResourcesContext,
  ResourcesContextProvider,
} from 'scripture-resources-rcl';
import useEffect from 'use-deep-compare-effect';

function Component() {
  const [bookId, setBookId] = React.useState('1jn');
  const [quote, setQuote] = React.useState('καὶ & μὴ');
  const [occurrence, setOccurrence] = React.useState(1);

  const form = React.useMemo(
    () => (
      <form noValidate autoComplete="off">
        <div style={{ padding: '1em 0' }}>
          <TextField
            id="bookId"
            label="BookId"
            variant="outlined"
            defaultValue={bookId}
            onBlur={(event) => setBookId(event.target.value)}
          />
        </div>
        <div style={{ padding: '1em 0' }}>
          <TextField
            id="quote"
            label="Quote"
            variant="outlined"
            defaultValue={quote}
            onBlur={(event) => setQuote(event.target.value)}
          />
          <TextField
            id="occurrence"
            label="Occurrence"
            variant="outlined"
            defaultValue={occurrence}
            onBlur={(event) => setOccurrence(parseInt(event.target.value))}
          />
        </div>
      </form>
    ),
    [bookId, quote, occurrence]
  );

  const bcvQuery = {
    book: {
      "1jn": {
        ch: {
          1: {
            v: {
              1: { },
              2: { },
            }
          },
          2: { v: { 5: { } } },
        },
      },
    },
  }

  const component = React.useMemo(() => {
    const reference = { bookId, chapter: 1, verse: "1-2,2:5", bcvQuery };
    return (
      <ParallelScripture
        reference={reference}
        quote={quote}
        onQuote={setQuote}
        occurrence={occurrence}
        height="250px"
      />
    );
  }, [bookId, quote, occurrence]);

  return (
    <>
      {form}
      {component}
      <p>Quote: {quote}</p>
      <p>Occurrence: {occurrence}</p>
    </>
  );
}
const config = { server: 'https://git.door43.org' };

const defaultResourceLinks = [
  'unfoldingWord/el-x-koine/ugnt/master/1jn',
  'unfoldingWord/en/ult/v5/1jn',
  'unfoldingWord/en/ust/v5/1jn',
  'ru_gl/ru/rlob/master/1jn',
  'https://git.door43.org/unfoldingWord/en_ust/src/branch/master',
];

const _resourceLinks = [...defaultResourceLinks];

const bcvQuery = {
  book: {
    "1jn": {
      ch: {
        1: {
          v: {
            1: { },
            2: { },
          }
        },
        2: { v: { 5: { } } },
      },
    },
  },
}

const reference = { bookId: '1jn', chapter: 1, verse: "1-2,2:5", bcvQuery };
// const resourceLinks = [
//   'unfoldingWord/hbo/uhb/master',
//   'unfoldingWord/en/ult/master',
//   'unfoldingWord/en/ust/master',
// ];

const [resourceLinks, setResourceLinks] = React.useState(_resourceLinks);
const [resources, setResources] = React.useState([]);
<ResourcesContextProvider
  reference={reference}
  resourceLinks={resourceLinks}
  defaultResourceLinks={defaultResourceLinks}
  onResourceLinks={setResourceLinks}
  resources={resources}
  onResources={setResources}
  config={config}
>
  <Component />
</ResourcesContextProvider>;
```

```js
import { TextField } from "@material-ui/core";
import {
  ParallelScripture,
  ResourcesContext,
  ResourcesContextProvider,
} from "scripture-resources-rcl";
import useEffect from "use-deep-compare-effect";

function Component() {
  const [bookId, setBookId] = React.useState("1jn");
  const [quote, setQuote] = React.useState("καὶ & μὴ");
  const [occurrence, setOccurrence] = React.useState(1);

  const form = React.useMemo(
    () => (
      <form noValidate autoComplete="off">
        <div style={{ padding: "1em 0" }}>
          <TextField
            id="bookId"
            label="BookId"
            variant="outlined"
            defaultValue={bookId}
            onBlur={(event) => setBookId(event.target.value)}
          />
        </div>
        <div style={{ padding: "1em 0" }}>
          <TextField
            id="quote"
            label="Quote"
            variant="outlined"
            defaultValue={quote}
            onBlur={(event) => setQuote(event.target.value)}
          />
          <TextField
            id="occurrence"
            label="Occurrence"
            variant="outlined"
            defaultValue={occurrence}
            onBlur={(event) => setOccurrence(parseInt(event.target.value))}
          />
        </div>
      </form>
    ),
    [bookId, quote, occurrence]
  );

  const bcvQuery = {
    book: {
      "1jn": {
        ch: {
          1: {
            v: {
                1: {},
                2: {},
                5: {}
              }
            },
        },
      },
    },
  }

  const component = React.useMemo(() => {
    const reference = { bookId, chapter: 1, verse: "1-2,5", bcvQuery };
    return (
      <ParallelScripture
        reference={reference}
        quote={quote}
        onQuote={setQuote}
        occurrence={occurrence}
        height="250px"
      />
    );
  }, [bookId, quote, occurrence]);

  return (
    <>
      {form}
      {component}
      <p>Quote: {quote}</p>
      <p>Occurrence: {occurrence}</p>
    </>
  );
}
const config = { server: "https://git.door43.org" };

const defaultResourceLinks = [
  "unfoldingWord/el-x-koine/ugnt/master/1jn",
  "unfoldingWord/en/ult/v5/1jn",
  "unfoldingWord/en/ust/v5/1jn",
  "ru_gl/ru/rlob/master/1jn",
  "https://git.door43.org/unfoldingWord/en_ust/src/branch/master",
];

const _resourceLinks = [...defaultResourceLinks];

const bcvQuery = {
  book: {
    "1jn": {
      ch: {
        1: {
          v: {
              1: {},
              2: {},
              5: {}
            }
          },
      },
    },
  },
}

const reference = { bookId: "1jn", chapter: 1, verse: "1-2,5", bcvQuery };
// const resourceLinks = [
//   'unfoldingWord/hbo/uhb/master',
//   'unfoldingWord/en/ult/master',
//   'unfoldingWord/en/ust/master',
// ];

const [resourceLinks, setResourceLinks] = React.useState(_resourceLinks);
const [resources, setResources] = React.useState([]);
<ResourcesContextProvider
  reference={reference}
  resourceLinks={resourceLinks}
  defaultResourceLinks={defaultResourceLinks}
  onResourceLinks={setResourceLinks}
  resources={resources}
  onResources={setResources}
  config={config}
>
  <Component />
</ResourcesContextProvider>;
```
