import React from 'react';
import PropTypes from 'prop-types';

import { useResources } from '..';

export const ResourcesContext = React.createContext({});

export function ResourcesContextProvider({
  resources,
  resourceLinks,
  defaultResourceLinks,
  onResourceLinks,
  onAddResourceLink,
  reference,
  config,
  onResources,
  children,
  ORIGINAL_LANG_POSITION
}) {
  const val = useResources({
    resources: resources || [],
    resourceLinks,
    defaultResourceLinks,
    onResourceLinks,
    onAddResourceLink,
    reference,
    config,
    onResources,
    ORIGINAL_LANG_POSITION
  });

  return (
    <ResourcesContext.Provider value={val}>
      {children}
    </ResourcesContext.Provider>
  );
}

ResourcesContextProvider.propTypes = {
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

export default ResourcesContextProvider;
