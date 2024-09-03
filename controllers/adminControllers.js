const services = require("../services/adminService");

const addAdmin = async (req, res) => {
  try {
    const { email, user_name } = req.body;
    let admin = await services.addAdminService(email, user_name);
    if (admin.status !== 200) {
      return res.status(result.status).json({ error: result.error });
    }

    res.status(200).json("Admin added sussesfull!");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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

const deleteProducts = async (req, res) => {
  try {
    const { sku, quantity } = req.body;
    const item = await services.deleteProduct(sku, quantity);
    if (item.status !== 200) {
      return res.status(500).json({ error: message.error });
    }
    const productBefore = item.quantity;
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { addAdmin, addProductToStock, deleteProducts };
