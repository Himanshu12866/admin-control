import React, { useState } from "react";
import { Col, Container, Row, Table, Form } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import '../../css/product-details.css';
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function ProductDetails() {
  const location = useLocation();
  const { product } = location.state || {};
  const variants = product.variants || [];
  // Assuming 'covers' is part of the product object
  const [selectedCover, setSelectedCover] = useState(product?.covers[1][0]); // Default to first cover
  if (!product) {
    return <div>No product details available.</div>;
  }
  // Handle cover selection
  const handleCoverChange = (event) => {
    const coverId = event.target.value;
    setSelectedCover(product?.covers[coverId][0]); // Get the first cover of the selected ID
  };
  // Group variants by thickness (height)
  const groupedVariants = variants.reduce((acc, variant) => {
    const thickness = variant.attributes.find(attr => attr.name === "height")?.value;
    if (!acc[thickness]) {
      acc[thickness] = [];
    }
    acc[thickness].push(variant);
    return acc;
  }, {});
  return (
    <div>
      <div className="product-details">
        <Container fluid>
          <div className="product-head-data">
            <div className="d-flex gap-2">
              <h5><Link to='/'>Products</Link></h5>
              <span>/</span>
              <span>Product Details</span>
            </div>
            <h4>{product.title}</h4>
            <hr />
          </div>
          <div className="product-data">
            <Row>
              <Col lg={7} className="prodInfo me-3">
                <div >
                  <h5>Product Information</h5>
                </div>
                <hr />
                <form >
                  <Form.Group className="mt-5">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      value={product.title}
                      readOnly
                    />
                  </Form.Group>
                  <div className="row mt-5">
                    <Form.Group as={Col} md="6">
                      <Form.Label>Category</Form.Label>
                      <Form.Control
                        type="text"
                        value={product.category}
                        readOnly
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="6">
                      <Form.Label>Subcategory</Form.Label>
                      <Form.Control
                        type="text"
                        value={product.subcategory}
                        readOnly
                      />
                    </Form.Group>
                  </div>
                  <div className="row mt-5">
                    <Form.Group as={Col} md="6">
                      <Form.Label>Product SKU</Form.Label>
                      <Form.Control
                        type="text"
                        value={product.id}
                        readOnly
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="6">
                      <Form.Label>Rating</Form.Label>
                      <Form.Control
                        type="text"
                        value={product.rating}
                        readOnly
                      />
                    </Form.Group>
                  </div>
                  <Form.Group className="mt-4">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={product.descriptions
                        .map(description => `• ${description}`)
                        .join('\n')}
                      readOnly
                      className="description-textarea "
                      style={{ height: '450px', whiteSpace: 'pre-wrap', paddingTop: '30px', lineHeight: '40px' }}
                    />
                  </Form.Group>
                </form>
              </Col>
              <Col lg={4} className="prodInfo">
                <div >
                  <h5>covers Information</h5>
                </div>
                <hr />
                <Form.Group>
                  <div className="dropdown-container">
                    <Form.Control as="select" onChange={handleCoverChange} defaultValue="1">
                      {Object.keys(product.covers).map((key) => (
                        <option key={key} value={key}>
                          {product.covers[key][0].name}
                        </option>
                      ))}
                    </Form.Control>
                    <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" />
                  </div>
                </Form.Group>
                <div className="cover-details mt-4">
                  <Form.Group className="mt-3">
                    <Form.Label>Cover Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedCover.name}
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group className="mt-3">
                    <Form.Label>Cover Note</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedCover.notes}
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group className="mt-4">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={selectedCover.descriptions
                        .map(desc => `• ${desc}`)
                        .join('\n')}
                      readOnly
                      style={{
                        height: '300px',
                        whiteSpace: 'pre-wrap',
                        paddingTop: '30px',
                        lineHeight: '40px'
                      }}
                    />
                  </Form.Group>
                  <img
                    src={selectedCover.image}
                    alt={selectedCover.name}
                    style={{ width: '100%', borderRadius: '10px', marginTop: '20px' }}
                  />
                </div>
              </Col>
            </Row>
          </div>
          <Row className="mt-5">
            <Col lg={7} className="prodInfo me-3">
              <div >
                <h5>Media</h5>
              </div>
              <hr />
              <Row>
                {product.imageurl && product.imageurl.map((image, index) => (
                  <Col lg={4} key={index} className="text-center mb-4 mt-2">
                    <img
                      src={image}
                      alt={`Product Media ${index + 1}`}
                      style={{ width: "100%", height: "100%", borderRadius: "10px" }}
                    />
                  </Col>
                ))}
              </Row>
            </Col>
            <Col lg={4} className="prodInfo">
              <div >
                <h5>Offers</h5>
              </div>
              <hr />
              <Form.Group className="mt-3">
                <Form.Control
                  as="textarea"
                  value={product.offers?.text}
                  readOnly
                  style={{
                    height: '100px',
                    whiteSpace: 'pre-wrap',
                    paddingTop: '10px',
                    lineHeight: '20px'
                  }}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-5 mb-5">
            <Col lg={7} className="prodInfo">
              <div >
                <h5>Variants</h5>
              </div>
              <hr />
              <Row>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Thickness</th>
                      <th>Size</th>
                      <th>Dimensions</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(groupedVariants).map(thickness => (
                      groupedVariants[thickness].map((variant, index) => {
                        const size = variant.attributes.find(attr => attr.name === "categorytypes")?.value;
                        const price = variant.price;
                        const dimensions = variant.attributes
                          .filter(attr => attr.name === "dimension_inches")
                          .map(attr => attr.value);
                        return (
                          <React.Fragment key={variant._id}>
                            <tr>
                              <td rowSpan={dimensions.length > 3 ? 2 : 1}>{thickness} inches</td>
                              <td>{size}</td>
                              <td rowSpan={dimensions.length > 3 ? 2 : 1}>
                                {/* Render dimensions */}
                                {dimensions.slice(0, 3).map((dim, idx) => (
                                  <div key={idx}>{dim}</div>
                                ))}
                              </td>
                              <td rowSpan={dimensions.length > 3 ? 2 : 1}>{price}</td>
                            </tr>
                            {dimensions.length > 3 && (
                              <tr>
                                {/* For the second row, use `rowSpan` to show remaining dimensions in one cell */}
                                <td>{size}</td>
                                <td>
                                  {dimensions.slice(3).map((dim, idx) => (
                                    <div key={idx}>{dim}</div>
                                  ))}
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })
                    ))}
                  </tbody>
                </Table>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
