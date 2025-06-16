"use strict";

module.exports = function (defaultFuncs, api, ctx) {
  return function markActive(callback) {
    const form = {
      state: "active",
      source: "chat_sidebar"
    };

    defaultFuncs
      .post("https://www.facebook.com/ajax/chat/buddy_list_status.php", ctx.jar, form)
      .then(() => {
        if (callback) callback(null);
      })
      .catch(function (err) {
        if (callback) return callback(err);
      });
  };
};
