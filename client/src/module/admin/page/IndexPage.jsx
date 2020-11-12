import React, { PropTypes, memo, connect } from '@coderich/hotrod/react';
import Map from '../component/Map';

const IndexPage = memo((props) => {
  return (
    <div style={{ width: '400px', height: '400px' }}>
      <Map />
    </div>
  );
});

export default connect({
})(IndexPage);

// IndexPage.propTypes = {
//   connected: PropTypes.bool.isRequired,
//   theme: PropTypes.instanceOf(Object).isRequired,
// };
