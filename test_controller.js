const controller = require('./src/controller/providerServiceController.js');

const req = { user: { id: 14 } };
const res = {
  json: (data) => console.log('RESPONSE:', JSON.stringify(data, null, 2)),
  status: (code) => ({ json: (data) => console.log('STATUS', code, 'RESPONSE:', data) })
};

controller.getMyServices(req, res).then(() => {
  console.log('Done');
  process.exit(0);
}).catch(console.error);
