import React, { PropTypes, Fragment, memo } from '@coderich/hotrod/react';
import { Grid, List, ListItem, ListItemText } from '@material-ui/core';

const cyan = 'cyan';
const red = '#EE766D';
const green = 'limegreen';
const purple = '#98389E';
const pink = '#EF8CF9';
const cool = 'cadetblue';
const water = '#6876f7';
const maroon = '#BFBB3C';
const highlight = '#fffb7f';

const cell = {
  border: '1px dashed #2F2F2F',
  color: pink,
};

const Action = memo((props) => {
  const { action: { type, value } } = props;

  switch (type) {
    case 'room': return (
      <Fragment>
        <div style={{ color: cyan }}>{value.name}</div>
        {value.description && <div style={{ textIndent: '30px' }}>{value.description}</div>}
        {value.items.length > 0 && (
          <div style={{ color: cool }}>
            <span>You notice </span>
            <span>{value.items.join(', ')}</span>
            <span> here.</span>
          </div>
        )}
        {value.units.length > 0 && (
          <React.Fragment>
            <Grid container>
              <Grid container item style={{ margin: 5 }} direction="column">
                <fieldset className="canvas">
                  <legend>Leader: cave bear<sup>[c2]</sup></legend>
                  <Grid container item align="center">
                    <Grid container item style={{ color: 'white' }}>
                      <Grid item xs={1} />
                      <Grid item xs>1</Grid>
                      <Grid item xs>2</Grid>
                      <Grid item xs>3</Grid>
                    </Grid>
                    <Grid container item>
                      <Grid item xs={1} style={{ textAlign: 'right', color: 'white' }}>c&nbsp;</Grid>
                      <Grid item xs style={cell}>priest</Grid>
                      <Grid item xs style={cell}>cave bear</Grid>
                      <Grid item xs style={cell}>priest</Grid>
                    </Grid>
                    <Grid container item>
                      <Grid item xs={1} style={{ textAlign: 'right', color: 'white' }}>b&nbsp;</Grid>
                      <Grid item xs style={cell}>archer</Grid>
                      <Grid item xs style={cell} />
                      <Grid item xs style={cell}>archer</Grid>
                    </Grid>
                    <Grid container item>
                      <Grid item xs={1} style={{ textAlign: 'right', color: 'white' }}>a&nbsp;</Grid>
                      <Grid item xs style={cell}>rat</Grid>
                      <Grid item xs style={cell}>ant</Grid>
                      <Grid item xs style={cell}>rat</Grid>
                    </Grid>
                  </Grid>
                </fieldset>
              </Grid>
              <Grid container item style={{ margin: 5 }} direction="column">
                <fieldset className="canvas">
                  <legend>Leader: Random<sup>[a1]</sup></legend>
                  <Grid container item align="center" style={{ color: pink }}>
                    <Grid container item>
                      <Grid item xs>Random<sup>[a1]</sup></Grid>
                      <Grid item xs>Dusty<sup>[a2]</sup></Grid>
                    </Grid>
                  </Grid>
                </fieldset>
              </Grid>
            </Grid>
            <div>
              <span style={{ color: purple }}>Also here: </span>
              <span style={{ color: pink }}>{value.units.join(', ')}</span>
            </div>
          </React.Fragment>
        )}
        <div style={{ color: green }}>
          <span>Obvious exits: </span>
          <span>{value.exits.join(', ')}</span>
        </div>
      </Fragment>
    );
    case 'shop': {
      return (
        <List dense>
          {value.map((item) => {
            return (
              <ListItem key={item.name}>
                <ListItemText primary={`(${item.cost}) ${item.name}`} />
              </ListItem>
            );
          })}
        </List>
      );
    }
    case 'spawn': {
      return (
        <div style={{ color: green }}>
          <span style={{ color: highlight }}>A {value.name}</span>
          <span> {value.moves}s into the room from nowhere.</span>
        </div>
      );
    }
    case 'enter': {
      return (
        <div style={{ color: green }}>
          <span style={{ color: value.type === 'user' ? red : highlight }}>{value.name}</span>
          <span> walks into the room from the {value.from}.</span>
        </div>
      );
    }
    case 'leave': {
      return (
        <div style={{ color: green }}>
          <span style={{ color: value.type === 'user' ? red : highlight }}>{value.name}</span>
          <span> just left to the {value.to}.</span>
        </div>
      );
    }
    case 'cool': {
      return <div style={{ color: cool }}>{value}</div>;
    }
    case 'water': {
      return <div style={{ color: water }}>{value}</div>;
    }
    case 'error': case 'red': {
      return <div style={{ color: red }}>{value}</div>;
    }
    case 'warning': {
      return <div style={{ color: highlight }}>{value}</div>;
    }
    case 'maroon': {
      return <div style={{ color: maroon }}>{value}</div>;
    }
    case 'info': {
      switch (value.toLowerCase()) {
        case '*combat engaged*': case '*combat off*': return <div style={{ color: maroon }}>{value}</div>;
        default: return <div>{value}</div>;
      }
    }
    default: {
      return <span />;
    }
  }
});

export default Action;

Action.propTypes = {
  action: PropTypes.instanceOf(Object).isRequired,
};
