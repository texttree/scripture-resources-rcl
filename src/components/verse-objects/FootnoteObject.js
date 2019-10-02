import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import {
  Badge,
  Popover,
  Typography,
} from '@material-ui/core';

function FootnoteObject ({
  verseObject,
}) {
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

  return (
    <>
      <Badge
        className={classes.badge}
        badgeContent="fn"
        color="primary"
        aria-describedby={id}
        variant="standard"
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
  footnote: {
    padding: theme.spacing(2),
  },
  badge: {
    margin: theme.spacing(1),
  },
}));

export default FootnoteObject;