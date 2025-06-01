import React, { PropTypes, connect, memo } from '@coderich/hotrod/react';
import { Grid } from '@material-ui/core';

const bodyParts = ['head', 'neck', 'chest', 'torso', 'shoulders', 'arms', 'hands', 'waist', 'legs', 'feet'];

const Player = memo((props) => {
  const { stats } = props;
  const weapon = stats.equipped.hand || stats.equipped['two-hand'] || { name: 'fist', dmg: '1d3' };
  const shield = stats.equipped['off-hand'] || stats.equipped['two-hand'] || { name: 'fist', prot: 0 };

  return (
    <Grid container direction="column" justify="space-between" style={{ height: '100%' }}>
      <Grid item container alignContent="flex-start" spacing={1} xs>
        <Grid item xs={12}>{stats.name} (level {stats.lvl})</Grid>
        <Grid item xs={12} />
        <Grid item xs={4}>str: {stats.str}</Grid>
        <Grid item xs={4}>agi: {stats.agi}</Grid>
        <Grid item xs={4}>int: {stats.int}</Grid>
        <Grid item xs={4}>hp: {stats.hp}</Grid>
        <Grid item xs={4}>ac: {stats.ac}</Grid>
        <Grid item xs={4}>ma: {stats.ma}</Grid>
        <Grid item xs={12} />
      </Grid>
      <Grid item>
        <hr style={{ color: 'white' }} />
      </Grid>
      <Grid item container alignContent="flex-start" xs>
        {bodyParts.map((part) => {
          return (
            <React.Fragment key={part}>
              <Grid item xs={5}>{part}</Grid>
              <Grid item xs={5}>{stats.equipped[part] ? stats.equipped[part].name : '<empty>'}</Grid>
              <Grid item xs={2}>{stats.equipped[part] ? `+${stats.equipped[part].prot}` : '-'}</Grid>
            </React.Fragment>
          );
        })}
        <Grid item xs={5}>weapon</Grid>
        <Grid item xs={5}>{weapon.name}</Grid>
        <Grid item xs={2}>{weapon.dmg}</Grid>

        <Grid item xs={5}>off-hand</Grid>
        <Grid item xs={5}>{shield.name}</Grid>
        <Grid item xs={2}>+{shield.prot}</Grid>
      </Grid>
      <Grid item>
        <hr style={{ color: 'white' }} />
      </Grid>
      <Grid item container alignContent="flex-start" xs>
        {stats.talents.map((talent) => {
          return (
            <React.Fragment key={talent}>
              <Grid item xs={5}>{talent}</Grid>
              <Grid item xs={5}>30</Grid>
              <Grid item xs={2}>20</Grid>
            </React.Fragment>
          );
        })}
      </Grid>
    </Grid>
  );
});

export default connect({
  selectors: {
    stats: 'stats',
  },
})(Player);

Player.propTypes = {
  stats: PropTypes.instanceOf(Object).isRequired,
};
