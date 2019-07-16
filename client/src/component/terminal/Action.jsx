import React, { PropTypes, Fragment, memo } from '@coderich/hotrod/react';

const Action = memo((props) => {
  const { prompt, action: { type, value } } = props;

  switch (type) {
    case 'command': return `${prompt} ${value}`;
    case 'room': return (
      <Fragment>
        <div style={{ color: 'cyan' }}>{value.name}</div>
        {value.description && <div style={{ textIndent: '0px' }}>{value.description}</div>}
        {value.items.length > 0 && (
          <div style={{ color: 'cadetblue' }}>
            <span>You notice </span>
            <span>{value.items.join(', ')}</span>
            <span> here.</span>
          </div>
        )}
        {value.units.length > 0 && (
          <div>
            <span style={{ color: 'indianred' }}>Also here: </span>
            <span>{value.units.join(', ')}</span>
          </div>
        )}
        <div style={{ color: 'limegreen' }}>
          <span>Obvious exits: </span>
          <span>{value.exits.join(', ')}</span>
        </div>
      </Fragment>
    );
    case 'error': return <div style={{ color: 'red' }}>{value}</div>;
    case 'info': return <div>{value}</div>;
    default: return <div />;
  }
});

export default Action;

Action.propTypes = {
  prompt: PropTypes.string.isRequired,
  action: PropTypes.instanceOf(Object).isRequired,
};
