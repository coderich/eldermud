import React, { memo } from '@coderich/hotrod/react';
import { Grid, Box } from '@material-ui/core';
import { jsPlumb } from 'jsplumb';
import Room from './Room';

const viewport = {
  flexWrap: 'nowrap',
  width: '100%',
  height: '100%',
};

const map = [
  [0, { 1: ['e', 's'] }, { 1: ['w', 's'] }, 0],
  [0, { 1: ['n', 'e', 'sw'] }, { 2: ['n', 'w', 'se'] }, 0],
  [{ 3: ['ne', 'se'] }, { 4: ['e', 's'] }, { 5: ['w', 's'] }, { 6: ['nw', 'sw', 'u'] }],
  [0, { 7: ['n', 'nw'] }, { 8: ['n', 'ne'] }, 0],
];

const getInfo = (row, col, dir) => {
  switch (dir) {
    case 'n': return { target: `room-${row - 1}-${col}`, anchors: ['Top', 'Bottom'] };
    case 's': return { target: `room-${row + 1}-${col}`, anchors: ['Bottom', 'Top'] };
    case 'e': return { target: `room-${row}-${col + 1}`, anchors: ['Right', 'Left'] };
    case 'w': return { target: `room-${row}-${col - 1}`, anchors: ['Left', 'Right'] };
    case 'ne': return { target: `room-${row - 1}-${col + 1}`, anchors: ['TopRight', 'BottomLeft'] };
    case 'nw': return { target: `room-${row - 1}-${col - 1}`, anchors: ['TopLeft', 'BottomRight'] };
    case 'se': return { target: `room-${row + 1}-${col + 1}`, anchors: ['BottomRight', 'TopLeft'] };
    case 'sw': return { target: `room-${row + 1}-${col - 1}`, anchors: ['BottomLeft', 'TopRight'] };
    default: return { target: `room-${row}-${col}` };
  }
};

const Component = memo((props) => {
  setTimeout(() => {
    jsPlumb.ready(() => {
      jsPlumb.setContainer('container');

      map.forEach((arr, row) => {
        arr.forEach((data, col) => {
          if (data) {
            const [dirs] = Object.values(data);
            const source = `room-${row}-${col}`;

            dirs.forEach((dir) => {
              const {
                target,
                anchors,
                endpoint = 'Blank',
                connector = 'Straight',
              } = getInfo(row, col, dir);
              jsPlumb.connect({ source, target, anchors, endpoint, connector });
            });
          }
        });
      });
    });
  });

  return (
    <div id="container" style={viewport}>
      {map.map((arr, row) => {
        const rowId = `container-${row}`;

        return (
          <Grid container style={viewport} key={rowId}>
            {arr.map((data, col) => {
              const roomId = `room-${row}-${col}`;

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

export default Component;
