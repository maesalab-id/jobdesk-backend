const users = require('./users/users.service.js');
const departments = require('./departments/departments.service.js');
const configs = require('./configs/configs.service.js');
const desks = require('./desks/desks.service.js');
const jobs = require('./jobs/jobs.service.js');
const schedules = require('./schedules/schedules.service.js');
const userList = require('./user-list/user-list.service.js');
const references = require('./references/references.service.js');
const recaps = require('./recaps/recaps.service.js');
const reports = require('./reports/reports.service.js');
const spots = require('./spots/spots.service.js');
const orders = require('./orders/orders.service.js');
const subordinates = require('./subordinates/subordinates.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(departments);
  app.configure(configs);
  app.configure(desks);
  app.configure(jobs);
  app.configure(schedules);
  app.configure(userList);
  app.configure(references);
  app.configure(recaps);
  app.configure(reports);
  app.configure(spots);
  app.configure(orders);
  app.configure(subordinates);
};
