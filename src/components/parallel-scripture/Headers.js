import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  TableHead,
  TableRow,
  TableCell,
} from '@material-ui/core';

function Headers({ columns }) {
  const classes = useStyles();
  const _titles = columns.filter(col => !col.hidden).map(column => (
    <TableCell
      key={column.id}
      align={column.align}
      className={classes.cell}
    >
      {column.label}
    </TableCell>
  ));

  return (
    <TableHead className={classes.root}>
      <TableRow>
        {_titles}
      </TableRow>
    </TableHead>
  );
};

Headers.propTypes = { columns: PropTypes.array.isRequired };

const useStyles = makeStyles(theme => ({
  root: {},
  cell: {
    position: 'sticky',
    top: '0px',
    padding: 0,
    paddingLeft: theme.spacing(1),
    backgroundColor: '#fff',
    minWidth: '15rem',
  },
}));

export default Headers;