import React, { Component } from "react";
import { Row, Card, CardBody, FormGroup, Label, CustomInput, Button, Input } from "reactstrap";
import { Form } from "formik";
import { NotificationManager } from "../../components/common/react-notifications";
// import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { registerUser } from "../../redux/actions";

import IntlMessages from "../../helpers/IntlMessages";
import { Colxx } from "../../components/common/CustomBootstrap";

import { database } from '../../helpers/Firebase';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prev_user: this.props.user,
      invite_key: this.props.match.params.invite_key,
      email: "",
      by_uid: "",
      by_name: "",
      by_profile_url: "",
      role: 2,
      sites: [],
      first_name: "",
      first_name_valid: "",
      last_name: "",
      last_name_valid: "",
      password: "",
      password_valid: "",
      repeat_password: "",
      repeat_password_valid: "",
      term_check: false,
      loading: false
    };
  }

  componentDidMount() {   
    database.ref('/Invited_User/' + this.state.invite_key)
      .once('value')
      .then(function(snapshot) {
        if(snapshot.val() === null) {
          NotificationManager.warning(
            "We don't invite you",
            "Warning",
            3000,
            null,
            null,
            ''
          );
          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
          
        }
        var childData = snapshot.val();
        var email = childData.email;
        var by_uid = childData.uid;
        var role = childData.role;
        var sites = childData.sites;

        this.setState({
          email: email,
          by_uid: by_uid,
          role: role,
          sites: sites
        })

        var by_name = "";
        var by_profile_url = "";

        database.ref('/Users')
          .orderByChild('uid')
          .equalTo(by_uid)
          .once('value', function(snapshot){
            snapshot.forEach(function(childSnapshot) {
              var childData = childSnapshot.val();

              var by_parent_uid = childData.uid;
              if(by_parent_uid != "") by_uid = by_parent_uid;
              by_name = childData.first_name + " " + childData.last_name;
              by_profile_url = childData.profile_url;
            })

            this.setState({
              by_name: by_name,
              by_profile_url: by_profile_url,
              by_uid: by_uid
            })
        }.bind(this));
    }.bind(this));
  }

  firstNameChange(value) {
    let error = "";
    if (!value) {
        error = "Please enter your first name";
    } else if (value.length < 2) {
        error = "Value must be longer than 2 characters";
    }
    
    this.setState({
      first_name: value,
      first_name_valid: error
    });      
  }

  lastNameChange(value) {
    let error = "";
    if (!value) {
        error = "Please enter your last name";
    } else if (value.length < 1) {
        error = "Value must be longer than 1 characters";
    }
    
    this.setState({
      last_name: value,
      last_name_valid: error
    });
  }

  passwordChange(value) {
      let error = "";
      if (!value) {
          error = "Please enter your password";
      } else if (value.length < 6) {
          error = "Password must contain a min. of 6 characters";
      }
      
      this.setState({
        password: value,
        password_valid: error
      });
  }

  repeatPasswordChange(value) {
    let error = "";
    let str_pwd = this.state.password;
    if (!value) {
        error = "You did not repeat your password correctly.";
    } else if (value.length < 6) {
        error = "Password must contain a min. of 6 characters";
    } else if (value !== str_pwd) {
        error = "You did not repeat your password correctly.";
    }
    
    this.setState({
      repeat_password: value,
      repeat_password_valid: error
    });
  }

  setFieldValue(val) {
    this.setState({
      term_check: val
    });
  }

  onUserRegister() {
    if (this.state.first_name !== "" && this.state.first_name_valid === "" && 
        this.state.last_name !== "" && this.state.last_name_valid === "" && 
        this.state.password !== "" && this.state.password_valid === "" && 
        this.state.repeat_password !== "" && this.state.repeat_password_valid === "") {
      
      this.setState({ loading: true });
      var value = {
        email: this.state.email,
        password: this.state.password
      }
      console.log("register value = ", value);
      
      this.props.registerUser(value, this.props.history);
        
    } else {
      this.firstNameChange("");
      this.lastNameChange("");
      this.passwordChange("");
      this.repeatPasswordChange("");
      this.setFieldValue(false);
    }
  }

  componentDidUpdate() {
    if (this.props.error) {
      NotificationManager.warning(
        this.props.error,
        "Rigister Error",
        3000,
        null,
        null,
        ''
      );
    }
  }

  register_process() {
    console.log("************rigister process******");
    var onComplete = function(error) {
      if (error) {
          console.log('***********Operation failed');
          NotificationManager.warning(
            "DATABASE CONNECT ERROR!!!",
            "Rigister Error",
            3000,
            null,
            null,
            ''
          );
      } else {
          console.log('********** Operation completed');
          NotificationManager.warning(
            "Rigister success",
            "Rigister success",
            3000,
            null,
            null,
            ''
          );
            
          database.ref('/Invited_User/' + this.state.invite_key).remove();

          this.setState({ loading: false });

          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
      }
    }.bind(this);

    var userRef = database.ref().child("Users");
 
    userRef.push({
      "uid": this.props.user,
      "email": this.state.email,
      "first_name": this.state.first_name,
      "last_name": this.state.last_name,
      "company_individual": "company_individual_2",
      "country": 0,
      "state": "",
      "city": "",
      "zip_code": "",
      "address": "",
      "company": "",
      "card_name": "",
      "card_number": "",
      "role": this.state.role,
      "parent_uid": this.state.by_uid,
      "profile_url": "https://firebasestorage.googleapis.com/v0/b/gogo-react-login-511d1.appspot.com/o/images%2F3ac23881-a840-4d4a-b09e-793c75922d18.png?alt=media&token=de502cec-4f3b-4dd8-b91f-75e34ab93528",
      "lang": 0,
      "sites": this.state.sites
    }, onComplete);
  }

  render() {
    console.log("rigister user = ", this.props);
    if(this.props.user !== "" && 
      this.props.user !== null &&
      this.props.error === "" && 
      this.state.prev_user !== this.props.user &&
      this.state.loading)
    {
      this.register_process();
    }

    return (
      <Row className="h-100">
        <Colxx xxs="12" md="10" className="mx-auto my-auto">
          <Card className="auth-card">
            <CardBody className="form-side1">
              <Form className="av-tooltip tooltip-label-bottom">
                <Row>
                  <Colxx xxs="12">
                    <img className="acceptinvite_img" src={this.state.by_profile_url} alt="by_profile_url" />
                    <Label className="ml-2">
                      {
                        this.state.by_name + " invited you to their company"
                      }
                    </Label>
                  </Colxx>
                </Row>
                <Row className="mt-5">
                  <Colxx xxs="12">
                    <IntlMessages id="user.register-email" className="text-one font-weight-bold" />
                    <br />
                    <Label className="mt-1">
                      {
                        this.state.email
                      }
                    </Label>
                  </Colxx>
                </Row>
                <Row className="h-100 mt-5">
                  <Colxx sm="12" md="6">
                    <FormGroup className="form-group">
                      <Label>
                        <IntlMessages id="user.register-first-name" />
                      </Label>
                      <Input 
                        placeholder="Enter first name"
                        name="first_name"
                        id="first_name"
                        onChange={(event) => this.firstNameChange(event.target.value)}
                      />
                      { this.state.first_name_valid && (
                        <Label className="color-theme-1">
                          { this.state.first_name_valid }
                        </Label>
                      )}
                    </FormGroup>
                  </Colxx>
                  <Colxx sm="12" md="6">
                    <FormGroup className="form-group">
                      <Label>
                        <IntlMessages id="user.register-last-name" />
                      </Label>
                      <Input 
                        placeholder="Enter last name"
                        name="last_name"
                        id="last_name"
                        onChange={(event) => this.lastNameChange(event.target.value)}
                      />
                      { this.state.last_name_valid && (
                        <Label className="color-theme-1">
                          { this.state.last_name_valid }
                        </Label>
                      )}
                    </FormGroup>
                  </Colxx>
                </Row>

                <Row className="h-100 mt-5">
                  <Colxx sm="12" md="6">
                    <FormGroup className="form-group">
                      <Label>
                        <IntlMessages id="user.register-pass" />
                      </Label>
                      <Input 
                        placeholder="Enter password"
                        name="password"
                        id="password"
                        onChange={(event) => this.passwordChange(event.target.value)}
                      />
                      { this.state.password_valid && (
                        <Label className="color-theme-1">
                          { this.state.password_valid }
                        </Label>
                      )}
                    </FormGroup>
                  </Colxx>
                  <Colxx sm="12" md="6">
                    <FormGroup className="form-group">
                      <Label>
                        <IntlMessages id="user.register-repeat-pass" />
                      </Label>
                      <Input 
                        placeholder="Confirm the password"
                        name="repeat_password"
                        id="repeat_password"
                        onChange={(event) => this.repeatPasswordChange(event.target.value)}
                      />
                      { this.state.repeat_password_valid && (
                        <Label className="color-theme-1">
                          { this.state.repeat_password_valid }
                        </Label>
                      )}
                    </FormGroup>
                  </Colxx>
                </Row>
                
                <Row className="h-100 mt-5">
                  <Colxx  xxs="12">
                    <FormGroup className="form-group">
                      <CustomInput
                        type="checkbox"
                        name="term_check"
                        id="term_check"
                        label="I agree to the Terms and Conditions and Privacy Policy"
                        checked={this.state.term_check}
                        onChange={event => this.setFieldValue(event.target.checked)}
                      />
                      {!this.state.term_check && (
                        <div className="color-theme-1">
                          You must accept the terms and privacy policy to continue.
                        </div>
                      )}
                    </FormGroup>
                  </Colxx>
                </Row>
                <div className="d-flex justify-content-end align-items-center">
                  <Button
                    color="primary"
                    className={`btn-shadow btn-multiple-state ${this.props.loading ? "show-spinner" : ""}`}
                    size="lg"
                    onClick={() => this.onUserRegister()}
                  >
                    <span className="spinner d-inline-block">
                      <span className="bounce1" />
                      <span className="bounce2" />
                      <span className="bounce3" />
                    </span>
                    <span className="label"><IntlMessages id="user.register-button" /></span>
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Colxx>
      </Row>
    );
  }
}
const mapStateToProps = ({ authUser }) => {
  const { user, loading, error } = authUser;
  return { user, loading, error };
};

export default connect(
  mapStateToProps,
  {
    registerUser
  }
)(Register);
