## useRsrc

A custom hook to retrieve resources from DCS. Unlike useResource it allows to retrieve files that are in a subfolder trhough the filePath value.

```jsx
import React, { useEffect, useState } from "react";
import { Book, useRsrc } from 'scripture-resources-rcl';
const reference = {
  projectId: "tit",
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
  return <>{content !== null ? <Book book={content} paragraphs showUnsupported reference={reference} /> : 'loading'}</>;
}

<Component />;
```
