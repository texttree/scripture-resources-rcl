import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Badge,
  Popover,
  Typography,
} from '@material-ui/core';

function UnsupportedObject({ verseObject }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const content = verseObject.content || verseObject.text;

  return (
    <>
      <Badge
        className={classes.badge}
        badgeContent={verseObject.tag}
        variant="standard"
        overlap="rectangular"
        color="error"
        aria-describedby={id}
        onClick={handleClick}
      >
        <span>&nbsp;</span>
      </Badge>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Typography className={classes.footnote}>
          {content}
        </Typography>
      </Popover>
    </>
  );
};

UnsupportedObject.propTypes = {
  verseObject: PropTypes.shape({
    tag: PropTypes.string.isRequired,
    content: PropTypes.string,
    text: PropTypes.string,
  }).isRequired,
};

const useStyles = makeStyles(theme => ({
  footnote: { padding: theme.spacing(2) },
  badge: { margin: theme.spacing(2) },
}));

export default UnsupportedObject;
