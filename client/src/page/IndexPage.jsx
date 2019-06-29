import React, { PropTypes, memo, connect } from '@coderich/hotrod/react';
import { Container } from '@material-ui/core';
import Terminal from '../component/terminal/Terminal';

const IndexPage = memo((props) => {
  return (
    <Container maxWidth="md" style={{ height: '100vh' }}>
      <Terminal />
    </Container>
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
