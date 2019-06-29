import React, { PropTypes, Fragment, memo } from '@coderich/hotrod/react';

const Action = memo((props) => {
  const { prompt, action: { type, value } } = props;

  switch (type) {
    case 'command': return `${prompt} ${value}`;
    case 'room': return (
      <Fragment>
        <div style={{ color: 'cyan' }}>{value.name}</div>
        <div>{value.description}</div>
        <div style={{ color: 'green' }}>
          <span>Obvious exits: </span>
          <span>{value.exits.join(', ')}</span>
        </div>
      </Fragment>
    );
    case 'error': return <div style={{ color: 'red' }}>{value}</div>;
    default: return <div>{value}</div>;
  }
});

export default Action;

Action.propTypes = {
  prompt: PropTypes.string.isRequired,
  action: PropTypes.instanceOf(Object).isRequired,
};
