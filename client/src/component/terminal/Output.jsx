import React, { PropTypes, useRef, useImperativeHandle, forwardRef } from '@coderich/hotrod/react';
import { Box, Grid } from '@material-ui/core';

const style = {
  width: '100%',
  height: '100%',
  color: 'white',
  overflowY: 'auto',
  // backgroundColor: '#36454f',
};

const Output = (props, ref) => {
  const screen = useRef();
  const { lines } = props;

  useImperativeHandle(ref, () => ({
    scrollToBottom: () => {
      screen.current.scrollTo(0, screen.current.scrollHeight);
    },
  }));

  return (
    <Box style={style} ref={screen}>
      {lines.reverse().map((line, i) => (
        <Grid item key={i} style={{ overflow: 'hidden' }}>{line}</Grid>
      ))}
    </Box>
  );
};

export default forwardRef(Output);

Output.propTypes = {
  lines: PropTypes.instanceOf(Array).isRequired,
};
