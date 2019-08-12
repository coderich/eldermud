import React, { PropTypes, memo, connect } from '@coderich/hotrod/react';
import { Grid } from '@material-ui/core';
import PlayerInput from './PlayerInput';
import Progress from './Progress';

const PlayerStatus = memo((props) => {
  const { status } = props;
  const pctHP = Math.round((status.hp / status.mhp) * 100);
  // const pctMA = Math.round((status.ma / status.mma) * 100);

  return (
    <Grid container>
      <Grid item container direction="column" spacing={1} xs>
        <Grid item container>
          <Grid item>${status.exp}:</Grid>
          <Grid item style={{ flexGrow: 1 }}><PlayerInput /></Grid>
        </Grid>
        <Grid item>
          <Progress val={status.hp} max={status.mhp} height={20} backgroundColor={pctHP < 33 ? 'red' : (pctHP < 66 ? 'orange' : 'limegreen')} />
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
    status: 'status',
  },
})(PlayerStatus);

PlayerStatus.propTypes = {
  status: PropTypes.instanceOf(Object).isRequired,
};
