"use strict";

const userstore = require("../models/user-store");
const logger = require("../utils/logger");
const uuid = require("uuid");
const utility = require("../models/utility.js");

const accounts = {
  index(request, response) {
    const viewData = {
      title: "Login or Signup"
    };
    response.render("index", viewData);
  },

  login(request, response) {
    const viewData = {
      title: "Login to the Service"
    };
    response.render("login", viewData);
  },

  logout(request, response) {
    response.cookie("assessments", "");
    response.redirect("/");
  },

  signup(request, response) {
    const viewData = {
      title: "Login to the Service"
    };
    response.render("signup", viewData);
  },

  register(request, response) {
    const user = request.body;
    user.id = uuid.v1();
    user.trainer = "0";
    user.goalWeight = Number(request.body.goalWeight);
    user.previousWeight = Number(request.body.startWeight);
    user.currentWeight = Number(request.body.startWeight);
    user.weightClassGoalReached = true;
    user.bmiCatGoalReached = false;
    user.bmiGoalReached = false;
    user.kilosFromGoalWeight = Number(request.body.startWeight) - Number(request.body.goalWeight);
    user.goalDate = utility.formatGoalDate();
    user.originalGoalDate = utility.setGoalDate();
    user.daysToGoal = 100;
    userstore.addUser(user);
    logger.info(`registering ${user.email}`);
    response.redirect("/");
  },

  authenticate(request, response) {
    userstore.updateGoalOnLogin();
    const user = userstore.getUserByEmail(request.body.email);
    if ((user) && (user.trainer === "1")) {
      response.cookie("assessments", user.email);
      logger.info(`logging in ${user.email}`);
      response.redirect("/trainerdashboard");
    } else if (user) {
      response.cookie("assessments", user.email);
      logger.info(`logging in ${user.email}`);
      response.redirect("/dashboard");
    } else {
      response.redirect("/");
    }
  },

  getCurrentUser(request) {
    const userEmail = request.cookies.assessments;
    return userstore.getUserByEmail(userEmail);
  }
};

module.exports = accounts;
