// services/csvService.js
const fs = require("fs");
const csv = require("csv-parser");
const Esop = require("../models/Esop");
const { ValidationError, DatabaseError } = require("../utils/errors");
const { validateCsvData } = require("../middleware/validation");
const { csvRowSchema } = require("../validators/esopValidators");

function parseDate(dateString) {
  if (!dateString) {
    console.log('Warning: Empty date string provided');
    return null;
  }

  console.log(`Parsing date string: ${dateString}`);

  // Try standard ISO formats first
  let date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    console.log(`  Successfully parsed as ISO date: ${date.toISOString()}`);
    return date;
  }

  // Handle MM/DD/YYYY
  const partsSlash = dateString.split('/');
  if (partsSlash.length === 3) {
    date = new Date(partsSlash[2], partsSlash[0] - 1, partsSlash[1]);
    if (!isNaN(date.getTime())) {
      console.log(`  Successfully parsed as MM/DD/YYYY: ${date.toISOString()}`);
      return date;
    }
  }

  // Handle DD-MM-YYYY
  const partsDash = dateString.split('-');
  if (partsDash.length === 3) {
    date = new Date(partsDash[2], partsDash[1] - 1, partsDash[0]);
    if (!isNaN(date.getTime())) {
      console.log(`  Successfully parsed as DD-MM-YYYY: ${date.toISOString()}`);
      return date;
    }
  }

  console.log(`  Failed to parse date string: ${dateString}`);
  return null; // Return null if all parsing fails
}

async function parseAndSaveEsopCSV(filePath, userId) {
  return new Promise((resolve, reject) => {
    console.log(`Starting to parse CSV file: ${filePath} for user: ${userId}`);
    const results = [];
    let rowCount = 0;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        rowCount++;
        console.log(`Processing row ${rowCount}:`, JSON.stringify(data).substring(0, 100) + '...');
        
        // Better parsing with fallbacks and logging
        const totalGrants = parseInt(data.totalGrants || data.total_grants || data.grants || 0, 10);
        const vested = parseInt(data.vested || 0, 10);
        const unvested = parseInt(data.unvested || 0, 10);
        const exercised = parseInt(data.exercised || 0, 10);
        const exercisePrice = parseFloat(data.exercisePrice || data.exercise_price || data.price || 0);

        const processedRow = {
          userId,
          grantDate: parseDate(data.grantDate || data.grant_date || data['Grant Date']),
          exercisePrice: exercisePrice,
          vestingSchedule: data.vestingSchedule || data.vesting_schedule || data['Vesting Schedule'] || "Standard",
          expirationDate: parseDate(data.expirationDate || data.expiration_date || data['Expiration Date']),
          totalGrants: totalGrants,
          vested: vested,
          unvested: unvested,
          exercised: exercised,
          ticker: (data.ticker || data.symbol || "N/A").toUpperCase(),
          type: data.type || data.option_type || "ISO",
          quantity: totalGrants,
          price: exercisePrice,
          exerciseDate: parseDate(data.exerciseDate || data.exercise_date || data['Exercise Date']),
          status: exercised > 0 ? "Exercised" : "Not exercised",
          notes: data.notes || data.comments || ""
        };
        
        console.log(`Processed row ${rowCount}:`, 
          `ticker=${processedRow.ticker}, ` + 
          `grants=${processedRow.totalGrants}, ` + 
          `vested=${processedRow.vested}, ` + 
          `unvested=${processedRow.unvested}, ` + 
          `type=${processedRow.type}`);
          
        results.push(processedRow);
      })
      .on("end", async () => {
        try {
          console.log(`CSV parsing complete. Parsed ${results.length} records`);
          
          // Before deletion, verify what will be deleted
          const existingRecords = await Esop.find({ userId }).countDocuments();
          console.log(`Found ${existingRecords} existing records for deletion`);
          
          // Delete existing records with explicit confirmation
          console.log(`Deleting existing records for user ${userId}...`);
          const deleteResult = await Esop.deleteMany({ userId });
          console.log(`Deleted ${deleteResult.deletedCount} old records for user ${userId}`);
          
          // Insert new records with explicit confirmation
          console.log(`Inserting ${results.length} new records...`);
          const savedResults = await Esop.insertMany(results);
          console.log(`Successfully inserted ${savedResults.length} new records`);
          
          if (savedResults.length > 0) {
            console.log('First saved record:', JSON.stringify(savedResults[0]).substring(0, 200) + '...');
          }
          
          resolve({ data: savedResults, validationPassed: true });
        } catch (err) {
          console.error('Database save error:', err);
          reject(new DatabaseError(`Failed to save ESOP data: ${err.message}`));
        }
      })
      .on("error", (err) => {
        console.error('CSV parsing error:', err);
        reject(err);
      });
  });
}

module.exports = {
  parseAndSaveEsopCSV,
};
