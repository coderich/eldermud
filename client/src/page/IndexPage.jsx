import React, { memo } from '@coderich/hotrod/react';
import { TextField } from '@material-ui/core';

const IndexPage = memo((props) => {
  return (
    <TextField
      id="outlined-full-width"
      label="Label"
      style={{ margin: 8 }}
      placeholder="Placeholder"
      helperText="Full width!"
      fullWidth
      margin="normal"
      variant="outlined"
      InputLabelProps={{ shrink: true }}
    />
  );
});

export default IndexPage;
