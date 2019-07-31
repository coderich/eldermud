import React, { PropTypes, memo } from '@coderich/hotrod/react';

const style = {
  width: 20,
  height: 20,
  margin: 10,
};

const Component = memo((props) => {
  const { id, data } = props;

  return (
    <div id={id} style={{ ...style, opacity: data }}>
      <svg viewBox="0 0 75 75" width="20px">
        <path d="m5,22 18,-18 28,0 18,18 0,28 -18,18, -28,0 -18,-18z" stroke="black" strokeWidth="0" fill={data.me ? 'red' : 'transparent'} />
      </svg>
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
