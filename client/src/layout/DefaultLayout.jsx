import React, { memo, PropTypes } from '@coderich/hotrod/react';

const Layout = memo((props) => {
  const { children } = props;

  return (
    <div>
      <main>
        {children}
      </main>
    </div>
  );
});

export default Layout;

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
