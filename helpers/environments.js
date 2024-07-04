//module scaffolding

const environments = {};

environments.staging = {
  port: 3000,
  envName: "staging",
  secretKey:'kalsdkjflaksjdf'
};

environments.production = {
  port: 5000,
  envName: "production",
  secretKey:'asldfjlakjsdflkja'
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
