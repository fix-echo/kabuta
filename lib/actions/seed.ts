"use server";

import { unicorns } from "@/lib/db/schemas/unicorns";
import { db } from "@/lib/db";
import fs from "fs";
import csv from "csv-parser";
import path from "path";

function parseDate(dateString: string): Date {
  const parts = dateString.split("/");
  if (parts.length === 3) {
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // JavaScript months are 0-based
    const year = parseInt(parts[2]);
    return new Date(year, month, day);
  }
  console.warn(`Could not parse date: ${dateString}`);
  throw new Error(`Could not parse date: ${dateString}`);
}

export async function seed() {
  const results: any[] = [];
  const csvFilePath = path.join(process.cwd(), "unicorns.csv");

  console.log("📖 Reading CSV file...");
  await new Promise((resolve, reject) => {
    let rowCount = 0;
    fs.createReadStream(csvFilePath)
      .pipe(
        csv({
          skipLines: 2,
          headers: [
            "empty",
            "company",
            "valuation",
            "dateJoined",
            "country",
            "city",
            "industry",
            "selectInvestors",
          ],
        })
      )
      .on("data", (data) => {
        if (data.company && data.company !== "Company") {
          const cleanValuation = data.valuation.replace(/[$,\s]/g, "");
          data.valuation = cleanValuation;
          results.push(data);
          rowCount++;
          if (rowCount % 10 === 0) {
            console.log(`📊 Processed ${rowCount} records...`);
          }
        }
      })
      .on("end", () => {
        console.log(
          `✅ Finished reading CSV. Found ${results.length} unicorn companies.`
        );
        resolve(void 0);
      })
      .on("error", reject);
  });

  console.log("💾 Starting database import...");
  let successCount = 0;
  let errorCount = 0;

  for (const row of results) {
    try {
      const formattedDate = parseDate(row.dateJoined);

      await db
        .insert(unicorns)
        .values({
          company: row.company,
          valuation: row.valuation,
          dateJoined: formattedDate,
          country: row.country,
          city: row.city || null,
          industry: row.industry,
          selectInvestors: row.selectInvestors,
        })
        .onConflictDoNothing();

      successCount++;
      if (successCount % 10 === 0) {
        console.log(
          `✨ Imported ${successCount}/${results.length} companies...`
        );
      }
    } catch (error) {
      errorCount++;
      console.error(`❌ Error importing ${row.company}:`, error);
    }
  }

  console.log("\n📊 Import Summary:");
  console.log(`✅ Successfully imported: ${successCount} companies`);
  console.log(`❌ Failed to import: ${errorCount} companies`);

  return {
    unicorns: results,
    success: successCount,
    errors: errorCount,
  };
}

seed().catch(console.error);
