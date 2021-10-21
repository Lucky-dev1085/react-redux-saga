import React, { Component, Fragment } from "react";
import { Row, Table } from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import { Formik, Form, Field } from "formik";
import Select from "react-select";
import CustomSelectInput from "../../../components/common/CustomSelectInput";

import firebase from "firebase";
// import FileUploader from "react-firebase-file-uploader";
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import { NotificationManager } from "../../../components/common/react-notifications";

// import axios from 'axios';

import Switch from "rc-switch";
import "rc-switch/assets/index.css";

import { userLangData } from "../../../data/userLangData";
import { countryData } from "../../../data/countryData"

import { 
  Button, 
  Card, 
  CardBody, 
  Label,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip 
} from "reactstrap";

import { connect } from "react-redux";

import { database, auth } from '../../../helpers/Firebase';


class UserSetting extends Component {
  constructor(props) {
    super(props);

    this.form0 = React.createRef();

    this.state = {
      resetPassword: false,
      twoFactorStatus: false,
      enableTwoFactor: false,
      addSSH: false,
      sshList: [],
      sshDelToltipOpen: false,
      addSubscribe: false,
      subscribeStatus: false,
      selectedsubscribeOption: "",
      selectedCountryOption: "",
      switchMessage: true,
      switchEmail: true,
      selectedOption: "",
      role: "",
      company: "",
      selectedFile: null,
      avatar: "",
      isUploading: false,
      progress: 0,
      avatarURL: "https://firebasestorage.googleapis.com/v0/b/gogo-react-login-511d1.appspot.com/o/images%2F3ac23881-a840-4d4a-b09e-793c75922d18.png?alt=media&token=de502cec-4f3b-4dd8-b91f-75e34ab93528",
      fields: [
        {
            valid: "",
            name: "email",
            value: ""
        },
        {
          valid: "",
          name: "first_name",
          value: ""
        },
        {
          valid: "",
          name: "last_name",
          value: ""
        },
        {
          valid: "",
          name: "user_lang",
          value: ""
        },
        {
          valid: "",
          name: "current_pwd",
          value: ""
        },
        {
          valid: "",
          name: "new_pwd",
          value: ""
        },
        {
          valid: "",
          name: "country",
          value: ""
        },
        {
          valid: "",
          name: "cellphone_number",
          value: ""
        },
        {
          valid: "",
          name: "ssh_label",
          value: ""
        },
        {
          valid: "",
          name: "ssh_key",
          value: ""
        },
        {
          valid: "",
          name: "subscribe",
          value: ""
        },
      ]
    }
  }

  componentDidMount() {
    this.getUserList();
  }

  getUserList() {
    var email = "";
    var first_name = "";
    var last_name = "";
    var profile_url = "";
    var roleName = "";
    var company = "";
    var lang = 0;

    database.ref('/Users')
      .orderByChild('uid')
      .equalTo(this.props.loginUser).once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          console.log("snapshot = ", childSnapshot.val());
          var childData = childSnapshot.val();

          first_name = childData.first_name;
          last_name = childData.last_name;
          email = childData.email;
          profile_url = childData.profile_url;
          company = childData.company;
          lang = childData.lang;
          var role = childData.role;
          switch(role) {
            case 1: 
              roleName = "Company owner";
              break;
            case 2: 
              roleName = "Company administrator";
              break;
            case 3: 
              roleName = "Company developer";
              break;
            case 4: 
              roleName = "Company billing";
              break;
            case 5: 
              roleName = "Site administrator";
              break;
            case 6: 
              roleName = "Site developer";
              break;
            default:
              roleName = "";
              break;
          }
        })

        let fields = this.state.fields;
        fields[0].value = email;
        fields[1].value = first_name;
        fields[2].value = last_name;
        fields[3].value = userLangData[lang];
        this.setState({
          fields: fields,
          company: company,
          role: roleName,
          avatarURL: profile_url,
          selectedOption: userLangData[lang]
        });

    }.bind(this)); 

    database.ref("/FA_2/" + this.props.loginUser).once('value', function(snapshot) {
      console.log("2FA ==", snapshot.val());
      if(snapshot.val() != null){
        this.setState({
          twoFactorStatus: true
        })
      }
    }.bind(this));

    database.ref("/Subscribe/" + this.props.loginUser).once('value', function(snapshot) {
      console.log("Subscribe ==", snapshot.val());
      if(snapshot.val() != null){
        let fields = this.state.fields;
        fields[10].value = countryData[snapshot.val().country];

        this.setState({
          subscribeStatus: true,
          fields: fields,
          selectedsubscribeOption: countryData[snapshot.val().country]
        })
      }
    }.bind(this));

    this.getSSHKeyList();
  }

  getSSHKeyList() {
    var ssh_List = [];

    database.ref('/SSH_Key')
      .orderByChild('uid')
      .equalTo(this.props.loginUser).once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var childData = childSnapshot.val();

          ssh_List.push({
            uid: childData.uid,
            label: childData.label,
            key: childData.key,
            create_date: childData.create_date,
            index: childSnapshot.key,
            sshDelToltipOpen: false
          })
        })

        this.setState({
          sshList: ssh_List
        });
    }.bind(this));
  }

  onChangeEmailValid(value) {
      let error = "";
      if (!value) {
          error = "Please enter your email address";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
          error = "Invalid email address";
      }
      let fields = this.state.fields;
      fields[0].value = value;
      fields[0].valid = error;
      this.setState({ fields });
  }

  onChangeFirstNameValid(value) {
      let error = "";
      if (!value) {
          error = "Please enter your first name";
      } else if (value.length < 2) {
          error = "Value must be longer than 2 characters";
      }
      let fields = this.state.fields;
      fields[1].value = value;
      fields[1].valid = error;
      this.setState({ fields });
  }

  onChangeLastNameValid(value) {
    let error = "";
    if (!value) {
        error = "Please enter your last name";
    } else if (value.length < 1) {
        error = "Value must be longer than 1 characters";
    }
    let fields = this.state.fields;
    fields[2].value = value;
    fields[2].valid = error;
    this.setState({ fields });
  }

  handleLangChange = (event) => {
    console.log(event);
    let fields = this.state.fields;
    fields[3].value = event;
    this.setState({ 
      selectedOption: event,
      fields: fields
    });
  };

  // onchangeFileHandler = event => {
  //   console.log(event.target.files[0]);
  //   this.setState({
  //     selectedFile: event.target.files[0],
  //     loaded: 0,
  //   })
  // }

  // onClickHandler = () => {
  //   const data = new FormData() 
  //   data.append('file', this.state.selectedFile);
  //   axios.post("http://localhost:8000/upload", data, { // receive two parameter endpoint url ,form data 

  //   })
  //   .then(res => { // then print response status
  //     console.log("res = ", res.statusText)
  //   })
  // }

  handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });
  handleProgress = progress => this.setState({ progress });
  handleUploadError = error => {
    this.setState({ isUploading: false });
    console.error(error);
  };
  handleUploadSuccess = filename => {
    this.setState({ avatar: filename, progress: 100, isUploading: false });
    firebase
      .storage()
      .ref("images")
      .child(filename)
      .getDownloadURL()
      .then(url => this.setState({ avatarURL: url }));
  };

  onChangeMessage( status ) {
    console.log("Message status = ", status);
    this.setState({switchMessage: status});
  }

  onChangeEmail( status ) {
    this.setState({switchEmail: status});
  } 

  onChangeCurPwd ( value ) {
    let fields = this.state.fields;
    fields[4].value = value;
    fields[4].valid = "";
    this.setState({ fields });
  }

  onChangeNewPwdValid ( value ) {
    let error = "";
    if (!value) {
        error = "Please enter your new password";
    } else if (value.length < 6) {
        error = "Password must contain a min. of 6 characters";
    }
    let fields = this.state.fields;
    fields[5].value = value;
    fields[5].valid = error;
    this.setState({ fields });
  }

  resetPassword = () => {
    // this.setState(prevState => ({
    //   resetPassword: !prevState.resetPassword
    // }));
    auth.sendPasswordResetEmail(this.state.fields[0].value)
      .then(function (user) {
        NotificationManager.success(
          "Please check your email...",
          "Success",
          3000,
          null,
          null,
          ''
        );
        // setTimeout(() => {
        //   window.location.href = "/app";
        // }, 3000);
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
  };

  resetPasswordHandle() {
    if(this.state.fields[4].value === "")
    {
      let fields = this.state.fields;
      fields[4].valid = "Please insert current password";
      this.setState({ fields });
    }
    else {
      this.resetPassword();
    }
  }

  saveChange = () => {
    database.ref('/Users')
      .orderByChild('uid')
      .equalTo(this.props.loginUser).once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          console.log("snapshot = ", childSnapshot.val());
          var key = childSnapshot.key;
          var childData = childSnapshot.val();

          var updateData = {
            "uid": this.props.loginUser,
            "email": this.state.fields[0].value,
            "first_name": this.state.fields[1].value,
            "last_name": this.state.fields[2].value,
            "company_individual": childData.company_individual,
            "country": childData.country,
            "state": childData.state,
            "city": childData.city,
            "zip_code": childData.zip_code,
            "address": childData.address,
            "company": childData.company,
            "card_name": childData.card_name,
            "card_number": childData.card_number,
            "role": childData.role,
            "parent_uid": childData.parent_uid,
            "profile_url": this.state.avatarURL,
            "sites": childData.sites,
            "lang": this.state.fields[3].value.key
          }

          var updates = {};
          updates['/Users/' + key] = updateData;
        
          database.ref().update(updates);

          NotificationManager.success(
            "User Info saved",
            "Success",
            3000,
            null,
            null,
            ''
          );

        }.bind(this))
    }.bind(this)); 
  }


  //////////////////////////////////////////////////
  ///////// 2 FA ///////////////////////////////////
  //////////////////////////////////////////////////
  enableTwoFactor = () => {
    this.setState(prevState => ({
      enableTwoFactor: !prevState.enableTwoFactor
    }));
  }

  enableTwoFactorHandle() {
    if(this.state.fields[7].value === ""){
      this.onChangeCellphoneValid("");
      return;
    }
    if(this.state.fields[6].value === "") {
      return;
    }

    var insertData = {
      country: this.state.fields[6].value.key,
      cellphone_number: this.state.fields[7].value
    }

    database.ref("/FA_2/" + this.props.loginUser).set(
      insertData, function(error){
        if(error) {
          console.log("insert 2FA error");
          NotificationManager.warning(
            "Two-Factor authentication Error",
            "Done",
            3000,
            null,
            null,
            ''
          );
        } else {
          console.log("insert 2FA success");
          this.setState({
            twoFactorStatus: true
          })
          this.enableTwoFactor();
      
          NotificationManager.success(
            "Two-Factor authentication Enabled",
            "Done",
            3000,
            null,
            null,
            ''
          );
        }
      }.bind(this)
    )
  }

  disableTwoFactor() {
    database.ref("/FA_2/" + this.props.loginUser).remove();
    this.setState({
      twoFactorStatus: false
    })

    NotificationManager.success(
      "Two-Factor authentication Disabled",
      "Done",
      3000,
      null,
      null,
      ''
    );
  }

  handleCountryChange = (event) => {
    console.log(event);
    let fields = this.state.fields;
    fields[6].value = event;
    this.setState({ 
      selectedCountryOption: event,
      fields: fields
    });
  };

  onChangeCellphoneValid(value) {
    let error = "";
    if (!value) {
        error = "Please enter your cellphone number";
    }
    let fields = this.state.fields;
    fields[7].value = value;
    fields[7].valid = error;
    this.setState({ fields });
  }

  //////////////////////////////////////////////////
  ///////// add SSH ////////////////////////////////
  //////////////////////////////////////////////////
  addSSH = () => {
    this.setState(prevState => ({
      addSSH: !prevState.addSSH
    }));
  }

  addSSHHandle() {
    if(this.state.fields[8].value === ""){
      this.onChangeSSHLabelValid("");
      return;
    }
    if(this.state.fields[9].value === "") {
      this.onChangeSSHKeyValid("");
      return;
    }
    this.setState({
      twoFactorStatus: true
    })
    this.addSSH();

    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year

    var newPostKey = database.ref().child('SSH_Key').push().key;

    var insertData = {
      uid: this.props.loginUser,
      label: this.state.fields[8].value,
      key: this.state.fields[9].value,
      create_date: year + "-" + month + "-" + date,
      index: newPostKey,
      sshDelToltipOpen: false
    }

    var updates = {};
    updates['/SSH_Key/' + newPostKey] = insertData;

    database.ref().update(updates, function(error) {

    // database.ref().child("SSH_Key").push(insertData, function(error) {
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
        NotificationManager.success(
          "Add SSH Key",
          "Success",
          3000,
          null,
          null,
          ''
        );
        
        let ssh_List = this.state.sshList;
        ssh_List.push(insertData);
        this.setState({sshList: ssh_List});
      }
    }.bind(this));
  }

  onChangeSSHLabelValid (value) {
    let fields = this.state.fields;
    fields[8].value = value;
    this.setState({ fields });
  }

  onChangeSSHKeyValid (value) {
    let fields = this.state.fields;
    fields[9].value = value;
    this.setState({ fields });
  }

  sshDelModal(index) {
    console.log("ssh key index = ", index);
    var keyIndex = this.state.sshList[index].index;

    database.ref('/SSH_Key/' + keyIndex).remove();

    NotificationManager.success(
      "SSH Key Deleted!!!",
      "Success",
      3000,
      null,
      null,
      ''
    );

    this.getSSHKeyList();
  }

  sshDelToltip(index) {
    this.setState(prevState => ({
      sshDelToltipOpen: !prevState.sshDelToltipOpen
    }));
    let ssh_List = this.state.sshList;
    ssh_List[index].sshDelToltipOpen = this.state.sshDelToltipOpen;
    this.setState({
      sshList: ssh_List
    });
  };

  //////////////////////////////////////////////////
  ///////// Subscribe //////////////////////////////
  //////////////////////////////////////////////////
  addSubscribe = () => {
    this.setState(prevState => ({
      addSubscribe: !prevState.addSubscribe
    }));
  }

  addSubscribeHandle () {
    if(this.state.fields[10].value === "") {
      return;
    }

    var insertData = {
      country: this.state.fields[10].value.key
    }

    database.ref("/Subscribe/" + this.props.loginUser).set(
      insertData, function(error){
        if(error) {
          console.log("Subscribe error");
          NotificationManager.warning(
            "Subscribe Error",
            "Done",
            3000,
            null,
            null,
            ''
          );
        } else {
          console.log("Subscribe success");
          this.addSubscribe();
          
          if(this.state.subscribeStatus)
          {
            NotificationManager.success(
              "Subscribe change language",
              "Done",
              3000,
              null,
              null,
              ''
            );
          } else {
            this.setState({
              subscribeStatus: true
            })
        
            NotificationManager.success(
              "Add Subscribe",
              "Done",
              3000,
              null,
              null,
              ''
            );
          }
        }
      }.bind(this)
    )
  }

  disableSubscribe() {
    database.ref("/Subscribe/" + this.props.loginUser).remove();
    this.setState({
      subscribeStatus: false
    })

    NotificationManager.success(
      "Subscribe Disabled",
      "Done",
      3000,
      null,
      null,
      ''
    );
  }

  handleCountryChangeSubscribe = (event) => {
    console.log(event);
    let fields = this.state.fields;
    fields[10].value = event;
    this.setState({ 
      selectedsubscribeOption: event,
      fields: fields
    });
  };

  subscribeChangeLang () {
    this.addSubscribe();

  }


  render() {
    console.log("status = ", this.state);
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <h1><IntlMessages id="user-setting.title"/></h1>
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        
        <Row>
          <Colxx xxs="12" className="mb-4">
            <Card className="h-100">
              <CardBody>
                <Label className="font-weight-bold text-one">
                  <IntlMessages id="user-setting.account-settings" />
                </Label>
                {/* 
                  Account setting
                */}
                <Row className="mt-4">
                  <Colxx sm="12" md="3" className="user-setting-img text-center">
                    {/* <input type="file" name="file" onChange={this.onchangeFileHandler} />
                    <button type="button" className="btn btn-success btn-block" onClick={this.onClickHandler}>Upload</button>  */}
                    {this.state.isUploading && <p>Progress: {this.state.progress}</p>}
                    {this.state.avatarURL && <img src={this.state.avatarURL} alt="avatar"/>}
                    <br />
                    <CustomUploadButton
                      accept="image/*"
                      name="avatar"
                      randomizeFilename
                      storageRef={firebase.storage().ref("images")}
                      onUploadStart={this.handleUploadStart}
                      onUploadError={this.handleUploadError}
                      onUploadSuccess={this.handleUploadSuccess}
                      onProgress={this.handleProgress}
                      style={{backgroundColor: 'steelblue', color: 'white', padding: 10, borderRadius: 4}}
                    >
                      Select your awesome avatar
                    </CustomUploadButton>
                  </Colxx>
                  <Colxx sm="12" md="9">
                    <Formik
                        ref={this.form0}
                        initialValues={{
                          email: this.state.fields[0].value,
                          first_name: this.state.fields[1].value,
                          last_name: this.state.fields[2].value
                        }}
                        onSubmit={() => {}}>
                        {({ errors, touched }) => (
                            <Form className="av-tooltip tooltip-label-bottom">
                                <Label>
                                  <IntlMessages id="user-setting.email" />
                                </Label>
                                <Row className="h-100 mt-4">
                                  <Colxx xxs="6">
                                    <FormGroup className="form-group">
                                      <Field
                                        className="form-control"
                                        name="email"
                                        disabled
                                        value={this.state.fields[0].value}
                                        onChange={event => this.onChangeEmailValid(event.target.value)}
                                      />
                                      {this.state.fields[0].valid && (
                                        <div className="invalid-feedback d-block">
                                          {this.state.fields[0].valid}
                                        </div>
                                      )}
                                    </FormGroup>
                                  </Colxx>
                                  <Colxx xxs="6">
                                    <Button outline onClick={this.resetPassword}>
                                      <IntlMessages id="user-setting.change-password" />
                                    </Button>

                                    {/* <Modal isOpen={this.state.resetPassword} size="lg" toggle={this.resetPassword}>
                                      <ModalHeader toggle={this.resetPassword}>
                                        <IntlMessages id="user-setting.change-password" />
                                      </ModalHeader>
                                      <ModalBody>
                                        <Form className="av-tooltip tooltip-label-bottom">
                                          <Row>
                                            <Colxx sm="12" md="6">
                                              <FormGroup className="form-group">
                                                <Label>
                                                  <IntlMessages id="user-setting.current-pwd" />
                                                </Label>
                                                <Field
                                                  className="form-control"
                                                  name="current_pwd" 
                                                  type="password"
                                                  onChange={event => this.onChangeCurPwd(event.target.value)}
                                                />
                                                {this.state.fields[4].valid && (
                                                  <div className="invalid-feedback d-block">
                                                    {this.state.fields[4].valid}
                                                  </div>
                                                )}
                                              </FormGroup>
                                            </Colxx>
                                            <Colxx sm="12" md="6">
                                              <FormGroup className="form-group">
                                                <Label>
                                                  <IntlMessages id="user-setting.new-pwd" />
                                                </Label>
                                                <Field
                                                  className="form-control"
                                                  name="new_pwd"
                                                  type="password"
                                                  onChange={event => this.onChangeNewPwdValid(event.target.value)}
                                                />
                                                {this.state.fields[5].valid && (
                                                  <div className="invalid-feedback d-block">
                                                    {this.state.fields[5].valid}
                                                  </div>
                                                )}
                                              </FormGroup>
                                            </Colxx>
                                          </Row>
                                        </Form>
                                      </ModalBody>
                                      <ModalFooter>
                                        <Button outline color="secondary" onClick={this.resetPassword}>
                                          Cancel
                                        </Button>{" "}
                                        <Button color="secondary" onClick={() => this.resetPasswordHandle()}>
                                          <IntlMessages id="user-setting.change-password" />
                                        </Button>
                                      </ModalFooter>
                                    </Modal> */}
                                  </Colxx>
                                </Row>

                                <Row className="h-100 mt-5">
                                  <Colxx xxs="6">
                                    <FormGroup className="form-group">
                                      <Label>
                                        <IntlMessages id="user-setting.first-name" />
                                      </Label>
                                      <Field
                                        className="form-control"
                                        name="first_name"
                                        onChange={event => this.onChangeFirstNameValid(event.target.value)}
                                        value={this.state.fields[1].value}
                                      />
                                      {this.state.fields[1].valid && (
                                        <div className="invalid-feedback d-block">
                                          {this.state.fields[1].valid}
                                        </div>
                                      )}
                                    </FormGroup>
                                  </Colxx>
                                  <Colxx xxs="6">
                                    <FormGroup className="form-group">
                                      <Label>
                                        <IntlMessages id="user-setting.last-name" />
                                      </Label>
                                      <Field
                                        className="form-control"
                                        name="last_name"
                                        onChange={event => this.onChangeLastNameValid(event.target.value)}
                                        value={this.state.fields[2].value}
                                      />
                                      {this.state.fields[2].valid && (
                                        <div className="invalid-feedback d-block">
                                          {this.state.fields[2].valid}
                                        </div>
                                      )}
                                    </FormGroup>
                                  </Colxx>
                                </Row>

                                <Row className="h-100 mt-4">
                                  <Colxx xxs="12">
                                    <FormGroup className="form-group">
                                      <Label>
                                        <IntlMessages id="user-setting.language" />
                                      </Label>
                                      <Select
                                        components={{ Input: CustomSelectInput }}
                                        className="react-select"
                                        classNamePrefix="react-select"
                                        name="lang"
                                        value={this.state.selectedOption}
                                        onChange={(event) => this.handleLangChange(event)}
                                        options={userLangData}
                                      />
                                      {!this.state.selectedOption && (
                                        <div className="invalid-feedback d-block">
                                          Please select the language.
                                        </div>
                                      )}
                                    </FormGroup>
                                  </Colxx>
                                </Row>

                                <Row className="mt-4 text-right">
                                  <Colxx xxs="12">
                                    <Button outline onClick={this.saveChange}>
                                      <IntlMessages id="user-setting.save-change" />
                                    </Button>
                                  </Colxx>
                                </Row>
                                
                            </Form>
                        )}
                    </Formik>
                  </Colxx>
                </Row>
                
                {/* 
                  2FA 
                */}
                <div className="separator pt-4 mb-5" />
                <Row>
                  <Colxx xxs="12">
                    <Label className="font-weight-bold text-one">
                      <IntlMessages id="user-setting.two-factor" />
                    </Label>
                  </Colxx>
                </Row>
                <Row>
                  <Colxx sm="12" md="9">
                    <Label className="text-muted">
                      <IntlMessages id="user-setting.two-factor-des" />
                    </Label>
                  </Colxx>
                  <Colxx sm="12" md="3" className="text-right">
                    {
                      this.state.twoFactorStatus ? (
                        <Button outline onClick={() => this.disableTwoFactor()}>
                          <IntlMessages id="user-setting.two-factor-disable" />
                        </Button>
                      ) : (
                        <Button outline onClick={() => this.enableTwoFactor()}>
                          <IntlMessages id="user-setting.two-factor-enable" />
                        </Button>
                      )
                    }
                    <Modal isOpen={this.state.enableTwoFactor} size="lg" toggle={this.enableTwoFactor}>
                      <ModalHeader toggle={this.enableTwoFactor}>
                        <IntlMessages id="user-setting.two-factor-enable" />
                      </ModalHeader>
                      <ModalBody>
                        <Formik>
                        <Form className="av-tooltip tooltip-label-bottom">
                          <Row>
                            <Colxx sm="12">
                              <FormGroup className="form-group">
                                <Label>
                                  <IntlMessages id="user-setting.enable-country" />
                                </Label>
                                <Select
                                  components={{ Input: CustomSelectInput }}
                                  className="react-select"
                                  classNamePrefix="react-select"
                                  name="country"
                                  value={this.state.selectedCountryOption}
                                  onChange={(event) => this.handleCountryChange(event)}
                                  options={countryData}
                                />
                                {!this.state.fields[6].value && (
                                  <div className="invalid-feedback d-block">
                                    Please select the country.
                                  </div>
                                )}
                              </FormGroup>
                            </Colxx>
                          </Row>
                          <Row>
                            <Colxx sm="12">
                              <FormGroup className="form-group">
                                <Label>
                                  <IntlMessages id="user-setting.cellphone" />
                                </Label>
                                <Field
                                  className="form-control"
                                  name="cellphone_number"
                                  onChange={event => this.onChangeCellphoneValid(event.target.value)}
                                />
                                {this.state.fields[7].valid && (
                                  <div className="invalid-feedback d-block">
                                    {this.state.fields[7].valid}
                                  </div>
                                )}
                              </FormGroup>
                            </Colxx>
                          </Row>
                        </Form>
                        </Formik>
                      </ModalBody>
                      <ModalFooter>
                        <Button outline color="secondary" onClick={this.enableTwoFactor}>
                          Cancel
                        </Button>{" "}
                        <Button color="secondary" onClick={() => this.enableTwoFactorHandle()}>
                          <IntlMessages id="user-setting.enable-btn" />
                        </Button>
                      </ModalFooter>
                    </Modal>
                  </Colxx>
                </Row>
                
                {/* 
                  SSH Key 
                */}
                <div className="separator pt-4 mb-5" />
                <Row>
                  <Colxx xxs="12">
                    <Label className="font-weight-bold text-one">
                      <IntlMessages id="user-setting.ssh-keys" />
                    </Label>
                  </Colxx>
                </Row>
                <Row>
                  <Colxx sm="12" md="9">
                    <Label className="text-muted">
                      <IntlMessages id="user-setting.ssh-keys-des" />
                    </Label>
                  </Colxx>
                  <Colxx sm="12" md="3" className="text-right">
                    <Button outline onClick={this.addSSH}>
                      <IntlMessages id="user-setting.ssh-keys-add" />
                    </Button>

                    <Modal isOpen={this.state.addSSH} size="lg" toggle={this.addSSH}>
                      <ModalHeader toggle={this.addSSH}>
                        <IntlMessages id="user-setting.ssh-keys-add" />
                      </ModalHeader>
                      <ModalBody>
                        <Formik>
                        <Form className="av-tooltip tooltip-label-bottom">
                          <Row>
                            <Colxx sm="12">
                              <FormGroup className="form-group">
                                <Label>
                                  <IntlMessages id="user-setting.ssh-label" />
                                </Label>
                                <Field
                                  className="form-control"
                                  name="ssh_label"
                                  onChange={event => this.onChangeSSHLabelValid(event.target.value)}
                                />
                                {!this.state.fields[8].value && (
                                  <div className="invalid-feedback d-block">
                                    <IntlMessages id="user-setting.ssh-label-valid" />
                                  </div>
                                )}
                              </FormGroup>
                            </Colxx>
                          </Row>
                          <Row>
                            <Colxx sm="12">
                              <FormGroup className="form-group">
                                <Label>
                                  <IntlMessages id="user-setting.ssh-key" />
                                </Label>
                                <Field
                                  className="form-control"
                                  name="ssh_key"
                                  type="textarea"
                                  onChange={event => this.onChangeSSHKeyValid(event.target.value)}
                                />
                                {!this.state.fields[9].value && (
                                  <div className="invalid-feedback d-block">
                                    <IntlMessages id="user-setting.ssh-key-valid" />
                                  </div>
                                )}
                              </FormGroup>
                            </Colxx>
                          </Row>
                        </Form>
                        </Formik>
                      </ModalBody>
                      <ModalFooter>
                        <Button outline color="secondary" onClick={this.addSSH}>
                          Cancel
                        </Button>{" "}
                        <Button color="secondary" onClick={() => this.addSSHHandle()}>
                          <IntlMessages id="user-setting.ssh-keys-add" />
                        </Button>
                      </ModalFooter>
                    </Modal>
                  </Colxx>
                </Row>
                <Row className="mt-2">
                  <Colxx xxs="12">
                  {
                    this.state.sshList.length && (
                      <Table hover>
                        <thead>
                          <tr>
                            <th className="w-60">Label</th>
                            <th className="w-40">Create date</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.sshList.map((sshkey, index) => {
                              return (
                                  <tr key={index}>
                                    <td>{sshkey.label}</td>
                                    <td>{sshkey.create_date}</td>
                                    <td>
                                      <span className="color-theme-2 text-large" 
                                        onClick={() => this.sshDelModal(index)}
                                        id={"ssh_del_" + index}
                                      >
                                        <i className="simple-icon-trash" />
                                        <Tooltip
                                          placement="top"
                                          isOpen={this.state.sshList[index].sshDelToltipOpen}
                                          target={"ssh_del_" + index}
                                          toggle={() => this.sshDelToltip(index)}
                                        >
                                          <IntlMessages id="user-management.remove-user" />
                                        </Tooltip>
                                      </span>
                                    </td>
                                  </tr>
                              )
                            })
                        }
                        </tbody>
                      </Table>
                    )
                  }
                  </Colxx>
                </Row>
                
                {/* 
                  Newsletter 
                */}
                <div className="separator pt-4 mb-5" />
                <Row>
                  <Colxx xxs="12">
                    <Label className="font-weight-bold text-one">
                      <IntlMessages id="user-setting.newsletter" />
                    </Label>
                  </Colxx>
                </Row>
                <Row>
                  <Colxx sm="12" md="9">
                    <Label className="text-muted">
                      <IntlMessages id="user-setting.newsletter-des" />
                    </Label>
                  </Colxx>
                  <Colxx sm="12" md="3" className="text-right">
                    {
                      this.state.subscribeStatus ? (
                        <div>
                          <Button outline onClick={() => this.subscribeChangeLang()}>
                            <IntlMessages id="user-setting.newsletter-changelang" />
                          </Button>
                          <Button outline className="ml-2" onClick={() => this.disableSubscribe()}>
                            <IntlMessages id="user-setting.newsletter-unsubscribe" />
                          </Button>
                        </div>
                      ) : (
                        <Button outline onClick={() => this.addSubscribe()}>
                          <IntlMessages id="user-setting.newsletter-subscribe" />
                        </Button>
                      )
                    }

                    <Modal isOpen={this.state.addSubscribe} size="lg" toggle={this.addSubscribe}>
                      <ModalHeader toggle={this.addSubscribe}>
                        {
                          this.state.subscribeStatus ? (
                            <IntlMessages id="user-setting.newsletter-changelang" />
                          ) : (
                            <IntlMessages id="user-setting.newsletter-subscribe" />
                          )
                        }
                      </ModalHeader>
                      <ModalBody>
                        <Formik>
                        <Form className="av-tooltip tooltip-label-bottom">
                          <Row>
                            <Colxx sm="12">
                              <FormGroup className="form-group">
                                <Label>
                                  <IntlMessages id="user-setting.subscribe-country" />
                                </Label>
                                <Select
                                  components={{ Input: CustomSelectInput }}
                                  className="react-select"
                                  classNamePrefix="react-select"
                                  name="country"
                                  value={this.state.selectedsubscribeOption}
                                  onChange={(event) => this.handleCountryChangeSubscribe(event)}
                                  options={countryData}
                                />
                                {!this.state.fields[10].value && (
                                  <div className="invalid-feedback d-block">
                                    Please select the country.
                                  </div>
                                )}
                              </FormGroup>
                            </Colxx>
                          </Row>
                        </Form>
                        </Formik>
                      </ModalBody>
                      <ModalFooter>
                        <Button outline color="secondary" onClick={this.addSubscribe}>
                          Cancel
                        </Button>{" "}
                        <Button color="secondary" onClick={() => this.addSubscribeHandle()}>
                          <IntlMessages id="user-setting.newsletter-subscribe" />
                        </Button>
                      </ModalFooter>
                    </Modal>
                  </Colxx>
                </Row>

                {/* 
                  Overage notification 
                */}
                <div className="separator pt-4 mb-5" />
                <Row>
                  <Colxx xxs="12">
                    <Label className="font-weight-bold text-one">
                      <IntlMessages id="user-setting.overage-notification" />
                    </Label>
                  </Colxx>
                </Row>
                <Row>
                  <Colxx sm="12" md="9">
                    <Label className="text-muted">
                      <IntlMessages id="user-setting.overage-notification-des" />
                    </Label>
                  </Colxx>
                  <Colxx sm="12" md="3" className="text-left">
                    <div>
                      <Switch
                        className="custom-switch custom-switch-secondary custom-switch-large ml-2 mr-2"
                        checked={this.state.switchMessage}
                        onChange={switchMessage => { this.onChangeMessage(switchMessage)}}
                      />
                      <span className="text-one"><IntlMessages id="user-setting.switch-message" /></span>
                    </div>

                    <div className="mt-1">
                      <Switch
                        className="custom-switch custom-switch-secondary custom-switch-large ml-2 mr-2"
                        checked={this.state.switchEmail}
                        onChange={switchEmail => { this.onChangeEmail(switchEmail)}}
                      />
                      <span className="text-one">
                        <IntlMessages id="user-setting.switch-email" /> ( to {this.state.fields[0].value} )
                      </span>
                    </div>
                    
                  </Colxx>
                </Row>

                {/* 
                  Company and site access 
                */}
                <div className="separator pt-4 mb-5" />
                <Row>
                  <Colxx sm="12" md="9">
                    <Label className="font-weight-bold text-one">
                      <IntlMessages id="user-setting.company-site" />
                    </Label>
                  </Colxx>
                  <Colxx sm="12" md="3" className="text-right">
                    <Button outline href="/app/billings/create_company">
                      <IntlMessages id="user-setting.new-company" />
                    </Button>
                  </Colxx>
                </Row>
                {
                  this.state.role === "Company owner" ? (
                    null
                  ) : (
                    <Row className="mt-2">
                      <Colxx sm="12" md="5">
                        {this.state.company}
                      </Colxx>
                      <Colxx sm="12" md="4">
                        {this.state.role}
                      </Colxx>
                      <Colxx sm="12" md="3" className="text-right">
                        <Button outline>
                          <IntlMessages id="user-setting.leave" />
                        </Button>
                      </Colxx>
                    </Row>
                  )
                }
                

              </CardBody>
            </Card>
          </Colxx>
        </Row>
        

      </Fragment>
    )
  }
}

const mapStateToProps = ({ authUser }) => {
  const { user: loginUser } = authUser;
  return { loginUser };
};

const mapActionToProps={}

export default connect(
  mapStateToProps,
  mapActionToProps
)(UserSetting);