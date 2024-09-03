const db = require("../models");
const SKU_PATTERN = /^[A-Z]{3}\d{3}-[A-Z]{2}-[A-Z]$/;

const addProduct = async (name, price, brand, condition, quantity, sku) => {
  try {
    console.log(sku);

    if (!SKU_PATTERN.test(sku)) {
      console.log(`invalid SKU format: ${sku} `);

      return { status: 400 };
    }
    // if (!db.Product) return { status: 500, error: "Product don't exist" };

    console.log(`serch sku: ${sku}`);
    const item = await db.Product.findOne({ where: { sku } });
    console.log(`creating new`);
    if (item) {
      const quantityBefore = await item.quantity;
      const quantityAfter = (await quantityBefore) + quantity;
      item.quantity = quantityAfter;
      await item.save();
      return {
        status: 200,
        data: `item  update: quantity inserted ${quantity}, in stock before Update:${quantityBefore}, in stock now:${quantityAfter}`,
      };
    }

    const result = await db.Product.create({
      name,
      price,
      quantity,
      brand,
      condition,
      sku,
    });

    return { status: 200, data: result };
  } catch (error) {
    console.log(`error del caths`);

    return { status: 500, error: error.message };
  }
};

const addAdminService = async (email, user_name) => {
  const nameLogin = email || user_name;

  const user = await db.User.findOne({
    where: {
      [db.Sequelize.Op.or]: [{ user_name: nameLogin }, { email: nameLogin }],
    },
  });

  if (!user) {
    return { status: 500, message: "The user  don't exist" };
  }

  await db.User.update(
    { role: "admin" }, // Columna y valor a modificar
    {
      where: {
        [db.Sequelize.Op.or]: [{ user_name: nameLogin }, { email: nameLogin }],
      },
    }
  );

  return { status: 200, message: "The user  is a new admin" };
};

const deleteProduct = async (sku, quantity) => {
  try {
    if (!db.Product) return { status: 404, error: error.message };

    const item = await db.Product.findOne({ where: { sku } });
    console.log(`hollsss`);
    if (!item) return { status: 404, error: error.message };

    if (item) {
      const quantityBefore = item.quantity;
      const quantityAfter = item.quantity - quantity;
      item.quantity = quantityAfter
      item.save();
      return {
        status: 200,
        data: `item  update: quantity deleted ${quantity}, in stock before Update:${quantityBefore}, in stock now:${quantityAfter}`,
      };
      console.log(`existe`);
    }

    return {
      status: 200,
      // date: `was deleted ${quantityBefore} product in sku ${sku}`,
    };
  } catch (error) {
    console.log(`catch`);

    return { status: 404, error: error.message };
  }
};


module.exports = { addAdminService, addProduct, deleteProduct };
