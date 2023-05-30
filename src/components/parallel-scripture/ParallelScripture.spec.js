// import { TextField } from '@material-ui/core';
// import {
//   ParallelScripture,
//   ResourcesContextProvider,
// } from 'scripture-resources-rcl';

// function Component() {
//   const [bookId, setBookId] = React.useState('2jn');
//   const [chapter, setChapter] = React.useState(1);
//   const [verse, setVerse] = React.useState(1);
//   const [quote, setQuote] = React.useState('καὶ…μὴ');
//   const [occurrence, setOccurrence] = React.useState(-1);

//   const form = React.useMemo(
//     () => (
//       <form noValidate autoComplete="off">
//         <div style={{ padding: '1em 0' }}>
//           <TextField
//             id="bookId"
//             label="BookId"
//             variant="outlined"
//             defaultValue={bookId}
//             onBlur={(event) => setBookId(event.target.value)}
//           />
//           <TextField
//             id="chapter"
//             label="Chapter"
//             variant="outlined"
//             defaultValue={chapter}
//             onBlur={(event) => setChapter(parseInt(event.target.value))}
//           />
//           <TextField
//             id="verse"
//             label="Verse"
//             variant="outlined"
//             defaultValue={verse}
//             onBlur={(event) => setVerse(parseInt(event.target.value))}
//           />
//         </div>
//         <div style={{ padding: '1em 0' }}>
//           <TextField
//             id="quote"
//             label="Quote"
//             variant="outlined"
//             defaultValue={quote}
//             onBlur={(event) => setQuote(event.target.value)}
//           />
//           <TextField
//             id="occurrence"
//             label="Occurrence"
//             variant="outlined"
//             defaultValue={occurrence}
//             onBlur={(event) => setOccurrence(parseInt(event.target.value))}
//           />
//         </div>
//       </form>
//     ),
//     [bookId, chapter, verse, quote, occurrence],
//   );

//   const component = React.useMemo(() => {
//     const reference = {
//       bookId, chapter, verse,
//     };
//     return (
//       <ParallelScripture
//         reference={reference}
//         quote={quote}
//         onQuote={setQuote}
//         occurrence={occurrence}
//         height="250px"
//       />
//     );
//   }, [bookId, chapter, verse, quote, occurrence]);

//   return (
//     <>
//       {form}
//       {component}
//       <p>Quote: {quote}</p>
//       <p>Occurrence: {occurrence}</p>
//     </>
//   );
// }

// const config = { server: 'https://git.door43.org' };

// const defaultResourceLinks = [
//   'unfoldingWord/el-x-koine/ugnt/master/2jn',
//   'unfoldingWord/en/ult/v5/2jn',
//   'unfoldingWord/en/ust/v5/2jn',
//   'ru_gl/ru/rlob/master/2jn',
//   'https://git.door43.org/unfoldingWord/en_ust/src/branch/master',
// ];

// const _resourceLinks = [...defaultResourceLinks];

// const reference = {
//   bookId: '2jn', chapter: 1, verse: 1,
// };
// // const resourceLinks = [
// //   'unfoldingWord/hbo/uhb/master',
// //   'unfoldingWord/en/ult/master',
// //   'unfoldingWord/en/ust/master',
// // ];

// const [resourceLinks, setResourceLinks] = React.useState(_resourceLinks);
// const [resources, setResources] = React.useState([]);

// <ResourcesContextProvider
//   reference={reference}
//   resourceLinks={resourceLinks}
//   defaultResourceLinks={defaultResourceLinks}
//   onResourceLinks={setResourceLinks}
//   resources={resources}
//   onResources={setResources}
//   config={config}
// >
//   <Component />
// </ResourcesContextProvider>;


// describe('ParallelScripture: resourceFromResourceLink: parse and download resource', () => {
//   it('should be RLOB 2jn', async () => {
//     const resourceLink = `https://git.door43.org/ru_gl/ru_rlob`;
//     let content = await resourceFromResourceLink({
//       resourceLink, reference2jn, config,
//     });
//     //console.log(content.projects[1]);
//     expect(content.projects.length).toBeGreaterThan(0);
//   });
// });
