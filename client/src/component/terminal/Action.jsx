import React, { PropTypes, Fragment, memo } from '@coderich/hotrod/react';
import { List, ListItem, ListItemText } from '@material-ui/core';

const cyan = 'cyan';
const red = '#EE766D';
const green = 'limegreen';
const purple = '#98389E';
const pink = '#EF8CF9';
const cool = 'cadetblue';
const water = '#6876f7';
const maroon = '#BFBB3C';
const highlight = '#fffb7f';

const Action = memo((props) => {
  const { prompt, action: { type, value } } = props;

  switch (type) {
    // case 'command': return `${prompt} ${value}`;
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
          <div>
            <span style={{ color: purple }}>Also here: </span>
            <span style={{ color: pink }}>{value.units.join(', ')}</span>
          </div>
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
    case 'error': {
      return <div style={{ color: red }}>{value}</div>;
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
  prompt: PropTypes.string.isRequired,
  action: PropTypes.instanceOf(Object).isRequired,
};
