import { connectToDatabase, closeDatabaseConnection } from "./connection.js";

const getPopulationByCountry = async (age, year, Country) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("student");

    const pipeline = [
      {
        $match: {
          Age: age,
          Year: year,
          Country: { $in: Country },
        },
      },
      {
        $addFields: {
          M: { $toDouble: "$M" },
          F: { $toDouble: "$F" },
        },
      },
      {
        $addFields: {
          TotalPopulation: { $add: ["$M", "$F"] },
        },
      },
      {
        $sort: { Country: 1 },
      },
      {
        $group: {
          _id: "$Country",
          document: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$document" },
      },
    ];

    const result = await collection.aggregate(pipeline).toArray();
    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  } finally {
    await closeDatabaseConnection();
    console.log("Connection closed");
  }
};

async function main() {
  const year = "2020";
  const age = "100+";
  const Country = [
    "AFRICA",
    "LATIN AMERICA AND THE CARIBBEAN",
    "ASIA",
    "EUROPE",
    "NORTHERN AMERICA",
    "OCEANIA",
  ];

  const populationData = await getPopulationByCountry(age, year, Country);
  console.log(populationData);
}

await main();
