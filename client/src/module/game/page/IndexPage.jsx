import React, { PropTypes, memo, connect } from '@coderich/hotrod/react';
import { Grid } from '@material-ui/core';
import Terminal from '../component/terminal/Terminal';
import RoomHUD from '../component/RoomHUD';
import PlayerHUD from '../component/PlayerHUD';
import PlayerStatus from '../component/PlayerStatus';

const mapSize = '320px';

const bubble = {
  backgroundColor: 'rgba(0,0,0,.8)',
  maxHeight: '100%',
  border: '1px dashed #1C6EA4',
  borderRadius: '40px',
  padding: 10,
};

const IndexPage = memo((props) => {
  const { theme, connected } = props;
  const { lightgray } = theme.colors;

  if (!connected) return '';

  return (
    <Grid className="canvas" container>
      <Grid className="canvas" container item direction="column" style={{ width: mapSize }}>
        <Grid container item xs style={{ height: '100%', overflowY: 'auto', ...bubble }}>
          <RoomHUD />
        </Grid>
      </Grid>
      <Grid className="canvas" container item xs>
        <Grid className="canvas" container item xs={7} style={bubble}>
          <Grid className="canvas" container item direction="column" spacing={1} style={{ padding: 10 }}>
            <Grid className="canvas" item xs>
              <Terminal />
            </Grid>
            <Grid item><hr style={{ border: `1px solid ${lightgray}` }} /></Grid>
            <Grid item>
              <PlayerStatus />
            </Grid>
          </Grid>
        </Grid>
        <Grid className="canvas" container item xs={5} style={bubble}>
          <PlayerHUD />
        </Grid>
      </Grid>
    </Grid>
  );
});

export default connect({
  selectors: {
    connected: 'connected',
    theme: 'theme',
  },
})(IndexPage);

IndexPage.propTypes = {
  connected: PropTypes.bool.isRequired,
  theme: PropTypes.instanceOf(Object).isRequired,
};
