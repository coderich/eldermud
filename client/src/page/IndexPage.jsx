import React, { memo, connect } from '@coderich/hotrod/react';
import { Grid } from '@material-ui/core';
import Terminal from '../component/terminal/Terminal';
import MapView from '../component/map/Map';

const mapSize = '320px';

const style = {
  color: 'white',
  padding: 10,
  backgroundColor: 'rgba(0,0,0,.8)',
  maxHeight: '100%',
  overflow: 'hidden',
  border: '10px double #1C6EA4',
  borderRadius: '40px',
};

const IndexPage = memo((props) => {
  return (
    <Grid container style={{ height: '100vh' }}>
      <Grid item container style={{ width: mapSize }} direction="column" justify="flex-end">
        <Grid item container style={style} xs alignContent="flex-start" spacing={2}>
          <Grid item xs={12}>Name:</Grid>
          <Grid item xs={4}>Str:</Grid>
          <Grid item xs={4}>Agi:</Grid>
          <Grid item xs={4}>Int:</Grid>

        </Grid>
        <Grid item style={{ height: mapSize, ...style }}>
          <MapView />
        </Grid>
      </Grid>
      <Grid item container xs style={{ maxHeight: '100vh' }}>
        <Grid item xs={7} style={style}>
          <Terminal />
        </Grid>
        <Grid item xs={5} style={style} />
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
