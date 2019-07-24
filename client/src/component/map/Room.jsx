import React, { PropTypes, memo } from '@coderich/hotrod/react';

const style = {
  width: 20,
  height: 20,
  margin: 10,
};

const Component = memo((props) => {
  const { id, data } = props;

  return (
    <div style={{ opacity: data }}>
      <div id={id} style={{ ...style, backgroundColor: data.me ? 'limegreen' : 'grey' }} />
    </div>
  );
});

export default Component;

Component.propTypes = {
  id: PropTypes.string.isRequired,
  data: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.instanceOf(Object),
  ]).isRequired,
};
