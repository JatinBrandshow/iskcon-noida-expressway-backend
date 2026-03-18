const adminController = require("./admin.controller");
const slugController = require("./slug.controller");
const metaController = require("./meta.controller");
const facultyController = require("./faculty.controller");
const staticPageController = require("./staticPage.controller");
const announcementController = require("./announcement.controller");
const highlightBannerController = require("./highlightBanner.controller");
const componentsController = require('./components.controller')
const extraParamsDataController = require('./extraParamsData.controller')
const editPathController = require('./EditPath.controller');
const newsDetailPageController = require('./newsDetailPage.controller');
const dashboardController = require('./Dashboard.controller');
const uploadfileController = require('./upload.controller');
const widgetController = require('./widget.controller')
const applicationController = require('./application.controller')
const pageDataController =require('./pageData.controller')
const faqController = require("./faq.controller");
const reviewController = require("./review.controller");
const testimonialController = require("./testimonial.controller");
const downloadController = require("./download.controller");
const topperController = require("./topper.controller");
const noticeController = require("./notice.controller");
const permissionController = require("./permission-management.controller");
const adminLogController = require("./adminLog.controller");


module.exports = {
  adminController,
  slugController,
  metaController,
  editPathController,
  facultyController,
  staticPageController,
  announcementController,
  highlightBannerController,
  componentsController,
  extraParamsDataController,
  newsDetailPageController,
  uploadfileController,
  dashboardController,
  widgetController,
  applicationController,
  pageDataController ,
  faqController ,
  reviewController ,
  testimonialController,
  downloadController,
  topperController,
  noticeController,
  permissionController,
  adminLogController
};
