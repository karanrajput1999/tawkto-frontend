import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ButtonGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  UncontrolledDropdown,
} from "reactstrap";
import webwersLogo from "../assets/images/webwersLogo.png";

//import images
import logoSm from "../assets/images/logo-sm.png";
import logoDark from "../assets/images/logo-dark.png";
import logoLight from "../assets/images/logo-light.png";

//import Components
import ProfileDropdown from "../Components/Common/ProfileDropdown";
import LightDark from "../Components/Common/LightDark";

import { changeSidebarVisibility } from "../slices/thunks";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { useFormik } from "formik";
import * as Yup from "yup";
import AddWorkspaceModal from "./AddWorkspaceModal";
import { createWorkspace } from "../slices/Workspace/thunk";

const Header = ({ onChangeLayoutMode, layoutModeType, headerClass }) => {
  const dispatch = useDispatch();

  const [modal_list, setmodal_list] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null); // State to track selected workspace

  function tog_list() {
    setmodal_list(!modal_list);
  }

  const validation = useFormik({
    initialValues: {
      workspaceName: "",
      websiteAddress: "",
    },
    validationSchema: Yup.object({
      workspaceName: Yup.string().required("Please enter workspaceName"),
      websiteAddress: Yup.string().required("Please enter your websiteAddress"),
    }),
    onSubmit: (values, { resetForm }) => {
      dispatch(createWorkspace(values));
      resetForm();
      setmodal_list(false);
    },
  });

  function formHandleSubmit(e) {
    e.preventDefault();
    validation.handleSubmit();
    if (!validation.errors) {
      setmodal_list(false);
    }
    return false;
  }

  const selectDashboardData = createSelector(
    (state) => state.Layout,
    (sidebarVisibilitytype) => sidebarVisibilitytype.sidebarVisibilitytype
  );
  const sidebarVisibilitytype = useSelector(selectDashboardData);

  const [search, setSearch] = useState(false);
  const toogleSearch = () => {
    setSearch(!search);
  };

  const toogleMenuBtn = () => {
    var windowSize = document.documentElement.clientWidth;
    dispatch(changeSidebarVisibility("show"));

    if (windowSize > 767)
      document.querySelector(".hamburger-icon").classList.toggle("open");

    if (document.documentElement.getAttribute("data-layout") === "horizontal") {
      document.body.classList.toggle("menu");
    }

    if (
      sidebarVisibilitytype === "show" &&
      (document.documentElement.getAttribute("data-layout") === "vertical" ||
        document.documentElement.getAttribute("data-layout") === "semibox")
    ) {
      if (windowSize < 1025 && windowSize > 767) {
        document.body.classList.remove("vertical-sidebar-enable");
        document.documentElement.getAttribute("data-sidebar-size") === "sm"
          ? document.documentElement.setAttribute("data-sidebar-size", "")
          : document.documentElement.setAttribute("data-sidebar-size", "sm");
      } else if (windowSize > 1025) {
        document.body.classList.remove("vertical-sidebar-enable");
        document.documentElement.getAttribute("data-sidebar-size") === "lg"
          ? document.documentElement.setAttribute("data-sidebar-size", "sm")
          : document.documentElement.setAttribute("data-sidebar-size", "lg");
      } else if (windowSize <= 767) {
        document.body.classList.add("vertical-sidebar-enable");
        document.documentElement.setAttribute("data-sidebar-size", "lg");
      }
    }

    if (document.documentElement.getAttribute("data-layout") === "twocolumn") {
      document.body.classList.toggle("twocolumn-panel");
    }
  };

  return (
    <React.Fragment>
      <header id="page-topbar" className={headerClass}>
        <div className="layout-width">
          <div className="navbar-header">
            <div className="d-flex">
              <div className="navbar-brand-box horizontal-logo">
                <Link to="/" className="logo logo-dark">
                  <span className="logo-sm">
                    <img src={logoSm} alt="" height="22" />
                  </span>
                  <span className="logo-lg">
                    <img src={logoDark} alt="" />
                  </span>
                </Link>

                <Link to="/" className="logo logo-light">
                  <span className="logo-sm">
                    <img src={logoSm} alt="" height="22" />
                  </span>
                  <span className="logo-lg">
                    <img src={logoLight} alt="" height="17" />
                  </span>
                </Link>
              </div>

              <button
                onClick={toogleMenuBtn}
                type="button"
                className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger"
                id="topnav-hamburger-icon"
              >
                <span className="hamburger-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </button>
            </div>

            <div className="d-flex align-items-center">
              <Dropdown
                isOpen={search}
                toggle={toogleSearch}
                className="d-md-none topbar-head-dropdown header-item"
              >
                <DropdownToggle
                  type="button"
                  tag="button"
                  className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
                >
                  <i className="bx bx-search fs-22"></i>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
                  <Form className="p-3">
                    <div className="form-group m-0">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search ..."
                        />
                        <button className="btn btn-primary" type="submit">
                          <i className="mdi mdi-magnify"></i>
                        </button>
                      </div>
                    </div>
                  </Form>
                </DropdownMenu>
              </Dropdown>
              {/* 
              <ButtonGroup>
                <UncontrolledDropdown>
                  <DropdownToggle
                    tag="button"
                    className="btn btn-primary btn-sm"
                  >
                    Select Workspace <i className="mdi mdi-chevron-down"></i>
                  </DropdownToggle>
                  <DropdownMenu style={{ paddingBottom: "0" }}>
                    {(workspaces?.length > 0 ? workspaces : []).map(
                      (workspace) => (
                        <DropdownItem
                          key={workspace.id}
                          onClick={() => setSelectedWorkspace(workspace.id)}
                        >
                          <span>{workspace.name}</span>
                          {selectedWorkspace === workspace.id && (
                            <span>
                              <i
                                className="ri-check-line"
                                style={{
                                  fontSize: "20px",
                                  paddingLeft: "8px",
                                }}
                              ></i>
                            </span>
                          )}
                        </DropdownItem>
                      )
                    )}

                    <DropdownItem divider />

                    <button
                      style={{
                        width: "100%",
                        border: "none",
                        backgroundColor: "#343A40",
                        paddingBlock: "8px",
                        color: "white",
                      }}
                      onClick={tog_list}
                    >
                      <i
                        className="ri-add-circle-line"
                        style={{
                          marginRight: "8px",
                        }}
                      ></i>
                      Add Workspace
                    </button>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </ButtonGroup> */}

              <LightDark
                layoutMode={layoutModeType}
                onChangeLayoutMode={onChangeLayoutMode}
              />

              <ProfileDropdown />
            </div>
          </div>
        </div>
      </header>
      <AddWorkspaceModal
        validation={validation}
        modal_list={modal_list}
        tog_list={tog_list}
        formHandleSubmit={formHandleSubmit}
      />
    </React.Fragment>
  );
};

export default Header;
