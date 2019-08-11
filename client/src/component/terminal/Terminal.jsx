import React, { PropTypes, memo, connect } from '@coderich/hotrod/react';
import { Grid } from '@material-ui/core';
import Action from './Action';

const container = {
  fontSize: '16px',
  width: '100%',
  height: '100%',
  flexWrap: 'nowrap',
  overflow: 'hidden',
  color: 'lightgray',
  wordWrap: 'wrap',
};

const Terminal = memo((props) => {
  const { responses } = props;

  return (
    <Grid style={container} container direction="column" justify="flex-end">
      {responses.map((action, i) => (
        <Grid item key={i}>
          <Action action={action} />
        </Grid>
      ))}
    </Grid>
  );
});

export default connect({
  selectors: {
    responses: 'responses',
  },
})(Terminal);

Terminal.propTypes = {
  responses: PropTypes.instanceOf(Array).isRequired,
};
