// import db from "../models/index.js";

// const facturation = async (products, token) => {
//   try {
//     if (products.length === 0)
//       throw new Error({ status: 401, error: "No products found" });

//     const user = await verifyToken(token);

//     if (!user)
//       throw new Error({ status: 401, error: "you musth be logged in" });

//     const decodeUser = await jwt.verify(token, process.env.JWT_SECRET);
//     const userId = await decodeUser.userId;

//     const total = await products.reduce(
//       (acc, product) => acc + product.price * product.quantity,
//       0
//     );

//     const unitaryPrice = await products.map((product) => {
//       return product.price;
//     });

//     const generatefacturations = async () => {
//       const factureDates = await Promise.all(
//         (facture = {
//           user: await db.User.findOne({
//             atribute: ["full_name", "address"],
//             where: { id: userId },
//           }),
//         })
//       );
//     };
//   } catch (e) {
//     return {
//       status: e.status || 500,
//       error: e.error || "An unexpected error occurred in facturation",
//     };
//   }
// };
