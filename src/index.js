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
  return data;
};

const PRIVACY_SETTINGS = {
  GROUPS: "groups",
  PUBLIC: "public",
  PRIVATE: "private",
};

const PRIVACY_TO_CHANGE = PRIVACY_SETTINGS.PRIVATE;

const changePrivacy = async function (activity) {
  const result = {
    activityId: activity.activityId,
    privacy: activity.privacy.typeKey,
  };

  try {
    if (activity.privacy.typeKey === PRIVACY_TO_CHANGE) {
      result.status = 0;
    } else {
      const { status } = await request({
        method: "PUT",
        path: `/activity-service/activity/${result.activityId}`,
        body: {
          accessControlRuleDTO: { typeKey: PRIVACY_TO_CHANGE },
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

const listActivities = async function (options = {}) {
  const { start = 0, limit = 20 } = options;
  try {
    const { data: responseData } = await request({
      path: "/activitylist-service/activities/search/activities",
      query: {
        activityType: "running",
        limit,
        start,
      },
    });
    const data = responseData.map(processActivity);
    const results = await map(data, changePrivacy, { concurrency: 1 });
    console.log(results);
  } catch (err) {
    console.log(err);
  }
};

const MAX_ACITIVITES = 200;
const LIMIT_ACTIVITIES = 20;
const START = 0;

function init() {
  console.log("START");
  map(
    new Array(Math.ceil(MAX_ACITIVITES / LIMIT_ACTIVITIES)),
    function (_, index) {
      const start = START + index * LIMIT_ACTIVITIES;
      console.log(`Processing next ${LIMIT_ACTIVITIES} from activity ${start}`);
      return listActivities({
        limit: LIMIT_ACTIVITIES,
        start: START + index * LIMIT_ACTIVITIES,
      });
    },
    { concurrency: 1 }
  );
  console.log("DONE");
}

init();
