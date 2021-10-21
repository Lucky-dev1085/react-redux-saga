import React, { Component } from "react";
import { Row } from "reactstrap";
import { NavLink } from "react-router-dom";
import LogoLayout from '../layout/LogoLayout';

import { Colxx } from "../components/common/CustomBootstrap";
import IntlMessages from "../helpers/IntlMessages";

class Logo extends Component {
  constructor(props) {
    super(props);
    console.log("logo");
    console.log(props);
  }

  render() {
    return (
      <LogoLayout>
          <Row className="h-100">
            <Colxx xxs="6">

            </Colxx>
            <Colxx xxs="6" md="6" className="mt-5 text-right font-weight-bold">
              <NavLink to={`/show_plan`} className="white mr-4">
                <IntlMessages id="logo.plan-button" />
              </NavLink>
              <NavLink to={`/show_features`} className="white mr-4">
                <IntlMessages id="logo.features-button" />
              </NavLink>
              <NavLink to={`/show_clients`} className="white mr-4">
                <IntlMessages id="logo.clients-button" />
              </NavLink>
              <NavLink to={`/show_contact`} className="white mr-4">
                <IntlMessages id="logo.contact-button" />
              </NavLink>
              <NavLink to={`/view_main`} className="white mr-5">
                <i className="iconsminds-male" /><IntlMessages id="logo.login-button" />
              </NavLink>
            </Colxx>
          </Row>
      </LogoLayout>
    );
  }
}

export default Logo;