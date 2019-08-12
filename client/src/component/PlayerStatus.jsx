import React, { PropTypes, memo, connect } from '@coderich/hotrod/react';
import { Grid, Chip, Avatar } from '@material-ui/core';
import { CheckCircleOutline } from '@material-ui/icons';
import PlayerInput from './PlayerInput';
import Progress from './Progress';

const PlayerStatus = memo((props) => {
  const { stats, status } = props;
  const pctHP = Math.round((status.hp / status.mhp) * 100);
  const pctMA = Math.round((status.ma / status.mma) * 100);

  return (
    <Grid container>
      <Grid item container direction="column" spacing={1} xs>
        <Grid item container>
          <Grid item>{stats.name } (lvl {stats.lvl}) [{status.exp}/{status.tnl}]:</Grid>
          <Grid item style={{ flexGrow: 1 }}><PlayerInput /></Grid>
        </Grid>
        <Grid item>
          <Progress pct={pctHP} label={`${status.hp} / ${status.mhp}`} height={20} backgroundColor={pctHP < 33 ? 'red' : (pctHP < 66 ? 'orange' : 'limegreen')} />
        </Grid>
        <Grid item>
          <Progress pct={pctMA} label={`${status.ma} / ${status.mma}`} height={20} backgroundColor="#6876f7" />
        </Grid>
        <Grid item container spacing={1}>
          {Object.entries(status.cooldowns).map(([talent, time]) => {
            if (!time) {
              return (
                <Grid item key={talent}>
                  <Chip avatar={<Avatar><CheckCircleOutline /></Avatar>} label={talent} size="small" variant="outlined" color="secondary" />
                </Grid>
              );
            }

            return (
              <Grid item key={talent}>
                <Chip avatar={<Avatar>{time}</Avatar>} label={talent} size="small" />
              </Grid>
            );
          })}
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
