import path from 'path';
import YAML from 'js-yaml-parser';
import { decodeBase64ToUtf8, get } from 'gitea-react-toolkit';
import usfmJS from 'usfm-js';

export const resourcesFromResourceLinks = async ({
  resourceLinks,
  reference,
  config,
}) => {
  const promises = resourceLinks.map((resourceLink) =>
    resourceFromResourceLink({
      resourceLink,
      reference,
      config,
    }),
  );
  // Filter invalid resources (those that did not parse)
  const resources = await (await Promise.all(promises)).filter(
    (parsedResource) => parsedResource != null,
  );
  return resources;
};

export const resourceFromResourceLink = async ({
  resourceLink,
  reference,
  config,
}) => {
  let manifestHttpResponse = null;

  try {
    const resource = parseResourceLink({
      resourceLink,
      config,
      reference,
    });
    resource.fullResponse = true;
    const { manifest, response } = await getResourceManifest(resource);
    manifestHttpResponse = response;
    const projects = manifest.projects.map((project) =>
      extendProject({
        project,
        resource,
        reference,
      }),
    );
    const projectId = reference ? reference.projectId || reference.bookId : '';
    const project = await projectFromProjects({
      reference,
      projectId,
      projects,
    });
    const _resource = {
      ...resource,
      reference,
      manifest,
      projects,
      project,
      manifestHttpResponse,
    };
    return _resource;
  } catch (e) {
    const errorMessage =
      'scripture-resources-rcl: resources.js: Cannot load resource [' +
      resourceLink +
      ']';
    console.error(errorMessage, e);
    return { manifestHttpResponse };
  }
};

export const parseResourceLink = ({
  resourceLink, config, reference = {},
}) => {
  let parsedArray,
    username,
    repository,
    languageId,
    resourceId,
    projectId = reference.projectId || reference.bookId,
    tag,
    ref,
    matched;
  ref = ref || tag || 'master'; // fallback to using tag if ref not given
  const versionHttpMatch = /https?:\/\/.*org\/api\/v1\/repos\/([^/]*)\/([^/]*)\/([^/]*)([/][^/]*)*\?ref=([^/]+)/;
  const versionLinkMatch = /\/api\/v1\/repos\/([^/]*)\/([^/]*)\/([^/]*)([/][^/]*)*\?ref=([^/]+)/;

  if (matched = resourceLink.match(versionHttpMatch)) {
    //https://git.door43.org/api/v1/repos/ru_gl/ru_rlob/contents?ref=v0.9
    //https://git.door43.org/api/v1/repos/ru_gl/ru_rlob/contents/manifest.yaml?ref=v0.9
    [, username, repository, , , ref] = matched;
    [languageId, resourceId] = repository.split('_');
  } else if (matched = resourceLink.match(versionLinkMatch)) {
    // /api/v1/repos/ru_gl/ru_rlob/contents?ref=v0.9
    // /api/v1/repos/ru_gl/ru_rlob/contents/manifest.yaml?ref=v0.9
    [, username, repository, , , ref] = matched;
    [languageId, resourceId] = repository.split('_');
  } else if (matched = resourceLink.match(/https?:\/\/.*org\/([^/]*)\/([^/]*).git/)) {
    // https://git.door43.org/Door43-Catalog/en_ust.git
    [, username, repository] = matched;
    [languageId, resourceId] = repository.split('_');
  } else if (resourceLink.includes('/u/')) {
    // https://door43.org/u/unfoldingWord/en_ult/
    parsedArray = resourceLink.match(/https?:\/\/.*org\/u\/([^/]*)\/([^/]*)/);
    [, username, repository] = parsedArray;
    [languageId, resourceId] = repository.split('_');
  } else if (resourceLink.includes('src/branch') ||
    resourceLink.includes('src/tag') ||
    resourceLink.includes('raw/branch') ||
    resourceLink.includes('raw/tag')){
    //https://git.door43.org/ru_gl/ru_rlob/src/branch/master
    //https://git.door43.org/ru_gl/ru_rlob/src/tag/v1.1.1
    //https://git.door43.org/ru_gl/ru_rlob/raw/tag/v1.1.1
    //https://git.door43.org/ru_gl/ru_rlob/src/branch/master/3jn
    parsedArray = resourceLink.match(
      /https?:\/\/.*org\/([^/]*)\/([^/]*)\/([^/]*)\/([^/]*)\/([^/]*)/
    );
    [, username, repository, , , ref] = parsedArray;
    [languageId, resourceId] = repository.split('_');
  } else if (resourceLink.includes('http')) {
    //https://git.door43.org/ru_gl/ru_rlob
    //https://git.door43.org/ru_gl/ru_rlob/3jn
    parsedArray = resourceLink.match(/https?:\/\/.*org\/([^/]*)\/([^/]*)/);
    [, username, repository] = parsedArray;
    [languageId, resourceId] = repository.split('_');
  } else if (resourceLink.match(/^\/?([^/]*)\/([^/]*)\/?\/?([^/]*)?\/?$/)) {
    // /ru_gl/ru_rlob
    // /ru_gl/ru_rlob/3jn
    parsedArray = resourceLink.match(/^\/?([^/]*)\/([^/]*)\/?\/?([^/]*)?\/?$/);
    [
      ,
      username,
      repository,
      projectId = reference.projectId || reference.bookId,
    ] = parsedArray;
    [languageId, resourceId] = repository.split('_');
  } else {
    //ru_gl/ru/rlob/master/
    //ru_gl/ru/rlob/master/tit
    parsedArray = resourceLink.split('/');
    [username, languageId, resourceId, ref = 'master', projectId] = parsedArray;
    repository = `${languageId}_${resourceId}`;
  }

  if (!projectId || projectId == '' || projectId.length == 0) {
    projectId = reference.projectId || reference.bookId;
  }
  resourceLink = `${username}/${languageId}/${resourceId}/${ref}/${projectId}`;

  return {
    resourceLink,
    username,
    repository,
    languageId,
    resourceId,
    tag: ref,
    ref,
    projectId,
    config,
  };
};

export const getResourceManifest = async ({
  username,
  languageId,
  resourceId,
  tag,
  ref,
  config,
  fullResponse,
  doRefFetch,
}) => {
  ref = ref || tag; // fallback to using tag if ref not given
  const repository = `${languageId}_${resourceId}`;
  const path = 'manifest.yaml';
  const response = await getFile({
    username,
    repository,
    path,
    ref,
    config,
    fullResponse,
    doRefFetch,
  });
  const yaml = getResponseData(response);
  const manifest = yaml ? YAML.safeLoad(yaml) : null;
  return fullResponse ? { manifest, response } : manifest;
};

export const getResourceProjectFile = async ({
  username,
  languageId,
  resourceId,
  ref,
  tag,
  project: { path: projectPath },
  config,
  filePath,
  doRefFetch,
}) => {
  const repository = `${languageId}_${resourceId}`;
  projectPath = filePath && filePath.length ? path.join(projectPath, filePath) : projectPath;

  const file = await getFile({
    username,
    repository,
    path: projectPath,
    ref,
    tag,
    config,
    fullResponse: true,
    doRefFetch,
  });
  return file;
};

export const projectFromProjects = ({
  reference, projectId, projects,
}) => {
  const identifier = reference ? (reference?.projectId || reference?.bookId) : projectId;
  const project = projects.filter(
    (project) => project.identifier === identifier,
  )[0];
  return project;
};

export const extendProject = ({
  project, resource, reference,
}) => {
  let _project = { ...project };
  const { projectId, resourceLink } = resource;

  // eslint-disable-next-line require-await
  _project.file = async () =>
    getResourceProjectFile({
      ...resource,
      project,
      filePath: reference?.filePath,
    });

  if (project.path.match(/\.usfm$/)) {
    _project.parseUsfm = async () => {
      const start = performance.now();
      let results;

      if (reference && (reference.chapter || reference.bcvQuery)) {
        results = await parseChapters({ project: _project, reference });
      } else {
        results = await parseBook({ project: _project });
      }

      const { json, response } = results || {};
      const end = performance.now();
      let identifier =
        reference && reference.bookId
          ? reference?.projectId || reference.bookId
          : projectId;

      console.log(
        `fetch & parse ${resourceLink} ${identifier}: ${(end - start).toFixed(
          3,
        )}ms`,
      );
      return { json, response };
    };
  }
  return _project;
};

/**
 * get data from http response and decode data in base64 format
 * @param {object} response - http response
 * @return {*} - response data decoded
 */
export function getResponseData(response) {
  let data = response?.data;

  if (!data?.errors) { // make sure was not a fetch error
    data = (data?.encoding === 'base64') ? decodeBase64ToUtf8(data.content) : data;
    return data;
  }
  return null;
}

export const parseBook = async ({ project }) => {
  console.log('parseBook usfmJS.toJSON');
  const response = (await project.file()) || '';
  const usfm = getResponseData(response);
  const json = usfmJS.toJSON(usfm);
  return { json, response };
};

export const chapterListFromBcvQuery = (bcvQuery) => {
  const resArray = []
  if (bcvQuery?.book) {
    Object.entries(bcvQuery?.book).forEach(([bookKey, { ch }]) => {
      Object.entries(ch).forEach(([chNum, { v }]) => {
        resArray.push(chNum);
      })
    })
  }
  return resArray
}

export const parseChapters = async ({ project, reference }) => {
  const response = await project.file();
  const usfm = getResponseData(response);

  if (usfm) {
    let chapterText = '';
    const chList = reference?.bcvQuery ? chapterListFromBcvQuery(reference?.bcvQuery) : [reference?.chapter]

    chList?.forEach(ch => {
      const nextChapter = ch + 1;
      const regexpString =
        '(\\\\c\\s*' +
        ch +
        '\\s*(.*?\n?)*?)(?:(\\\\c\\s*' +
        nextChapter +
        '|$))';
      const regexp = new RegExp(regexpString, '');
      const matches = usfm.match(regexp);
      if (matches) {
        chapterText += matches[1];
      }
    })

    const json = usfmJS.toJSON(chapterText);
    return { json, response };
  }
};

// https://git.door43.org/unfoldingword/en_ult/raw/branch/master/manifest.yaml
export const getFile = async ({
  username,
  repository,
  path: urlPath = '',
  tag,
  ref,
  config,
  fullResponse,
}) => {
  let url;

  if (ref) {
    url = path.join('api/v1/repos', username, repository, 'contents', urlPath) + `?ref=${ref}`;
  } else if (tag && tag !== 'master') {
    url = path.join(username, repository, 'raw/tag', tag, urlPath);
  } else { // default to master
    url = path.join(username, repository, 'raw/branch/master', urlPath);
  }

  try {
    const _config = { ...config }; // prevents gitea-react-toolkit from modifying object
    const response = await get({
      url,
      config: _config,
      fullResponse,
    });
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};
