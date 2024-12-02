
import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { Container, Pagination } from "react-bootstrap";
import "../../css/products.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSearch, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
export default function CustomersList() {
    const [currentPage, setCurrentPage] = useState(1);
    const OrdersPerPage = 10;
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch data from the API
        fetch('https://livon-rest-healthy-backend-26380982364.us-east1.run.app/orders/getuserswithorders')
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              // Transform users to include number of orders and total amount spent
              const processedUsers = data.users.map((user) => {
                const numberOfOrders = user.orders.length;
                const totalAmountSpent = user.orders.reduce((sum, order) => sum + order.totalPrice, 0);
                const city = user.orders[0]?.deliveryAddress?.city || 'Not Mentioned';
                return {
                  name: user.fullname || 'New Users',
                  email: user.email || 'Not Mentioned',
                  city,
                  numberOfOrders,
                  totalAmountSpent,
                };
              });
              setUsers(processedUsers);
            }
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching users:', error);
            setLoading(false);
          });
      }, []);

    const indexOfLastOrder = currentPage * OrdersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - OrdersPerPage;
    const TotalOrders = users.slice(indexOfFirstOrder, indexOfLastOrder);

    const totalPages = Math.ceil(users.length / OrdersPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };
    return (
        <div>
            <div className="all-products">
                <Container fluid>
                    <div className="products-page-heading ">
                        <h1>Customers</h1>
                    </div>
                    <div className="all-product-list mb-5">
                        <div className="products-list d-flex">
                            <div>
                                <div className="search-bar-product me-auto position-relative">
                                    <input
                                        type="text"
                                        className="form-control search-input"
                                        placeholder="Search User"
                                    />
                                    <FontAwesomeIcon
                                        icon={faSearch}
                                        className="search-icon text-secondary"
                                    />
                                </div>
                            </div>
                            <div className="filtering ms-auto">
                                <button>
                                    <FontAwesomeIcon icon={faFilter} /> Filter
                                </button>
                            </div>
                        </div>
                        <Table className="table mt-5">
                            <thead className="thead-box">
                                <tr>
                                    <th className="col">Name</th>
                                    <th className="col">Email</th>
                                    <th className="col">City</th>
                                    <th className="col">Orders</th>
                                    <th className="col">Total Amount Spent</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map((user, index) => (
                                        <tr key={index}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.city}</td>
                                            <td>{user.numberOfOrders}</td>
                                            <td>{user.totalAmountSpent}/-</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot className="table-footer mt-5">
                                <tr>
                                    <td colSpan="5">
                                        <div className="pagination-controls d-flex justify-content-between align-items-center">
                                            <div>
                                                Showing:{" "}
                                                {indexOfFirstOrder + 1} -{" "}
                                                {Math.min(indexOfLastOrder, users.length)} of {users.length}
                                            </div>
                                            <Pagination>
                                                <Pagination.Prev onClick={handlePrevious} disabled={currentPage === 1}>
                                                    Previous
                                                </Pagination.Prev>
                                                {[...Array(totalPages).keys()].map((page) => (
                                                    <Pagination.Item
                                                        key={page + 1}
                                                        active={page + 1 === currentPage}
                                                        onClick={() => handlePageChange(page + 1)}
                                                    >
                                                        {page + 1}
                                                    </Pagination.Item>
                                                ))}
                                                <Pagination.Next onClick={handleNext} disabled={currentPage === totalPages}>
                                                    Next
                                                </Pagination.Next>
                                            </Pagination>
                                        </div>
                                    </td>
                                </tr>
                            </tfoot>
                        </Table>
                    </div>
                </Container>
            </div>
        </div>
    )
}
