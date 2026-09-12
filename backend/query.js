const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres:Imal2023Imasha@localhost:5472/grama_niladhari_db?schema=public',
});

async function main() {
  await client.connect();
  console.log("Starting deletion of residents...");

  // Start transaction
  await client.query('BEGIN');

  try {
    // 1. Delete Users with role RESIDENT
    const resUsers = await client.query(`DELETE FROM "User" WHERE role = 'RESIDENT' RETURNING "residentId"`);
    console.log(`Deleted ${resUsers.rowCount} Users.`);

    // 2. Delete Requests related to Residents (if any)
    await client.query(`DELETE FROM "Request"`);

    // 3. Delete ResidentCategories
    await client.query(`DELETE FROM "ResidentCategory"`);
    
    // 4. Delete Residents
    const resResidents = await client.query(`DELETE FROM "Resident" RETURNING "householdId"`);
    console.log(`Deleted ${resResidents.rowCount} Residents.`);

    // 5. Delete Households (if not referenced anywhere else)
    const resHouseholds = await client.query(`DELETE FROM "Household"`);
    console.log(`Deleted ${resHouseholds.rowCount} Households.`);

    await client.query('COMMIT');
    console.log("Successfully deleted all resident data.");
  } catch (err) {
    await client.query('ROLLBACK');
    console.error("Error during deletion:", err);
  }

  await client.end();
}
main().catch(console.error);
