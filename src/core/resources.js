import path from 'path';
import YAML from 'js-yaml-parser';
import { get } from 'gitea-react-toolkit';
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
    console.log(e);
    const errorMessage =
      'scripture-resources-rcl: resources.js: Cannot load resource [' +
      resourceLink +
      ']';
    console.error(errorMessage);
    console.error(e);
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
    tag = 'master';

  if (resourceLink.includes('src/branch')) {
    //https://git.door43.org/ru_gl/ru_rlob/src/branch/master
    //https://git.door43.org/ru_gl/ru_rlob/src/branch/master/3jn
    parsedArray = resourceLink.match(
      /https?:\/\/.*org\/([^/]*)\/([^/]*)\/src\/([^/]*)\/([^/]*)/,
    );
    [, username, repository, , tag] = parsedArray;
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
    [username, languageId, resourceId, tag = 'master', projectId] = parsedArray;
    repository = `${languageId}_${resourceId}`;
  }

  if (!projectId || projectId == '' || projectId.length == 0) {
    projectId = reference.projectId || reference.bookId;
  }
  resourceLink = `${username}/${languageId}/${resourceId}/${tag}/${projectId}`;

  const resource = {
    resourceLink,
    username,
    repository,
    languageId,
    resourceId,
    tag,
    projectId,
    config,
  };
  return resource;
};

export const getResourceManifest = async ({
  username,
  languageId,
  resourceId,
  tag,
  config,
  fullResponse,
}) => {
  const repository = `${languageId}_${resourceId}`;
  const path = 'manifest.yaml';
  const response = await getFile({
    username,
    repository,
    path,
    tag,
    config,
    fullResponse,
  });
  const yaml = fullResponse ? (response?.data || null) : response;
  const manifest = yaml ? YAML.safeLoad(yaml) : null;
  return fullResponse ? { manifest, response } : manifest;
};

export const getResourceProjectFile = async ({
  username,
  languageId,
  resourceId,
  tag,
  project: { path: projectPath },
  config,
  filePath,
}) => {
  const repository = `${languageId}_${resourceId}`;
  projectPath = filePath && filePath.length ? path.join(projectPath, filePath) : projectPath;

  const file = await getFile({
    username,
    repository,
    path: projectPath,
    tag,
    config,
  });
  return file;
};

export const projectFromProjects = ({
  reference, projectId, projects,
}) => {
  const identifier = reference
    ? reference?.projectId || reference?.bookId
    : projectId;
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
      let json;

      if (reference && reference.chapter) {
        json = await parseChapter({ project: _project, reference });
      } else {
        json = await parseBook({ project: _project });
      }

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
      return json;
    };
  }
  return _project;
};

export const parseBook = async ({ project }) => {
  console.log('parseBook usfmJS.toJSON');
  const usfm = (await project.file()) || '';
  const json = usfmJS.toJSON(usfm);
  return json;
};

export const parseChapter = async ({ project, reference }) => {
  const usfm = await project.file();

  if (usfm) {
    const thisChapter = parseInt(reference.chapter);
    const nextChapter = thisChapter + 1;
    const regexpString =
      '(\\\\c\\s*' +
      thisChapter +
      '\\s*(.*?\n?)*?)(?:(\\\\c\\s*' +
      nextChapter +
      '|$))';
    const regexp = new RegExp(regexpString, '');
    const matches = usfm.match(regexp);

    let chapter = '';

    if (matches) {
      chapter = matches[1];
    }

    const json = usfmJS.toJSON(chapter);
    return json;
  }
};

// https://git.door43.org/unfoldingword/en_ult/raw/branch/master/manifest.yaml
export const getFile = async ({
  username,
  repository,
  path: urlPath = '',
  tag,
  config,
  fullResponse,
}) => {
  let url;

  if (tag && tag !== 'master' && urlPath) {
    url = path.join(username, repository, 'raw/tag', tag, urlPath);
  } else {
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
