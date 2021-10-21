import React, { Component, Fragment, Suspense } from "react";
import { Redirect, Route, Switch } from 'react-router-dom';

const MyPlan = React.lazy(() => import('./my_plan'));
const CreateCompany = React.lazy(() => import('./create_company'));

export default class Billings extends Component {
  // constructor(props) {
  //   super(props);
  // }
  
  render() {
    const { match } = this.props;
      return (
        <Fragment>
          <Suspense fallback={<div className="loading" />}>
            <Switch>
              <Redirect exact from={`${match.url}/`} to={`${match.url}/my_plan`} />
              <Route
                path={`${match.url}/my_plan`}
                render={props => <MyPlan {...props} />}
              />
              <Route
                path={`${match.url}/create_company`}
                render={props => <CreateCompany {...props} />}
              />
              <Redirect to="/error" />
            </Switch>
          </Suspense>
        </Fragment>
      )
  }
}
