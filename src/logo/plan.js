import React, { Component, Fragment } from "react";
import { NavLink } from "react-router-dom";
import { Button, Row, Card, CardBody, CardTitle } from "reactstrap";
import { Colxx } from "../components/common/CustomBootstrap";
import IntlMessages from "../helpers/IntlMessages";
import GlideComponent from "../components/carousel/GlideComponent";

import { plansData } from "../data/planData"

import Switch from "rc-switch";
import "rc-switch/assets/index.css";

import { database } from '../helpers/Firebase';

// import {defaultLocale} from '../constants/defaultValues'

// const locale = localStorage.getItem('currentLanguage') || defaultLocale;

const PlanItem = ({ title, price, detail, link, features, yearly, plan_id}) => {
  return (
    <div className="glide-item">      
      <Card>
          <CardBody className="pt-5 pb-5 d-flex flex-lg-column flex-md-row flex-sm-row flex-column text-center">
              <div className="price-top-part">
                  {/* <i className={"large-icon " + icon}></i> */}
                  <h5 className="mb-0 font-weight-semibold color-theme-1 mb-4">{title}</h5>
                  <p className="text-large mb-2 color-theme-2 font-weight-bold">{price}</p>
                  <p className="text-muted text-small mt-3">{detail}</p>
              </div>
              <div className="pl-3 pr-3 pt-3 pb-0 d-flex price-feature-list flex-column flex-grow-1">
                  <ul className="list-unstyled">
                      {
                          features.map((feature, index) => {
                              return (
                                  <li key={index}>
                                      <p className="mb-2 text-medium">{feature}</p>
                                  </li>
                              )
                          })
                      }
                  </ul>
                  <div className="text-center">
                    <NavLink to={'/sign_up/' + plan_id + '/' + yearly } >
                      <Button outline color="secondary" className="mb-2">
                        <IntlMessages id="plans.choose" />
                      </Button>
                    </NavLink>
                      <br />
                      {/* <NavLink to={link} className="btn color-theme-2 btn-empty btn-lg"> */}
                      <span className="btn color-theme-2 btn-empty btn-lg" onClick={() => {
                        console.log("------detail -----", title);
                      }}>    
                        <IntlMessages id="plans.detail" /> <i className="simple-icon-arrow-down" /> 
                      </span>
                      {/* </NavLink> */}
                  </div>
              </div>
          </CardBody>
      </Card>

    </div>
  );
};

function setThousandSeperate( inNumber ) {
  var outStr = '';
  var dec = '';
  var pos = 0;
  var arr = [];
  // console.log("inNumber = ", inNumber);
  if(inNumber === 0.0) return "";
  if(inNumber === parseInt(inNumber)){
    outStr = inNumber.toString();
    pos = outStr.length;
  }
  else 
  {
    outStr = inNumber.toString();
    pos = outStr.indexOf(".");
    
    var len = outStr.length;
    if((len - pos) >= 4)
      dec = outStr.substr(pos, 4);
    else
      dec = outStr.substr(pos, (len - pos));
  }
  
  while(pos > 0)
  {
    if(pos > 3)
    { 
      arr.push(outStr.substr(pos-3, 3));
    }
    else 
    {
      arr.push(outStr.substr(0,pos));
    }
    pos -= 3;
  }
  arr.reverse();
  outStr = arr.toString();
  return outStr + dec;
}

class Plan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      switchYearlyPaid: false,
      plansData: plansData
    };
  }

  componentDidMount() {
    this.getPlanList(this.state.switchYearlyPaid);
  }

  onChangePaid( paidStatus ) {
    console.log("paidStatus = ", paidStatus);
    this.getPlanList(paidStatus);
  }

  getPlanList( paidStatus ) {
    var planData_list = [];
    database.ref('/Plan_List/en').once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
          var childData = childSnapshot.val();
          var price = (paidStatus ? childData.price * 10 : childData.price * 1);
          
          price = setThousandSeperate(price);
          // console.log("+++price", price);
          var showData = {
              title: childData.name,
              price: '$' + price,
              detail: 'USD/MONTH',
              link: '#',
              features: []
          };
          showData.features.push(setThousandSeperate(childData.install_num) + ' WordPress install');
          showData.features.push(setThousandSeperate(childData.monthly_visits) + ' visits');
          showData.features.push(setThousandSeperate(childData.SSD_stroage) + ' GB disk space');
          showData.features.push('Free SSL & CDN');

          planData_list.push(showData);
      });
      // console.log("-------------plandata_list", planData_list);
      this.setState({
        plansData: planData_list,
        switchYearlyPaid: paidStatus
      });
    }.bind(this));  
  }

  render() {
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
                  <IntlMessages id="plans.title" />
                </div>
                <div className="text-medium mb-2 white font-weight-bold text-center">
                  <IntlMessages id="plans.title-detail" />
                </div>
              </CardTitle>
            </Colxx>
            <Colxx xxs="12" className="pl-0 pr-0 mb-5 mt-5">

              <GlideComponent 
                settings={ 
                  { 
                    gap: 5, 
                    perView: 4,
                    type: "carousel", 
                    breakpoints: { 
                      480: { perView: 1 }, 
                      800: { perView: 2 }, 
                      1200: { perView: 3 } 
                    }, 
                    hideNav: false
                  } 
                } 
                total={
                  this.state.plansData.length
                }
              >
                {
                  this.state.plansData.map((plan_data, index) => {
                    return (
                      <div key={index}>
                        <PlanItem {...plan_data} yearly={this.state.switchYearlyPaid} plan_id={index + 1} />
                      </div>
                    )
                  })
                }
    
              </GlideComponent>

            </Colxx>
          </Row>
          
          <Row className="mt-5 text-center white font-weight-bold">
            <Colxx xxs="12" className="white font-weight-bold text-one">
              
              <span className="text-one"><IntlMessages id="logo.paid-monthly" /></span>

              <Switch
                className="custom-switch custom-switch-primary custom-switch-large ml-2 mr-2"
                checked={this.state.switchYearlyPaid}
                onChange={switchYearlyPaid => { this.onChangePaid(switchYearlyPaid)}}
              />

              <span className="text-one"><IntlMessages id="logo.paid-yearly" /></span>
              <span className="text-muted"> - <IntlMessages id="logo.paid-yearly-detail" /></span>
            </Colxx>
          </Row>
          

        </div>
      </Fragment>
    )
  }
}

export default Plan;
