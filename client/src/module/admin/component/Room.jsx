import React, { PropTypes, memo, connect } from '@coderich/hotrod/react';

const style = {
  width: '20px',
  height: '20px',
  border: '1px solid white',
  // backgroundColor: 'white',
};

const Component = memo((props) => {
  const { data, addRoomPath } = props;

  const handlers = {
    onClick: () => {
      console.log(data);
    },
    onDragStart: (e) => {
      e.dataTransfer.setData('room', JSON.stringify(data));
    },
    onDragOver: (e) => {
      e.preventDefault();
    },
    onDrop: (e) => {
      e.preventDefault();
      const from = JSON.parse(e.dataTransfer.getData('room'));
      if (from.id !== data.id) addRoomPath({ from, to: data });
    },
  };

  return (
    <div style={style} {...handlers} draggable />
  );
});

export default connect({
  actions: {
    addRoomPath: 'addRoomPath',
  },
})(Component);

Component.propTypes = {
  data: PropTypes.instanceOf(Object).isRequired,
  addRoomPath: PropTypes.func.isRequired,
};
