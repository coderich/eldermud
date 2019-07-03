import React, { memo, connect } from '@coderich/hotrod/react';
import { Container, Grid } from '@material-ui/core';
import Terminal from '../component/terminal/Terminal';

const style = {
  color: 'white',
  backgroundColor: 'black',
};

const border = {
  border: '10px double #1C6EA4',
  borderRadius: '40px',
};

const IndexPage = memo((props) => {
  return (
    <Container maxWidth="md" style={{ paddingTop: '15px' }}>
      <div style={{ ...style, height: '80vh' }}>
        <Terminal />
      </div>
      <Grid container style={{ marginTop: '15px' }}>
        <Grid item style={{ ...style, flexGrow: 1, padding: '10px' }}>
          <div>NAVIGATION:</div>
          <Grid container>
            <Grid item style={{ flexGrow: 1 }}>
              <div>(u) up</div>
              <div>(n) north</div>
              <div>(s) south</div>
              <div>(e) east</div>
              <div>(w) west</div>
            </Grid>
            <Grid item style={{ flexGrow: 1 }}>
              <div>(d) down</div>
              <div>(ne) northeast</div>
              <div>(nw) northwest</div>
              <div>(se) southeast</div>
              <div>(sw) southwest</div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item style={{ ...style, flexGrow: 1, padding: '10px' }}>
          <div>ACTIONS:</div>
          <Grid container>
            <Grid item style={{ flexGrow: 1 }}>
              <div>(g) get {'<item>'}</div>
              <div>(dr) drop {'<item>'}</div>
              <div>(i) inventory</div>
              <div>(l) look</div>
            </Grid>
            <Grid item style={{ flexGrow: 1 }}>
              <div>(op) open {'<direction>'}</div>
              <div>(cl) close {'<direction>'}</div>
              <div>(use) use {'<item>'}</div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
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
