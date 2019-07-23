import React, { memo, connect } from '@coderich/hotrod/react';
import { Grid } from '@material-ui/core';
import Terminal from '../component/terminal/Terminal';
import MapView from '../component/map/Map';

const style = {
  color: 'white',
  padding: 10,
  backgroundColor: 'black',
};

const border = {
  border: '10px double #1C6EA4',
  borderRadius: '40px',
};

const IndexPage = memo((props) => {
  return (
    <Grid container>
      <Grid item xs={2} container style={{ ...style, ...border, height: '100vh' }} direction="column" alignContent="center" justify="flex-end">
        <Grid item>
          <MapView id="container1" />
        </Grid>
      </Grid>
      <Grid item xs={6} style={{ ...style, ...border, height: '100vh' }}>
        <Terminal />
      </Grid>
      <Grid item xs={4} style={{ ...style, ...border, height: '100vh' }}>
      </Grid>
    </Grid>
  );
});

export default connect({
  actions: {
    command: 'command',
  },
})(IndexPage);

// IndexPage.propTypes = {
//   command: PropTypes.func.isRequired,
// };
