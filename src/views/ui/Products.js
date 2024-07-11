import React, { useState, useEffect } from "react";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  Button,
  CardTitle,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Input,
} from "reactstrap";
import classnames from "classnames";
import ProductSidebar from "./ProductSidebar"; // Updated import

const Products = () => {
  const [activeTab, setActiveTab] = useState("0");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [modal, setModal] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 'delete' or 'toggleVisible'
  const [modalProduct, setModalProduct] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = () => {
    setLoading(true);
    fetch("https://tastykitchen-backend.vercel.app/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
        const uniqueCategories = [
          ...new Set(data.map((product) => product.menuId.name)),
        ];
        setCategories(uniqueCategories);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    setEditProduct(null);
    fetchProducts(); // Fetch the products again after closing the sidebar
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleDelete = (product) => {
    setModalProduct(product);
    setModalAction("delete");
    toggleModal();
  };

  const handleToggleVisible = (product) => {
    setModalProduct(product);
    setModalAction("toggleVisible");
    toggleModal();
  };

  const confirmAction = () => {
    setProcessing(true);
    let url, method;

    if (modalAction === "delete") {
      url = `https://tastykitchen-backend.vercel.app/products/${modalProduct._id}`;
      method = "DELETE";
    } else if (modalAction === "toggleVisible") {
      url = `https://tastykitchen-backend.vercel.app/products/${modalProduct._id}/toggleVisible`;
      method = "PUT";
    }

    fetch(url, { method })
      .then((response) => response.json())
      .then(() => {
        setProcessing(false);
        toggleModal();
        setModalProduct(null);
        fetchProducts(); // Fetch the products again after action
      })
      .catch((error) => {
        setProcessing(false);
        console.error("Error:", error);
      });
  };

  const renderProductCard = (product) => (
    <div key={product._id} className="w-full sm:w-1/2 lg:w-1/3 p-2">
      <Card className="w-full rounded-md">
        <img
          className="w-full h-72 object-cover object-center rounded-tr-md rounded-tl-md"
          src={product.image}
          alt={product.name}
        />
        <CardBody>
          <p className="font-semibold text-xl">{product.name}</p>
          <p className="text-xs text-gray-500 my-2">{product.description}</p>
          <div>
            <p className="text-sm text-main uppercase">Options:</p>
            <div className="mt-2">
              {product.options.map((option) => (
                <div
                  key={option._id}
                  className="w-full flex items-center justify-between text-sm border px-2 py-1 rounded-md mb-2"
                >
                  <p>{option.size}</p>
                  <p className="text-main font-semibold">{option.price} €</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <Button className="flex-1 mr-2" onClick={() => handleEdit(product)}>
              <i className="bi bi-pencil-square mr-2"></i> Edit
            </Button>
            <Button
              className={`mx-2 ${
                product.visible ? "btn-success" : "btn-warning"
              }`}
              onClick={() => handleToggleVisible(product)}
            >
              {product.visible ? (
                <div>
                  {" "}
                  <i className="bi bi-eye"></i>
                </div>
              ) : (
                <div>
                  {" "}
                  <i className="bi bi-eye-slash"></i>
                </div>
              )}
            </Button>
            <Button
              className="ml-2 btn-danger"
              onClick={() => handleDelete(product)}
            >
              <i className="bi bi-trash"></i>
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );

  const renderAllProducts = () => {
    return categories.map((category) => (
      <div key={category}>
        <h3 className="font-semibold">{category}</h3>
        <div className="w-full h-[1px] bg-main my-2"></div>
        <div className="flex flex-wrap -mx-2">
          {filteredProducts
            .filter((product) => product.menuId.name === category)
            .map(renderProductCard)}
        </div>
      </div>
    ));
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    if (query === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query)
      );
      setFilteredProducts(filtered);
    }
  };

  return (
    <>
      {!loading && (
        <Card>
          <div className="flex items-center justify-between px-4 py-3">
            <CardTitle>
              <p className="text-2xl font-semibold">
                Products{" "}
                <span className="text-sm text-gray-400 font-semibold ml-2">
                  GESMAT: <span className="text-main">{products.length}</span>
                </span>
              </p>
            </CardTitle>
            <div className="flex items-center space-x-4">
              <Input
                type="text"
                placeholder="Search Products"
                value={searchQuery}
                onChange={handleSearch}
              />
              <Button
                className="bg-main hover:bg-red-700 border-red-500 hover:border-red-700 w-full"
                onClick={() => setSidebarOpen(true)}
              >
                <i className="bi bi-plus-circle mr-2"></i> Add New Product
              </Button>
            </div>
          </div>
          <div className="w-full bg-gray-300 h-[1px]"></div>
          <CardBody>
            <Nav tabs>
              <NavItem className="cursor-pointer">
                <NavLink
                  className={classnames({
                    active: activeTab === "0",
                  })}
                  onClick={() => toggle("0")}
                >
                  <span className="font-semibold text-xl">All</span>
                </NavLink>
              </NavItem>
              {categories.map((category, index) => (
                <NavItem key={index} className="cursor-pointer">
                  <NavLink
                    className={classnames({
                      active: activeTab === (index + 1).toString(),
                    })}
                    onClick={() => toggle((index + 1).toString())}
                  >
                    <span className="font-semibold text-xl">{category}</span>
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
            <TabContent activeTab={activeTab} className="mt-3">
              <TabPane tabId="0">{renderAllProducts()}</TabPane>
              {categories.map((category, index) => (
                <TabPane tabId={(index + 1).toString()} key={index}>
                  <div className="flex flex-wrap -mx-2">
                    {filteredProducts
                      .filter((product) => product.menuId.name === category)
                      .map(renderProductCard)}
                  </div>
                </TabPane>
              ))}
            </TabContent>
          </CardBody>
        </Card>
      )}
      {sidebarOpen && (
        <ProductSidebar
          closeSidebar={handleCloseSidebar}
          editProduct={editProduct}
        />
      )}
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          {modalAction === "delete"
            ? "Confirm Delete"
            : "Confirm Toggle Visibility"}
        </ModalHeader>
        <ModalBody>
          {modalAction === "delete"
            ? `Are you sure you want to delete the product: ${
                modalProduct && modalProduct.name
              }?`
            : `Are you sure you want to ${
                modalProduct && modalProduct.visible ? "hide" : "show"
              } the product: ${modalProduct && modalProduct.name}?`}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={confirmAction} disabled={processing}>
            {processing ? <Spinner size="sm" /> : "Yes"}
          </Button>
          <Button color="secondary" onClick={toggleModal} disabled={processing}>
            No
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Products;
