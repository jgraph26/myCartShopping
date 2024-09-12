import services from "../services/CartServices.js"
import db from "../models/index.js"

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
    console.log(list.list);

    // Verificar si list es un array
    if (!Array.isArray(list.list)) {
      console.log("Result.list is not an array:", list.list); // Imprimir para depuración
      return res
        .status(500)
        .json({ error: "The response list is not an array" });
    }

    if (list.length === 0) {
      res.status(500).send(`the cart is empty`);
    }
    if (list.status !== 200) {
      res.status(list.status).json(list.error);
    }

    const response = {
      productQuantity: list.productQuantity,
      itemslist: list.list,
    };

    res.status(200).json(response);
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

const methods = { insert, show, remove };

export default methods;