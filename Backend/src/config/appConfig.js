const appConfig = {
  autoApproveDoctors: process.env.AUTO_APPROVE_DOCTORS !== "false",
};

module.exports = appConfig;
