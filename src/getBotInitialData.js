"use strict";

const utils = require("../utils");

module.exports = (defaultFuncs, api, ctx) => {
  return async (callback) => {
    const res = await defaultFuncs.get(
      `https://www.facebook.com/profile.php?id=${ctx.userID}`,
      ctx.jar,
      null,
      ctx,
      { customUserAgent: utils.windowsUserAgent }
    );

    const profileMatch = res.body.match(/"CurrentUserInitialData",\[\],\{(.*?)\},(.*?)\]/);
    if (profileMatch && profileMatch[1]) {
      const accountJson = JSON.parse(`{${profileMatch[1]}}`);
      accountJson.name = accountJson.NAME;
      accountJson.uid = accountJson.USER_ID;
      delete accountJson.NAME;
      delete accountJson.USER_ID;
      if (typeof callback === "function") callback(null, { ...accountJson });
      return { ...accountJson };
    } else {
      const error = { error: "❌ Failed to fetch profile data. Try again later." };
      if (typeof callback === "function") callback(null, error);
      return error;
    }
  };
};
