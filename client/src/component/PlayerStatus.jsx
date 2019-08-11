import React, { PropTypes, memo, connect } from '@coderich/hotrod/react';
import { Grid } from '@material-ui/core';
import PlayerInput from './PlayerInput';
import Progress from './Progress';

const PlayerStatus = memo((props) => {
  const { stats, status } = props;

  const pctHP = Math.round((status.hp / status.mhp) * 100);
  const pctMA = Math.round((status.ma / status.mma) * 100);

  return (
    <Grid container>
      {/*<Grid item container direction="column" xs={2}>
        <Grid item>{stats.name}</Grid>
        <Grid item>Str</Grid>
        <Grid item>Int</Grid>
        <Grid item>Agi</Grid>
      </Grid>
      <Grid item container direction="column" xs={1}>
        <Grid item>&nbsp;</Grid>
        <Grid item>Str</Grid>
        <Grid item>Int</Grid>
        <Grid item>Agi</Grid>
      </Grid>*/}
      <Grid item container direction="column" spacing={1} xs>
        <Grid item>
          <PlayerInput />
        </Grid>
        <Grid item>
          <Progress val={status.hp} max={status.mhp} height={20} backgroundColor={pctHP < 33 ? 'red' : (pctHP < 66 ? 'yellow' : 'limegreen')} />
        </Grid>
        <Grid item>
          <Progress val={status.ma} max={status.mma} height={20} backgroundColor="#6876f7" />
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
})(PlayerStatus);

PlayerStatus.propTypes = {
  stats: PropTypes.instanceOf(Object).isRequired,
  status: PropTypes.instanceOf(Object).isRequired,
};
