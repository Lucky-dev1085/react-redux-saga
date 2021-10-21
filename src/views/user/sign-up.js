import React, { Component } from "react";
import { Card, CardBody, FormGroup, Label, Spinner, Row, CustomInput } from "reactstrap";
import Select from "react-select";
import CustomSelectInput from "../../components/common/CustomSelectInput";
import { Colxx } from "../../components/common/CustomBootstrap";
import IntlMessages from "../../helpers/IntlMessages";
import { Wizard, Steps, Step } from 'react-albus';
import { BottomButtonNavigation } from "../../components/wizard/BottomButtonNavigation";
import { TopNavigation } from "../../components/wizard/TopNavigation";
import { Formik, Form, Field } from "formik";
import { countryData } from "../../data/countryData"
import EnLang from "../../lang/entries/en-US"
import { NotificationManager } from "../../components/common/react-notifications";

import { connect } from "react-redux";
import { signupUser } from "../../redux/actions";

import { database } from '../../helpers/Firebase';


class Sign_Up extends Component
{
  constructor(props) {
    super(props);
    this.onClickNext = this.onClickNext.bind(this);
    this.onClickPrev = this.onClickPrev.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.validateFirstName = this.validateFirstName.bind(this);
    this.validateLastName = this.validateLastName.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.validateRepeatPassword = this.validateRepeatPassword.bind(this);
    this.validateTermCheck = this.validateTermCheck.bind(this);

    this.form0 = React.createRef();
    this.form1 = React.createRef();
    this.form2 = React.createRef();

    this.state = {
      plan_id: this.props.match.params.plan,
      yearly: this.props.match.params.yearly,
      prev_user: this.props.user,
      bottomNavHidden: false,
      topNavDisabled: false,
      loading: false,
      selectedOption: "",
      fields: [
          {
              valid: false,
              name: "email",
              value: ""
          },
          {
            valid: false,
            name: "first_name",
            value: ""
          },
          {
            valid: false,
            name: "last_name",
            value: ""
          },
          {
            valid: false,
            name: "password",
            value: ""
          },
          {
            valid: false,
            name: "repeat_password",
            value: ""
          },
          {
            valid: false,
            name: "term_check",
            value: true
          },
          {
              valid: false,
              name: "company_individual",
              value: "company_individual_1"
          },
          {
              valid: false,
              name: "country",
              value: ""
          },
          {
              valid: false,
              name: "state",
              value: ""
          },
          {
              valid: false,
              name: "city",
              value: ""
          },
          {
              valid: false,
              name: "zip",
              value: ""
          },
          {
              valid: false,
              name: "address",
              value: ""
          },
          {
              valid: false,
              name: "company",
              value: ""
          },
          {
              valid: false,
              name: "card_name",
              value: ""
          },
          {
              valid: false,
              name: "card_number",
              value: ""
          },
          {
              valid: false,
              name: "payment",
              value: ""
          }
      ]
    }

    console.log(this.props.match.params.plan, " : ", this.props.match.params.yearly, " : props = ", this.props);
  }

  componentDidMount() {
    this.setState({ fields: [
        { ...this.state.fields[0], form: this.form0 },    
        { ...this.state.fields[1], form: this.form0 }, 
        { ...this.state.fields[2], form: this.form0 }, 
        { ...this.state.fields[3], form: this.form0 }, 
        { ...this.state.fields[4], form: this.form0 },
        { ...this.state.fields[5], form: this.form0 }, 
        { ...this.state.fields[6], form: this.form1 }, 
        { ...this.state.fields[7], form: this.form1 }, 
        { ...this.state.fields[8], form: this.form1 }, 
        { ...this.state.fields[9], form: this.form1 }, 
        { ...this.state.fields[10], form: this.form1 }, 
        { ...this.state.fields[11], form: this.form1 }, 
        { ...this.state.fields[12], form: this.form1 }, 
        { ...this.state.fields[13], form: this.form1 }, 
        { ...this.state.fields[14], form: this.form1 }, 
        { ...this.state.fields[15], form: this.form2 }
      ] 
    });

    console.log(this.state.fields);
  }

  //////////////////////////////////////////////////////////////////
  ///  form 0 //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////

  validateEmail(value) {
      let error;
      if (!value) {
          error = "Please enter your email address";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
          error = "Invalid email address";
      }
      return error;
  }

  validateFirstName(value) {
      let error;
      if (!value) {
          error = "Please enter your first name";
      } else if (value.length < 2) {
          error = "Value must be longer than 2 characters";
      }
      return error;
  }

  validateLastName(value) {
    let error;
    if (!value) {
        error = "Please enter your last name";
    } else if (value.length < 1) {
        error = "Value must be longer than 1 characters";
    }
    return error;
  }

  validatePassword(value) {
      let error;
      if (!value) {
          error = "Please enter your password";
      } else if (value.length < 6) {
          error = "Password must contain a min. of 6 characters";
      }
      return error;
  }

  validateRepeatPassword(value) {
    let error;
    let form = this.state.fields[0].form.current;
    let str_pwd = form.state.values['password'];
    if (!value) {
        error = "You did not repeat your password correctly.";
    } else if (value.length < 6) {
        error = "Password must contain a min. of 6 characters";
    } else if (value !== str_pwd) {
        error = "You did not repeat your password correctly.";
    }
    return error;
  }

  validateTermCheck(value) {
      let error = true;
      if (!value) {
          error = false;
      } 
      return error;
  }

  setFieldValue(val) {
    let fields = this.state.fields;
    fields[5].value = val;
    this.setState({fields});
  }

  //////////////////////////////////////////////////////////////////
  ///  form 1 //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////

  handleCountryChange = (event) => {
    console.log(event);
    let fields = this.state.fields;
    fields[7].value = event;
    this.setState({ 
      selectedOption: event,
      fields: fields
    });
  };

  handleCompany_individualChange (val) {
    console.log(val)
    let fields = this.state.fields;
    fields[6].value = val;
    this.setState({fields});
  }

  validateState(value) {
      let error;
      if (!value) {
          error = "Please enter your state";
      }
      return error;
  }

  validateCity(value) {
    let error;
    if (!value) {
        error = "Please enter your city";
    }
    return error;
  }

  validateZip(value) {
    let error;
    if (!value) {
        error = "Please enter your zip code";
    }
    return error;
  }

  validateAddress(value) {
    let error;
    if (!value) {
        error = "Please enter your address";
    }
    return error;
  }

  validateCompany(value) {
    let error;
    if (!value) {
        error = "Please enter your company name";
    }
    return error;
  }
  
  validateCardName(value) {
    let error;
    if (!value) {
        error = "Please enter the name on your card";
    }
    return error;
  }

  validateCardNumber(value) {
    let error;
    if (!value) {
        error = "Your card details are incorrect";
    }
    return error;
  }

  //////////////////////////////////////////////////////////////////
  ///  form 2 //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////


  //////////////////////////////////////////////////////////////////
  ///    //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////

  hideNavigation() {
    this.setState({ bottomNavHidden: true, topNavDisabled: true });
  }

  asyncLoading () {
      this.setState({ loading: true });
      var value = {
        email: this.state.fields[0].value,
        password: this.state.fields[3].value
      }
      console.log("signup value = ", value);
      if (this.state.fields[0].value !== "" && this.state.fields[3].value !== "") {
        this.props.signupUser(value, this.props.history);
      }
  }

  

  onClickNext(goToNext, steps, step) {
      if (steps.length - 1 <= steps.indexOf(step)) {
          return;
      }
      let formIndex = steps.indexOf(step);
      let form = "";
      if(formIndex === 0)
        form = this.state.fields[0].form.current;
      else if (formIndex === 1)
        form = this.state.fields[6].form.current;
      else if (formIndex === 2)
        form = this.state.fields[15].form.current;
      
      console.log("formIndex = ", formIndex, "  : form = ", form.state);
      form.submitForm().then(() => {
          let fields = this.state.fields;
          if(formIndex === 0){
            fields[0].value = form.state.values['email'];
            fields[0].valid = form.state.errors['email'] ? false : true;

            fields[1].value = form.state.values['first_name'];
            fields[1].valid = form.state.errors['first_name'] ? false : true;
            
            fields[2].value = form.state.values['last_name'];
            fields[2].valid = form.state.errors['last_name'] ? false : true;
            
            fields[3].value = form.state.values['password'];
            fields[3].valid = form.state.errors['password'] ? false : true;
            
            fields[4].value = form.state.values['repeat_password'];
            fields[4].valid = form.state.errors['repeat_password'] ? false : true;
            
            this.setState({ fields });
            console.log(this.state.fields);
            
            if (!form.state.errors['email'] && 
                !form.state.errors['first_name'] && 
                !form.state.errors['last_name'] && 
                !form.state.errors['password'] && 
                !form.state.errors['repeat_password'] && 
                fields[5].value) 
            {
                goToNext();
                step.isDone = true;
                if (steps.length - 2 <= steps.indexOf(step)) {
                    this.hideNavigation();
                    this.asyncLoading();
                }
            }
          } else if (formIndex === 1) {
            fields[8].value = form.state.values['state'];
            fields[8].valid = form.state.errors['state'] ? false : true;

            fields[9].value = form.state.values['city'];
            fields[9].valid = form.state.errors['city'] ? false : true;

            fields[10].value = form.state.values['zip'];
            fields[10].valid = form.state.errors['zip'] ? false : true;

            fields[11].value = form.state.values['address'];
            fields[11].valid = form.state.errors['address'] ? false : true;

            fields[12].value = form.state.values['company'];
            fields[12].valid = form.state.errors['company'] ? false : true;

            fields[13].value = form.state.values['card_name'];
            fields[13].valid = form.state.errors['card_name'] ? false : true;

            fields[14].value = form.state.values['card_number'];
            fields[14].valid = form.state.errors['card_number'] ? false : true;

            this.setState({ fields });
            console.log(this.state.fields);

            if (!form.state.errors['state'] && 
                !form.state.errors['city'] && 
                !form.state.errors['zip'] && 
                !form.state.errors['address'] && 
                !form.state.errors['card_name'] && 
                !form.state.errors['card_number']) 
            {
              if(fields[6].value === "company_individual_1" && !form.state.errors['company']) {
                goToNext();
                step.isDone = true;
                if (steps.length - 2 <= steps.indexOf(step)) {
                    this.hideNavigation();
                    this.asyncLoading();
                }
              }
              else if (fields[6].value === "company_individual_2") {
                goToNext();
                step.isDone = true;
                if (steps.length - 2 <= steps.indexOf(step)) {
                    this.hideNavigation();
                    this.asyncLoading();
                }
              }
                
            }

          } else if (formIndex === 2) {
              goToNext();
              step.isDone = true;
              if (steps.length - 2 <= steps.indexOf(step)) {
                  this.hideNavigation();
                  this.asyncLoading();
              }
          }
          
      });
  }

  onClickPrev(goToPrev, steps, step) {
      if (steps.indexOf(step) <= 0) {
          return;
      }
      goToPrev();
  }

  componentDidUpdate() {
    if (this.props.error) {
      NotificationManager.warning(
        this.props.error,
        "Sign up Error",
        3000,
        null,
        null,
        ''
      );
    }
  }

  signup_process() {
    console.log("************************sign process");
    var onComplete = function(error) {
      if (error) {
          console.log('***********Operation failed');
          NotificationManager.warning(
            "DATABASE CONNECT ERROR!!!",
            "Sign up Error",
            3000,
            null,
            null,
            ''
          );
      } else {
          console.log('********** Operation completed');

          var date = new Date().getDate(); //Current Date
          var month = new Date().getMonth() + 1; //Current Month
          var year = new Date().getFullYear(); //Current Year
          
          var planRef = database.ref().child("User_Plan");
          planRef.push({
            "uid": this.props.user,
            "plan_id": this.state.plan_id,
            "start_date": year + "-" + month + "-" + date,
            "yearly": this.state.yearly
          }, function(error){
            if(error) {
              NotificationManager.warning(
                "DATABASE CONNECT ERROR!!!",
                "Sign up Error",
                3000,
                null,
                null,
                ''
              );
            } else {
              console.log("---------success");
              this.setState({ loading: false });

              setTimeout(() => {
                this.props.history.push("/");
              }, 2000);
            }
          }.bind(this));
      }
    }.bind(this);

    var userRef = database.ref().child("Users");
 
    userRef.push({
      "uid": this.props.user,
      "email": this.state.fields[0].value,
      "first_name": this.state.fields[1].value,
      "last_name": this.state.fields[2].value,
      "company_individual": this.state.fields[6].value,
      "country": this.state.fields[7].value.key,
      "state": this.state.fields[8].value,
      "city": this.state.fields[9].value,
      "zip_code": this.state.fields[10].value,
      "address": this.state.fields[11].value,
      "company": this.state.fields[12].value,
      "card_name": this.state.fields[13].value,
      "card_number": this.state.fields[14].value,
      "role": 1,
      "parent_uid": "",
      "profile_url": "https://firebasestorage.googleapis.com/v0/b/gogo-react-login-511d1.appspot.com/o/images%2F3ac23881-a840-4d4a-b09e-793c75922d18.png?alt=media&token=de502cec-4f3b-4dd8-b91f-75e34ab93528",
      "lang": 0,
      "sites": [
        {
          "site_id": "",
          "site_role": 0
        }
      ]
    }, onComplete);


  }

  render() {
    const { messages } = EnLang;
    console.log("signup props = ", this.props);
    if(this.props.user !== "" && 
      this.props.user !== null &&
      this.props.error === "" && 
      this.state.prev_user !== this.props.user &&
      this.state.loading)
    {
      this.signup_process();
    }

    return (
      <Row>
        <Colxx xxs="2"></Colxx>
        <Colxx xxs="8">
          <Card>
            <CardBody className="wizard wizard-default">
                <Wizard>
                    <TopNavigation className="justify-content-center" disableNav={true} />
                    <Steps>
                        <Step id="step1" name={messages["sign_up.step-name-1"]} desc=''>
                            <div className="wizard-basic-step">
                                <Formik
                                    ref={this.form0}
                                    initialValues={{
                                        email: this.state.fields[0].value,
                                        first_name: this.state.fields[1].value,
                                        last_name: this.state.fields[2].value,
                                        password: this.state.fields[3].value,
                                        repeat_password: this.state.fields[4].value
                                    }}
                                    onSubmit={() => { }}>
                                    {({ errors, touched }) => (
                                        <Form className="av-tooltip tooltip-label-bottom">
                                            <Label>{messages["sign_up.step-1-form-name"]}</Label>
                                            <Row className="h-100 mt-4">
                                              <Colxx xxs="6">
                                                <FormGroup className="form-group">
                                                  <Label>
                                                    <IntlMessages id="sign_up.step-1-email" />
                                                  </Label>
                                                  <Field
                                                    className="form-control"
                                                    name="email"
                                                    validate={this.validateEmail}
                                                  />
                                                  {errors.email && touched.email && (
                                                    <div className="invalid-feedback d-block">
                                                      {errors.email}
                                                    </div>
                                                  )}
                                                </FormGroup>
                                              </Colxx>
                                              <Colxx xxs="6"></Colxx>
                                            </Row>

                                            <Row className="h-100 mt-5">
                                              <Colxx xxs="6">
                                                <FormGroup className="form-group">
                                                  <Label>
                                                    <IntlMessages id="sign_up.step-1-first-name" />
                                                  </Label>
                                                  <Field
                                                    className="form-control"
                                                    name="first_name"
                                                    validate={this.validateFirstName}
                                                  />
                                                  {errors.first_name && touched.first_name && (
                                                    <div className="invalid-feedback d-block">
                                                      {errors.first_name}
                                                    </div>
                                                  )}
                                                </FormGroup>
                                              </Colxx>
                                              <Colxx xxs="6">
                                                <FormGroup className="form-group">
                                                  <Label>
                                                    <IntlMessages id="sign_up.step-1-last-name" />
                                                  </Label>
                                                  <Field
                                                    className="form-control"
                                                    name="last_name"
                                                    validate={this.validateLastName}
                                                  />
                                                  {errors.last_name && touched.last_name && (
                                                    <div className="invalid-feedback d-block">
                                                      {errors.last_name}
                                                    </div>
                                                  )}
                                                </FormGroup>
                                              </Colxx>
                                            </Row>

                                            <Row className="h-100 mt-5">
                                              <Colxx xxs="6">
                                                <FormGroup className="form-group">
                                                  <Label>
                                                    <IntlMessages id="sign_up.step-1-pass" />
                                                  </Label>
                                                  <Field
                                                    className="form-control"
                                                    name="password"
                                                    type="password"
                                                    validate={this.validatePassword}
                                                  />
                                                  {errors.password && touched.password && (
                                                    <div className="invalid-feedback d-block">
                                                      {errors.password}
                                                    </div>
                                                  )}
                                                </FormGroup>
                                              </Colxx>
                                              <Colxx xxs="6">
                                                <FormGroup className="form-group">
                                                  <Label>
                                                    <IntlMessages id="sign_up.step-1-repeat-pass" />
                                                  </Label>
                                                  <Field
                                                    className="form-control"
                                                    name="repeat_password"
                                                    type="password"
                                                    validate={this.validateRepeatPassword}
                                                  />
                                                  {errors.repeat_password && touched.repeat_password && (
                                                    <div className="invalid-feedback d-block">
                                                      {errors.repeat_password}
                                                    </div>
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
                                                    checked={this.state.fields[5].value}
                                                    onChange={event => this.setFieldValue(event.target.checked)}
                                                  />
                                                  {!this.state.fields[5].value && (
                                                    <div className="color-theme-1">
                                                      You must accept the terms and privacy policy to continue.
                                                    </div>
                                                  )}
                                                </FormGroup>
                                              </Colxx>
                                              
                                            </Row>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </Step>
                        <Step id="step2" name={messages["sign_up.step-name-2"]} desc=''>
                            <div className="wizard-basic-step">
                                <Formik
                                    ref={this.form1}
                                    initialValues={{
                                        state: this.state.fields[7].value,
                                        city: this.state.fields[8].value,
                                        zip: this.state.fields[9].value,
                                        address: this.state.fields[10].value,
                                        company: this.state.fields[11].value,
                                        card_name: this.state.fields[12].value,
                                        card_number: this.state.fields[13].value,
                                    }}
                                    onSubmit={() => { }}>
                                    {({ errors, touched }) => (
                                        <Form className="av-tooltip tooltip-label-right">
                                            <Row className="h-100 mt-4">
                                              <Colxx xxs="6">
                                                <Label className="text-one">
                                                  Hi {this.state.fields[1].value}, nice to have you around!
                                                </Label>
                                                <br />
                                                <Label className="text-one font-weight-bold">
                                                  Add your payment info 
                                                </Label>
                                                <Label className="text-one">&nbsp;and you are good to go.</Label>
                                              </Colxx>
                                            </Row>
                                            <Label className="text-large font-weight-bold mt-4">
                                              {messages["sign_up.step-2-form-name"]}
                                            </Label>
                                            <FormGroup className="mt-4">
                                              <div>
                                                <CustomInput
                                                  type="radio"
                                                  id="company_individual_1"
                                                  name="company_individual"
                                                  label="Company"
                                                  value="company_individual_1"
                                                  checked={this.state.fields[6].value === 'company_individual_1'}
                                                  onChange={changeEvent => this.handleCompany_individualChange(changeEvent.target.value)}
                                                  inline
                                                />
                                                <CustomInput
                                                  type="radio"
                                                  id="company_individual_2"
                                                  name="company_individual"
                                                  label="Individual"
                                                  value="company_individual_2"
                                                  checked={this.state.fields[6].value === 'company_individual_2'}
                                                  onChange={changeEvent => this.handleCompany_individualChange(changeEvent.target.value)}
                                                  inline
                                                />
                                              </div>
                                            </FormGroup>
                                            <Row className="h-100 mt-4">
                                              <Colxx xxs="6">
                                                <FormGroup className="form-group">
                                                  <Label>
                                                    <IntlMessages id="sign_up.step-2-country" />
                                                  </Label>
                                                  <Select
                                                    components={{ Input: CustomSelectInput }}
                                                    className="react-select"
                                                    classNamePrefix="react-select"
                                                    name="country"
                                                    value={this.state.selectedOption}
                                                    onChange={(event) => this.handleCountryChange(event)}
                                                    options={countryData}
                                                  />
                                                  {errors.country && touched.country && (
                                                    <div className="invalid-feedback d-block">
                                                      {errors.country}
                                                    </div>
                                                  )}
                                                </FormGroup>
                                              </Colxx>
                                              <Colxx xxs="6">
                                                <FormGroup className="form-group">
                                                  <Label>
                                                    <IntlMessages id="sign_up.step-2-state" />
                                                  </Label>
                                                  <Field
                                                    className="form-control"
                                                    name="state"
                                                    validate={this.validateState}
                                                  />
                                                  {errors.state && touched.state && (
                                                    <div className="invalid-feedback d-block">
                                                      {errors.state}
                                                    </div>
                                                  )}
                                                </FormGroup>
                                              </Colxx>
                                            </Row>
                                            <Row className="h-100 mt-4">
                                              <Colxx xxs="6">
                                                <FormGroup className="form-group">
                                                  <Label>
                                                    <IntlMessages id="sign_up.step-2-city" />
                                                  </Label>
                                                  <Field
                                                    className="form-control"
                                                    name="city"
                                                    validate={this.validateCity}
                                                  />
                                                  {errors.city && touched.city && (
                                                    <div className="invalid-feedback d-block">
                                                      {errors.city}
                                                    </div>
                                                  )}
                                                </FormGroup>
                                              </Colxx>
                                              <Colxx xxs="6">
                                                <FormGroup className="form-group">
                                                  <Label>
                                                    <IntlMessages id="sign_up.step-2-zip" />
                                                  </Label>
                                                  <Field
                                                    className="form-control"
                                                    name="zip"
                                                    validate={this.validateZip}
                                                  />
                                                  {errors.zip && touched.zip && (
                                                    <div className="invalid-feedback d-block">
                                                      {errors.zip}
                                                    </div>
                                                  )}
                                                </FormGroup>
                                              </Colxx>
                                            </Row>
                                            <Row className="h-100 mt-4">
                                              <Colxx xxs="12">
                                                <FormGroup className="form-group">
                                                  <Label>
                                                    <IntlMessages id="sign_up.step-2-address" />
                                                  </Label>
                                                  <Field
                                                    className="form-control"
                                                    name="address"
                                                    validate={this.validateAddress}
                                                  />
                                                  {errors.address && touched.address && (
                                                    <div className="invalid-feedback d-block">
                                                      {errors.address}
                                                    </div>
                                                  )}
                                                </FormGroup>
                                              </Colxx>
                                            </Row>
                                            {this.state.fields[6].value === "company_individual_1" && (
                                              <Row className="h-100 mt-4">
                                                <Colxx xxs="6">
                                                  <FormGroup className="form-group">
                                                    <Label>
                                                      <IntlMessages id="sign_up.step-2-company" />
                                                    </Label>
                                                    <Field
                                                      className="form-control"
                                                      name="company"
                                                      validate={this.validateCompany}
                                                    />
                                                    {errors.company && touched.company && (
                                                      <div className="invalid-feedback d-block">
                                                        {errors.company}
                                                      </div>
                                                    )}
                                                  </FormGroup>
                                                </Colxx>
                                                <Colxx xxs="6"></Colxx>
                                              </Row>)
                                            }

                                            <Label className="text-large font-weight-bold mt-4">
                                              {messages["sign_up.step-2-form-name-2"]}
                                            </Label>
                                            <Row className="h-100 mt-4">
                                              <Colxx xxs="6">
                                                <FormGroup className="form-group">
                                                  <Label>
                                                    <IntlMessages id="sign_up.step-2-card-holder-name" />
                                                  </Label>
                                                  <Field
                                                    className="form-control"
                                                    name="card_name"
                                                    validate={this.validateCardName}
                                                  />
                                                  {errors.card_name && touched.card_name && (
                                                    <div className="invalid-feedback d-block">
                                                      {errors.card_name}
                                                    </div>
                                                  )}
                                                </FormGroup>

                                                <FormGroup className="form-group">
                                                  <Label>
                                                    <IntlMessages id="sign_up.step-2-card-number" />
                                                  </Label>
                                                  <Field
                                                    className="form-control"
                                                    name="card_number"
                                                    validate={this.validateCardNumber}
                                                  />
                                                  {errors.card_number && touched.card_number && (
                                                    <div className="invalid-feedback d-block">
                                                      {errors.card_number}
                                                    </div>
                                                  )}
                                                </FormGroup>
                                              </Colxx>
                                              <Colxx xxs="6"></Colxx>
                                            </Row>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </Step>
                        <Step id="step3" name={messages["sign_up.step-name-3"]} desc=''>
                            <div className="wizard-basic-step">
                                <Formik
                                    ref={this.form2}
                                    initialValues={{
                                        
                                    }}
                                    onSubmit={() => { }}>
                                    {({ errors, touched }) => (
                                        <Form className="av-tooltip tooltip-label-right error-l-75">
                                            <FormGroup>
                                                <Label>{messages["sign_up.step-3-form-name"]}</Label>
                                                <Row className="mt-5 text-center">
                                                  <Colxx xxs="12">
                                                    <h1>
                                                      Payment!!!
                                                    </h1>
                                                  </Colxx>
                                                </Row>
                                            </FormGroup>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </Step>
                        <Step id="step4" hideTopNav={true}>
                            <div className="wizard-basic-step text-center pt-3">
                                {
                                    this.state.loading ? (
                                        <div>
                                            <Spinner color="primary" className="mb-1" />
                                            <h2 className="mb-3"><IntlMessages id="sign_up.creating-account" /></h2>
                                            <p><IntlMessages id="sign_up.please-wait" /></p>
                                        </div>
                                    ) : (
                                            <div>
                                                <h2 className="mb-2"><IntlMessages id="sign_up.create-thanks" /></h2>
                                                <p><IntlMessages id="sign_up.create-account-successed" /></p>
                                            </div>
                                        )
                                }
                            </div>
                        </Step>
                    </Steps>
                    <BottomButtonNavigation 
                      onClickNext={this.onClickNext} 
                      className={"justify-content-left mt-5 " + (this.state.bottomNavHidden && "invisible")} 
                      continueLabel={messages["sign_up.continue"]} 
                      finishLabel={messages["sign_up.finish-up"]} 
                      paymentLabel={messages["sign_up.payment"]} 
                    />
                </Wizard>
            </CardBody>
          </Card>
        </Colxx>
        <Colxx xxs="2"></Colxx>
      </Row>
        
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { user, loading, error  } = authUser;
  return { user, loading, error  };
};

export default connect(
  mapStateToProps,
  {
    signupUser
  }
)(Sign_Up);