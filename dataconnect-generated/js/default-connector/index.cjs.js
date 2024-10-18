const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'campus-mobility-app',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

