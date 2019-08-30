import React, { PropTypes, Fragment, memo, connect } from '@coderich/hotrod/react';
import { Grid, List, ListItem, ListItemText, Divider } from '@material-ui/core';
import Party from './Party';

const Action = memo((props) => {
  const { theme, action } = props;
  const { type, value } = action;
  const { cyan, red, green, purple, pink, cool, water, maroon, highlight } = theme.colors;

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
              <Grid container item direction="column" style={{ margin: 5 }}>
                <Party
                  index={0}
                  width={3}
                  height={3}
                  matrix={[
                    [{ label: 'large titan', props: { rowSpan: 3 } }, { label: 'mad wizard' }, { label: 'small priest' }],
                    [{ skip: true }, { label: 'nimble archer' }],
                    [{ label: 'large ant' }, { label: 'giant rat' }],
                  ]}
                />
                <Divider style={{ margin: 5 }} />
                <Party
                  index={3}
                  width={3}
                  height={3}
                  matrix={[
                    [{ label: 'titan', props: { rowSpan: 3 } }, { label: 'giant snake', props: { colSpan: 2 } }],
                    [{ label: 'giant snake', props: { colSpan: 2 } }],
                    [{ label: 'large ant' }, { label: 'giant rat' }],
                  ]}
                />
                <Divider style={{ margin: 5 }} />
                <Party
                  index={6}
                  width={8}
                  height={1}
                  matrix={[
                    [
                      { label: 'Random' },
                      { label: 'Dusty' },
                      { label: 'Crimp' },
                      { label: 'Marine' },
                      { label: 'Dartanian' },
                      { label: 'MrMillhouse' },
                      { label: 'Constant' },
                      { label: 'Zilo' },
                    ],
                  ]}
                />
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
