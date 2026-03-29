const db = require("./src/config/db");

async function checkTables() {
  try {
    const [catTable] = await db.query("SHOW CREATE TABLE categories");
    const [subCatTable] = await db.query("SHOW CREATE TABLE sub_categories");
    console.log("Categories:\n", catTable[0]['Create Table']);
    console.log("\nSubCategories:\n", subCatTable[0]['Create Table']);
  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
}

checkTables();
