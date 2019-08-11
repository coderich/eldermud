import React, { memo, connect } from '@coderich/hotrod/react';
import { Grid, Chip, Avatar } from '@material-ui/core';
import Terminal from '../component/terminal/Terminal';
import MapView from '../component/map/Map';

const mapSize = '400px';

const style = {
  color: 'white',
  padding: 10,
  backgroundColor: 'rgba(0,0,0,.8)',
  maxHeight: '100%',
  overflow: 'hidden',
  border: '10px double #1C6EA4',
  borderRadius: '40px',
};

const chip = {
  width: '100%',
  justifyContent: 'start',
};

const IndexPage = memo((props) => {
  return (
    <Grid container style={{ height: '100vh' }}>
      <Grid item container xs={3} style={style}>
        (look obj) (st) (things you see)
      </Grid>
      <Grid item container xs={6} direction="column">
        <Grid item style={style} xs>
          <Terminal />
        </Grid>
        <Grid item container style={{ ...style, height: mapSize }}>
          <Grid item>
            <MapView />
          </Grid>
          <Grid item container xs direction="column" justify="flex-end">
            <Grid item container style={{ alignContent: 'flex-start', padding: '0 10px' }} spacing={1}>
              <Grid item xs>
                <Chip style={chip} avatar={<Avatar>3</Avatar>} label="Giant Rat" color="secondary" />
              </Grid>
              <Grid item xs>
                <Chip style={chip} avatar={<Avatar>1</Avatar>} label="Small Rat" color="secondary" />
              </Grid>
              <Grid item xs>
                <Chip style={chip} avatar={<Avatar>1</Avatar>} label="Skeletal Warrior" color="secondary" />
              </Grid>
              <Grid item xs>
                <Chip style={chip} avatar={<Avatar>4</Avatar>} label="Water Bottle" />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item container xs={3} style={style}></Grid>
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
