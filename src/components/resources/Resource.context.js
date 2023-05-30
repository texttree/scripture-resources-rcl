import React from 'react';
import PropTypes from 'prop-types';

import { useResource } from '..';

export const ResourceContext = React.createContext({});

export function ResourceContextProvider({
  resource,
  resourceLink,
  onResourceLink,
  reference,
  config,
  onResource,
  children,
}) {
  const val = useResource({
    resource,
    resourceLink,
    onResourceLink,
    reference,
    config,
    onResource,
  });

  return (
    <ResourceContext.Provider value={val}>{children}</ResourceContext.Provider>
  );
}

ResourceContextProvider.propTypes = {
  /** the resource content */
  resource: PropTypes.object,
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
  onResourceLink: PropTypes.any,
  reference: PropTypes.any,
  children: PropTypes.any,
};

export default ResourceContextProvider;
