import db from "../models/index.js";

const getCartItems = async () => {
  try {

    const list = await db.Cart.findAll({
      include: {
        model: db.Product,
        as: 'product',
        attributes: [
          "name",
          "price",
          "condition",
          "size",
          "color",
          "brand",
          "quantity",
        ],
      },
    });

    return {
      status: 200,
      productQuantity: `Total products in cart: ${list.length}`, // Cambiado a 'message'
      list: list.map(item => ({
        quantity: item.quantity,
        product: {
          name: item.product.name,
          price: item.product.price,
          condition: item.product.condition,
          size: item.product.size,
          color: item.product.color,
          brand: item.product.brand,
          quantity: item.product.quantity
        }
      })),
    };

  } catch (error) {
    return { status: 500, error: error.message };
  }
};

const addItem = async (productId, quantity) => {
  if (!db.Cart) throw new console.error("data base don't exist");

  const item = await db.Cart.findOne({ where: { productId } });

  if (item) {
    item.quantity += quantity;
    return item.save();
  }

  return db.Cart.create({ productId, quantity });
};

const removeProduct = async (productId) => {
  await db.Cart.destroy({
    where: { productId },
  });
};

const methods = { getCartItems, addItem, removeProduct };


export default methods;