import React, { PropTypes, memo, connect } from '@coderich/hotrod/react';
import { Typography, Grid, Paper, Toolbar, Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';

const toolbar = {
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
};

const RoomHUD = memo((props) => {
  const { room } = props;

  return (
    <Grid container direction="column" spacing={1}>
      <Grid item>{room.name}</Grid>
      <Grid item>
        <Paper style={{ overflowX: 'auto' }}>
          <Toolbar style={toolbar}>
            <Typography variant="h6">Helfgrims Blades</Typography>
            <Typography variant="caption">Weapon Shop</Typography>
          </Toolbar>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Req Stats</TableCell>
                <TableCell>Cost</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>dagger</TableCell>
                <TableCell>S1, A3, I1</TableCell>
                <TableCell>30</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>shortsword</TableCell>
                <TableCell>S1, A1, I1</TableCell>
                <TableCell>10000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>ebony greataxe</TableCell>
                <TableCell>S10, A5, I3</TableCell>
                <TableCell>100000</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Grid>
      <Grid item>
        <Paper style={{ overflowX: 'auto' }}>
          <Toolbar style={toolbar}>
            <Typography variant="h6">Trainer Thuluk</Typography>
            <Typography variant="caption">Level 5 Trainer</Typography>
          </Toolbar>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Talent</TableCell>
                <TableCell>Req Stats</TableCell>
                <TableCell>Cost</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>mend</TableCell>
                <TableCell>S1, A1, I3</TableCell>
                <TableCell>30</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>stab</TableCell>
                <TableCell>S1, A3, I1</TableCell>
                <TableCell>10000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>rage</TableCell>
                <TableCell>S5, A3, I3</TableCell>
                <TableCell>10000</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
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
