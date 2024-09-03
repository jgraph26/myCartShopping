const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
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

module.exports = { register, login };
