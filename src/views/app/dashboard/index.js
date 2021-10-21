import React, { Component, Fragment } from "react";
import { Row } from "reactstrap";
// import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";

import YourSitesList from '../../../containers/dashboards/YourSitesList';
import ResourceUsage from '../../../containers/dashboards/ResourceUsage';
import YourInvoices from '../../../containers/dashboards/YourInvoices';

import DataTransfer from '../../../containers/dashboards/DataTransfer';
import UniqueVisits from '../../../containers/dashboards/UniqueVisits';

class Dashboard extends Component {
  render() {
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="menu.dashboard" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        
        <Row>
          <Colxx sm="12" lg="4" className="mb-4">
            <YourSitesList />
          </Colxx>
          <Colxx md="6" lg="4" className="mb-4">
            <ResourceUsage />
          </Colxx>
          <Colxx md="6" lg="4" className="mb-4">
            <YourInvoices />
          </Colxx>
        </Row>

        <Row>
          <Colxx sm="12" md="6" className="mb-4">
            <DataTransfer />
          </Colxx>
          <Colxx sm="12" md="6" className="mb-4">
            <UniqueVisits />
          </Colxx>
        </Row>

      </Fragment>
    )
  }
}
export default Dashboard;
