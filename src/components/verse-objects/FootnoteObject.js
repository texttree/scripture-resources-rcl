import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Badge,
  Popover,
  Typography,
} from '@material-ui/core';

function FootnoteObject({ verseObject }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Badge
        className={classes.badge}
        badgeContent="fn"
        overlap="rectangular"
        color="primary"
        aria-describedby={id}
        variant="standard"
        onClick={handleOpen}
      >
        <span>&nbsp;</span>
      </Badge>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Typography className={classes.footnote}>
          {verseObject.content}
        </Typography>
      </Popover>
    </>
  );
};

FootnoteObject.propTypes = {
  verseObject: PropTypes.shape({
    tag: PropTypes.string,
    type: PropTypes.string,
    content: PropTypes.string,
  }).isRequired,
};

const useStyles = makeStyles(theme => ({
  footnote: { padding: theme.spacing(1) },
  badge: {
    margin: theme.spacing(1),
    top: theme.spacing(1),
    right: theme.spacing(0.25),
  },
}));

export default FootnoteObject;
