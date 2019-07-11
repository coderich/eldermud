import React, { PropTypes, memo } from '@coderich/hotrod/react';

const style = {
  width: 25,
  height: 25,
  margin: 20,
  backgroundColor: 'grey',
};

const Component = memo((props) => {
  const { id, data } = props;

  return (
    <div style={{ opacity: data }}>
      <div id={id} style={style} />
    </div>
  );
});

export default Component;

Component.propTypes = {
  id: PropTypes.string.isRequired,
  // data: PropTypes.instanceOf(Object).isRequired,
};
