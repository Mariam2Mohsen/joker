const fs = require('fs');
const mysql = require('mysql2/promise');
(async () => {
  try {
    const c = await mysql.createConnection({host:'localhost',user:'root',password:'2vx@3dve',database:'project_petra'});
    const [rows] = await c.query("SELECT ps.id, ps.service_id, s.name AS service_name, ps.description, ps.availability, ps.status, ps.approval_status, psp.pricing_type, psp.price FROM provider_services ps JOIN services s ON ps.service_id = s.service_id LEFT JOIN provider_service_prices psp ON ps.id = psp.provider_service_id WHERE ps.provider_id = 14");
    fs.writeFileSync('db_test_query.json', JSON.stringify(rows, null, 2));
    process.exit(0);
  } catch(e) { console.error(e) }
})();
