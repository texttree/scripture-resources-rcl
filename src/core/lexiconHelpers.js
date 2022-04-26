import { getFile } from "./resources";

export function getLexiconResourceID(isNt) {
  const resourceId = isNt ? 'ugl' : 'uhal';
  return resourceId;
}

export const parseSenses = ({lexiconMarkdown}) => {
  let uniqueSenses = [];
  if (lexiconMarkdown) {
    let senses = [];
    const sensesSection = lexiconMarkdown.split(/##\s*Senses/)[1];
    const senseSections = sensesSection.split(/###\s*Sense/).splice(1);
    senseSections.forEach(senseSection => {
      const definitionRegexp = /####\s*Definitions?.*?[\n\s]+(.*?)\n/;
      const glossRegexp = /####\s*Glosse?s?.*?[\n\s]+(.*?)\n/;
      let definition = definitionRegexp.test(senseSection) ? definitionRegexp.exec(senseSection)[1] : null;
      definition = (!/#/.test(definition)) ? definition : null;
      let gloss = glossRegexp.test(senseSection) ? glossRegexp.exec(senseSection)[1] : null;
      gloss = (!/#/.test(gloss)) ? gloss : null;
      const sense = {
        definition: definition,
        gloss: gloss,
      };
      senses.push(sense);
    });
    uniqueSenses = unique({array: senses});
  }
  return uniqueSenses;
};

export async function senses({strong}) {
  let senses, repository, path;
  if (/H\d+/.test(strong)) {
    repository = 'en_uhal';
    const _strong = strong.match(/H\d+/)[0];
    path = `content/${_strong}.md`;
  }
  if (/G\d+/.test(strong)) {
    repository = 'en_ugl';
    path = `content/${strong}/01.md`;
  }
  if (repository && path) {
    const lexiconMarkdown = await getFile({username: 'unfoldingword', repository, path});
    senses = parseSenses({lexiconMarkdown});
  }
  if (!senses) throw(Error(`Could not find sense info for: ${strong}`));
  return senses;
};

export const unique = ({array, response=[]}) => {
  let _array = array;
  array.forEach(object => {
    _array = _array.filter(_object =>
      !(object.gloss === _object.gloss && object.definition === _object.definition)
    );
    _array.push(object);
  });
  return _array;
}


/**
 * iterate through word objects to get list of strongs numbers found
 * @param {object[]} wordObjects
 * @return {string[]}
 */
export function getStrongsList(wordObjects) {
  const strongs = wordObjects.map(word => (word.strongs || word.strong)).filter(word => word);
  return strongs;
}

/**
 * iterate through nested verse objects to get array of wordObjects
 * @param {object[]} verseObjects
 * @return {null|object[]}
 */
export const getWordObjects = (verseObjects) => {
  let words = [];

  if (! verseObjects || !verseObjects.length) {
    return null;
  }

  for (let i = 0, l = verseObjects.length; i < l; i++) {
    const verseObject = verseObjects[i];

    if (verseObject.type === 'word') {
      words.push(verseObject);
    }

    if (verseObject.type === 'milestone') {
      if (verseObject.children) {
        // Handle children of type milestone
        const subWords = getWordObjects(verseObject.children);
        words = words.concat(subWords);
      }
    }
  }

  return words;
};

