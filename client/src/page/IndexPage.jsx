import React, { memo, connect } from '@coderich/hotrod/react';
import { Container, Grid } from '@material-ui/core';
import Terminal from '../component/terminal/Terminal';
import MapView from '../component/map/Map';

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
    <Grid container>
      {/*<Grid item xs={3}>
        <Container maxWidth="md" style={{ paddingTop: '15px' }}>
          <MapView />
        </Container>
      </Grid>*/}
      <Grid item xs={12}>
        <Container maxWidth="md" style={{ paddingTop: '15px' }}>
          <div style={{ ...style, height: '80vh' }}>
            <Terminal />
          </div>
          <Grid container style={{ marginTop: '15px' }}>
            <Grid item style={{ ...style, flexGrow: 1, padding: '10px' }}>
              <div>NAVIGATION:</div>
              <Grid container>
                <Grid item style={{ flexGrow: 1 }}>
                  <div>(u) Up</div>
                  <div>(n) North</div>
                  <div>(s) South</div>
                  <div>(e) East</div>
                  <div>(w) West</div>
                </Grid>
                <Grid item style={{ flexGrow: 1 }}>
                  <div>(d) Down</div>
                  <div>(ne) Northeast</div>
                  <div>(nw) Northwest</div>
                  <div>(se) Southeast</div>
                  <div>(sw) Southwest</div>
                </Grid>
              </Grid>
            </Grid>
            <Grid item style={{ ...style, flexGrow: 1, padding: '10px' }}>
              <div>ACTIONS:</div>
              <Grid container>
                <Grid item style={{ flexGrow: 1 }}>
                  <div>(sea) Search</div>
                  <div>(i) Inventory</div>
                  <div>(l) Look</div>
                </Grid>
                <Grid item style={{ flexGrow: 1 }}>
                  <div>(g) Get {'<item>'}</div>
                  <div>(dr) Drop {'<item>'}</div>
                  <div>(op) Open {'<item or direction>'}</div>
                  <div>(cl) Close {'<item or direction>'}</div>
                  <div>(use) Use {'<item> <direction>'}</div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Grid>
    </Grid>
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
