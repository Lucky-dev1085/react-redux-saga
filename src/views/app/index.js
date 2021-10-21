import React, { Component, Suspense } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AppLayout from '../../layout/AppLayout';

const Dashboard = React.lazy(() =>
  import(/* webpackChunkName: "viwes-dashboard" */ './dashboard')
);
const Sites = React.lazy(() =>
  import(/* webpackChunkName: "viwes-sites" */ './sites')
);
const Migrations = React.lazy(() =>
  import(/* webpackChunkName: "viwes-migrations" */ './migrations')
);

const ActivityLog = React.lazy(() => import('./activity_log'));
const Analytics = React.lazy(() => import('./analytics'));
const Billings = React.lazy(() => import('./billings'));

const Dns = React.lazy(() => import('./dns'));
const Users = React.lazy(() => import('./users'));

const UserSetting = React.lazy(() => import('./users/user_setting'));

class App extends Component {
  render() {
    const { match } = this.props;

    return (
      <AppLayout>
        <div className="dashboard-wrapper">
          <Suspense fallback={<div className="loading" />}>
            <Switch>
              <Redirect exact from={`${match.url}/`} to={`${match.url}/dashboard`} />
              <Route
                path={`${match.url}/dashboard`}
                render={props => <Dashboard {...props} />}
              />
              <Route
                path={`${match.url}/sites`}
                render={props => <Sites {...props} />}
              />
              <Route
                path={`${match.url}/migrations`}
                render={props => <Migrations {...props} />}
              />
              <Route
                path={`${match.url}/users`}
                render={props => <Users {...props} />}
              />
              <Route
                path={`${match.url}/user_setting`}
                render={props => <UserSetting {...props} />}
              />
              <Route
                path={`${match.url}/activity_log`}
                render={props => <ActivityLog {...props} />}
              />
              <Route
                path={`${match.url}/analytics`}
                render={props => <Analytics {...props} />}
              />
              <Route
                path={`${match.url}/billings`}
                render={props => <Billings {...props} />}
              />
              <Route
                path={`${match.url}/dns`}
                render={props => <Dns {...props} />}
              />
              <Redirect to="/error" />
            </Switch>
          </Suspense>
        </div>
      </AppLayout>
    );
  }
}
const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};

export default withRouter(
  connect(
    mapStateToProps,
    {}
  )(App)
);
