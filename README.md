# garmin-privacy-change

This project has the goal to automate the change the privacy of the activities in [garmin connect](https://connect.garmin.com/modern/), as the web application does not offer any way to change the privacy of all the existing activities, it is a manual process.
The endpoints and api actions replicates the behavior of the garmin connect web application, so they are a reverse engineering of their web application, so they may change any time.
_NOTE_ *Use at your own risk*

## Requirements

- nodejs
- garmin connect account

## Environment

You have to setup 3 environment values (as you can see on [.env.example](./.env.example)):
- GARMIN_HOST
- GARMIN_COMMON_PATH
- GARMIN_COOKIE. You have to get it once you authenticate on [garmin connect](https://connect.garmin.com/modern/)

## Flow

1. The script will query for the activities, it is setup to query only for _running_ activities, but it can be changed to any other activities, or just remove the parameter to query for all the activities.
2. _TODO_ one by one (we simulate the user intercation of changing the privacy manually, I do not want to send many request to garmin, they may throw some errors or block for many request), change the privacy of the activity.
_NOTE_ Garmin does not return any response on success update, only status 204.