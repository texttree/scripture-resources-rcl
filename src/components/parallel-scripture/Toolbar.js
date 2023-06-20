import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';

import { Actions } from '..';

function Toolbar({
  title,
  actions,
  buttons,
}) {
  const classes = useStyles();
  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      className={classes.root}
    >
      <Grid item>
        <Typography variant='h6' className={classes.title}>
          {title}
        </Typography>
      </Grid>
      <Grid item>
        <Actions actions={actions} buttons={buttons} />
      </Grid>
    </Grid>
  );
};

Toolbar.propTypes = {
  title: PropTypes.string.isRequired,
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
  root: {
    padding: `0`,
    background: '#fff',
  },
  title: {},
}));

export default Toolbar;
