import React, { memo, PropTypes } from '@coderich/hotrod/react';
import '../asset/styles.css';

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
