import React, { PropTypes, memo, connect } from '@coderich/hotrod/react';
import { Grid, Box } from '@material-ui/core';
import Action from './Action';
import Input from './Input';

const prompt = '>';

const container = {
  fontSize: '16px',
  width: '100%',
  height: '100%',
};

const viewport = {
  flexWrap: 'nowrap',
  width: '100%',
  height: '100%',
};

const screen = {
  flexGrow: 1,
  flexWrap: 'nowrap',
  width: '100%',
  height: '100%',
  color: 'lightgray',
  overflowY: 'hidden',
};

const Terminal = memo((props) => {
  const { command, responses } = props;

  const onSubmit = (value) => {
    command(value);
  };

  return (
    <Box p={1} style={container}>
      <Grid container direction="column" style={viewport}>
        <Grid item container direction="column" justify="flex-end" style={screen}>
          {responses.map((action, i) => (
            <Grid item key={i} style={{ marginBottom: '10px' }}>
              <Action prompt={prompt} action={action} />
            </Grid>
          ))}
        </Grid>
        <Grid item>
          <Input prompt={prompt} onSubmit={onSubmit} />
        </Grid>
      </Grid>
    </Box>
  );
});

export default connect({
  actions: {
    command: 'command',
  },
  selectors: {
    responses: 'responses',
  },
})(Terminal);

Terminal.propTypes = {
  command: PropTypes.func.isRequired,
  responses: PropTypes.instanceOf(Array).isRequired,
};
