import React, { PropTypes, memo, connect } from '@coderich/hotrod/react';
import Terminal from '../component/terminal/Terminal';

const IndexPage = memo((props) => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Terminal />
    </div>
  );
});

export default connect({
  actions: {
    command: 'command',
  },
})(IndexPage);

// IndexPage.propTypes = {
//   command: PropTypes.func.isRequired,
// };
