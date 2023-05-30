import usfmJS from 'usfm-js';
import {
  parseResourceLink,
  resourceFromResourceLink,
  getResponseData,
} from './resources';

const config = { server: 'https://bg.door43.org' };
const reference = {
  bookId: '3jn', chapter: 1, verse: 1,
};
const reference2jn = {
  bookId: '2jn', chapter: 1, verse: 1,
};

const resourceExpectedValue = {
  'config': { 'server': 'https://bg.door43.org' },
  'languageId': 'ru',
  'projectId': '3jn',
  'repository': 'ru_rlob',
  'resourceId': 'rlob',
  'resourceLink': 'ru_gl/ru/rlob/master/3jn',
  'tag': 'master',
  'ref': 'master',
  'username': 'ru_gl',
};

describe('resourceFromResourceLink- parse and download resource', () => {
  it('should be RLOB 3jn', async () => {
    const resourceLink = `https://git.door43.org/ru_gl/ru_rlob`;
    const book = await resourceFromResourceLink({
      resourceLink, reference, config,
    });
    // console.log(content);
    expect(book.projects.length).toBeGreaterThan(0);
  });

  it('should be RLOB 3jn verses', async () => {
    const resourceLink = `https://git.door43.org/ru_gl/ru_rlob`;

    // const resource = await resourceFromResourceLink({ resourceLink, reference, config });
    // const book = extendProject({});
    // const books = [book];
    // let referenceId = referenceIdsFromBooks({ books })[0];
    // versesFromReferenceIdAndBooks({ referenceId, books });


    // const resource = parseResourceLink({ resourceLink, config, reference });
    // const manifest = await getResourceManifest(resource);
    // const projects = manifest.projects.map((project) =>
    //     extendProject({
    //         project, resource, reference,
    //     }),
    // );
    // const json = await projects[1].parseUsfm();
    // //console.log(json);
    // const referenceId = referenceIdFromReference(reference);
    // const verses = versesFromReferenceIdAndBooks({ referenceId, books: projects.books });
    // console.log(verses);


    const resource = await resourceFromResourceLink({
      resourceLink, reference, config,
    });
    const file = await resource.project.file();
    const book = await usfmJS.toJSON(getResponseData(file));
    //console.log(book.headers[0].content);
    expect(book.headers[0].content).toContain('3JN RU_RLOB ru_Русский_ltr Russian Literal Open Bible');
  });

  it('should be RLOB 2jn verses (empty)', async () => {
    const resourceLink = `https://git.door43.org/ru_gl/ru_rlob`;

    const resource = await resourceFromResourceLink({
      resourceLink, reference: reference2jn, config,
    });
    const file = await resource.project.file();
    const book = await usfmJS.toJSON(getResponseData(file));
    //console.log(book.headers[0].content);
    expect(book.headers[0].content).toContain('2JN RU_RLOB ru_Русский_ltr');
  });

  it('should be RLOB 2jn', async () => {
    const resourceLink = `https://git.door43.org/ru_gl/ru_rlob`;
    let content = await resourceFromResourceLink({
      resourceLink, reference: reference2jn, config,
    });
    //console.log(content.projects[1]);
    expect(content.projects.length).toBeGreaterThan(0);
  });
});

describe('parseResourceLink without books', () => {
  it('should be en_ult from https://git.door43.org/Door43-Catalog/en_ust.git', () => {
    const resourceExpectedValue_ = {
      ...resourceExpectedValue,
      languageId: 'en',
      repository: 'en_ult',
      resourceId: 'ult',
      username: 'unfoldingWord',
      resourceLink: `unfoldingWord/en/ult/master/3jn`,
    };
    const resourceLink = `https://door43.org/u/unfoldingWord/en_ult/`;
    let resource = parseResourceLink({
      resourceLink, config, reference,
    });

    expect(resource).toStrictEqual(resourceExpectedValue_);
  });

  it('should be en_ult from https://door43.org/u/unfoldingWord/en_ult/', () => {
    const resourceExpectedValue_ = {
      ...resourceExpectedValue,
      languageId: 'en',
      repository: 'en_ult',
      resourceId: 'ult',
      username: 'unfoldingWord',
      resourceLink: `unfoldingWord/en/ult/master/3jn`,
    };
    const resourceLink = `https://door43.org/u/unfoldingWord/en_ult/`;
    let resource = parseResourceLink({
      resourceLink, config, reference,
    });

    expect(resource).toStrictEqual(resourceExpectedValue_);
  });

  it('should be ru_rlob from https://git.door43.org/api/v1/repos/ru_gl/ru_rlob/contents?ref=v0.9', () => {
    const resourceExpectedValue_ = {
      ...resourceExpectedValue,
      tag: `v0.9`,
      ref: `v0.9`,
      resourceLink: `ru_gl/ru/rlob/v0.9/3jn`,
    };
    const resourceLink = `https://git.door43.org/api/v1/repos/ru_gl/ru_rlob/contents?ref=v0.9`;
    let resource = parseResourceLink({
      resourceLink, config, reference,
    });

    expect(resource).toStrictEqual(resourceExpectedValue_);
  });

  it('should be ru_rlob from /api/v1/repos/ru_gl/ru_rlob/contents?ref=v0.9', () => {
    const resourceExpectedValue_ = {
      ...resourceExpectedValue,
      tag: `v0.9`,
      ref: `v0.9`,
      resourceLink: `ru_gl/ru/rlob/v0.9/3jn`,
    };
    const resourceLink = `/api/v1/repos/ru_gl/ru_rlob/contents?ref=v0.9`;
    let resource = parseResourceLink({
      resourceLink, config, reference,
    });

    expect(resource).toStrictEqual(resourceExpectedValue_);
  });

  it('should be ru_rlob from https://git.door43.org/ru_gl/ru_rlob', () => {
    const resourceLink = `https://git.door43.org/ru_gl/ru_rlob`;
    let resource = parseResourceLink({
      resourceLink, config, reference,
    });

    expect(resource).toStrictEqual(resourceExpectedValue);
  });

  it('should be ru_rlob from https://git.door43.org/ru_gl/ru_rlob/src/branch/master', () => {
    const resourceLink = `https://git.door43.org/ru_gl/ru_rlob/src/branch/master`;
    let resource = parseResourceLink({
      resourceLink, config, reference,
    });

    expect(resource).toStrictEqual(resourceExpectedValue);
  });

  it('should be ru_rlob from https://git.door43.org/ru_gl/ru_rlob/src/tag/v2.0.0', () => {
    const resourceExpectedValue_ = {
      ...resourceExpectedValue,
      tag: `v2.0.0`,
      ref: `v2.0.0`,
      resourceLink: `ru_gl/ru/rlob/v2.0.0/3jn`,
    };
    const resourceLink = `https://git.door43.org/ru_gl/ru_rlob/src/tag/v2.0.0`;
    let resource = parseResourceLink({
      resourceLink, config, reference,
    });

    expect(resource).toStrictEqual(resourceExpectedValue_);
  });

  it('should be ru_rlob from https://git.door43.org/ru_gl/ru_rlob/src/branch/other', () => {
    const resourceExpectedValue_ = {
      ...resourceExpectedValue,
      tag: `v2.0.0`,
      ref: `v2.0.0`,
      resourceLink: `ru_gl/ru/rlob/v2.0.0/3jn`,
    };
    const resourceLink = `https://git.door43.org/ru_gl/ru_rlob/src/tag/v2.0.0`;
    let resource = parseResourceLink({
      resourceLink, config, reference,
    });

    expect(resource).toStrictEqual(resourceExpectedValue_);
  });

  it('should be ru_rlob from https://git.door43.org/ru_gl/ru_rlob/src/tag/v2.0.0', () => {
    const resourceExpectedValue_ = {
      ...resourceExpectedValue,
      tag: `v2.0.0`,
      ref: `v2.0.0`,
      resourceLink: `ru_gl/ru/rlob/v2.0.0/3jn`,
    };
    const resourceLink = `https://git.door43.org/ru_gl/ru_rlob/src/tag/v2.0.0`;
    let resource = parseResourceLink({
      resourceLink, config, reference,
    });

    expect(resource).toStrictEqual(resourceExpectedValue_);
  });

  it('should be ru_rlob from https://git.door43.org/ru_gl/ru_rlob/raw/branch/other', () => {
    const resourceExpectedValue_ = {
      ...resourceExpectedValue,
      tag: `v2.0.0`,
      ref: `v2.0.0`,
      resourceLink: `ru_gl/ru/rlob/v2.0.0/3jn`,
    };
    const resourceLink = `https://git.door43.org/ru_gl/ru_rlob/raw/tag/v2.0.0`;
    let resource = parseResourceLink({
      resourceLink, config, reference,
    });

    expect(resource).toStrictEqual(resourceExpectedValue_);
  });

  it('should be ru_rlob from https://git.door43.org/ru_gl/ru_rlob/raw/branch/master', () => {
    const resourceLink = `https://git.door43.org/ru_gl/ru_rlob/raw/branch/master`;
    let resource = parseResourceLink({
      resourceLink, config, reference,
    });

    expect(resource).toStrictEqual(resourceExpectedValue);
  });

  it('should be ru_rlob from /ru_gl/ru_rlob', () => {
    const resourceLink = `/ru_gl/ru_rlob`;
    let resource = parseResourceLink({
      resourceLink, config, reference,
    });

    expect(resource).toStrictEqual(resourceExpectedValue);
  });

  it('should be ru_rlob from ru_gl/ru_rlob', () => {
    const resourceLink = `ru_gl/ru_rlob`;
    let resource = parseResourceLink({
      resourceLink, config, reference,
    });

    expect(resource).toStrictEqual(resourceExpectedValue);
  });

  it('should be ru_rlob from ru_gl/ru/rlob/master/', () => {
    const resourceLink = `ru_gl/ru/rlob/master/`;
    let resource = parseResourceLink({
      resourceLink, config, reference,
    });

    expect(resource).toStrictEqual(resourceExpectedValue);
  });
});


describe('parseResourceLink with books', () => {
  it('should be ru_rlob', () => {
    const resourceLink = `https://git.door43.org/ru_gl/ru_rlob/3jn`;
    let resource = parseResourceLink({
      resourceLink, config, reference,
    });

    expect(resource).toStrictEqual(resourceExpectedValue);
  });

  it('should be ru_rlob tag', () => {
    const resourceExpectedValue_ = {
      ...resourceExpectedValue,
      tag: `v0.9`,
      ref: `v0.9`,
      resourceLink: `ru_gl/ru/rlob/v0.9/3jn`,
    };

    const resourceLink = `https://git.door43.org/ru_gl/ru_rlob/src/tag/v0.9/3jn`;
    let resource = parseResourceLink({
      resourceLink, config, reference,
    });

    expect(resource).toStrictEqual(resourceExpectedValue_);
  });

  it('should be ru_rlob branch', () => {
    const resourceLink = `https://git.door43.org/ru_gl/ru_rlob/src/branch/master/3jn`;
    let resource = parseResourceLink({
      resourceLink, config, reference,
    });

    expect(resource).toStrictEqual(resourceExpectedValue);
  });

  it('should be ru_rlob 1534', () => {
    const resourceLink = `/ru_gl/ru_rlob/3jn`;
    let resource = parseResourceLink({
      resourceLink, config, reference,
    });

    expect(resource).toStrictEqual(resourceExpectedValue);
  });

  it('should be ru_rlob with book', () => {
    const resourceLink = `ru_gl/ru_rlob/3jn`;
    let resource = parseResourceLink({
      resourceLink, config, reference,
    });

    expect(resource).toStrictEqual(resourceExpectedValue);
  });

  it('should be ru_rlob', () => {
    const resourceLink = `ru_gl/ru/rlob/master/3jn`;
    let resource = parseResourceLink({
      resourceLink, config, reference,
    });

    expect(resource).toStrictEqual(resourceExpectedValue);
  });
});
