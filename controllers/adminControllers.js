const services = require("../services/adminService");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const showAllProducts = async (req, res) => {
  try {
    const list = await services.getAllProducts();
    if (list.length === 0) {
      res.status(list.status).send(list.data);
    } else {
      res.status(list.status).json(list);
    }
  } catch (error) {
    res.status(list.status).json(list.error);
  }
};

const addAdmin = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const { password, email, user_name } = req.body;
    let admin = await services.addAdminService(
      email,
      user_name,
      token,
      password
    );
    if (admin.status !== 200) {
      return res.status(admin.status).json(admin.error);
    }

    res.status(admin.status).json(admin.data);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const addProductToStock = async (req, res) => {
  try {
    const {
      name,
      price,
      brand,
      condition,
      quantity,
      sku,
      tags = [],
    } = req.body;

    const product = await services.addProduct(
      name,
      price,
      brand,
      condition,
      quantity,
      sku,
      tags
    );

    if (product.status !== 200) {
      res.status(product.status).json(product.error);
    }

    res.status(product.status).json(product.data);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const deleteProducts = async (req, res) => {
  try {
    const { sku, quantity } = req.body;
    const item = await services.deleteProduct(sku, quantity);
    if (item.status !== 200) {
      return res.status(item.status).json(item.error);
    }
    res.status(item.status).json(item.data);
  } catch (error) {
    res.status(item.status).json(item.error);
  }
};

const adminFilterProduct = async (req, res) => {
  const { tags, brand, minPrice, maxPrice } = req.body;
  console.log(brand);

  if (
    (!tags || tags.length === 0) &&
    (!brand || brand === null) &&
    (!minPrice) &&
    (!maxPrice || maxPrice === 0)
  ) {
    return res.status(400).json({ error: "Tags, prices or brand  required!" });
  }
  const products = await services.adminFilterProducts(
    tags,
    brand,
    minPrice,
    maxPrice
  );

  if (products.status !== 200)
    return res.status(products.status).json(products.error);

  res.status(200).json(products);
};

module.exports = {
  addAdmin,
  addProductToStock,
  deleteProducts,
  showAllProducts,
  adminFilterProduct,
};
