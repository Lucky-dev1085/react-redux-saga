import React, { Component } from "react";
import { Row, Card, CardTitle, Form, Label, Input, Button } from "reactstrap";
import { NavLink } from "react-router-dom";
import { Colxx } from "../../components/common/CustomBootstrap";
import IntlMessages from "../../helpers/IntlMessages";

import { NotificationManager } from "../../components/common/react-notifications";

import { auth } from "../../helpers/Firebase";

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ""
    };
  }

  emailChange(value) {
    this.setState({
      email: value
    })
  }

  forgot_password() {
    let error = "";
    var value = this.state.email;
    if (!value) {
      error = "Please enter your email address";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = "Invalid email address";
    }

    if(error !== "")
    {
      NotificationManager.warning(
        error,
        "Error",
        3000,
        null,
        null,
        ''
      );
      return;
    }

    auth.sendPasswordResetEmail(value)
      .then(function (user) {
        NotificationManager.success(
          "Please check your email...",
          "Success",
          3000,
          null,
          null,
          ''
        );
        setTimeout(() => {
          window.location.href = "/app";
        }, 3000);
      }).catch(function (e) {
        console.log(e);
        NotificationManager.warning(
          'please try again later',
          "Error",
          3000,
          null,
          null,
          ''
        );
    })
  }

  render() {
    return (
      <Row className="h-100">
        <Colxx xxs="12" md="6" className="mx-auto my-auto">
          <Card className="auth-card">
            {/* <div className="position-relative image-side ">
              <p className="text-white h2">MAGIC IS IN THE DETAILS</p>
              <p className="white mb-0">
                Please use your e-mail to reset your password. <br />
                If you are not a member, please{" "}
                <NavLink to={`/register`} className="white">
                  register
                </NavLink>
                .
              </p>
            </div> */}
            <div className="form-side1">
              <NavLink to={`/`} className="white">
                <span className="logo-single" />
              </NavLink>
              <CardTitle className="mb-4">
                <IntlMessages id="user.forgot-password" />
              </CardTitle>
              <Form>
                <Label className="form-group has-float-label mb-4">
                  <Input type="email" defaultValue={this.state.email} onChange={event => this.emailChange(event.target.value)}/>
                  <IntlMessages id="user.email" />
                </Label>

                <div className="d-flex justify-content-end align-items-center">
                  <Button
                    color="primary"
                    className="btn-shadow"
                    size="lg"
                    onClick={() => this.forgot_password()}
                  >
                    <IntlMessages id="user.reset-password-button" />
                  </Button>
                </div>
              </Form>
            </div>
          </Card>
        </Colxx>
      </Row>
    );
  }
}
