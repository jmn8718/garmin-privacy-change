const GARMIN_HOST = process.env.GARMIN_HOST || "http://localhost:3000";
const GARMIN_COMMON_PATH = process.env.GARMIN_COMMON_PATH || "/connect";
const GARMIN_COOKIE = process.env.GARMIN_COOKIE || "cookie";

module.exports = {
  GARMIN_HOST,
  GARMIN_COMMON_PATH,
  GARMIN_COOKIE,
};
