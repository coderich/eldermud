import React, { PropTypes, memo, useState } from '@coderich/hotrod/react';
import { Grid, Box } from '@material-ui/core';

const style = {
  fontSize: '18px',
  width: '100%',
  color: 'transparent',
  textShadow: '0 0 0 #ffffff',
  border: 0,
  outline: 'none',
  backgroundColor: 'inherit',
  pointerEvents: 'none',
};

const Input = memo((props) => {
  const { onSubmit, prompt } = props;
  const [value, setValue] = useState('');
  const history = [];

  const handleSubmit = (e) => {
    e.preventDefault();
    history.push(value);
    onSubmit(value);
    setValue('');
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const onBlur = (e) => {
    e.target.focus();
  };

  return (
    <Box p={1}>
      <form style={style} onSubmit={handleSubmit}>
        <Grid container>
          <Grid item>
            <span>{prompt}</span>
            <span>&nbsp;</span>
          </Grid>
          <Grid item style={{ flexGrow: 1 }}>
            <input autoFocus onBlur={onBlur} value={value} onChange={handleChange} style={style} />
          </Grid>
        </Grid>
      </form>
    </Box>
  );
});

export default Input;

Input.propTypes = {
  prompt: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
