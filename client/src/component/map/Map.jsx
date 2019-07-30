// http://jsplumb.github.io/jsplumb/types.html#connection-type
import React, { PropTypes, memo, connect } from '@coderich/hotrod/react';
import { Grid } from '@material-ui/core';
import { jsPlumb } from 'jsplumb';
import Room from './Room';

const viewport = {
  flexWrap: 'nowrap',
};

const Component = memo((props) => {
  const { maps } = props;

  const now = new Date().getTime();
  const containerId = `container-${now}`;

  const getInfo = (row, col, exit) => {
    switch (exit) {
      case 'n': return { target: `room-${row - 1}-${col}-${now}`, anchors: ['Top', 'Bottom'] };
      case 's': return { target: `room-${row + 1}-${col}-${now}`, anchors: ['Bottom', 'Top'] };
      case 'e': return { target: `room-${row}-${col + 1}-${now}`, anchors: ['Right', 'Left'] };
      case 'w': return { target: `room-${row}-${col - 1}-${now}`, anchors: ['Left', 'Right'] };
      case 'ne': return { target: `room-${row - 1}-${col + 1}-${now}`, anchors: ['TopRight', 'BottomLeft'] };
      case 'nw': return { target: `room-${row - 1}-${col - 1}-${now}`, anchors: ['TopLeft', 'BottomRight'] };
      case 'se': return { target: `room-${row + 1}-${col + 1}-${now}`, anchors: ['BottomRight', 'TopLeft'] };
      case 'sw': return { target: `room-${row + 1}-${col - 1}-${now}`, anchors: ['BottomLeft', 'TopRight'] };
      default: return { target: `room-${row}-${col}-${now}` };
    }
  };

  setTimeout(() => {
    jsPlumb.ready(() => {
      jsPlumb.reset();
      jsPlumb.setContainer(containerId);

      jsPlumb.registerConnectionTypes({
        basic: {
          paintStyle: { stroke: 'black', strokeWidth: 3 },
        },
      });

      maps.minimap.forEach((arr, row) => {
        arr.forEach((data, col) => {
          if (data) {
            const { exits } = data;
            const source = `room-${row}-${col}-${now}`;

            exits.forEach((exit) => {
              const endpoint = 'Blank';
              const connector = 'Straight';
              const { target, anchors } = getInfo(row, col, exit);
              jsPlumb.connect({
                source,
                target,
                anchors,
                endpoint,
                connector,
                type: 'basic',
              });
            });
          }
        });
      });
    });
  });


  let me;
  maps.minimap.forEach((arr, row) => {
    arr.forEach((data, col) => {
      if (data && data.me) me = data;
    });
  });
  const xOffset = (20 * me.col * 2);
  const yOffset = (20 * me.row * 2) - 12;
  const backgroundPosition = `calc(50% - ${xOffset}px) calc(50% - ${yOffset}px)`;

  return (
    <div id={containerId} className="map" style={{ alignSelf: 'center', backgroundPosition }}>
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
