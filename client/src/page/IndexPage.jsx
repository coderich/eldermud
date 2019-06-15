import React, { PropTypes, memo, useState, connect } from '@coderich/hotrod/react';
import { TextField } from '@material-ui/core';

const IndexPage = memo((props) => {
  const { command } = props;
  const [value, setValue] = useState('');

  const submit = (e) => {
    e.preventDefault();
    command(value);
    setValue('');
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <form onSubmit={submit}>
      <TextField
        id="outlined-full-width"
        value={value}
        onChange={handleChange}
        autoComplete="off"
        label="Label"
        style={{ margin: 8 }}
        placeholder="Placeholder"
        helperText="Enter command"
        fullWidth
        margin="normal"
        variant="outlined"
        InputLabelProps={{ shrink: true }}
      />
    </form>
  );
});

export default connect({
  actions: {
    command: 'command',
  },
})(IndexPage);

IndexPage.propTypes = {
  command: PropTypes.func.isRequired,
};
