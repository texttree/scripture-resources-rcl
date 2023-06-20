import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, IconButton, Tooltip,
} from '@material-ui/core';

function ParallelTitles({
  actions,
  buttons,
}) {
  const classes = useStyles();
  const _actions = actions.map(({
    icon, tooltip, onClick, menu,
  }, index) => {
    const button = (
      <Tooltip title={tooltip} arrow >
        <IconButton
          aria-label={tooltip}
          onClick={onClick}
          className={classes.action}
          size='small'
        >
          {icon}
        </IconButton>
      </Tooltip>
    );
    return (
      <span key={index}>
        {button}
        {menu}
      </span>
    );
  });

  return (
    <Grid
      container
      direction="row"
      justifyContent="flex-end"
      alignItems="center"
      className={classes.root}
    >
      {_actions}
      {buttons}
    </Grid>
  );
};

ParallelTitles.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.element.isRequired,
      tooltip: PropTypes.string.isRequired,
      onClick: PropTypes.func,
    }).isRequired,
  ),
  buttons: PropTypes.any,
};

const useStyles = makeStyles(() => ({
  root: {},
  action: { padding: '8px' },
}));

export default ParallelTitles;
