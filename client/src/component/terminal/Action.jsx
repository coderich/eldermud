import React, { PropTypes, memo, connect } from '@coderich/hotrod/react';
import { Grid, List, ListItem, ListItemText } from '@material-ui/core';
import Party from './Party';

const intersperse = (arr, sep) => {
  if (arr.length === 0) return [];
  return arr.slice(1).reduce((xs, x, i) => xs.concat([sep, x]), [arr[0]]);
};

const Action = memo((props) => {
  const { theme, action } = props;
  const { type, value } = action;
  const { cyan, red, green, purple, pink, cool, water, maroon, highlight } = theme.colors;

  switch (type) {
    case 'room': {
      const { name, description, items = [], units = [], exits = [] } = value;

      return (
        <div>
          <div style={{ color: cyan }}>{name}</div>

          {description && <div style={{ textIndent: '30px' }}>{description}</div>}

          {items.length > 0 && (
            <div style={{ color: cool }}>
              <span>You notice </span>
              <span>{items.join(', ')}</span>
              <span> here.</span>
            </div>
          )}

          {units.length > 0 && (
            <div>
              <span style={{ color: purple }}>Also here: </span>
              <span style={{ color: pink }}>
                {intersperse(units.map((unit) => {
                  return <span key={unit.id}>{unit.name}{unit.size ? <sup>+{unit.size}</sup> : ''}</span>;
                }), ', ')}
              </span>
            </div>
          )}

          <div style={{ color: green }}>
            <span>Obvious exits: </span>
            <span>{exits.join(', ')}</span>
          </div>
        </div>
      );
    }
    case 'unit': {
      const { name, description, notices = [] } = value;

      return (
        <div>
          <div style={{ color: cyan }}>{name}</div>
          <div style={{ textIndent: '30px' }}>{description}</div>
          {notices.map((notice, i) => <div key={i} style={{ color: maroon }}>{notice}</div>)}
        </div>
      );
    }
    case 'party': {
      const party = value;
      const { size = [1, 1], matrix } = party;
      return (
        <Grid container item direction="column">
          <Grid item key={party.leader}>
            <Party
              size={size}
              matrix={matrix}
            />
          </Grid>
        </Grid>
      );
    }
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
    case 'html': {
      console.log(value);
      return <div dangerouslySetInnerHTML={{ __html: value }} />;
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
