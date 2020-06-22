/** @jsx jsx */
import { jsx } from 'theme-ui';
import React from 'react';
import { TabPanel } from 'react-tabs';

const SocialHub = ({ user, ...rest }) => {
  return (
    <TabPanel {...rest}>
      <h1
        sx={{
          fontFamily: 'heading',
          color: 'text',
          fontWeight: 500,
          width: '100%',
          fontSize: ['1.4em', '1.7em', '2em'],
          marginBottom: 20,
          padding: 10,
          textAlign: 'center',
        }}
      >
        Welcome to your Social Hub {user}
      </h1>
    </TabPanel>
  );
};

SocialHub.tabsRole = 'TabPanel';

export default SocialHub;