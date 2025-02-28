import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';
import Layout from '../Layout/Layout';

interface PrivateRouteProps {
  component: React.ComponentType<Record<string, unknown>>;
  path: string;
  exact?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  const { userInfo } = useSelector((state: RootState) => state.auth);

  return (
    <Route
      {...rest}
      render={(props) =>
        userInfo ? (
          <Layout>
            <Component {...props} />
          </Layout>
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
