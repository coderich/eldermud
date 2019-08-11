import React, { PropTypes, memo } from '@coderich/hotrod/react';
import { Grid } from '@material-ui/core';

const borderRadius = '40px';

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
  const { val, max, height, backgroundColor } = props;
  const pct = Math.round((val / max) * 100);

  return (
    <Grid container justify="center" style={{ width: '100%', textAlign: 'center', height, ...container }}>
      <Grid item style={{ zIndex: 100 }}><strong>{val} / {max}</strong></Grid>
      <Grid item style={{ backgroundColor, width: `${pct}%`, ...bar }} />
    </Grid>
  );
});

export default Progress;

Progress.propTypes = {
  val: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  backgroundColor: PropTypes.string.isRequired,
};
