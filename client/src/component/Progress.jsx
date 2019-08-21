import React, { PropTypes, memo } from '@coderich/hotrod/react';
import { Grid } from '@material-ui/core';

const borderRadius = '0px';

const container = {
  border: '1px solid lightgrey',
  borderRadius,
  position: 'relative',
};

const bar = {
  borderRadius,
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
};

const Progress = memo((props) => {
  const { pct, label, height, backgroundColor } = props;

  return (
    <Grid container justify="center" style={{ width: '100%', height, ...container }}>
      <Grid item style={{ zIndex: 100 }}><strong>{label}</strong></Grid>
      <Grid item style={{ backgroundColor, width: `${pct}%`, ...bar }} />
    </Grid>
  );
});

export default Progress;

Progress.propTypes = {
  pct: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  backgroundColor: PropTypes.string.isRequired,
};
