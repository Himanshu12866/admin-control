import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { Container, Pagination } from "react-bootstrap";
import "../../css/products.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faSearch,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
// import { CSSProperties } from "react";
// import ClipLoader from "react-spinners/ClipLoader";
import PacmanLoader from "react-spinners/PacmanLoader"

export default function OrderList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#ffffff");

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "green",
  };
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "https://livon-rest-healthy-backend-26380982364.us-east1.run.app/orders/getuserswithorders"
        );
        const data = await response.json();

        if (data.success) {
          // Transform data to extract orders with required fields
          const extractedOrders = data.users.flatMap((user) =>
            user.orders.map((order) => ({
              orderId: order.orderId,
              dateOfOrder: order.createdAt,
              customerName: user.fullname || "New User",
              productTitle: order.products[0]?.title, // Extract product title
              paymentMethod: order.paymentMethod,
              totalPrice: order.totalPrice,
            }))
          );
          setOrders(extractedOrders);
        } else {
          setError("Failed to fetch orders");
        }
      } catch (err) {
        setError("An error occurred while fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="sweet-loading w-100  flex justify-center h-52  flex-col-reverse items-center">
        <button onClick={() => setLoading(!loading)}>Loading Orders .....</button>
      

        {/* <ClipLoader
          color={color}
          loading={loading}
          cssOverride={override}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        /> */}
        <PacmanLoader size={30} color="green" />
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  const OrdersPerPage = 10;

  const indexOfLastOrder = currentPage * OrdersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - OrdersPerPage;
  const TotalOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(orders.length / OrdersPerPage);

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
            <h1>Orders</h1>
          </div>
          <div className="all-product-list mb-5">
            <div className="products-list d-flex">
              <div>
                <div className="search-bar-product me-auto position-relative">
                  <input
                    type="text"
                    className="form-control search-input"
                    placeholder="Search order"
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
                  <th className="col">Order ID</th>
                  <th className="col">Date</th>
                  <th className="col">Customer</th>
                  <th className="col">Product Name</th>
                  <th className="col">Payment Method</th>
                  <th className="col">Amount</th>
                </tr>
              </thead>
              <tbody>
                {TotalOrders.map((order, index) => (
                  <tr key={index}>
                    <td>{order.orderId}</td>
                    <td>{order.dateOfOrder}</td>
                    <td>{order.customerName}</td>
                    <td>{order.productTitle}</td>
                    <td>{order.paymentMethod}</td>
                    <td>{order.totalPrice}/-</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="table-footer mt-5">
                <tr>
                  <td colSpan="5">
                    <div className="pagination-controls d-flex justify-content-between align-items-center">
                      <div>
                        Showing: {indexOfFirstOrder + 1} -{" "}
                        {Math.min(indexOfLastOrder, orders.length)} of{" "}
                        {orders.length}
                      </div>
                      <Pagination>
                        <Pagination.Prev
                          onClick={handlePrevious}
                          disabled={currentPage === 1}
                        >
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
                        <Pagination.Next
                          onClick={handleNext}
                          disabled={currentPage === totalPages}
                        >
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
  );
}
