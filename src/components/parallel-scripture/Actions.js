import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import {Grid, IconButton} from '@material-ui/core';

function ParallelTitles ({
  actions,
}) {
  const classes = useStyles();
  const _actions = actions.map(({icon, tooltip, onClick, menu}, index) => {
    const button = (
      <IconButton
        aria-label={tooltip}
        onClick={onClick}
        className={classes.action}
        size='small'
      >
        {icon}
      </IconButton>
    );
    return (
      <span key={index}>
        {button}
        {menu}
      </span>
    )
  });

  return (
    <Grid
      container
      direction="row"
      justify="flex-end"
      alignItems="center"
      className={classes.root}
    >
      {_actions}
    </Grid>
  )
};

ParallelTitles.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({  
      icon: PropTypes.element.isRequired,
      tooltip: PropTypes.string.isRequired,
      onClick: PropTypes.func,
    }).isRequired,
  ),
};

const useStyles = makeStyles(theme => ({
  root: {
  },
  action: {
  },
}));

export default ParallelTitles;