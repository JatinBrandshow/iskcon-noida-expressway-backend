const {
  adminRouter,
  slugRouter,
  metaRouter,
  facultyRouter,
  staticPageRouter,
  announcementRouter,
  highlightBannerRouter,
  componentRouter,
  extraParamsDataRouter,
  editPathRouter,
  newsDetailPageRouter,
  uploadRouter,
  dashboardRouter,
  widgetRouter,
  applicationRouter,
  pageDataRouter,
  faqRouter,
  reviewRouter,
  testimonialRouter,
  downloadRouter,
  topperRouter,
  noticeRouter,
  permissionRouter,
  adminLogRouter,
  calendarRouter

} = require("./routes");
const { userAuth } = require("./middlewares/auth");
const express = require("express");
const connectDB = require("./db");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");
const app = express();
app.set('trust proxy', 1);

const PORT = process.env.PORT || 5000;
// Import Routers

// Connect to the database
connectDB();

const allowedOrigins = [
  "http://localhost:3000",
  // "https://new-akg.vercel.app",
  // "https://vs4l9npm-3000.inc1.devtunnels.ms",
  "https://iskcon-noida-expressway-frontend.vercel.app"
];

// Custom function to allow subdomains of onrender.com
function isAllowedOrigin(origin) {
  try {
    const url = new URL(origin);
    return (
      allowedOrigins.includes(origin) ||
      url.hostname.endsWith(".onrender.com")
    );
  } catch (e) {
    return false;
  }
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json()); // To parse JSON request bodies
app.use(cookieParser());


app.get('/health-check', (req, res) => {
  res.status(200).send("Everything Is Fine " + Date.now())
})

// Admin Router
app.use("/api/admin", adminRouter);
// Admin Router
app.use('/api/permission', permissionRouter);
// Admin Router
app.use("/api/admin-log", adminLogRouter);

// meta Router
app.use("/api/slug", slugRouter);

// meta Router
app.use("/api/meta", userAuth, metaRouter);

// faculty Router
app.use("/api/faculty", userAuth, facultyRouter);

// static-page page
app.use("/api/static-page", userAuth, staticPageRouter);

// static-page page
app.use("/api/announcement", userAuth, announcementRouter);

// static-page page
app.use("/api/highlight-banner", highlightBannerRouter);

// static-page page
app.use("/api/components", userAuth, componentRouter);

// static-page page
app.use("/api/extra-component-data", userAuth, extraParamsDataRouter);
// Edit Path Router
app.use("/api/edit-path", userAuth, editPathRouter);
// Edit Path Router
app.use("/api/upload", userAuth, uploadRouter);

// News Detail Page Router
app.use("/api/list-detail-page", userAuth, newsDetailPageRouter);

// dashboard api router 
app.use("/api/dashboardData", userAuth, dashboardRouter)

// dashboard api router 
app.use("/api/widget", widgetRouter)

// Application Router
app.use("/api/applications", applicationRouter);

app.use("/api/page-params", pageDataRouter);

// FAQ Router
app.use("/api/faq", faqRouter);

// Review Router
app.use("/api/review", reviewRouter);

// Testimonial Router

app.use("/api/testimonial", testimonialRouter);

app.use("/api/downloads", downloadRouter)

app.use("/api/toppers", topperRouter)

app.use("/api/notices", noticeRouter)

// Guest Calendar Router
app.use("/api/guest/calendar", calendarRouter);

// Start the server
app.listen(PORT || 3000, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
