import React, { PropTypes, Fragment, memo, connect } from '@coderich/hotrod/react';
import { Grid, List, ListItem, ListItemText, Table, TableBody, TableRow, TableCell } from '@material-ui/core';

// const numToArray = num => Array.from(Array(num));

// const makeCell = (w, h, label) => {
//   return (
//     <Grid container direction="column">
//       {numToArray(h).map(() => {
//         return (
//           <Grid container item xs>
//             {numToArray(w).map(() => {
//               return (
//                 <Grid itemn xs>{label}</Grid>
//               );
//             })}
//           </Grid>
//         );
//       })}
//     </Grid>
//   );
// };

const Action = memo((props) => {
  const { theme, action: { type, value } } = props;
  const { cyan, red, green, purple, pink, cool, water, maroon, highlight } = theme.colors;
  const cell = { border: '1px dashed #2F2F2F', color: pink };

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
                  <legend>party</legend>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell rowSpan={3}>titan</TableCell>
                        <TableCell>mad wizard</TableCell>
                        <TableCell>small priest</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell />
                        <TableCell>nimble archer</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>large ant</TableCell>
                        <TableCell>giant rat</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </fieldset>
              </Grid>
              <Grid container item style={{ margin: 5 }} direction="column">
                <fieldset className="canvas">
                  <legend>party</legend>
                  <Grid container item align="center">
                    <Grid container item>
                      <Grid item style={{ textAlign: 'right', color: 'white' }}>a<sup>3</sup>&nbsp;</Grid>
                      <Grid item xs style={cell}>huge titan (head)</Grid>
                      <Grid item xs style={{ ...cell, color: purple }}>mad wizard</Grid>
                      <Grid item xs style={cell}>small priest</Grid>
                    </Grid>
                    <Grid container item>
                      <Grid item style={{ textAlign: 'right', color: 'white' }}>b<sup>2</sup>&nbsp;</Grid>
                      <Grid item xs style={cell}>huge titan (body)</Grid>
                      <Grid item xs style={cell} />
                      <Grid item xs style={cell}>nimble archer</Grid>
                    </Grid>
                    <Grid container item>
                      <Grid item style={{ textAlign: 'right', color: 'white' }}>c<sup>1</sup>&nbsp;</Grid>
                      <Grid item xs style={cell}>huge titan (legs)</Grid>
                      <Grid item xs style={cell}>large ant</Grid>
                      <Grid item xs style={cell}>giant rat</Grid>
                    </Grid>
                  </Grid>
                </fieldset>
              </Grid>
              <Grid container item style={{ margin: 5 }} direction="column" xs={6}>
                <fieldset className="canvas">
                  <legend>adult dragon</legend>
                  <Grid container item align="center">
                    <Grid container item>
                      <Grid item style={{ textAlign: 'right', color: 'white' }}>e<sup>3</sup>&nbsp;</Grid>
                      <Grid item xs style={cell}>(tail)</Grid>
                      <Grid item xs style={cell}>(body)</Grid>
                      <Grid item xs style={cell}>(body)</Grid>
                      <Grid item xs style={cell}>(head)</Grid>
                    </Grid>
                    <Grid container item>
                      <Grid item style={{ textAlign: 'right', color: 'white' }}>f<sup>2</sup>&nbsp;</Grid>
                      <Grid item xs style={cell}>(tail)</Grid>
                      <Grid item xs style={cell}>(body)</Grid>
                      <Grid item xs style={cell}>(body)</Grid>
                      <Grid item xs style={cell}>(head)</Grid>
                    </Grid>
                    <Grid container item>
                      <Grid item style={{ textAlign: 'right', color: 'white' }}>f<sup>1</sup>&nbsp;</Grid>
                      <Grid item xs style={cell}>(tail)</Grid>
                      <Grid item xs style={cell}>(claw)</Grid>
                      <Grid item xs style={cell}>(claw)</Grid>
                      <Grid item xs style={cell} />
                    </Grid>
                  </Grid>
                </fieldset>
              </Grid>
              {/*<Grid container item style={{ margin: 5 }} direction="column" xs={4}>
                <fieldset className="canvas">
                  <legend>large titan</legend>
                  <Grid container item align="center">
                    <Grid container item>
                      <Grid item style={{ textAlign: 'right', color: 'white' }}>d<sup>3</sup>&nbsp;</Grid>
                      <Grid item xs style={cell}>(head)</Grid>
                    </Grid>
                    <Grid container item>
                      <Grid item style={{ textAlign: 'right', color: 'white' }}>e<sup>2</sup>&nbsp;</Grid>
                      <Grid item xs style={cell}>(body)</Grid>
                    </Grid>
                    <Grid container item>
                      <Grid item style={{ textAlign: 'right', color: 'white' }}>f<sup>1</sup>&nbsp;</Grid>
                      <Grid item xs style={cell}>(legs)</Grid>
                    </Grid>
                  </Grid>
                </fieldset>
              </Grid>*/}
              <Grid container item style={{ margin: 5 }} direction="column" xs={8}>
                <fieldset className="canvas">
                  <legend>party</legend>
                  <Grid container item align="center">
                    <Grid container item>
                      <Grid item style={{ textAlign: 'right', color: 'white' }}>g<sup>1</sup>&nbsp;</Grid>
                      <Grid item xs style={{ ...cell, color: purple }}>Random</Grid>
                      <Grid item xs style={cell}>Dusty</Grid>
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

export default connect({
  selectors: {
    theme: 'theme',
  },
})(Action);

Action.propTypes = {
  theme: PropTypes.instanceOf(Object).isRequired,
  action: PropTypes.instanceOf(Object).isRequired,
};
