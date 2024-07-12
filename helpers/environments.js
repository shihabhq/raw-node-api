//module scaffolding

const environments = {};

environments.staging = {
  port: 3000,
  envName: "staging",
  secretKey: "kalsdkjflaksjdf",
  maxChecks: 5,
  twilio: {
    fromPhone: "+12513697195",
    accountSid: "AC0a19d0a3267c2725b53aeeae336d27d7",
    authtToken: "5e5233524118c1e5280a332e769c9d5c",
  },
};

environments.production = {
  port: 5000,
  envName: "production",
  secretKey: "asldfjlakjsdflkja",
  maxChecks: 5,
  twilio: {
    fromPhone: "+12513697195",
    accountSid: "AC0a19d0a3267c2725b53aeeae336d27d7",
    authToken: "5e5233524118c1e5280a332e769c9d5c",
  },
};

// determine which environment was passed
const currentEnv =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

const environmentToExport =
  typeof environments[currentEnv] === "object"
    ? environments[currentEnv]
    : environments.staging;

// export module
module.exports = environmentToExport;
