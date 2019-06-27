import React, { PropTypes, memo, useState, useRef, connect } from '@coderich/hotrod/react';
import { Grid } from '@material-ui/core';
import Input from './Input';

const container = {
  flexWrap: 'nowrap',
  width: '100%',
  height: '100%',
  backgroundColor: 'black',
};

const screen = {
  flexGrow: 1,
  flexWrap: 'nowrap',
  padding: '10px',
  width: '100%',
  height: '100%',
  color: 'white',
  overflowY: 'scroll',
  backgroundColor: '#36454f',
};

const Terminal = memo((props) => {
  const output = useRef();
  const { command } = props;
  const [lines, setLines] = useState([]);

  const onSubmit = (value) => {
    command(value);
    setLines([...lines.concat(value)]);
    setTimeout(() => output.current.scrollTo(0, output.current.scrollHeight));
  };

  return (
    <Grid container direction="column" style={container}>
      <Grid id="idk" item container direction="column" style={screen} ref={output}>
        {lines.map((line, i) => (
          i === 0 ? <Grid item key={i} style={{ marginTop: 'auto' }}>{line}</Grid> : <Grid item key={i}>{line}</Grid>
        ))}
      </Grid>
      <Grid item>
        <Input prompt=">" onSubmit={onSubmit} />
      </Grid>
    </Grid>
  );
});

export default connect({
  actions: {
    command: 'command',
  },
})(Terminal);

Terminal.propTypes = {
  command: PropTypes.func.isRequired,
};
