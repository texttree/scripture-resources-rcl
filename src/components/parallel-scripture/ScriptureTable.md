### Using a Context

```js
import {ScriptureTable,
  ResourcesContext, ResourcesContextProvider,
} from "scripture-resources-rcl";
import useEffect from 'use-deep-compare-effect';

import usfmJS from 'usfm-js';

function Component ({reference}) {

  const resourcesContext = React.useContext(ResourcesContext);
  const resources = resourcesContext.state;

  const [title, setTitle] = React.useState('');
  const [titles, setTitles] = React.useState([]);
  const [books, setBooks] = React.useState([]);
  const [quote, setQuote] = React.useState('Θεὸς & λόγος');
  const [occurrence, setOccurrence] = React.useState(1);

  React.useEffect(() => {
    if (resources.length > 0) {
      const {title: _title} = resources[0].project;
      setTitle(_title);
      const _titles = resources.map((resource) => {
        let _title = `Error: ${resource.resourceLink}`;
        if (resource.manifest) {
          const { manifest: { dublin_core: {title, version} } } = resource;
          _title =`${title} v${version}`;
        }
        return _title;
      });
      setTitles(_titles);
      const promises = resources.map((resource, index) => resource.project.file() );
      Promise.all(promises).then(files => {
        const start = performance.now();
        const _books = files.map(file => usfmJS.toJSON(file));
        const end = performance.now();
        console.log(`USFM parsing books took: ${(end - start).toFixed(3)}ms`);
        setBooks(_books);
      });
    }
  }, [resources.length]);

  return (
    <>
      <p>Quote: {quote}</p>
      <p>Occurrence: {occurrence}</p>
      <div style={{border: '1px #ebf1f3 solid'}}>
        <ScriptureTable
          titles={titles}
          books={books}
          title={title}
          reference={reference}
          quote={quote}
          occurrence={occurrence}
          height='250px'
        />
      </div>
    </>
  );
}

const resourceLinks = [
  'unfoldingWord/el-x-koine/ugnt/v0.8',
  'unfoldingWord/en/ult/v5',
  'unfoldingWord/en/ust/v5',
];

const config = {server: 'https://git.door43.org'};

const reference = {bookId: 'jhn', chapter: 1, verse: 1};

//<Resources resourceLinks={resourceLinks} config={config} reference={reference} />
const [ resources, setResources ] = React.useState( [] );
const quote='Θεὸς & λόγος';
const occurrence=1;
<>
  <ResourcesContextProvider
    reference={reference}
    resources={resources}
    resourceLinks={resourceLinks}
    onResources={setResources}
    config={config}
  >
      <Component reference={reference}/>
  </ResourcesContextProvider>
</>

```


### Manually providing files

```js
import {ScriptureTable} from "scripture-resources-rcl";
import usfmJS from 'usfm-js';

import ugnt_tit from '../mocks/ugnt_tit.usfm.js';
import en_aligned_tit from '../mocks/en_aligned_tit.usfm.js';
import hi_aligned_tit from '../mocks/hi_aligned_tit.usfm.js';
import hi_tit from '../mocks/hi_tit.usfm.js';
import bhd_tit from '../mocks/bhd_tit.usfm.js';

const titles = [
  'UGNT - Greek',
  'English - ULT (aligned)',
  'Hindi - IRV (aligned)',
  'Hindi - ULB',
  'Bhadrawahi - ULB',
];

const books = [
  usfmJS.toJSON(ugnt_tit),
  usfmJS.toJSON(en_aligned_tit),
  usfmJS.toJSON(hi_aligned_tit),
  usfmJS.toJSON(hi_tit),
  usfmJS.toJSON(bhd_tit),
];

const reference = {
  bookId: 'tit',
  chapter: 1,
  verse: 3,
};

const [component, setComponent] = React.useState(<></>)
const [quote, setQuote] = React.useState("τοῦ σωτῆρος ἡμῶν θεοῦ");
const [occurrence, setOccurrence] = React.useState(1);

React.useEffect(() => {
  setComponent(
    <ScriptureTable
      titles={titles}
      books={books}
      title='Titus'
      reference={reference}
      quote={quote}
      onQuote={setQuote}
      occurrence={occurrence}
      height='250px'
    />
  );
}, []);

<>
  <p>Quote: {quote}</p>
  <p>Occurrence: {occurrence}</p>
  <div style={{border: '1px #ebf1f3 solid'}}>
    {component}
  </div>
</>
```
