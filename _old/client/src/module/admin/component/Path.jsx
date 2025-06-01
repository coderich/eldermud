import React, { PropTypes, memo, connect } from '@coderich/hotrod/react';

const style = {
  stroke: 'rgb(255,0,0)',
  strokeWidth: 2,
  position: 'absolute',
};

const Component = memo((props) => {
  const { data } = props;

  return (
    <svg width="0" height="0">
      <g>
        <path d={`M ${data.x1} ${data.y1}`} />
        <line style={style} x1="0" y1="0" x2="20" y2="20" stroke="red" />
      </g>
    </svg>
  );
});

export default connect({
})(Component);

Component.propTypes = {
  data: PropTypes.instanceOf(Object).isRequired,
};
