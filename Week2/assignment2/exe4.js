import { connection } from "./connection.js";

const executeQueries = async () => {
  try {
    console.log("Executing queries...");

    const queryResearchPapersAuthorsCount = `
      SELECT r.paper_title, COUNT(ap.author_id) AS author_count
      FROM research_papers r
      LEFT JOIN author_papers ap ON r.paper_id = ap.paper_id
      GROUP BY r.paper_title;
    `;

    const [researchPapersAuthorsCount] = await connection.execute(
      queryResearchPapersAuthorsCount
    );
    console.log(
      "Research Papers and the number of authors that wrote that paper:"
    );
    console.table(researchPapersAuthorsCount);

    const queryFemaleAuthorsResearchCount = `
      SELECT SUM(CASE WHEN a.gender = 'Female' THEN 1 ELSE 0 END) AS female_authors_paper_count
      FROM authors a
      LEFT JOIN author_papers ap ON a.author_id = ap.author_id;
    `;

    const [femaleAuthorsResearchCount] = await connection.execute(
      queryFemaleAuthorsResearchCount
    );
    console.log("Sum of the research papers published by all female authors:");
    console.table(femaleAuthorsResearchCount);

    const queryAvgHIndexPerUniversity = `
      SELECT a.university, AVG(a.h_index) AS avg_h_index
      FROM authors a
      GROUP BY a.university;
    `;

    const [avgHIndexPerUniversity] = await connection.execute(
      queryAvgHIndexPerUniversity
    );
    console.log("Average of the h-index of all authors per university:");
    console.table(avgHIndexPerUniversity);

    const queryResearchCountPerUniversity = `
      SELECT a.university, COUNT(ap.paper_id) AS paper_count
      FROM authors a
      LEFT JOIN author_papers ap ON a.author_id = ap.author_id
      GROUP BY a.university;
    `;

    const [researchCountPerUniversity] = await connection.execute(
      queryResearchCountPerUniversity
    );
    console.log("Sum of the research papers of the authors per university:");
    console.table(researchCountPerUniversity);

    const queryMinMaxHIndexPerUniversity = `
      SELECT a.university, MIN(a.h_index) AS min_h_index, MAX(a.h_index) AS max_h_index
      FROM authors a
      GROUP BY a.university;
    `;

    const [minMaxHIndexPerUniversity] = await connection.execute(
      queryMinMaxHIndexPerUniversity
    );
    console.log(
      "Minimum and maximum of the h-index of all authors per university:"
    );
    console.table(minMaxHIndexPerUniversity);
  } catch (err) {
    console.error("Error executing queries:", err.message);
  } finally {
    await connection.end();
    console.log("Database connection closed.");
  }
};

await executeQueries();
