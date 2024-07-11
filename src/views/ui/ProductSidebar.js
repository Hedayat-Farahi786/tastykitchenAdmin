import React, { useState, useEffect } from "react";
import { Button } from "reactstrap";
import imagePlaceholder from "../../assets/images/placeholder-image.jpg";
import { Spinner } from "reactstrap";

const ProductSidebar = ({ closeSidebar, editProduct }) => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    optionsTitle: "Select a size",
    options: [],
    menuId: "",
  });
  const [imageUrl, setImageUrl] = useState(imagePlaceholder);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch("http://localhost:4000/categories") // Adjust the endpoint as needed
      .then((response) => response.json())
      .then((data) => setCategories(data));
  }, []);

  useEffect(() => {
    if (editProduct) {
      setForm({
        name: editProduct.name,
        description: editProduct.description,
        image: editProduct.image,
        optionsTitle: editProduct.optionsTitle,
        options: editProduct.options,
        menuId: editProduct.menuId._id,
      });
    }
  }, [editProduct]);

  useEffect(() => {
    if (form.image) {
      const img = new Image();
      img.src = form.image;
      img.onload = () => setImageUrl(form.image);
      img.onerror = () => setImageUrl(imagePlaceholder);
    } else {
      setImageUrl(imagePlaceholder);
    }
  }, [form.image]);

  const addOption = () => {
    setForm({
      ...form,
      options: [...form.options, { size: "", price: "" }],
    });
  };

  const removeOption = (index) => {
    const newOptions = form.options.filter((_, i) => i !== index);
    setForm({ ...form, options: newOptions });
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...form.options];
    newOptions[index][field] = value;
    setForm({ ...form, options: newOptions });
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!form.name) formErrors.name = "Name is required";
    // if (!form.description) formErrors.description = "Description is required";
    if (!form.image) formErrors.image = "Image URL is required";
    if (!form.optionsTitle) formErrors.optionsTitle = "Options title is required";
    // if (form.options.length === 0) formErrors.options = "At least one option is required";
    if (!form.menuId) formErrors.menuId = "Category is required";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    setLoading(true);
    const method = editProduct ? "PUT" : "POST";
    const url = editProduct ? `http://localhost:4000/products/${editProduct._id}` : "http://localhost:4000/products";
    if(!editProduct){
      form.visible = true;
    }
    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        closeSidebar();
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error:", error);
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end" onClick={closeSidebar}>
      <div
        className="bg-white w-1/3 h-full p-4 overflow-y-scroll pb-5 relative"
        onClick={(e) => e.stopPropagation()} // Prevents click event from closing sidebar when clicking inside
      >
        <button
          className="absolute top-4 right-4 text-gray-600"
          onClick={closeSidebar}
        >
          <i className="bi bi-x-lg"></i>
        </button>
        <h2 className="text-xl font-semibold mb-4">
          {editProduct ? "Edit Product" : "Add New Product"}
        </h2>
        <div className="w-full flex items-center justify-center mb-4">
          <img src={imageUrl} className="w-60 rounded-md border" alt="product" />
        </div>
        <label className="block mb-2">Product Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        <label className="block mb-2">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        {/* {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>} */}
        <label className="block mb-2">Image URL</label>
        <input
          type="text"
          value={form.image}
          onChange={(e) => handleChange("image", e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
        <label className="block mb-2">Options Title</label>
        <input
          type="text"
          value={form.optionsTitle}
          onChange={(e) => handleChange("optionsTitle", e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        {errors.optionsTitle && <p className="text-red-500 text-sm">{errors.optionsTitle}</p>}
        <label className="block mb-2">Options</label>
        {form.options.map((option, index) => (
          <div key={index} className="flex mb-2">
            <input
              type="text"
              placeholder="Size"
              value={option.size}
              onChange={(e) =>
                handleOptionChange(index, "size", e.target.value)
              }
              className="w-1/2 mr-2 p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Price"
              value={option.price}
              onChange={(e) =>
                handleOptionChange(index, "price", e.target.value)
              }
              className="w-1/2 p-2 border rounded"
            />
            <Button className="ml-2 btn btn-danger" onClick={() => removeOption(index)}>
              <i className="bi bi-trash"></i>
            </Button>
          </div>
        ))}
        {/* {errors.options && <p className="text-red-500 text-sm">{errors.options}</p>} */}
        <Button className="mb-4" onClick={addOption}>
          <i className="bi bi-plus-circle mr-2"></i> Add Option
        </Button>
        <label className="block mb-2">Category</label>
        <select
          value={form.menuId}
          onChange={(e) => handleChange("menuId", e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        >
          <option value="">Choose a category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <div className="mb-5">
        {errors.menuId && <p className="text-red-500 text-sm">{errors.menuId}</p>}
        </div>
        <Button className="btn btn-success w-full" onClick={handleSubmit} disabled={loading}>
          {loading ? <Spinner size="sm" /> : <><i className="bi bi-plus-lg mr-2"></i>Submit</>}
        </Button>
      </div>
    </div>
  );
};

export default ProductSidebar;
