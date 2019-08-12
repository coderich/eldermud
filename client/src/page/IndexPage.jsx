import React, { memo, connect } from '@coderich/hotrod/react';
import { Grid } from '@material-ui/core';
import Terminal from '../component/terminal/Terminal';
import MapView from '../component/map/Map';
import RoomHUD from '../component/RoomHUD';
import PlayerStatus from '../component/PlayerStatus';

const mapSize = '320px';

const bubble = {
  padding: 10,
  backgroundColor: 'rgba(0,0,0,.8)',
  maxHeight: '100%',
  border: '1px dashed #1C6EA4',
  borderRadius: '40px',
};

const IndexPage = memo((props) => {
  return (
    <Grid className="canvas" container>
      <Grid className="canvas" container item direction="column" style={{ width: mapSize }}>
        <Grid container item xs style={{ height: '100%', overflowY: 'auto', ...bubble }}>
          <RoomHUD />
        </Grid>
        <Grid item style={bubble}>
          <MapView />
        </Grid>
      </Grid>
      <Grid className="canvas" container item xs>
        <Grid className="canvas" container item xs={7} style={bubble}>
          <Grid className="canvas" container item direction="column" spacing={1}>
            <Grid className="canvas" item xs>
              <Terminal />
            </Grid>
            <Grid item>
              <PlayerStatus />
            </Grid>
          </Grid>
        </Grid>
        <Grid className="canvas" container item xs={5} style={bubble}>
        </Grid>
      </Grid>
    </Grid>
  );
});

export default connect()(IndexPage);
