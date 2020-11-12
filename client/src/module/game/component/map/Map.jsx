// http://jsplumb.github.io/jsplumb/types.html#connection-type
import React, { PropTypes, memo, connect } from '@coderich/hotrod/react';
import { Grid } from '@material-ui/core';
import { draw } from '../../../../service/MinimapService';
import Room from './Room';

const viewport = {
  flexWrap: 'nowrap',
};

const Component = memo((props) => {
  const { maps } = props;
  const now = new Date().getTime();
  const containerId = `container-${now}`;

  global.requestAnimationFrame(() => draw(maps, now));
  global.window.onresize = () => draw(maps, now);

  // let me = { row: 0, col: 0 };

  // maps.minimap.forEach((arr, row) => {
  //   arr.forEach((data, col) => {
  //     if (data && data.me) me = data;
  //   });
  // });

  // const xOffset = (20 * me.col * 2) + 10;
  // const yOffset = (20 * me.row * 2);
  // const backgroundPosition = `calc(50% - ${xOffset}px) calc(50% - ${yOffset}px)`;

  return (
    <div id={containerId} className="map" style={{ alignSelf: 'center' }}>
      {maps.minimap.map((arr, row) => {
        const rowId = `container-${row}-${now}`;

        return (
          <Grid container style={viewport} key={rowId}>
            {arr.map((data, col) => {
              const roomId = `room-${row}-${col}-${now}`;

              return (
                <Room id={roomId} data={data} key={roomId} />
              );
            })}
          </Grid>
        );
      })}
    </div>
  );
});

export default connect({
  selectors: {
    maps: 'maps',
  },
})(Component);

Component.propTypes = {
  maps: PropTypes.instanceOf(Object).isRequired,
};
