import React, { PropTypes, memo, connect } from '@coderich/hotrod/react';
import { Grid, Avatar } from '@material-ui/core';
import PlayerInput from './PlayerInput';
import Progress from './Progress';

const avatarWidth = '120px';

const avatar = {
  width: avatarWidth,
  backgroundColor: 'grey',
};

const talent = {
  width: '65px',
  height: '65px',
  backgroundColor: 'grey',
  border: '1px solid white',
};

const inv = {
  height: '50px',
  backgroundColor: 'grey',
  border: '1px solid white',
};

const PlayerView = memo((props) => {
  const { stats, status } = props;
  const pctHP = Math.round((status.hp / status.mhp) * 100);
  const pctMA = Math.round((status.ma / status.mma) * 100);

  return (
    <Grid container direction="column" spacing={1}>
      <Grid container item>
        <Grid item>{stats.name}:</Grid>
        <Grid item xs><PlayerInput /></Grid>
      </Grid>
      <Grid container item justify="space-between">
        <Grid container item style={avatar} />
        <Grid item style={{ padding: 10 }} xs>
          <Grid container item direction="column" spacing={2}>
            <Grid container item justify="space-around">
              <Grid item style={talent}>A</Grid>
              <Grid item style={talent}>B</Grid>
              <Grid item style={talent}>C</Grid>
              <Grid item style={talent}>D</Grid>
            </Grid>
            <Grid container item spacing={1}>
              <Grid item xs={12}>
                <Progress pct={pctHP} label={`${status.hp} / ${status.mhp}`} height={20} backgroundColor={pctHP < 33 ? 'red' : (pctHP < 66 ? 'orange' : 'limegreen')} />
              </Grid>
              <Grid item xs={12}>
                <Progress pct={pctMA} label={`${status.ma} / ${status.mma}`} height={20} backgroundColor="#6876f7" />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container item direction="column" style={{ width: '160px' }}>
            <Grid container item>
              <Grid item xs={4} style={inv}>A</Grid>
              <Grid item xs={4} style={inv}>B</Grid>
              <Grid item xs={4} style={inv}>C</Grid>
              <Grid item xs={4} style={inv}>D</Grid>
              <Grid item xs={4} style={inv}>E</Grid>
              <Grid item xs={4} style={inv}>F</Grid>
              <Grid item xs={4} style={inv}>1</Grid>
              <Grid item xs={4} style={inv}>2</Grid>
              <Grid item xs={4} style={inv}>3</Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
});

export default connect({
  selectors: {
    stats: 'stats',
    status: 'status',
  },
})(PlayerView);

PlayerView.propTypes = {
  stats: PropTypes.instanceOf(Object).isRequired,
  status: PropTypes.instanceOf(Object).isRequired,
};
