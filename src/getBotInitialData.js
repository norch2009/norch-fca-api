"use strict";

const utils = require("../utils");

module.exports = (defaultFuncs, api, ctx) => {
  return async (callback) => {
    let resolveFunc = () => {};
    let rejectFunc = () => {};
    const returnPromise = new Promise((resolve, reject) => {
      resolveFunc = resolve;
      rejectFunc = reject;
    });

    if (!callback) {
      callback = (err, data) => {
        if (err) return rejectFunc(err);
        resolveFunc(data);
      };
    }

    utils.log("Fetching account info...");

    defaultFuncs.get(
      `https://www.facebook.com/profile.php?id=${ctx.userID}`,
      ctx.jar,
      null,
      ctx,
      { customUserAgent: utils.windowsUserAgent }
    ).then((res) => {
      const profileMatch = res.body.match(/"CurrentUserInitialData",\[\],\{(.*?)\},(.*?)\]/);
      if (profileMatch && profileMatch[1]) {
        const accountJson = JSON.parse(`{${profileMatch[1]}}`);
        accountJson.name = accountJson.NAME;
        accountJson.uid = accountJson.USER_ID;
        delete accountJson.NAME;
        delete accountJson.USER_ID;
        return callback(null, { ...accountJson });
      } else {
        return callback(null, {
          error: "⚠️ Something went wrong. Try again later or check your cookies."
        });
      }
    }).catch((err) => callback(err));

    return returnPromise;
  };
};
