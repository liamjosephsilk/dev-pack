import React from 'react';
import { navigate } from 'gatsby';
import { toast } from 'react-toastify';
import { LOGGED_IN_SERVICES } from '../../butler';

import { useQuery } from '@apollo/client';

toast.configure();

const PrivateRoute = ({ component: Component, location, ...rest }) => {
  const { loading, error, data } = useQuery(LOGGED_IN_SERVICES);

  // check if the user is logged in. If they are already then navigate them to the hub
  if (
    data &&
    data.me.serviceMetadata.loggedInServices.length &&
    !data.me.serviceMetadata.loggedInServices[0].isLoggedIn &&
    data.me.serviceMetadata.loggedInServices[0].service === 'GITHUB' &&
    location.pathname !== `/app/login`
  ) {
    console.log('Not logged in, navigating to login page');
    // If we’re not logged in, redirect to the login page.
    navigate(`/app/login`);
    return null;
  }

  return <Component {...rest} />;
};

export default PrivateRoute;
