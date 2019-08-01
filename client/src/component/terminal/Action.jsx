import React, { PropTypes, Fragment, memo } from '@coderich/hotrod/react';
import { List, ListItem, ListItemText } from '@material-ui/core';

const Action = memo((props) => {
  const { prompt, action: { type, value } } = props;

  switch (type) {
    // case 'command': return `${prompt} ${value}`;
    case 'room': return (
      <Fragment>
        <div style={{ color: 'cyan' }}>{value.name}</div>
        {value.description && <div style={{ textIndent: '30px' }}>{value.description}</div>}
        {value.items.length > 0 && (
          <div style={{ color: 'cadetblue' }}>
            <span>You notice </span>
            <span>{value.items.join(', ')}</span>
            <span> here.</span>
          </div>
        )}
        {value.units.length > 0 && (
          <div>
            <span style={{ color: '#98389E' }}>Also here: </span>
            <span style={{ color: '#EF8CF9' }}>{value.units.join(', ')}</span>
          </div>
        )}
        <div style={{ color: 'limegreen' }}>
          <span>Obvious exits: </span>
          <span>{value.exits.join(', ')}</span>
        </div>
      </Fragment>
    );
    case 'cool': {
      return <div style={{ color: 'cadetblue' }}>{value}</div>;
    }
    case 'error': {
      return <div style={{ color: '#EE766D' }}>{value}</div>;
    }
    case 'info': {
      switch (value.toLowerCase()) {
        case '*combat engaged*': case '*combat off*': return <div style={{ color: '#BFBB3C' }}>{value}</div>;
        default: return <div>{value}</div>;
      }
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
