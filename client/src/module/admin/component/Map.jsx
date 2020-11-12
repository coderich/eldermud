import React, { PropTypes, memo, connect } from '@coderich/hotrod/react';
import Room from './Room';
import Path from './Path';

const style = {
  width: 'inherit',
  height: 'inherit',
  overflow: 'scroll',
  position: 'relative',
  backgroundColor: 'grey',
};

const Component = memo((props) => {
  const { size, depth, roomPaths } = props;

  return (
    <div style={style}>
      {
        // Rooms
        Array.from(new Array(size)).map((i, row) => {
          return Array.from(new Array(size)).map((j, col) => {
            const x = row * size * 2;
            const y = col * size * 2;
            const id = `${row}-${col}-${depth}`;
            const data = { id, x, y, z: depth, row, col };

            return (
              <div key={id} style={{ position: 'absolute', top: y, left: x }}>
                <Room data={data} />
              </div>
            );
          });
        }).concat(roomPaths.map((path, i) => {
          return (
            <Path data={path} />
          );
        }))
      }
    </div>
  );
});

export default connect({
  selectors: {
    roomPaths: 'roomPaths',
  },
})(Component);

Component.propTypes = {
  size: PropTypes.number,
  depth: PropTypes.number,
  roomPaths: PropTypes.instanceOf(Array).isRequired,
};

Component.defaultProps = {
  size: 20,
  depth: 1,
};
