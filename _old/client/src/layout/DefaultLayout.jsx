import React, { memo, PropTypes } from '@coderich/hotrod/react';
import '../asset/styles.css';

const Layout = memo((props) => {
  const { children } = props;

  return (
    <main className="canvas">
      {children}
    </main>
  );
});

export default Layout;

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
