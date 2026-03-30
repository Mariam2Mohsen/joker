const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const path = require("path");
const adminServicesRoutes = require("./src/routes/adminServicesRoutes");

const categoryRoutes = require("./src/routes/categories");
const subCategoryRoutes = require("./src/routes/subcategories");
const userRoutes = require("./src/routes/userRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const serviceRoutes = require("./src/routes/services");
const providerServiceRoutes = require("./src/routes/providerServices");

const db = require("./src/config/db");

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: [process.env.CLIENT_URL ,'https://petrajuniors.org'],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "X-Requested-With",
    ],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//app.use("/images", express.static(path.join(__dirname, "src/images")));

app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/services", adminServicesRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/provider/services", providerServiceRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Petra API",
    version: "1.0.0",
    endpoints: {
      signup: "POST /user_signup",
      login: "POST /user_login",
      getUsers: "GET /get_users",
      updateUser: "PUT /user_update/:id",
      deleteUser: "DELETE /user_delete/:id",

      categories: "GET /categories",
      createCategory: "POST /categories",
      updateCategory: "PUT /categories/:id",
      deleteCategory: "DELETE /categories/:id",

      subCategories: "GET /subcategories",
      createSubCategory: "POST /subcategories",

      pendingProviders: "GET /admin/pending-providers",
      approveProvider: "PUT /admin/approve-provider/:id",
      rejectProvider: "PUT /admin/reject-provider/:id",
    },
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📡 API Base URL: http://localhost:${port}/api`);
});

module.exports = app;
