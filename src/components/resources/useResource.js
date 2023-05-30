import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import deepFreeze from 'deep-freeze';
import useEffect from 'use-deep-compare-effect';

import { resourceFromResourceLink } from '../../core';

function useResource({
  resource,
  resourceLink,
  reference,
  config,
  onResource,
}) {
  const [projectIdentifier, setProjectIdentifier] = useState();
  const [usfmJson, setUsfmJson] = useState();

  const parseUsfm = useCallback(async () => {
    if (resource && resource.project) {
      const { project } = resource;

      if (project.identifier !== projectIdentifier || !usfmJson) {
        const json = await project.parseUsfm();
        setUsfmJson(json);
        setProjectIdentifier(project.identifier);
      }
    }
  }, [projectIdentifier, resource, usfmJson]);

  useEffect(() => {
    resourceFromResourceLink({
      resourceLink, reference, config,
    }).then(
      (_resource) => {
        update(_resource);
      },
    );
  }, [resourceLink, reference, config, update]);

  const update = useCallback(
    (_resource) => {
      const __resource = _resource && deepFreeze(_resource);
      onResource(__resource);
    },
    [onResource],
  );

  return {
    state: resource,
    actions: {
      update,
      parseUsfm,
    },
  };
}

useResource.propTypes = {
  /** the resource content */
  resource: PropTypes.object,
  /** reference: chapter and verse */
  reference: PropTypes.object,
  /** The link to parse and fetch the resource manifest */
  resourceLink: PropTypes.string.isRequired,
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
  onResource: PropTypes.func.isRequired,
};

export default useResource;
