import React from "react";
import {
  Card,
  CardBody,
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu
} from "reactstrap";

import IntlMessages from "../../helpers/IntlMessages";
import {AreaChart} from "../../components/charts";

import { conversionChartData } from "../../data/charts";

const UniqueVisits = ({ className = "", controls = false }) => {
  return (
    <Card className={`${className} dashboard-filled-line-chart`}>
      <CardBody>
        <div className="float-left float-none-xs">
          <div className="d-inline-block">
            <h5 className="d-inline">
              <IntlMessages id="dashboards.unique-visits" />
            </h5>
            {/* <span className="text-muted text-small d-block">
              <IntlMessages id="dashboards.per-session" />
            </span> */}
          </div>
        </div>
        {controls && (
          <div className="btn-group float-right float-none-xs mt-2">
            <UncontrolledDropdown>
              <DropdownToggle caret color="secondary" className="btn-xs" outline>
                <IntlMessages id="dashboards.this-week" />
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>
                  <IntlMessages id="dashboards.last-week" />
                </DropdownItem>
                <DropdownItem>
                  <IntlMessages id="dashboards.this-month" />
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        )}
      </CardBody>

      <div className="chart card-body pt-0">
        <AreaChart shadow data={conversionChartData} />
      </div>
    </Card>
  );
};

export default UniqueVisits;
