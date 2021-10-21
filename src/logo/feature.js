import React, { Component, Fragment } from "react";
import { NavLink } from "react-router-dom";
import { Row, CardTitle } from "reactstrap";
import { Colxx } from "../components/common/CustomBootstrap";
import IntlMessages from "../helpers/IntlMessages";

class Features extends Component {
  constructor(props) {
    super(props);
    console.log("feature = ", props);
  }

  render() {
    // const { match } = this.props;
    return (
      <Fragment>
        <div className="bg--image--tech pb--60 bg--gradient--purple-light-blue">
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

          <Row className="mt-5">
            <Colxx xxs="12">
              <CardTitle>
                <div className="text-large mb-2 white font-weight-bold text-center">
                  <IntlMessages id="features.title" />
                </div>
                <div className="text-medium mb-2 white font-weight-bold text-center">
                  <IntlMessages id="features.title-detail" />
                </div>
              </CardTitle>
            </Colxx>
          </Row>

        </div>
      </Fragment>
    )
  }
}

export default Features;