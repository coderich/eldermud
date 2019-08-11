import React, { memo, connect } from '@coderich/hotrod/react';
import { Grid } from '@material-ui/core';
import Terminal from '../component/terminal/Terminal';
import MapView from '../component/map/Map';
import Player from '../component/Player';
import PlayerInput from '../component/PlayerInput';

const mapSize = '320px';

const style = {
  color: 'white',
  padding: 10,
  backgroundColor: 'rgba(0,0,0,.8)',
  maxHeight: '100%',
  overflow: 'hidden',
  border: '10px double #1C6EA4',
  borderRadius: '40px',
  flexWrap: 'nowrap',
};

const IndexPage = memo((props) => {
  return (
    <Grid container style={{ height: '100vh' }}>
      <Grid item container style={{ width: mapSize }} direction="column" justify="flex-end">
        <Grid item style={style} xs>
          <Player />
        </Grid>
        <Grid item style={{ height: mapSize, ...style }}>
          <MapView />
        </Grid>
      </Grid>
      <Grid item container xs style={{ maxHeight: '100vh' }}>
        <Grid item container xs={7} style={style} direction="column">
          <Grid item xs>
            <Terminal />
          </Grid>
          <Grid item container style={{ flexWrap: 'nowrap' }}>
            <Grid item container direction="column" xs={2}>
              <Grid item>Random</Grid>
              <Grid item xs>Avatar</Grid>
            </Grid>
            <Grid item container direction="column" xs>
              <Grid item>Str</Grid>
              <Grid item>Int</Grid>
              <Grid item>Agi</Grid>
            </Grid>
            <Grid item container direction="column" xs>
              <Grid item>
                <PlayerInput />
              </Grid>
            </Grid>
          </Grid>
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
