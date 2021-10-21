import React, { Component, Suspense } from 'react';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import { IntlProvider } from 'react-intl';
// import { database, auth } from './helpers/Firebase';
import AppLocale from './lang';
import ColorSwitcher from './components/common/ColorSwitcher';
import NotificationContainer from './components/common/react-notifications/NotificationContainer';
import { isMultiColorActive, isDemo } from './constants/defaultValues';
import { getDirection } from './helpers/Utils';

const ViewMain = React.lazy(() =>
  import(/* webpackChunkName: "views" */ './views')
);
const ViewApp = React.lazy(() =>
  import(/* webpackChunkName: "views-app" */ './views/app')
);
const ViewUser = React.lazy(() =>
  import(/* webpackChunkName: "views-user" */ './views/user')
);
const ViewError = React.lazy(() =>
  import(/* webpackChunkName: "views-error" */ './views/error')
);
const LogoShow = React.lazy(() =>
  import(/* webpackChunkName: "logo-show" */ './logo')
);

const ForgotPwd = React.lazy(() => import('./views/user/forgot-password'));

const LogoPlan = React.lazy(() => import('./logo/plan'));
const LogoFeatures = React.lazy(() => import('./logo/feature'));
const LogoClients = React.lazy(() => import('./logo/clients'));
const LogoContact = React.lazy(() => import('./logo/contact'));

const SignUpPage = React.lazy(() => import('./views/user/sign-up'));

const AcceptInvitation = React.lazy(() => import('./views/user/register'));

const AuthRoute = ({ component: Component, authUser, ...rest }) => {
  console.log("authRoute", rest);
  return (
    <Route
      {...rest}
      render={props =>
        authUser || isDemo ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/user/login',
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    const direction = getDirection();
    if (direction.isRtl) {
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }

    // database.ref('users/1').set({
    //   username: "name",
    //   email: "test@email.com",
    //   profile_picture : "imageUrl"
    // });
    // database.ref('users/2').set({
    //   username: "name",
    //   email: "test@email.com",
    //   profile_picture : "imageUrl"
    // });
    // database.ref('userlist/1').set({
    //   username: "name",
    //   email: "test@email.com",
    //   profile_picture : "imageUrl"
    // });
    //var userId = auth.currentUser;
    // database.ref('/users/1').once('value').then(function(snapshot) {
    //   var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
    //   console.log("username");
    //   console.log(snapshot.val());
    // });

    // database.ref('/users').once('value', function(snapshot) {
    //   snapshot.forEach(function(childSnapshot) {
    //     var childKey = childSnapshot.key;
    //     var childData = childSnapshot.val();
    //     console.log("childKey");
    //     console.log(childKey);
    //     console.log("childData");
    //     console.log(childData);
    //   });
    // });

    // database.ref('users/2').set({
    //   username: "123123",
    //   email: "test@email.com",
    //   profile_picture : "imageUrl"
    // }, function(error) {
    //   if (error) {
    //     console.log("db connection error");
    //   } else {
    //     console.log("Data saved successfully!");
    //   }
    // });

    // var onComplete = function(error) {
    //     if (error) {
    //         console.log('Operation failed');
    //     } else {
    //         console.log(' Operation completed');
    //     }
    // };

    // var booksRef = database.ref().child("books");
 
    // booksRef.push({
    //     author: " Adam Freeman",
    //     title: "Pro AngularJS"
    // }, onComplete);

    // booksRef.child('Adam Freeman').set({
    //     title: "Pro AngularJS"
    // }, onComplete);

    // database.ref('users/2').remove();
    
    // var postData = {
    //   username: "username",
    //   email: "uid"
    // };
  
    // // Get a key for a new Post.
    // // var newPostKey = database.ref().child('users').push().key;
  
    // // Write the new post's data simultaneously in the posts list and the user's post list.
    // var updates = {};
    // // updates['/users/' + newPostKey] = postData;
    // updates['/users/2'] = postData;
  
    // database.ref().update(updates);


  }

  render() {
    const { locale, loginUser } = this.props;
    const currentAppLocale = AppLocale[locale];
    console.log("App.js  props");
    console.log(this.props);
    return (
      <div className="h-100">
        <IntlProvider
          locale={currentAppLocale.locale}
          messages={currentAppLocale.messages}
        >
          <React.Fragment>
            <NotificationContainer />
            {isMultiColorActive && <ColorSwitcher />}
            <Suspense fallback={<div className="loading" />}>
              <Router>
                <Switch>
                  <AuthRoute
                    path="/app"
                    authUser={loginUser}
                    component={ViewApp}
                  />
                  <Route
                    path="/user"
                    render={props => <ViewUser {...props} />}
                  />
                  <Route
                    path="/view_main"
                    exact
                    render={props => <ViewMain {...props} />}
                  />
                  <Route
                    path="/forgot-password"
                    exact
                    render={props => <ForgotPwd {...props} />}
                  />
                  <Route
                    path="/error"
                    exact
                    render={props => <ViewError {...props} />}
                  />
                  <Route
                    path="/show_plan"
                    exact
                    render={props => <LogoPlan {...props} />}
                  />
                  <Route
                    path="/show_features"
                    exact
                    render={props => <LogoFeatures {...props} />}
                  />
                  <Route
                    path="/show_clients"
                    exact
                    render={props => <LogoClients {...props} />}
                  />
                  <Route
                    path="/show_contact"
                    exact
                    render={props => <LogoContact {...props} />}
                  />
                  <Route
                    path="/sign_up/:plan/:yearly"
                    exact
                    render={props => <SignUpPage {...props} />}
                  />
                  <Route
                    path="/acceptinvitation/:invite_key"
                    exact
                    render={props => <AcceptInvitation {...props} />}
                  />
                  <Route
                    path="/"
                    exact
                    render={props => loginUser ? (<ViewMain {...props} />) : (<LogoShow {...props} />)}
                  />
                  <Redirect to="/error" />
                </Switch>
              </Router>
            </Suspense>
          </React.Fragment>
        </IntlProvider>
      </div>
    );
  }
}

const mapStateToProps = ({ authUser, settings }) => {
  const { user: loginUser } = authUser;
  const { locale } = settings;
  return { loginUser, locale };
};
const mapActionsToProps = {};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(App);
