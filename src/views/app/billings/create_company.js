import React, { Component, Fragment } from "react";
import { Row } from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";

export default class CreateCompany extends Component {
    render() {
        return (
            <Fragment>
            <Row>
              <Colxx xxs="12">
                <h1><IntlMessages id="create-company.title" /></h1>
                <Separator className="mb-5" />
              </Colxx>
            </Row>
            <Row>
              <Colxx xxs="12" className="mb-4">
                <p><IntlMessages id="menu.blank-page"/></p>
              </Colxx>
            </Row>
          </Fragment>
        )
    }
}
