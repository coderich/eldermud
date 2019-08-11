import React, { PropTypes, memo, useState, connect } from '@coderich/hotrod/react';
import { Grid } from '@material-ui/core';

const style = {
  width: '100%',
  border: 0,
  color: 'transparent',
  textShadow: '0 0 0 #ffffff',
  outline: 'none',
  fontSize: 'inherit',
  backgroundColor: 'inherit',
  pointerEvents: 'none',
};

const Input = memo((props) => {
  const { command } = props;
  const [value, setValue] = useState('');
  const history = [];

  const handleSubmit = (e) => {
    e.preventDefault();
    history.push(value);
    command(value);
    setValue('');
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const onBlur = (e) => {
    e.target.focus();
  };

  return (
    <form style={style} onSubmit={handleSubmit}>
      <Grid container>
        <Grid item>
          <span>#&gt;</span>
        </Grid>
        <Grid item style={{ flexGrow: 1 }}>
          <input autoFocus onBlur={onBlur} value={value} onChange={handleChange} style={style} />
        </Grid>
      </Grid>
    </form>
  );
});

export default connect({
  actions: {
    command: 'command',
  },
})(Input);

Input.propTypes = {
  command: PropTypes.func.isRequired,
};
