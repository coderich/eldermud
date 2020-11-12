import React, { PropTypes, memo } from '@coderich/hotrod/react';
import { hexagon } from '../../../../service/SVGService';

const style = { stroke: 'red', width: 20, height: 20, margin: 10 };

const Component = memo((props) => {
  const { id, data } = props;

  return (
    <div id={id} style={{ ...style, opacity: data, fill: data.me ? 'green' : 'transparent' }} dangerouslySetInnerHTML={{ __html: hexagon }} />
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
