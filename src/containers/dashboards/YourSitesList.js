import React from "react";
import { Card, CardBody, CardTitle, Table } from "reactstrap";
//import ReactTable from "react-table";

import IntlMessages from "../../helpers/IntlMessages";
//import Pagination from "../../components/DatatablePagination";

//import data from "../../data/YourSitesList";

const YourSitesList = ({title="dashboards.your-sites-list"}) => {
  // const columns = [
  //   {
  //     Header: "Name",
  //     accessor: "title",
  //     Cell: props => <p className="list-item-heading">{props.value}</p>
  //   },
  //   {
  //     Header: "visits",
  //     accessor: "visits",
  //     Cell: props => <p className="text-muted">{props.value}</p>
  //   }
  // ];
  return (
    <Card className="h-100">
      <CardBody>
        <CardTitle>
          <IntlMessages id={title} />
        </CardTitle>
        {/* <ReactTable
          defaultPageSize={3}
          data={data.slice(0, 12)}
          columns={columns}
          minRows={0}
          showPageJump={false}
          showPageSizeOptions={false}
          PaginationComponent={Pagination}
        /> */}
        <Table hover>
          <thead>
            <tr>
              <th className="w-70">Name</th>
              <th className="w-30 text-right">Visits</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Test Sites</td>
              <td className="text-right">10</td>
            </tr>
            <tr>
              <td>Test---Sites</td>
              <td className="text-right">5</td>
            </tr>
            <tr>
              <td>Test Sites111</td>
              <td className="text-right">10</td>
            </tr>
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};
export default YourSitesList;
