const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const path = require("path");
const http = require("http"); //////////////////////////
const { Server } = require("socket.io");/////////////////////////

// Routes
const adminServicesRoutes = require("./src/routes/adminServicesRoutes");
const categoryRoutes = require("./src/routes/categories");
const subCategoryRoutes = require("./src/routes/subcategories");
const userRoutes = require("./src/routes/userRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const serviceRoutes = require("./src/routes/services");
const providerServiceRoutes = require("./src/routes/providerServices");
const publicProviderRoutes = require("./src/routes/publicProviderRoutes");

const app = express();
const server = http.createServer(app); ////////////////////
///////////////////////////////////////
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL, "http://localhost:3000", "http://localhost:3001"], 
    methods: ["GET", "POST"],
    credentials: true
  }
});


app.set("io", io);


io.on("connection", (socket) => {
  console.log(`✅ User Connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log("❌ User Disconnected");
  });
});


/////////////////////////////////



const port = process.env.PORT;

// Middleware
app.use(
  cors({
    origin: [process.env.CLIENT_URL ,'https://petrajuniors.org','http://localhost:3000','http://localhost:3001'],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logger for development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// Static files
app.use("/images", express.static(path.join(__dirname, "src/images")));
app.use("/images/categories", express.static(path.join(__dirname, "src/uploads/categories")));

// API Endpoints
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/services", adminServicesRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/provider/services", providerServiceRoutes);

 app.use("/api/providers", publicProviderRoutes);
// Root Route - API Overview
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Petra API",
    version: "1.0.0",
    api_base_url: "/api",
    documentation: {
      auth: {
        signup: "POST /api/users/user_signup",
        login: "POST /api/users/user_login",
      },
      categories: {
        list: "GET /api/categories",
        details: "GET /api/categories/:id",
        create: "POST /api/categories (Admin)",
        update: "PUT /api/categories/:id (Admin)",
        delete: "DELETE /api/categories/:id (Admin)",
      },
     admin: {
        providers: "GET /api/admin/providers",
        provider_details: "GET /api/admin/providers/:id",
        approve_provider: "PATCH /api/admin/providers/:id/status",
        handleProviderAction: "PATCH /api/admin/provider-action/:id",
        service_requests: "GET /api/admin/services/requests/pending",
        approve_service: "POST /api/admin/services/requests/:id/approve",
      },
      provider: {
        my_services: "GET /api/provider/services",
        add_service: "POST /api/provider/services",
      }
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

server.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📡 Socket.io & API are both live!`);
});

module.exports = app;
