import React, { useState } from "react";
import { Col, Container, Row, Form, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faTimes } from "@fortawesome/free-solid-svg-icons";
import "../../css/product-details.css";
import "../../css/addproduct.css";

export default function AddProduct() {
  const [mediaFiles, setMediaFiles] = useState([]); // State for Media Files
  const [coverMediaFiles, setCoverMediaFiles] = useState([]); // State for Cover Media Files
  const [groupedVariants, setGroupedVariants] = useState({});
  const [thickness, setThickness] = useState("");
  const [size, setSize] = useState("");
  const [dimensions, setDimensions] = useState([]);
  const [price, setPrice] = useState("");
  const [editingVariantIndex, setEditingVariantIndex] = useState(null);
  const [editingThickness, setEditingThickness] = useState("");
  const [variantTable, setVariantTable] = useState("none");
  const [inchW, setInchW] = useState();
  const [inchH, setInchH] = useState();
  const [dimension_inches, setDimension_inches] = useState("");
  const [cmH, setCmH] = useState();
  const [cmW, setCmW] = useState();
  const [dimension_cm, setDimension_cm] = useState("");
  // Handle adding a new variant
  const handleAddVariant = () => {
    if (!thickness || !size || !price) {
      alert("Please fill all fields");
      return;
    }

    const newVariant = {
      _id: `${thickness}-${size}`, // Unique ID for the variant
      attributes: [
        { name: "categorytypes", value: size },
        { name: "dimension_inches", value: dimensions },
      ],
      price,
    };

    setGroupedVariants((prevVariants) => {
      const updatedVariants = { ...prevVariants };
      if (!updatedVariants[thickness]) {
        updatedVariants[thickness] = [];
      }
      updatedVariants[thickness].push(newVariant);
      return updatedVariants;
    });

    // Clear form after adding
    setThickness("");
    setSize("");
    setDimensions([]);
    setPrice("");
  };

  // Handle editing a variant
  const handleEditVariant = (thickness, index) => {
    const variant = groupedVariants[thickness][index];

    // Get the attributes correctly
    const variantThickness = thickness; // Set thickness directly
    const variantSize = variant.attributes?.find(
      (attr) => attr.name === "categorytypes"
    )?.value;
    const variantDimensions =
      variant.attributes?.find((attr) => attr.name === "dimension_inches")
        ?.value || []; // Ensure it's always an array
    const variantPrice = variant.price;

    // Set the form fields to the variant's values
    setThickness(variantThickness); // Set thickness directly
    setSize(variantSize || "");
    setDimensions(variantDimensions);
    setPrice(variantPrice || "");

    setEditingVariantIndex(index); // Mark as editing this variant by index
    setEditingThickness(thickness); // Store the thickness for updating
  };

  // Handle updating only the thickness of the variant
  const handleUpdateVariant = () => {
    if (!thickness) {
      alert("Please provide a thickness");
      return;
    }

    // Check if the variant to be updated exists
    if (editingVariantIndex === null || editingThickness === "") {
      alert("No variant selected for update");
      return;
    }

    setGroupedVariants((prevVariants) => {
      const updatedVariants = { ...prevVariants };

      // Find the variant using thickness and index
      const updatedVariant =
        updatedVariants[editingThickness][editingVariantIndex];

      // Only update the thickness, leave the rest intact
      updatedVariant._id = `${thickness}-${updatedVariant._id.split("-")[1]}`; // Update _id based on new thickness
      updatedVariants[editingThickness][editingVariantIndex] = updatedVariant;

      return updatedVariants;
    });

    // Clear form after update
    setThickness("");
    setSize("");
    setDimensions([]);
    setPrice("");
    setEditingVariantIndex(null); // Reset editing state
    setEditingThickness(""); // Reset thickness
  };

  // Handle removing a variant
  const handleRemoveVariant = (variantId, thickness) => {
    setGroupedVariants((prevVariants) => {
      const updatedVariants = { ...prevVariants };
      updatedVariants[thickness] = updatedVariants[thickness].filter(
        (variant) => variant._id !== variantId
      );
      return updatedVariants;
    });
  };

  // Handle file upload for Media (multiple files)
  const handleMediaUpload = (event) => {
    const files = Array.from(event.target.files);
    setMediaFiles((prevFiles) => [...prevFiles, ...files]);
  };

  // Handle file upload for Cover Media (multiple files)
  const handleCoverMediaUpload = (event) => {
    const files = Array.from(event.target.files);
    setCoverMediaFiles((prevFiles) => [...prevFiles, ...files]);
  };

  // Remove uploaded file by index
  const removeMediaFile = (index) => {
    const updatedFiles = mediaFiles.filter((_, i) => i !== index);
    setMediaFiles(updatedFiles);
  };

  // Remove uploaded cover media file by index
  const removeCoverMediaFile = (index) => {
    const updatedFiles = coverMediaFiles.filter((_, i) => i !== index);
    setCoverMediaFiles(updatedFiles);
  };

  // Handle drag-and-drop functionality for media files
  const handleDrop = (event, isCover = false) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    if (isCover) {
      setCoverMediaFiles((prevFiles) => [...prevFiles, ...files]);
    } else {
      setMediaFiles((prevFiles) => [...prevFiles, ...files]);
    }
  };

  // Handle drag over event to allow drop
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Functions for updating variant dimenstions in inches and cms

  const handleInchW = (e) => {
    let value = e.target.value;
    if (!value || isNaN(value) || value <= 0) {
      alert("Please enter a valid positive value for width in inches.");
      return;
    }
    let cmValue = Math.floor(value * 2.54); // Convert inches to cm
    setInchW(value);
    setCmW(cmValue);
  };
  
  const handleInchH = (e) => {
    let value = e.target.value;
    if (!value || isNaN(value) || value <= 0) {
      alert("Please enter a valid positive value for height in inches.");
      return;
    }
    let cmValue = Math.floor(value * 2.54); // Convert inches to cm
    setInchH(value);
    setCmH(cmValue);
  };
  
  const handleCmW = (e) => {
    let value = e.target.value;
    if (!value || isNaN(value) || value <= 0) {
      alert("Please enter a valid positive value for width in centimeters.");
      return;
    }
    let inchValue = Math.floor(value / 2.54); // Convert cm to inches
    setCmW(value);
    setInchW(inchValue);
  };
  
  const handleCmH = (e) => {
    let value = e.target.value;
    if (!value || isNaN(value) || value <= 0) {
      alert("Please enter a valid positive value for height in centimeters.");
      return;
    }
    let inchValue = Math.floor(value / 2.54); // Convert cm to inches
    setCmH(value);
    setInchH(inchValue);
  };
  
  function setDimensionInches() {
    setDimension_inches(`${inchW} * ${inchH}`);
    setDimension_cm(`${cmW} * ${cmH}`);
    console.log(dimension_inches);
    console.log(dimension_cm);
  }

  return (
    <div>
      <div className="product-details">
        <Container fluid>
          {/* Header */}
          <div className="product-head-data">
            <div className="d-flex gap-2">
              <h5>
                <Link to="/">Products</Link>
              </h5>
              <span>/</span>
              <span>Add New Product</span>
            </div>
            <h4>Add New Product</h4>
            <hr />
          </div>

          {/* Form Section */}
          <div className="product-data">
            <Row>
              {/* Product Information */}
              <Col lg={7} className="prodInfo me-3">
                <div>
                  <h5>Product Information</h5>
                </div>
                <hr />
                <form>
                  {/* Title */}
                  <Form.Group className="mt-1">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      placeholder="Product title"
                    />
                  </Form.Group>
                  {/* Category and Subcategory */}
                  <div className="row mt-1">
                    <Form.Group as={Col} md="6">
                      <Form.Label>Category</Form.Label>
                      <Form.Control
                        type="text"
                        name="category"
                        placeholder="Category"
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="6">
                      <Form.Label>Subcategory</Form.Label>
                      <Form.Control
                        type="text"
                        name="subcategory"
                        placeholder="Subcategory"
                      />
                    </Form.Group>
                  </div>
                  <Form.Group className="mt-2">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="descriptions"
                      placeholder="product Description"
                      className="description-textarea"
                      style={{
                        height: "auto",
                        whiteSpace: "pre-wrap",
                        paddingTop: "10px",
                        lineHeight: "40px",
                      }}
                    />
                  </Form.Group>
                </form>

                {/* Media Section */}
                <Row className="mt-5 mb-5">
                  <div className="gap-6">
                    <Button
                      data-bs-toggle="modal"
                      data-bs-target="#variant-modal"
                      className="btn btn-primary mr-5 w-52"
                    >
                      Add Variant
                    </Button>
                    <Button
                      className="btn btn-success mr-5 w-52"
                      data-bs-toggle="modal"
                      data-bs-target="#cover-modal"
                    >
                      Add Cover
                    </Button>
                  </div>

                  <div className="add-product-btn-container mt-2 ">
                    {/* Centered the Add Product button */}
                    <Button
                      variant="primary"
                      className="add-product-btn w-100 "
                    >
                      Add Product
                    </Button>
                  </div>
                </Row>
              </Col>

              {/* Cover Information */}
              <Col
                lg={4}
                style={{ border: "none" }}
                className="prodInfo sm:h-[300px]"
              >
                <div>
                  <h5>Media</h5>
                </div>
                <hr />
                <Row>
                  <Col>
                    <div className="preview-images flex flex-row gap-3 flex-wrap w-full">
                      {mediaFiles.map((file, index) => (
                        <div
                          key={index}
                          className="preview-container mt-3 position-relative"
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt="Uploaded Preview"
                            style={{
                              width: "150px", // Adjust the preview size
                              height: "100px", // Adjust the preview size
                              objectFit: "cover",
                              borderRadius: "10px",
                            }}
                          />
                          <FontAwesomeIcon
                            icon={faTimes}
                            className="position-absolute top-0 end-0 p-1"
                            style={{
                              cursor: "pointer",
                              color: "red",
                              fontSize: "1.2rem",
                            }}
                            onClick={() => removeMediaFile(index)}
                          />{" "}
                        </div>
                      ))}
                    </div>
                  </Col>
                </Row>
                {/* Drag and Drop File Upload Section */}
                <Form.Group className="mt-5">
                  <div
                    className="file-upload"
                    onDrop={(e) => handleDrop(e)}
                    onDragOver={handleDragOver}
                    onClick={() =>
                      document.getElementById("media-file-input").click()
                    } // Trigger file input click on div click
                    style={{
                      width: "100%",
                      height: "200px",
                      border: "2px dashed #ccc",
                      borderRadius: "10px",
                      textAlign: "center",
                      paddingTop: "70px",
                      cursor: "pointer",
                      backgroundColor: "rgb(248 250 253)",
                    }}
                  >
                    <p>Drag and drop your file here</p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: "none" }}
                      id="media-file-input"
                      onChange={handleMediaUpload}
                    />
                    <p>or</p>
                    <label htmlFor="media-file-input" className="upload-button">
                      Browse File
                    </label>
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Variants Secton */}
          <div className="modal fade" id="variant-modal">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="p-4 modal-header">
                  <h5>Variants</h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <Form>
                    {/* Thickness Field */}
                    <Form.Group
                      controlId="thickness"
                      className="mb-3 flex justify-between"
                    >
                      <div className="row w-100">
                        <div className="col-4">
                          <Form.Label>Thickness (inches)</Form.Label>
                        </div>
                        <div className="col-8">
                          <Form.Control
                            type="number"
                            className="w-100"
                            value={thickness}
                            onChange={(e) => setThickness(e.target.value)}
                            placeholder="Enter thickness"
                          />
                        </div>
                      </div>
                    </Form.Group>

                    {/* Size Field */}
                    <Form.Group
                      controlId="size"
                      className="mb-3 flex justify-between"
                    >
                      <div className="row w-100">
                        <div className="col-4">
                          <Form.Label>Size</Form.Label>
                        </div>
                        <div className="col-8">
                          <Form.Control
                            type="text"
                            className="w-100"
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                            placeholder="Enter size"
                          />
                        </div>
                      </div>
                    </Form.Group>

                    {/* Dimensions Field */}
                    <Form.Group
                      controlId="dimensions"
                      className="mb-3 flex justify-between"
                    >
                      <div className="row w-100">
                        <div className="col-4">
                          <Form.Label>Dimensions (In)</Form.Label>
                        </div>
                        <div className="col-8">
                          <div className="row w-100">
                            <div className="col-5">
                              <div className="input-group">
                                <span className="input-group-text">Width</span>
                                <input
                                  className="form-control"
                                  value={inchW}
                                  onChange={handleInchW}
                                  type="number"
                                />
                              </div>
                            </div>
                            <div className="col-2 flex justify-center items-center">
                              <p className="text-3xl font-medium">*</p>
                            </div>
                            <div className="col-5">
                              <div className="input-group">
                                <span className="input-group-text">Height</span>
                                <input
                                  className="form-control"
                                  value={inchH}
                                  onChange={handleInchH}
                                  type="number"
                                />
                              </div>
                            </div>
                          </div>
                          {/* <Form.Control
                            type="text"
                            value={dimensions.join(", ")}
                            onChange={(e) =>
                              setDimensions(e.target.value.split(","))
                            }
                            placeholder="Enter dimensions separated by commas"
                          /> */}
                        </div>
                      </div>
                    </Form.Group>
                    <Form.Group
                      controlId="dimensions"
                      className="mb-3 flex justify-between"
                    >
                      <div className="row w-100">
                        <div className="col-4">
                          <Form.Label>Dimensions (Cm)</Form.Label>
                        </div>
                        <div className="col-8">
                          <div className="row w-100">
                            <div className="col-5">
                              <div className="input-group">
                                <span className="input-group-text">Width</span>
                                <input
                                  className="form-control"
                                  value={cmW}
                                  onChange={handleCmW}
                                  type="number"
                                />
                              </div>
                            </div>
                            <div className="col-2 flex justify-center items-center">
                              <p className="text-3xl font-medium">*</p>
                            </div>
                            <div className="col-5">
                              <div className="input-group">
                                <span className="input-group-text">Height</span>
                                <input
                                  className="form-control"
                                  value={cmH}
                                  onChange={handleCmH}
                                  type="number"
                                />
                              </div>
                            </div>
                          </div>
                          {/* <Form.Control
                            type="text"
                            value={dimensions.join(", ")}
                            onChange={(e) =>
                              setDimensions(e.target.value.split(","))
                            }
                            placeholder="Enter dimensions separated by commas"
                          /> */}
                        </div>
                      </div>
                    </Form.Group>

                    {/* Price Field */}

                    <Form.Group
                      controlId="price"
                      className="mb-3 flex justify-between"
                    >
                      <div className="row w-100">
                        <div className="col-4">
                          <Form.Label>Price</Form.Label>
                        </div>
                        <div className="col-8">
                          <Form.Control
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Enter price"
                          />
                        </div>
                      </div>
                    </Form.Group>

                    {/* Submit Button */}
                    <div className="flex justify-center mt-4 mb-2">
                      <Button
                        variant="primary"
                        data-bs-dismiss="modal"
                        onClick={() => {
                          if (editingVariantIndex !== null) {
                            handleUpdateVariant();
                            setDimensionInches();
                          } else {
                            handleAddVariant();
                            setDimensionInches();
                          }
                          setVariantTable("block"); // Add your new functionality here
                        }}
                      >
                        {editingVariantIndex !== null
                          ? "Update Variant"
                          : "Add Variant"}
                      </Button>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>

          {/*Cover Section */}
          <div className="modal fade" id="cover-modal">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                {/* Modal Header */}
                <div className="modal-header">
                  <h5>Covers Information</h5>
                  <button
                    type="button"
                    className="btn btn-close"
                    data-bs-dismiss="modal"
                  ></button>
                </div>

                {/* Modal Body */}
                <div className="modal-body pb-5">
                  {/* Cover Name */}
                  <Form.Group className="mb-3">
                    <Form.Label>Cover Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter cover name" />
                  </Form.Group>

                  {/* Cover Note */}
                  <Form.Group className="mb-3">
                    <Form.Label>Cover Note</Form.Label>
                    <Form.Control type="text" placeholder="Enter cover note" />
                  </Form.Group>

                  {/* Description */}
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      placeholder="Enter description"
                      style={{
                        height: "60px",
                        whiteSpace: "pre-wrap",
                        paddingTop: "10px",
                        lineHeight: "1.5",
                      }}
                    />
                  </Form.Group>

                  {/* Cover Media Section */}
                  <div className="mb-4">
                    <h5>Cover Media</h5>
                  </div>
                  <div className="preview-images mb-4">
                    {coverMediaFiles.map((file, index) => (
                      <div
                        key={index}
                        className="preview-container position-relative"
                        style={{
                          display: "inline-block",
                          marginRight: "5px",
                          marginLeft: "10px",
                          padding: "5px",
                        }}
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Uploaded Preview"
                          style={{
                            width: "100px", // Adjust the preview size
                            height: "auto", // Adjust the preview size
                            objectFit: "cover",
                            borderRadius: "10px",
                          }}
                        />
                        <FontAwesomeIcon
                          icon={faTimes}
                          className="position-absolute top-0 end-0 p-1"
                          style={{
                            cursor: "pointer",
                            color: "red",
                            fontSize: "1.2rem",
                          }}
                          onClick={() => removeCoverMediaFile(index)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Drag and Drop File Upload */}
                  <Form.Group>
                    <div
                      className="file-upload"
                      onDrop={(e) => handleDrop(e, true)}
                      onDragOver={handleDragOver}
                      onClick={() =>
                        document.getElementById("cover-file-input").click()
                      }
                      style={{
                        width: "100%",
                        height: "150px",
                        border: "2px dashed #ccc",
                        borderRadius: "10px",
                        textAlign: "center",
                        paddingTop: "20px",
                        cursor: "pointer",
                        backgroundColor: "rgb(248, 250, 253)",
                      }}
                    >
                      <p>Drag and drop your file here</p>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: "none" }}
                        id="cover-file-input"
                        onChange={handleCoverMediaUpload}
                      />
                      <p>or</p>
                      <label
                        htmlFor="cover-file-input"
                        className="upload-button"
                      >
                        Browse File
                      </label>
                    </div>
                  </Form.Group>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
      {/* <Row className={`mt-5 d-${variantTable}`}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Thickness</th>
              <th>Size</th>
              <th>Dimensions</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(groupedVariants).map((thickness) =>
              groupedVariants[thickness].map((variant, index) => {
                const size = variant.attributes?.find(
                  (attr) => attr.name === "categorytypes"
                )?.value;
                const price = variant.price;
                const dimensions =
                  variant.attributes
                    ?.filter((attr) => attr.name === "dimension_inches")
                    .map((attr) => attr.value)
                    .flat() || []; // Ensure dimensions is always an array

                return (
                  <tr key={variant._id}>
                    <td>{thickness} inches</td>
                    <td>{size}</td>
                    <td>
                      {Array.isArray(dimensions) && dimensions.length > 0
                        ? dimensions.map((dim, idx) => (
                            <div key={idx}>{dim}</div>
                          ))
                        : "No dimensions available"}
                    </td>
                    <td>{price}</td>
                    <td>
                      <Button
                        variant="warning"
                        onClick={() => handleEditVariant(thickness, index)}
                        className="me-2"
                        data-bs-target="#variant-modal"
                        data-bs-toggle="modal"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() =>
                          handleRemoveVariant(variant._id, thickness)
                        }
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </Row> */}
    </div>
  );
}
