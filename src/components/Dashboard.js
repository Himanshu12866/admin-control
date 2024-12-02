import React, { useState } from "react";
import { Container, Row, Col, Nav, NavItem, NavLink } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import { BrowserRouter as Router, Link, Route, Routes, Navigate } from "react-router-dom";
import Logo from "../Images/Livon logos 1-03.png";
import "../css/Dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faClipboard,
  faUsers,
  faBars,
  faChevronDown,
  faChevronUp,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import Products from "./Products/Products";
import ProductDetails from "./Products/ProductDetails";
import AddProduct from "./Products/AddProduct";
import OrderList from "./orders/OrderList";
import CustomersList from "./Customers/CustomersList";

const AdminPanel = () => {
  const [selectedTab, setSelectedTab] = useState("All-products");
  const [expandedFolder, setExpandedFolder] = useState(null); // To manage which folder is expanded
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // To toggle sidebar

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed); // Toggle the sidebar state
  };

  const toggleFolder = (folder) => {
    setExpandedFolder(expandedFolder === folder ? null : folder); // Toggle folder
  };

  return (
    <Router>
      <Container fluid>
        <Row>
          {/* Left Sidebar */}
          <Col
            xs={isSidebarCollapsed ? 1 : 2}
            className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}
          >
            <div className="d-flex justify-content-between align-items-center p-2">
              {!isSidebarCollapsed && (
                <Link to='/'>
                  <img
                    src={Logo}
                    alt="Logo"
                    className="Logo"
                    style={{ maxWidth: "80%" }}
                  />
                </Link>
              )}
              <FontAwesomeIcon
                icon={faBars}
                onClick={toggleSidebar}
                className="text-dark p-2"
                style={{ cursor: "pointer" }}
              />
            </div>
            <Nav
              defaultActiveKey="/"
              className={`flex-column mt-5 ${
                isSidebarCollapsed ? "d-flex justify-content-center" : ""
              }`}
            >
              {/* Products Folder */}
              <NavItem>
                <NavLink
                  onClick={() => toggleFolder("products")}
                  className="d-flex align-items-center justify-content-between text-start px-3"
                >
                  <div className="d-flex align-items-center ">
                    <FontAwesomeIcon icon={faBox} className="me-3 " />
                    {!isSidebarCollapsed && <span>Products</span>}
                  </div>
                  {!isSidebarCollapsed && (
                    <FontAwesomeIcon
                      icon={
                        expandedFolder === "products"
                          ? faChevronUp
                          : faChevronDown
                      }
                      className="chevron-icon"
                    />
                  )}
                </NavLink>
                {expandedFolder === "products" && !isSidebarCollapsed && (
                  <Nav
                    className="flex-column ms-3"
                    style={{ borderLeft: "2px solid #ddd" }}
                  >
                    <NavItem>
                      <NavLink
                        as={Link}
                        to="/All-products"
                        onClick={() => setSelectedTab("All-products")}
                        className={` ${
                          selectedTab === "All-products" ? "active" : ""
                        }`}
                      >
                        Products
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        as={Link}
                        to="/ProductDetails"
                        onClick={() => setSelectedTab("ProductDetails")}
                        className={` ${
                          selectedTab === "ProductDetails" ? "active" : ""
                        }`}
                      >
                        Product Details
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        as={Link}
                        to="/Add-Product"
                        onClick={() => setSelectedTab("/Add-Product")}
                        className={` ${
                          selectedTab === "/Add-Product" ? "active" : ""
                        }`}
                      >
                        Add Product
                      </NavLink>
                    </NavItem>
                  </Nav>
                )}
              </NavItem>

              {/* Orders Folder */}
              <NavItem>
                <NavLink
                  onClick={() => toggleFolder("orders")}
                  className="d-flex align-items-center justify-content-between text-start px-3"
                >
                  <div className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faClipboard} className="me-3" />
                    {!isSidebarCollapsed && <span>Orders</span>}
                  </div>
                  {!isSidebarCollapsed && (
                    <FontAwesomeIcon
                      icon={
                        expandedFolder === "orders"
                          ? faChevronUp
                          : faChevronDown
                      }
                      className="chevron-icon"
                    />
                  )}
                </NavLink>
                {expandedFolder === "orders" && !isSidebarCollapsed && (
                  <Nav
                    className="flex-column ms-3"
                    style={{ borderLeft: "2px solid #ddd" }}
                  >
                    <NavItem>
                      <NavLink
                        as={Link}
                        to="/All-Orders"
                        onClick={() => setSelectedTab("View Orders")}
                        className={` ${
                          selectedTab === "View Orders" ? "active" : ""
                        }`}
                      >
                        Orders
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        as={Link}
                        to="/order-history"
                        onClick={() => setSelectedTab("Order History")}
                        className={` ${
                          selectedTab === "Order History" ? "active" : ""
                        }`}
                      >
                        Order Details
                      </NavLink>
                    </NavItem>
                  </Nav>
                )}
              </NavItem>

              {/* Customers Folder */}
              <NavItem>
                <NavLink
                  onClick={() => toggleFolder("customers")}
                  className="d-flex align-items-center justify-content-between text-start px-3"
                >
                  <div className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faUsers} className="me-3" />
                    {!isSidebarCollapsed && <span>Customers</span>}
                  </div>
                  {!isSidebarCollapsed && (
                    <FontAwesomeIcon
                      icon={
                        expandedFolder === "customers"
                          ? faChevronUp
                          : faChevronDown
                      }
                      className="chevron-icon"
                    />
                  )}
                </NavLink>
                {expandedFolder === "customers" && !isSidebarCollapsed && (
                  <Nav
                    className="flex-column ms-3"
                    style={{ borderLeft: "2px solid #ddd" }}
                  >
                    <NavItem>
                      <NavLink
                        as={Link}
                        to="/All-Customers"
                        onClick={() => setSelectedTab("View Customers")}
                        className={` ${
                          selectedTab === "View Customers" ? "active" : ""
                        }`}
                      >
                        Customers
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        as={Link}
                        to="/customer-feedback"
                        onClick={() => setSelectedTab("Customer Feedback")}
                        className={` ${
                          selectedTab === "Customer Feedback" ? "active" : ""
                        }`}
                      >
                        Customer Details
                      </NavLink>
                    </NavItem>
                  </Nav>
                )}
              </NavItem>
            </Nav>
          </Col>
          {/* Right Content Area */}
          <Col xs={isSidebarCollapsed ? 11 : 10} className="ps-0 right-content">
            <Navbar
              className="left-content-header"
              style={{
                position: "sticky",
                top: 0,
                zIndex: 1020,
                background: "#fff",
                borderBottom: "1px solid #ddd",
              }}
            >
              <Container
                fluid
                className="d-flex justify-content-between align-items-center"
              >
                <div className="search-bar me-auto position-relative">
                  <input
                    type="text"
                    className="form-control search-input"
                    placeholder="Search product"
                  />
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="search-icon text-secondary"
                  />
                </div>
                <Navbar.Brand href="#home" className="ms-auto">
                  <div className="avatar">
                    <img
                      src="https://htmlstream.com/front-dashboard/assets/img/160x160/img6.jpg"
                      alt="User Avatar"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                </Navbar.Brand>
              </Container>
            </Navbar>
            <Routes>
              <Route path="/All-products" element={<Products />} />
              <Route path="/productsDetails/:productTitle" element={<ProductDetails />} />
              <Route path="/Add-Product" element={<AddProduct />} />
              <Route path="/All-Orders" element={<OrderList />} />
              <Route path="/All-Customers" element={<CustomersList />} />
              <Route path="*" element={<Navigate to="/All-products" replace />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </Router>
  );
};

export default AdminPanel;
