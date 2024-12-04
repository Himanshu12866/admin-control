import React, { useEffect, useState } from "react";
import { Col, Container, Row, Form, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faTimes } from "@fortawesome/free-solid-svg-icons";
import "../../css/product-details.css";
import "../../css/addproduct.css";
import axios from "axios";
export default function AddProduct() {
  const [mediaFiles, setMediaFiles] = useState([]); // State for Media Files
  const [coverMediaFiles, setCoverMediaFiles] = useState([]); // State for Cover Media Files
  const [thickness, setThickness] = useState("");
  const [data, setData] = useState([]); // State to store fetched data
  const [categories, setCategories] = useState([]); // State to store unique categories
  const [subCategories, setSubCategories] = useState([]); // State to store unique categories
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [variantTable, setVariantTable] = useState("none");
  const [inchW, setInchW] = useState(0);
  const [inchH, setInchH] = useState(0);
  const [dimension_inches, setDimension_inches] = useState("");
  const [cmH, setCmH] = useState(0);
  const [cmW, setCmW] = useState(0);
  const [dimension_cm, setDimension_cm] = useState("");
  const [toggle, setToggle] = useState("");
  const [variants, setVariants] = useState([]);
  const [editingVariantIndex, setEditingVariantIndex] = useState(null);
  const [dnewCat, setDnewCat] = useState("none");
  const [dnewSubCat, setDnewSubCat] = useState("none");
  const [coverName, setCoverName] = useState("");
  const [coverNote, setCoverNote] = useState("");
  const [coverDescription, setCoverDescription] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [covers, setCovers] = useState([]);
  const [coverTable, setCoverTable] = useState("none");
  const [editIndex, setEditIndex] = useState(null); // Track the index being edited

  const handleAddVariant = () => {
    const newVariant = {
      thickness,
      size,
      dimensionsInch: `${inchW}x${inchH}`,
      dimensionsCm: `${cmW}x${cmH}`,
      price,
    };

    setVariants([...variants, newVariant]);
    setVariantTable("block");
    resetFields();
  };
  const LoadCatSubCat = async () => {
    try {
      const fetchedData = await axios
        .get(
          "https://livon-rest-healthy-backend-26380982364.us-east1.run.app/productdetails"
        )
        .then((response) => {
          return response.data;
        });
      setData(fetchedData[0].products);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Extract unique categories from data
  const extractCategories = (data) => {
    // console.log(fetchedData)

    const uniqueCategories = [...new Set(data.map((item) => item.category))]; // Create unique category list
    const uniqueSubCategories = [
      ...new Set(data.map((item) => item.subcategory)),
    ];
    setSubCategories(uniqueSubCategories);
    setCategories(uniqueCategories); // Store unique categories in state
    console.log("Unique Categories:", uniqueCategories); // Log unique categories
  };

  // Fetch data when the component mounts
  useEffect(() => {
    LoadCatSubCat();
    console.log(data);
  }, []);

  // Extract categories when data is updated
  useEffect(() => {
    if (data.length > 0) {
      extractCategories(data); // Extract categories when data is available
    }
  }, [data]);

  const handleUpdateVariant = () => {
    const updatedVariants = [...variants];
    updatedVariants[editingVariantIndex] = {
      thickness,
      size,
      dimensionsInch: `${inchW}x${inchH}`,
      dimensionsCm: `${cmW}x${cmH}`,
      price,
    };

    setVariants(updatedVariants);
    setEditingVariantIndex(null);
    resetFields();
  };

  const handleEditVariant = (index) => {
    const variant = variants[index];
    setThickness(variant.thickness);
    setSize(variant.size);
    const [widthInch, heightInch] = variant.dimensionsInch.split("x");
    setInchW(widthInch);
    setInchH(heightInch);
    const [widthCm, heightCm] = variant.dimensionsCm.split("x");
    setCmW(widthCm);
    setCmH(heightCm);
    setPrice(variant.price);
    setEditingVariantIndex(index);
  };

  const handleDeleteVariant = (index) => {
    if (variants.length === 1) {
      setVariants(variants.filter((_, i) => i !== index));
      setVariantTable("none");
    } else {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  const resetFields = () => {
    // setThickness("");
    // setSize("");
    setInchW("");
    setInchH("");
    setCmW("");
    setCmH("");
    setPrice("");
  };

  // Handle file upload for Media (multiple files)
  const handleMediaUpload = (event) => {
    const files = Array.from(event.target.files);
    setMediaFiles((prevFiles) => [...prevFiles, ...files]);
  };

  // Handle file upload for Cover Media (multiple files)
  const handleCoverMediaUpload = (event) => {
    const files = Array.from(event.target.files);
    let imageFile = event.target.files[0];
    if (imageFile) {
      setCoverImage(imageFile); // Set the file in the local state
    }
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

    let file = event.dataTransfer.files[0]; // Get the first dropped file
    if (file) {
      setCoverImage(file); // Set the file in the local state
    }
  };

  // Handle drag over event to allow drop
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Functions for updating variant dimenstions in inches and cms

  const handleInchW = (e) => {
    let value = e.target.value;
    let cmValue = Math.floor(Math.round(value * 2.54 * 100) / 100); // Rounds to two decimal places
    setInchW(value);
    setCmW(cmValue);
  };
  const handleinchH = (e) => {
    let value = e.target.value;
    let cmValue = Math.floor(Math.round(value * 2.54 * 100) / 100); // Rounds to two decimal places
    setInchH(value);
    setCmH(cmValue);
  };
  const handleCmW = (e) => {
    let value = e.target.value;
    let inchValue = Math.floor(value / 2.54); // Convert centimeters to inches and round down to the nearest integer
    setCmW(value); // Set the original value in centimeters
    setInchW(inchValue);
  };
  const handleCmH = (e) => {
    let value = e.target.value;
    let inchValue = Math.floor(value / 2.54); // Convert centimeters to inches and round down to the nearest integer
    setCmH(value); // Set the original value in centimeters
    setInchH(inchValue); // Set the converted value in inches
  };
  function setDimensionInches() {
    if (
      inchH <= 0 &&
      inchW <= 0 &&
      inchW <= 0 &&
      inchH <= 0 &&
      thickness === "" &&
      size === "" &&
      price === ""
    ) {
      alert("Please enter valid dimensions");
      setToggle("");
    } else {
      setDimension_inches(`${inchW} * ${inchH}`);
      setDimension_cm(`${cmW} * ${cmH}`);
      setToggle("modal");
      console.log(dimension_inches);
      console.log(dimension_cm);
    }
  }

  // fucntion for adding new categories and subcategories

  const AddNewCat = (e) => {
    if (e.target.value === "Add New Category") {
      setDnewCat("block");
    } else {
      setDnewCat("none");
    }
  };
  const AddNewSubCat = (e) => {
    if (e.target.value === "Add New Subcategory") {
      setDnewSubCat("block");
    } else {
      setDnewSubCat("none");
    }
  };

  // Cover Function
  // Add or Update Cover Data
  const displayCoverData = () => {
    const newCover = {
      coverName,
      coverNote,
      coverImage: coverImage ? coverImage.name : null,
      coverDescription,
    };

    if (editIndex !== null) {
      // Edit existing cover
      setCovers((prevCovers) => {
        const updatedCovers = [...prevCovers];
        updatedCovers[editIndex] = newCover;
        console.log("Updated Covers:", updatedCovers);
        return updatedCovers;
      });
    } else {
      // Add new cover
      setCovers((prevCovers) => {
        const updatedCovers = [...prevCovers, newCover];
        console.log("New Cover Added:", updatedCovers);
        setCoverTable("block");
        return updatedCovers;
      });
    }

    // Reset form fields
    resetFormFields();
  };

  // Reset Form Fields
  const resetFormFields = () => {
    setCoverDescription("");
    setCoverImage(null);
    setCoverName("");
    setCoverNote("");
    setEditIndex(null); // Reset edit index
    setCoverMediaFiles([]); // Clear media file previews
  };

  // Edit Cover
  const handleEdit = (index) => {
    const coverToEdit = covers[index];
    setEditIndex(index);
    setCoverName(coverToEdit.coverName);
    setCoverNote(coverToEdit.coverNote);
    setCoverDescription(coverToEdit.coverDescription);
    setCoverImage(coverToEdit.coverImage);
  };

  // Delete Cover
  const handleDelete = (index) => {
    setCovers((prevCovers) => {
      const updatedCovers = prevCovers.filter((_, i) => i !== index);
      console.log("Covers after delete:", updatedCovers);
      return updatedCovers;
    });
  };

  useEffect(() => {
    console.log("Covers state changed:", covers);
  }, [covers]); // Logs whenever covers state changes

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

                      <select className="form-select" onChange={AddNewCat}>
                        <option value="1">Select Categories</option>
                        {categories.map((item, index) => (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        ))}
                        <option>Add New Category</option>
                      </select>
                      <div className={`d-${dnewCat} my-2`}>
                        <input
                          className="form-control"
                          style={{ padding: "-5px" }}
                          type="text"
                          name="category"
                          placeholder="Add New Category"
                        />
                      </div>
                    </Form.Group>
                    <Form.Group as={Col} md="6">
                      <Form.Label>Subcategory</Form.Label>
                      <select className="form-select" onChange={AddNewSubCat}>
                        <option value="1">Select Subcategories</option>
                        {subCategories.map((item, index) => (
                          <option key={index}>{item}</option>
                        ))}
                        <option>Add New Subcategory</option>
                      </select>
                      <div className={`d-${dnewSubCat} my-2`}>
                        <input
                          className="form-control"
                          style={{ padding: "-5px" }}
                          type="text"
                          name="subcategory"
                          placeholder="Add New SubCategory"
                        />
                      </div>
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
                          <Form.Label className="font-medium">
                            Thickness (inches)
                          </Form.Label>
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
                          <Form.Label className="font-medium">Size</Form.Label>
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
                          <Form.Label className="font-medium">
                            Dimensions (In)
                          </Form.Label>
                        </div>
                        <div className="col-8">
                          <div className="row w-100">
                            <div className="col-5">
                              <div className="input-group">
                                <span className="input-group-text font-medium">
                                  Width
                                </span>
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
                                <span className="input-group-text font-medium">
                                  Height
                                </span>
                                <input
                                  className="form-control"
                                  value={inchH}
                                  onChange={handleinchH}
                                  type="number"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Form.Group>
                    <Form.Group
                      controlId="dimensions"
                      className="mb-3 flex justify-between"
                    >
                      <div className="row w-100">
                        <div className="col-4">
                          <Form.Label className="font-medium">
                            Dimensions (Cm)
                          </Form.Label>
                        </div>
                        <div className="col-8">
                          <div className="row w-100">
                            <div className="col-5">
                              <div className="input-group">
                                <span className="input-group-text font-medium">
                                  Width
                                </span>
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
                                <span className="input-group-text font-medium">
                                  Height
                                </span>
                                <input
                                  className="form-control"
                                  value={cmH}
                                  onChange={handleCmH}
                                  type="number"
                                />
                              </div>
                            </div>
                          </div>
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
                          <Form.Label className="font-medium">Price</Form.Label>
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
                          } else {
                            handleAddVariant();
                          }
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
                    <Form.Label className="font-medium">Cover Name</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={(e) => setCoverName(e.target.value)}
                      value={coverName}
                      placeholder="Enter cover name"
                    />
                  </Form.Group>

                  {/* Cover Note */}
                  <Form.Group className="mb-3">
                    <Form.Label className="font-medium">Cover Note</Form.Label>
                    <Form.Control
                      type="text"
                      value={coverNote}
                      onChange={(e) => setCoverNote(e.target.value)}
                      placeholder="Enter cover note"
                    />
                  </Form.Group>

                  {/* Description */}
                  <Form.Group className="mb-3">
                    <Form.Label className="font-medium">Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      placeholder="Enter description"
                      value={coverDescription}
                      onChange={(e) => setCoverDescription(e.target.value)}
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
                    <h5 className="font-medium">Cover Image</h5>
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
                  <button
                    onClick={displayCoverData}
                    data-bs-dismiss="modal"
                    className="btn btn-dark mt-3 w-100"
                  >
                    Add Cover
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Row className={`mt-5 d-${variantTable}`}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Thickness (Inches)</th>
              <th>Size</th>
              <th>Dimensions (Inches)</th>
              <th>Dimensions (Cm)</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((variant, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{variant.thickness}</td>
                <td>{variant.size}</td>
                <td>{variant.dimensionsInch}</td>
                <td>{variant.dimensionsCm}</td>
                <td>{variant.price}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    data-bs-toggle="modal"
                    data-bs-target="#variant-modal"
                    onClick={() => handleEditVariant(index)}
                  >
                    <span className="bi bi-pen"></span>
                  </Button>{" "}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteVariant(index)}
                  >
                    <span className="bi bi-trash"></span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
      <Row className={`mt-5 d-${coverTable} flex justify-center`}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Cover Name</th>
              <th>Cover Note</th>
              <th>Cover Description</th>
              <th>Preview</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {covers.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.coverName}</td>
                <td>{item.coverNote}</td>
                <td>{item.coverDescription}</td>
                <td>
                  {item.coverImage && (
                    <img
                      src={item.coverImage}
                      alt={item.coverImage}
                      style={{
                        width: "150px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "5px",
                      }}
                    />
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-success mr-4"
                    data-bs-target="#cover-modal"
                    data-bs-toggle="modal"
                    onClick={() => handleEdit(index)}
                  >
                    <span className="bi bi-pen"></span>
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(index)}
                  >
                    <span className="bi bi-trash"></span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
    </div>
  );
}
