import React, { PropTypes, memo, connect } from '@coderich/hotrod/react';
import { Grid, Chip, Avatar } from '@material-ui/core';
import PlayerInput from './PlayerInput';
import Progress from './Progress';

const RoomHUD = memo((props) => {
  const { room } = props;

  return (
    <Grid container>
      <Grid item container direction="column" spacing={1} xs>
        <Grid item>
          <Grid item>{room.name}</Grid>
        </Grid>
        <Grid item>
          <Grid item>{room.description}</Grid>
        </Grid>
        <Grid item>
          <Grid item>{room.description}</Grid>
        </Grid>
        <Grid item>
          <Grid item>{room.description}</Grid>
        </Grid>
        <Grid item>
          <Grid item>{room.description}</Grid>
        </Grid>
        <Grid item>
          <Grid item>{room.description}</Grid>
        </Grid>
      </Grid>
    </Grid>
  );
});

export default connect({
  selectors: {
    room: 'room',
  },
})(RoomHUD);

RoomHUD.propTypes = {
  room: PropTypes.instanceOf(Object).isRequired,
};
