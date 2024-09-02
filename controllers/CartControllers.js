const services = require("../services/CartServices");
const db = require("../models");

const insert = async (req, res) => {
  try {
    // if (req.body.ProductId === null || req.body.quantity === null)
    //   throw new console.error("the body is empty");

    const { productId, quantity } = req.body;

    const item = await services.addItem(productId, quantity);
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const show = async (req, res) => {
  try {
    const list = await services.getCartItems();
    if (list.length === 0) {
      res.status(500).send(`the cart is empty`);
    } else {
      res.status(200).json(list);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  const { productId } = req.params;

  try {
    // Buscar el item en la base de datos
    const item = await db.Cart.findOne({ where: { productId } });

    if (item) {
      // Llamar a la función de eliminación
      await services.removeProduct(productId);
      res.status(200).json(`Product with id ${productId} was deleted.`);
    } else {
      // Enviar una respuesta si el item no se encuentra
      res
        .status(404)
        .json({ error: `Product with id ${productId} does not exist.` });
    }
  } catch (err) {
    // Manejar errores generales
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { insert, show, remove };
