const adminRouter = require("./admin.router");
const slugRouter = require("./slug.router");
const metaRouter = require("./meta.router");
const facultyRouter = require("./faculty.router");
const staticPageRouter = require("./staticPage.router");
const announcementRouter = require("./announcements.router");
const highlightBannerRouter = require("./highlight-banner.router");
const componentRouter = require('./components.router')
const extraParamsDataRouter = require('./extraParamsData.router')
const editPathRouter = require("./EditPath.router");
const newsDetailPageRouter = require("./newsDetailPage.router");
const uploadRouter = require("./upload.router");
const dashboardRouter = require("./Dashboard.router");
const widgetRouter = require('./widget.router')
const applicationRouter = require('./application.router')
const pageDataRouter=require('./pageData.router')
const faqRouter = require("./faq.router");
const reviewRouter = require("./review.router");
const testimonialRouter = require("./testimonial.router");
const downloadRouter = require("./download.router");
const topperRouter = require("./topper.router");
const noticeRouter = require("./notice.router");
const permissionRouter = require('./permission.router')
const adminLogRouter = require('./adminLog.router');
module.exports = {
  adminRouter,
  slugRouter,
  metaRouter,
  editPathRouter,
  facultyRouter,
  staticPageRouter,
  announcementRouter,
  highlightBannerRouter,
  componentRouter,
  extraParamsDataRouter,
  newsDetailPageRouter,
  uploadRouter,
  dashboardRouter,
  widgetRouter,
  applicationRouter,
  pageDataRouter ,
  faqRouter ,
  reviewRouter,
  testimonialRouter,
  downloadRouter,
  topperRouter,
  noticeRouter,
  permissionRouter,
  adminLogRouter
};
