import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import deepFreeze from 'deep-freeze';
import useEffect from 'use-deep-compare-effect';

import { resourcesFromResourceLinks } from '../../core';
import { removeResourceLink, tryAddResourceLink } from './resourcesHelper';

function useResources({
  resources,
  resourceLinks,
  defaultResourceLinks,
  reference,
  config,
  onResources,
  onResourceLinks = () => { },
}) {
  const [projectIdentifier, setProjectIdentifier] = useState();
  const [usfmJsonArray, setUsfmJsonArray] = useState();
  const [books, setBooks] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    resourcesFromResourceLinks({
      resourceLinks, reference, config,
    }).then(
      (_resources) => {
        update(_resources);
      },
    );
  }, [resourceLinks, reference, config, update]);

  const update = useCallback(
    (_resources) => {
      const __resources = _resources && deepFreeze(_resources);
      onResources(__resources);
    },
    [onResources],
  );

  const remove = useCallback(
    (index) => {
      let _resourceLinks = removeResourceLink(resourceLinks, index);
      onResourceLinks(_resourceLinks);
    },
    [resourceLinks, onResourceLinks],
  );

  const addResourceLink = useCallback(
    async (newResourceLink) => {
      const isSuccess = await tryAddResourceLink(
        resourceLinks,
        newResourceLink,
        reference,
        config,
        onResourceLinks,
      );

      return isSuccess;
    },
    [config, onResourceLinks, reference, resourceLinks],
  );

  const isDefaultResourceLink = (_resourceLink) => (
    defaultResourceLinks != null &&
    defaultResourceLinks.includes(_resourceLink)
  );

  const parseUsfm = useCallback(async () => {
    let response = usfmJsonArray;

    if (resources && resources[0] && resources[0].project) {
      const { project } = resources[0];

      if (!loading && (project.identifier !== projectIdentifier || !usfmJsonArray || usfmJsonArray.length != resourceLinks.length)) {
        setLoading(true);
        const promises = resources
          .map((resource) => {
            try {
              return resource.project.parseUsfm();
            } catch {
              return null;
            }
          })
          .filter((currentPromise) => currentPromise != null);
        const jsonArray = await Promise.all(promises);
        setUsfmJsonArray(jsonArray);
        setProjectIdentifier(project.identifier);
        response = jsonArray;
      }
    }
    setLoading(false);
    return response;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectIdentifier, resources, usfmJsonArray]);

  useEffect(() => {
    parseUsfm().then(setBooks);
  }, [parseUsfm, projectIdentifier]);

  return {
    state: { resources, books },
    actions: {
      addResourceLink,
      isDefaultResourceLink,
      parseUsfm,
      update,
      remove,
    },
  };
}

useResources.propTypes = {
  /** the resources  */
  resources: PropTypes.arrayOf(PropTypes.object),
  /** references: chapter and verse */
  reference: PropTypes.object,
  /** The link to parse and fetch the resource manifest */
  resourceLinks: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  /** The configuration of the server, and fetching */
  config: PropTypes.shape({
    server: PropTypes.string.isRequired,
    /** the overriding cache settings */
    cache: PropTypes.shape({
      /** cache age in ms */
      maxAge: PropTypes.number,
    }),
  }),
  /** action taken after a resource is acquired */
  onResources: PropTypes.func.isRequired,
};

export default useResources;
