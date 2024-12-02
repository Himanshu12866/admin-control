import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { Button, Container, Pagination } from "react-bootstrap";
import "../../css/products.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSearch, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const navigate = useNavigate();

  const handleProductClick = (product) => {
    const productTitleSlug = product.title.replace(/\s+/g, "-").toLowerCase();
    navigate(`/productsDetails/${productTitleSlug}`, { state: { product } });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://livon-rest-healthy-backend-26380982364.us-east1.run.app/productdetails"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setProducts(data[0]?.products || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (products.length === 0) {
    return <div>No products found</div>;
  }

  return (
    <div>
      <div className="all-products">
        <Container fluid>
          <div className="products-page-heading d-flex">
            <h1>Products</h1>
            <Button className="ms-auto">
              <Link to="/Add-Product">Add product</Link>
            </Button>
          </div>
          <div className="all-product-list mb-5">
            <div className="products-list d-flex">
              <div>
                <div className="search-bar-product me-auto position-relative">
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
                  <th className="col">Product</th>
                  <th className="col">Category</th>
                  <th className="col">Subcategory</th>
                  <th className="col">SKU</th>
                  <th className="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="col">
                      <div
                        className="d-flex gap-5 align-items-center title"
                        onClick={() => handleProductClick(product)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="product-image">
                          <img src={product.imageurl[0]} alt={product.title} />
                        </div>
                        {product.title}
                      </div>
                    </td>
                    <td className="col">{product.category}</td>
                    <td className="col">{product.subcategory}</td>
                    <td className="col">{product.id}</td>
                    <td className="col actions">
                      <button size="sm">
                        <FontAwesomeIcon icon={faPen} /> Edit
                      </button>{" "}
                      <button size="sm">
                        <FontAwesomeIcon icon={faTrash} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="table-footer mt-5">
                <tr>
                  <td colSpan="5">
                    <div className="pagination-controls d-flex justify-content-between align-items-center">
                      <div>
                        Showing:{" "}
                        {indexOfFirstProduct + 1} -{" "}
                        {Math.min(indexOfLastProduct, products.length)} of {products.length}
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
  );
}
