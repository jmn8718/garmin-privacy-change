require("dotenv").config();

const { map } = require("bluebird");
const { request } = require("./request");

const processActivity = function (rawActivity = {}) {
  const data = {
    activityId: rawActivity.activityId,
    activityName: rawActivity.activityName,
    description: rawActivity.description,
    startTimeGMT: rawActivity.startTimeGMT,
    startTimeLocal: rawActivity.startTimeLocal,
    distance: rawActivity.distance,
    duration: rawActivity.duration,
    averageSpeed: rawActivity.averageSpeed,
    maxSpeed: rawActivity.maxSpeed,
    ownerId: rawActivity.ownerId,
    ownerFullName: rawActivity.ownerFullName,
    ownerProfileImageUrlMedium: rawActivity.ownerProfileImageUrlMedium,
    steps: rawActivity.steps,
    activityType: rawActivity.activityType,
    eventType: rawActivity.eventType,
    privacy: rawActivity.privacy,
  };
  // console.log(data);
  return data;
};

const PRIVACY_SETTINGS = {
  GROUPS: "groups",
  PUBLIC: "public",
  PRIVATE: "private",
};

const PRIVACY_TO_CHANGE = PRIVACY_SETTINGS.PUBLIC;

const changePrivacy = async function (activity) {
  const result = {
    activityId: activity.activityId,
  };

  try {
    if (activity.privacy.typeKey === PRIVACY_TO_CHANGE) {
      result.status = 0;
    } else {
      const { status } = await request({
        path: "/activitylist-service/activities/search/activities",
        query: {
          activityType: "running",
          limit: 10,
          start: 0,
        },
        body: {
          accessControlRuleDTO: { typeKey: PRIVACY_SETTINGS.PUBLIC },
          activityId: activity.activityId,
        },
      });
      result.status = status;
    }
  } catch (err) {
    console.log(err);
    result.error = err.message;
    result.status = 1;
  }
  return result;
};

const listActivities = async function () {
  try {
    const { data: responseData } = await request({
      path: "/activitylist-service/activities/search/activities",
      query: {
        activityType: "running",
        limit: 10,
        start: 0,
      },
    });
    const data = responseData.map(processActivity);
    const results = await map(data, changePrivacy, { concurrency: 1 });
    console.log(results);
  } catch (err) {
    console.log(err);
  }
};

listActivities();
