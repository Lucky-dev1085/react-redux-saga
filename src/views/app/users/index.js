import React, { Component, Fragment } from "react";
import { Row } from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import Select from "react-select";
import CustomSelectInput from "../../../components/common/CustomSelectInput";
import { NotificationManager } from "../../../components/common/react-notifications";
import {CopyToClipboard} from 'react-copy-to-clipboard';

import { Formik, Form } from "formik";

import { 
  Button, 
  Card, 
  CardBody, 
  Table, 
  CustomInput, 
  Tooltip,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  FormGroup,
  ButtonGroup,
  Input
} from "reactstrap";

import { connect } from "react-redux";

import { database } from '../../../helpers/Firebase';

const roleData = [
  { label: "Company access", value: "Company access", key: 0 },
  { label: "Site access", value: "Site access", key: 1 }
];

const siteRoleData = [
  { label: "Site administrator", value: "Site administrator", key: 5 },
  { label: "Site developer", value: "Site developer", key: 6 }
];

const siteAccessList = [];

const sampleProfileUrl = "https://firebasestorage.googleapis.com/v0/b/gogo-react-login-511d1.appspot.com/o/images%2F3ac23881-a840-4d4a-b09e-793c75922d18.png?alt=media&token=de502cec-4f3b-4dd8-b91f-75e34ab93528";

const homepageUrl = "http://localhost:3000";

class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      homepageUrl: "",
      userList: [],
      userDelTooltipOpen: false,
      inviteTooltipOpen: false,
      userDelModal: false,
      userDelName: "",
      userDelIndex: 0,
      selectedOption: "",         //site list select
      inviteUser: false,
      selectedRoleOption: "",     //company and site access
      email: "",
      emailVaild: "",
      selectedRole: "",           //invite dialog - selected role in company access 
      siteList: [
        { label: "All sites", value: "All sites", key: 0 }
      ],
      selectedSiteAccessOption: "", //invite dialog - selected site in site access
      siteAccessList: [],
      selSiteList: [],     //site access - key:site id, name: site name, role: 
      selectedSiteRoleOption: { label: "Site administrator", value: "Site administrator", key: 5 }
    }
  }

  componentDidMount() {
    this.getUserList();

    var selectedOption = this.state.siteList[0];
    this.setState({
      selectedOption: selectedOption,
      homepageUrl: homepageUrl
    })
  }

  getUserList() {
    var userList = [];
    var parent_uid = "";

    database.ref('/Users')
      .orderByChild('uid')
      .equalTo(this.props.loginUser)
      .once('value', function(pSnapShot) {
        pSnapShot.forEach(function(pChild) {
          parent_uid = ((pChild.val().parent_uid === "") ? pChild.val().uid : pChild.val().parent_uid);
          console.log("parent_uid = ", parent_uid);
          this.getSiteList(parent_uid);
          database.ref('/Users')
            .orderByChild('uid')
            .equalTo(parent_uid).on('child_added', snapshot => {
              database.ref().child('/FA_2').child(snapshot.val().uid).once('value', fa_2 => {
                var childData = snapshot.val();
                var userName = childData.first_name + " " + childData.last_name;
                var email = childData.email;
                var role = childData.role;
                var sites = childData.sites;
                var profileUrl = childData.profile_url;
                var uid = childData.uid;
                var roleName = "";
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
                var sitesName = (sites[0].site_id === "" ? "All sites" : (sites.length + " site"));

                var user = {
                  userName: userName,
                  email: email,
                  roleName: roleName,
                  sitesName: sitesName,
                  role: role,
                  sites: sites,
                  profileUrl: profileUrl,
                  uid: uid,
                  fa_2: fa_2.val() == null ? "" : "2FA",
                  userDelTooltipOpen: false,
                  inviteTooltipOpen: false,
                  invitelinkCopy: false,
                  invited_user: ""
                }

                userList.push(user);
              })
              

              database.ref('/Invited_User')
                .orderByChild('uid')
                .equalTo(parent_uid)
                .once('value', function(snapshot) {
                  snapshot.forEach(function(childSnapshot) {
                    var inviteKey = childSnapshot.key;
                    var childData = childSnapshot.val();

                    var userName = "Pending invitation";
                    var email = childData.email;
                    var role = childData.role;
                    var sites = childData.sites;
                    var profileUrl = sampleProfileUrl;
                    var uid = "";
                    var roleName = "";
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
                    var sitesName = (sites[0].site_id === "" ? "All sites" : (sites.length + " site"));

                    var user = {
                      userName: userName,
                      email: email,
                      roleName: roleName,
                      sitesName: sitesName,
                      role: role,
                      sites: sites,
                      profileUrl: profileUrl,
                      uid: uid,
                      fa_2: "",
                      userDelTooltipOpen: false,
                      inviteTooltipOpen: false,
                      invitelinkCopy: false,
                      invited_user: inviteKey
                    }

                    userList.push(user);
                  })

                  this.setState({
                    userList: userList
                  });
              }.bind(this));

              database.ref('/Users')
                .orderByChild('parent_uid')
                .equalTo(parent_uid).once('value', function(snapshot) {
                  snapshot.forEach(function(childSnapshot) {
                    database.ref().child('/FA_2').child(childSnapshot.val().uid).once('value', fa_2 => {
                      var childData = childSnapshot.val();
                      
                      var userName = childData.first_name + " " + childData.last_name;
                      var email = childData.email;
                      var role = childData.role;
                      var sites = childData.sites;
                      var profileUrl = childData.profile_url;
                      var uid = childData.uid;
                      var roleName = "";
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
                      var sitesName = (sites[0].site_id === "" ? "All sites" : (sites.length + " site"));

                      var user = {
                        userName: userName,
                        email: email,
                        roleName: roleName,
                        sitesName: sitesName,
                        role: role,
                        sites: sites,
                        profileUrl: profileUrl,
                        uid: uid,
                        fa_2: fa_2.val() == null ? "" : "2FA",
                        userDelTooltipOpen: false,
                        inviteTooltipOpen: false,
                        invitelinkCopy: false,
                        invited_user: ""
                      }

                      userList.push(user);

                      this.setState({
                        userList: userList
                      });

                      database.ref('/Invited_User')
                        .orderByChild('uid')
                        .equalTo(uid)
                        .once('value', function(snapshot) {
                          snapshot.forEach(function(childSnapshot) {
                            var inviteKey = childSnapshot.key;
                            var childData = childSnapshot.val();

                            var userName = "Pending invitation";
                            var email = childData.email;
                            var role = childData.role;
                            var sites = childData.sites;
                            var profileUrl = sampleProfileUrl;
                            var uid = "";
                            var roleName = "";
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
                            var sitesName = (sites[0].site_id === "" ? "All sites" : (sites.length + " site"));

                            var user = {
                              userName: userName,
                              email: email,
                              roleName: roleName,
                              sitesName: sitesName,
                              role: role,
                              sites: sites,
                              profileUrl: profileUrl,
                              uid: uid,
                              fa_2: "",
                              userDelTooltipOpen: false,
                              inviteTooltipOpen: false,
                              invitelinkCopy: false,
                              invited_user: inviteKey
                            }

                            userList.push(user);

                            this.setState({
                              userList: userList
                            });
                          }.bind(this));
                      }.bind(this));

                      this.getSiteList(uid);
                    })
                  }.bind(this))
                  
                  console.log("----------userList = ", userList);
                  
                  this.setState({
                    userList: userList
                  });
              }.bind(this));
          });
        }.bind(this));
    }.bind(this));

  }

  getSiteList(uid) {
    let siteList = this.state.siteList;
    // let siteAccessList = this.state.siteAccessList;
    
    database.ref('/Sites_List')
      .orderByChild('uid')
      .equalTo(uid).once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var siteName = childSnapshot.val().name;

          var list = {
            label: siteName,
            value: siteName,
            key: childSnapshot.key
          }

          var listAccess = {
            label: siteName,
            value: siteName,
            key: childSnapshot.key
          }

          siteList.push(list);
          siteAccessList.push(listAccess);
        })

        this.setState({
          siteList: siteList,
          siteAccessList: siteAccessList
        })
    }.bind(this));
  }

  inviteUser = () => {
    this.setState(prevState => ({
      inviteUser: !prevState.inviteUser,
      selectedRoleOption: roleData[0],
      selectedRole: "",
      selectedSiteAccessOption: "",
      email: "",
      emailVaild: "",
      selSiteList: [],
      siteAccessList: siteAccessList
    }));
  }

  inviteUserHandle () {
    var role = 2;
    var email = this.state.email;
    var response_status = 0;
    var uid = this.props.loginUser;
    var sites = [];
    
    var siteEle = {
      site_id: "",
      site_role: role
    }
    
    if(this.state.selectedRoleOption.key === 0) {    // company access
      role = this.state.selectedRole;

      sites.push(siteEle);
    } else {        //site access
      for(var i = 0; i < this.state.selSiteList.length; i++) {
        role = this.state.selSiteList[0].role;

        siteEle = {
          site_id: this.state.selSiteList[i].key,
          site_role: this.state.selSiteList[i].role
        }

        sites.push(siteEle);
      }
    }

    var inviteUser = {
      uid: uid,
      email: email,
      role: role,
      response_status: response_status,
      sites: sites
    }

    var inviteKey = database.ref().child('users').push().key;
 
    database.ref('/Invited_User/' + inviteKey).set(inviteUser, function(error) {
      if(error) {
        NotificationManager.warning(
          "Inviting Error",
          "Warning",
          3000,
          null,
          null,
          ''
        );

        this.getUserList();
      } else {
        NotificationManager.success(
          "Successfully invited " + email,
          "Success",
          3000,
          null,
          null,
          ''
        );
      }
    });


    var userList = this.state.userList;

    var userName = "Pending invitation";
    var profileUrl = sampleProfileUrl;
    var invite_uid = "";
    var roleName = "";
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
    var sitesName = (sites[0].site_id === "" ? "All sites" : (sites.length + " site"));

    var user = {
      userName: userName,
      email: email,
      roleName: roleName,
      sitesName: sitesName,
      role: role,
      sites: sites,
      profileUrl: profileUrl,
      uid: invite_uid,
      fa_2: "",
      userDelTooltipOpen: false,
      inviteTooltipOpen: false,
      invitelinkCopy: false,
      invited_user: inviteKey
    }

    userList.push(user);
    this.setState({
      userList: userList
    })

    this.inviteUser();
  }

  emailChange(value) {
    let error = "";
    if (!value) {
        error = "Please enter your email address";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
        error = "Invalid email address";
    }

    this.setState({
      emailVaild: error,
      email: ""
    })

    if (error === "") {
      this.setState({
        email: value
      })
    }
  }

  handleRoleChange (event) {
    this.setState({
      selectedRoleOption: event
    })
  }

  selCompanyAccess(index) {
    console.log("selCompanyAccess", index);
    document.getElementById("selCompanyAdmin").style.borderColor = "#d7d7d7";
    document.getElementById("selCompanyAdminBtn").style.display = "initial";

    document.getElementById("selCompanyDev").style.borderColor = "#d7d7d7";
    document.getElementById("selCompanyDevBtn").style.display = "initial";

    document.getElementById("selCompanyBill").style.borderColor = "#d7d7d7";
    document.getElementById("selCompanyBillBtn").style.display = "initial";

    switch(index) {
      case 2:
        document.getElementById("selCompanyAdmin").style.borderColor = "blue";
        document.getElementById("selCompanyAdminBtn").style.display = "none";
        break;
      case 3:
        document.getElementById("selCompanyDev").style.borderColor = "blue";
        document.getElementById("selCompanyDevBtn").style.display = "none";
        break;
      case 4:
        document.getElementById("selCompanyBill").style.borderColor = "blue";
        document.getElementById("selCompanyBillBtn").style.display = "none";
        break;
      default:
        break;
    }

    this.setState({
      selectedRole: index
    });

  }

  handleSiteAccessChange (event) {
    var selSite = {
      key: event.key,
      name: event.value,
      role: 5
    }

    let selSiteList = this.state.selSiteList;
    selSiteList.push(selSite);

    var siteList = [];

    siteAccessList.forEach(siteAccess => {
      var key = siteAccess.key;
      var bExist = false;
      selSiteList.forEach(sel => {
        if(sel.key === key) bExist = true;
      })
      if(!bExist) siteList.push(siteAccess);
    });

    this.setState({
      selectedSiteAccessOption: "",
      selSiteList: selSiteList,
      siteAccessList: siteList
    })
  }

  handleSiteRoleChange (event, index) {
    let selSiteList = this.state.selSiteList;
    selSiteList[index].role = event.key;
    this.setState({
      selectedSiteRoleOption: event,
      selSiteList: selSiteList
    })
  }

  selSiteDel (index) {
    let selSiteBefore = this.state.selSiteList;
    let selSiteList = [];
    for(var i = 0; i < selSiteBefore.length; i++){
      if(i !== index) {
        selSiteList.push(selSiteBefore[i]);
      }
    }

    var siteList = [];

    siteAccessList.forEach(siteAccess => {
      var key = siteAccess.key;
      var bExist = false;
      selSiteList.forEach(sel => {
        if(sel.key === key) bExist = true;
      })
      if(!bExist) siteList.push(siteAccess);
    });

    this.setState({
      selectedSiteAccessOption: "",
      selSiteList: selSiteList,
      siteAccessList: siteList
    })
  }

  inviteTooltip(index) {
    this.setState(prevState => ({
      inviteTooltipOpen: !prevState.inviteTooltipOpen
    }));

    let user_list = this.state.userList;
    user_list[index].inviteTooltipOpen = this.state.inviteTooltipOpen;
    this.setState({
      userList: user_list
    });
  }

  copyInviteLink(index) {
    console.log("copy index = ", index);
    let user_list = this.state.userList;
    user_list[index].invitelinkCopy = true;
    this.setState({
      userList: user_list
    });

    setTimeout(() => {
      user_list[index].invitelinkCopy = false;
      this.setState({
        userList: user_list
      });
    }, 2000);
  }

  changeUserRole(index) {
    console.log("---select uid = ", index, " : ", this.state.userList[index].uid, " : role = ", this.state.userList[index]);
    var roleIndex = ((this.state.userList[index].role < 5) ? 0 : 1);
    var email = this.state.userList[index].email;
    var selectedRole = "";
    var selSiteList = [];
    if(roleIndex === 0) {
      selectedRole = this.state.userList[index].role;      
    } else {
      var sites = this.state.userList[index].sites;
      for(var i = 0; i < sites.length; i++) {
        for(var j = 0; j < siteAccessList.length; j++) {
          if(siteAccessList[j].key === sites[i].site_id) {
            var selSite = {
              key: siteAccessList[j].key,
              name: siteAccessList[j].value,
              role: sites[i].role
            }
            selSiteList.push(selSite);
          }
        }
      }
    }

    console.log("roleIndex : ", roleIndex, "--- email : ", email, "--- selectedRole : ", selectedRole, "--- selSiteList : ", selSiteList);

    this.setState(prevState => ({
      inviteUser: !prevState.inviteUser,
      selectedRoleOption: roleData[roleIndex],
      selectedRole: selectedRole,
      selectedSiteAccessOption: "",
      email: email,
      emailVaild: "",
      selSiteList: selSiteList,
      siteAccessList: siteAccessList
    }));

    this.selCompanyAccess(selectedRole);
  }

  userDelTooltip(index) {
    this.setState(prevState => ({
      userDelTooltipOpen: !prevState.userDelTooltipOpen
    }));

    let user_list = this.state.userList;
    user_list[index].userDelTooltipOpen = this.state.userDelTooltipOpen;
    this.setState({
      userList: user_list
    });
  };

  userDelModalShow(index) {
    var userDelName = this.state.userList[index].userName;
    this.setState(prevState => ({
      userDelModal: !prevState.userDelModal,
      userDelIndex: index,
      userDelName: userDelName
    }));
  }

  userDelModal = () => {
    this.setState(prevState => ({
      userDelModal: !prevState.userDelModal
    }));
  };

  userDelHandle() {
    console.log("---delete uid = ", this.state.userDelIndex, " : ", this.state.userList[this.state.userDelIndex].uid);
    var userDelIndex = this.state.userDelIndex;

    if(this.state.userList[userDelIndex].invited_user) {
      console.log("invited_user", this.state.userList[userDelIndex].invited_user);

      database.ref('/Invited_User/' + this.state.userList[userDelIndex].invited_user).remove();
    } else {
      database.ref('/Users')
        .orderByChild('uid')
        .equalTo(this.state.userList[userDelIndex].uid).once('value', function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            var childKey = childSnapshot.key;

            database.ref('/Users/' + childKey).remove();
          })
      
      })

      database.ref('/User_Plan')
        .orderByChild('uid')
        .equalTo(this.state.userList[userDelIndex].uid).once('value', function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            var childKey = childSnapshot.key;

            database.ref('/User_Plan/' + childKey).remove();
          })
      
      })
    }

    NotificationManager.success(
      "User Deleted",
      "Success",
      3000,
      null,
      null,
      ''
    );

    let userListBefore = this.state.userList;
    let userList = [];
    for(var i = 0; i < userListBefore.length; i++){
      if(i !== userDelIndex) {
        userList.push(userListBefore[i]);
      }
    }
    this.setState({
      userList: userList
    });
    
    this.userDelModal();
  }

  handleSiteChange = (event) => {
    console.log(event);
    this.setState({ 
      selectedOption: event
    });
  };

  render() {
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="menu.user-management" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        
        <Row>
          <Colxx xxs="12" className="mb-4">
            <Card className="h-100">
              <CardBody>
                <Row>
                  <Colxx sm="12" md="5">
                    <Select
                      components={{ Input: CustomSelectInput }}
                      className="react-select"
                      classNamePrefix="react-select"
                      name="filter_site"
                      value={this.state.selectedOption}
                      onChange={(event) => this.handleSiteChange(event)}
                      options={this.state.siteList}
                    />
                  </Colxx>
                  <Colxx sm="12" md="7" className="text-right">
                    <Button onClick={() => this.inviteUser()}>
                      <IntlMessages id="user-management.invite-user" />
                    </Button>
                    <Modal isOpen={this.state.inviteUser} size="lg" toggle={this.inviteUser}>
                      <ModalHeader toggle={this.inviteUser}>
                        <IntlMessages id="user-management.invite-user" />
                      </ModalHeader>
                      <ModalBody>
                        <Formik>
                        <Form className="av-tooltip tooltip-label-bottom">
                          <Row>
                            <Colxx sm="12">
                              <FormGroup className="form-group">
                                <Label>
                                  <IntlMessages id="user-management.email-address" />
                                </Label>
                                <br />
                                <ButtonGroup className="mb-2 w-100">
                                  <Input 
                                    className="w-70" 
                                    placeholder="Enter email address"
                                    name="email"
                                    id="email"
                                    onChange={(event) => this.emailChange(event.target.value)}
                                  />
                                  <Select
                                    components={{ Input: CustomSelectInput }}
                                    className="react-select w-30"
                                    classNamePrefix="react-select"
                                    name="invite_role"
                                    value={this.state.selectedRoleOption}
                                    onChange={(event) => this.handleRoleChange(event)}
                                    options={roleData}
                                  />
                                </ButtonGroup>
                                {
                                  this.state.emailVaild && (
                                    <Label className="color-theme-1">
                                      {
                                        this.state.emailVaild
                                      }
                                    </Label>
                                  )
                                }
                                {
                                  (this.state.selectedRoleOption.key === 0) ? (
                                    <div>
                                      <div 
                                        className="h-100 invite-div-border mt-3" 
                                        onClick={() => this.selCompanyAccess(2)}
                                        id="selCompanyAdmin"
                                      >
                                        <Row className="mt-5 mb-5">
                                          <Colxx sm="12" md="8">
                                            <Label className="text-one font-weight-bold ml-4 mr-3">
                                              <IntlMessages id="user-management.invite-role-company-admin" />
                                            </Label>
                                            <br />
                                            <Label className="text-muted ml-4 mr-3">
                                              <IntlMessages id="user-management.invite-role-company-admin-des" />
                                            </Label>
                                          </Colxx>
                                          <Colxx sm="12" md="4" className="text-right">
                                            <Button 
                                              outline 
                                              className="mr-3" 
                                              onClick={() => this.selCompanyAccess(2)}
                                              id="selCompanyAdminBtn"
                                            >
                                              <IntlMessages id="user-management.invite-role-choose" />
                                            </Button>
                                          </Colxx>
                                        </Row>
                                      </div>
                                      <div 
                                        className="h-100 invite-div-border" 
                                        onClick={() => this.selCompanyAccess(3)}
                                        id="selCompanyDev"
                                      >
                                        <Row className="mt-5 mb-5">
                                          <Colxx sm="12" md="8">
                                            <Label className="text-one font-weight-bold ml-4 mr-3">
                                              <IntlMessages id="user-management.invite-role-company-dev" />
                                            </Label>
                                            <br />
                                            <Label className="text-muted ml-4 mr-3">
                                              <IntlMessages id="user-management.invite-role-company-dev-des" />
                                            </Label>
                                          </Colxx>
                                          <Colxx sm="12" md="4" className="text-right">
                                            <Button 
                                              outline 
                                              className="mr-3" 
                                              onClick={() => this.selCompanyAccess(3)}
                                              id="selCompanyDevBtn"
                                            >
                                              <IntlMessages id="user-management.invite-role-choose" />
                                            </Button>
                                          </Colxx>
                                        </Row>
                                      </div>
                                      <div 
                                      className="h-100 invite-div-border" 
                                      onClick={() => this.selCompanyAccess(4)}
                                      id="selCompanyBill"
                                    >
                                      <Row className="mt-5 mb-5">
                                        <Colxx sm="12" md="8">
                                          <Label className="text-one font-weight-bold ml-4 mr-3">
                                            <IntlMessages id="user-management.invite-role-company-bill" />
                                          </Label>
                                          <br />
                                          <Label className="text-muted ml-4 mr-3">
                                            <IntlMessages id="user-management.invite-role-company-bill-des" />
                                          </Label>
                                        </Colxx>
                                        <Colxx sm="12" md="4" className="text-right">
                                          <Button 
                                            outline 
                                            className="mr-3" 
                                            onClick={() => this.selCompanyAccess(4)}
                                            id="selCompanyBillBtn"
                                          >
                                            <IntlMessages id="user-management.invite-role-choose" />
                                          </Button>
                                        </Colxx>
                                      </Row>
                                    </div>
                                    </div>
                                  ) : (
                                    <div>
                                      <Select
                                        components={{ Input: CustomSelectInput }}
                                        className="react-select mt-3"
                                        classNamePrefix="react-select"
                                        name="siteAccess"
                                        value={this.state.selectedSiteAccessOption}
                                        onChange={(event) => this.handleSiteAccessChange(event)}
                                        options={this.state.siteAccessList}
                                      />
                                      {
                                        this.state.selSiteList.map((site, index) => {
                                          return (
                                            <Row key={index} className="mt-3">
                                              <Colxx sm="12" md="6" className="selSiteName">
                                                <Label>
                                                  {
                                                    site.name
                                                  }
                                                </Label>
                                              </Colxx>
                                              <Colxx sm="12" md="6">
                                                <Row>
                                                  <Colxx xxs="10">
                                                    <Select
                                                      components={{ Input: CustomSelectInput }}
                                                      className="react-select"
                                                      classNamePrefix="react-select"
                                                      name="selSiteRole"
                                                      value={this.state.selectedSiteRoleOption}
                                                      onChange={(event) => this.handleSiteRoleChange(event, index)}
                                                      options={siteRoleData}
                                                    />
                                                  </Colxx>
                                                  <Colxx xxs="2">
                                                    <span className="color-theme-2 text-large" 
                                                      onClick={() => this.selSiteDel(index)}
                                                      id={"selSiteDel_" + index}
                                                    >
                                                      <i className="simple-icon-trash" />
                                                    </span>
                                                  </Colxx>
                                                </Row>
                                              </Colxx>
                                            </Row>
                                          )
                                        })
                                      }
                                    </div>
                                  )
                                }

                              </FormGroup>
                            </Colxx>
                          </Row>
                        </Form>
                        </Formik>
                      </ModalBody>
                      <ModalFooter>
                        <Button outline color="secondary" onClick={this.inviteUser}>
                          Cancel
                        </Button>{" "}
                        <Button 
                          color="secondary" 
                          disabled={
                            (this.state.selectedRoleOption.key === 0) ? (
                              !this.state.selectedRole || !this.state.email
                            ) : (
                              !this.state.selSiteList.length || !this.state.email
                            )
                          } 
                          id="inviteUserBtn" 
                          onClick={() => this.inviteUserHandle()}
                        >
                          <IntlMessages id="user-management.invite-user" />
                        </Button>
                      </ModalFooter>
                    </Modal>
                  </Colxx>
                </Row>
                <Table hover responsive className="mt-2">
                  <thead>
                    <tr>
                      <th className="w-3"></th>
                      <th className="w-20">Name</th>
                      <th className="w-20">Email</th>
                      <th className="w-10">2FA</th>
                      <th className="w-15">Role</th>
                      <th className="w-15">Sites</th>
                      <th className="w-17">Actions</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                    this.state.userList.map((user_data, index) => {
                      return (
                        <tr key={index}>
                          <td className="align-middle">
                            {
                              (user_data.role !== "Company owner") && (
                                <CustomInput
                                  type="checkbox"
                                  name={"user_check_" + index}
                                  id={"user_check_" + index}
                                  // checked={this.state.fields[5].value}
                                  // onChange={event => this.setFieldValue(event.target.checked)}
                                />
                              )
                            }
                          </td>
                          <td className="align-middle user-manage-img">
                            <img alt="Profile" src={user_data.profileUrl} />
                            {user_data.userName + ((user_data.uid === this.props.loginUser) ? " ( me ) " : "")}
                          </td>
                          <td className="align-middle">{user_data.email}</td>
                          <td className="align-middle">{user_data.fa_2}</td>
                          <td className="align-middle">{user_data.roleName}</td>
                          <td className="align-middle">{user_data.sitesName}</td>
                          <td className="align-middle">
                            {
                              (user_data.role !== "Company owner") && (
                                user_data.invited_user ? (
                                  <div>
                                    <Button outline color="secondary" onClick={() => this.changeUserRole(index)}>
                                      <IntlMessages id="user-management.resend" />
                                    </Button>
                                  </div>
                                ) : (
                                  <div>
                                    <Button outline color="secondary" onClick={() => this.changeUserRole(index)}>
                                      <IntlMessages id="user-management.change" />
                                    </Button>
                                  </div>
                                )
                              )
                            }
                          </td>
                          <td className="align-middle">
                            {
                              (user_data.invited_user) && (
                                <div>
                                  <span className="color-theme-2 text-one" 
                                    onClick={() => this.copyInviteLink(index)}
                                    id={"invite_link_" + index}
                                  >
                                    {
                                      !user_data.invitelinkCopy ? (
                                        <div>
                                          <CopyToClipboard text={this.state.homepageUrl + "/acceptinvitation/" + user_data.invited_user}>
                                            <i className="simple-icon-link" />
                                          </CopyToClipboard>
                                        </div>
                                        
                                      ) : (
                                        <i className="simple-icon-check" />
                                      )
                                    }
                                    <Tooltip
                                      placement="top"
                                      isOpen={user_data.inviteTooltipOpen}
                                      target={"invite_link_" + index}
                                      toggle={() => this.inviteTooltip(index)}
                                    >
                                      {
                                        !user_data.invitelinkCopy ? (
                                          <IntlMessages id="user-management.copy-invite-link" />
                                        ) : (
                                          <IntlMessages id="user-management.copid-to-clipboard" />
                                        )
                                      }
                                    </Tooltip>
                                  </span>
                                </div>
                              )
                            }
                          </td>
                          <td className="align-middle">
                            {
                              (user_data.role !== "Company owner") && (
                                <div>
                                  <span className="color-theme-2 text-large" 
                                    onClick={() => this.userDelModalShow(index)}
                                    id={"user_del_" + index}
                                  >
                                    <i className="simple-icon-trash" />
                                    <Tooltip
                                      placement="top"
                                      isOpen={this.state.userList[index].userDelTooltipOpen}
                                      target={"user_del_" + index}
                                      toggle={() => this.userDelTooltip(index)}
                                    >
                                      <IntlMessages id="user-management.remove-user" />
                                    </Tooltip>
                                  </span>
                                </div>
                              )
                            }
                          </td>
                        </tr>
                      )
                    })
                  }
                  </tbody>
                  <Modal isOpen={this.state.userDelModal} size="lg" toggle={this.userDelModal}>
                    <ModalHeader toggle={this.userDelModal}>
                      {"Remove " + this.state.userDelName}
                    </ModalHeader>
                    <ModalBody>
                      {
                        (
                          <div>
                            Are you sure you want to remove?
                            <br />
                            Access will be revoked from the this company and all of its sites.
                          </div>
                        )                                         
                      }
                    </ModalBody>
                    <ModalFooter>
                      <Button outline color="secondary" onClick={this.userDelModal}>
                        Cancel
                      </Button>{" "}
                      <Button color="danger" onClick={() => this.userDelHandle()}>
                        <IntlMessages id="user-management.remove-member" />
                      </Button>
                    </ModalFooter>
                  </Modal>
                </Table>
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
)(Users);