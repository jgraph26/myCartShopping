const db = require("../models");
const services = require("../services/productService");

const addProductToStock = async (req, res) => {
  try {
    const { name, price, brand, condition, quantity, sku } = req.body;
    console.log(name, price, brand, condition, quantity, sku);

    const product = await services.addProduct(
      name,
      price,
      brand,
      condition,
      quantity,
      sku
    );

    if (product.status !== 200) {
      res.status(500).json(services.addProduct.status);
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json("error", error.message);
  }
};

module.exports = { addProductToStock };
