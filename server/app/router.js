'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/user-status', controller.home.index)
  router.get('*', controller.home.index);
};
