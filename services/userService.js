import db from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Op } from "sequelize";
dotenv.config();
// constantes de patrones para validaciones
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const EMAIL_PATTERN = /^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;

const register = async (email, user_name, full_name, password) => {
  /// verifica si el email ya existe
  const existingUser = await db.User.findOne({ where: { email } });
  if (existingUser) throw new Error("Email already is in use");

  // verifica si el nombre de usuario ya existe
  const existingUserName = await db.User.findOne({ where: { user_name } });
  if (existingUserName) throw new Error("User name already is in use");

  //verifica si la contraseña cumple con los requisitos
  if (!PASSWORD_PATTERN.test(password)) {
    throw new Error(`Password must contend at least 8 characters long,
         and contain at least one uppercase letter, one lowercase letter, and one number`);
  }
  if (!EMAIL_PATTERN.test(email)) {
    throw new Error(`THE EMAIL IS'N A VALID EMAIL FORMAT`);
  }

  if (!db.User) throw new console.error("is not a valid user");
  if (!email) throw new console.error("is not a valid email");
  if (!user_name) throw new console.error("is not a valid user name");
  if (!password) throw new console.error("is not a valid password");

  // Cifra la contraseña antes de guardarla en la base de datos
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await db.User.create({
    email,
    user_name,
    full_name,
    password: hashedPassword,
    role: "client",
  });
};

const login = async (email, user_name, password) => {
  try {
    const nameLogin = email || user_name;

    if (!nameLogin) {
      return { status: 400, error: "Username or email is required" };
    }

    const user = await db.User.findOne({
      where: {
        [db.Sequelize.Op.or]: [{ user_name: nameLogin }, { email: nameLogin }],
      },
    });

    if (!user) {
      return { status: 404, error: "Username or email is incorrect" };
    }

    // Compara la contraseña ingresada con la contraseña cifrada en la base de datos
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { status: 401, error: "Password is incorrect" };
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { status: 200, success: true, token, user };
  } catch (error) {
    return { status: 500, error: "An error occurred while trying to login" };
  }
};

const changuePassword = async (
  token,
  actualPassword,
  newPassword,
  repeatPassword
) => {
  if (!token) {
    return { status: 404, error: " token is required" };
  }
  if (!actualPassword) {
    return { status: 401, error: "actual password required" };
  }
  if (!newPassword) {
    return { status: 401, error: "new password required" };
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.userId;
  const user = await db.User.findByPk(userId);
  if (!user) {
    return { status: 404, error: "user whit this token don't exist" };
  }

  const isPasswordValid = bcrypt.compareSync(actualPassword, user.password);

  if (!isPasswordValid) {
    return { status: 401, error: "actual password is incorrect" };
  }

  if (!PASSWORD_PATTERN.test(newPassword)) {
    return {
      status: 401,
      error:
        "new password must contain at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, and one number",
    };
  }
  const isMatch = bcrypt.compareSync(newPassword, user.password);
  const match = newPassword !== repeatPassword;

  if (match === true) {
    return { status: 401, error: "the passwords new are differents " };
  }

  if (isMatch === true) {
    return {
      status: 401,
      error: "new password must be different from actual password",
    };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await db.User.update({ password: hashedPassword }, { where: { id: userId } });

  return { status: 200, success: true, data: "Password changed successfully" };
};
const changueUserName = async (token, password, newUserName) => {
  if (!token) {
    return { status: 404, error: " token is required" };
  }
  if (!password) {
    return { status: 401, error: "actual password required" };
  }
  if (!newUserName) {
    return { status: 401, error: "new password required" };
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.userId;
  const user = await db.User.findByPk(userId);
  if (!user) {
    return { status: 404, error: "user whit this token don't exist" };
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);

  if (!isPasswordValid) {
    return { status: 401, error: "actual password is incorrect" };
  }
  if (user.user_name === newUserName) {
    return {
      status: 500,
      error: `the new username cannot be the same as the current one`,
    };
  }

  const usernameNew = await db.User.findOne({
    where: { user_name: newUserName },
  });
  console.log(usernameNew);

  if (usernameNew) {
    return { status: 500, error: `the new username already exists` };
  }

  await db.User.update({ user_name: newUserName }, { where: { id: userId } });

  return { status: 200, success: true, data: "username changed successfully" };
};

const clientFilterProducts = async (tags, brand, minPrice, maxPrice) => {
  // filter by category
  if (tags) {
    try {
      if (!db.Tag)
        return { status: 404, error: "Model Tag not found in the database" };

      const tagInstances = await db.Tag.findAll({ where: { name: tags } });

      if (!tagInstances.length) {
        return { status: 404, error: "No tags found" };
      }

      const tagIds = tagInstances.map((tag) => tag.id);

      const products = await db.Product.findAll({
        attributes: [
          "name",
          "price",
          "condition",
          "size",
          "color",
          "brand",
          "quantity",
        ],

        include: [
          {
            model: db.Tag,
            where: { id: tagIds },
            through: { attributes: [] },
          },
        ],
      });

      return { status: 200, products };
    } catch (error) {
      return {
        status: 500,
        error: `Error when filtering products: ${error.message}`,
      };
    }
  }

  //filter by brand
  if (brand) {
    try {
      if (!db.Product)
        return {
          status: 404,
          error: "Model Product not found in the database",
        };

      const products = await db.Product.findAll({
        attributes: [
          "name",
          "price",
          "condition",
          "size",
          "color",
          "brand",
          "quantity",
        ],
        where: { brand: brand },
      });

      if (products.length === 0) {
        return { status: 404, error: "No products found" };
      }

      return { status: 200, data: products };

      // return { status: 200,data: `llego el brand ${brand}`}
    } catch (error) {
      return { status: 500, error: error.message };
    }
  }

  // filter by prices
  if (minPrice && maxPrice) {
    try {
      if (!db.Product)
        return {
          status: 404,
          error: "Model Product not found in the database",
        };

      const products = await db.Product.findAll({
        attributes: [
          "name",
          "price",
          "condition",
          "size",
          "color",
          "brand",
          "quantity",
        ],
        where: { price: { [Op.between]: [minPrice, maxPrice] } },
      });

      if (products.length === 0) {
        return { status: 404, error: "Product not found" };
      }

      return {
        status: 200,
        data: `products found: ${products.length}`,
        products,
      };
    } catch (error) {
      return { status: 500, error: error.message };
    }
  }
};

const methods = {
  register,
  login,
  changuePassword,
  clientFilterProducts,
  changueUserName,
};

export default methods;
