import { connection } from "./connection.js";

const executeQueries = async () => {
  try {
    console.log("Executing queries...");

    const queryAuthorsMentors = `
      SELECT a.author_name AS Author, 
             COALESCE(m.author_name, 'No Mentor') AS Mentor
      FROM authors a
      LEFT JOIN authors m ON a.mentor = m.author_id;
    `;

    const [authorsMentors] = await connection.execute(queryAuthorsMentors);
    console.log("Authors and their mentors:");
    console.table(authorsMentors);

    const queryAuthorsPapers = `
      SELECT a.*, 
             COALESCE(r.paper_title, 'No Research Paper') AS Paper_Title
      FROM authors a
      LEFT JOIN author_papers ap ON a.author_id = ap.author_id
      LEFT JOIN research_papers r ON ap.paper_id = r.paper_id;
    `;

    const [authorsPapers] = await connection.execute(queryAuthorsPapers);
    console.log("Authors and their research papers:");
    console.table(authorsPapers);
  } catch (err) {
    console.error("Error executing queries:", err.message);
  } finally {
    await connection.end();
    console.log("Database connection closed.");
  }
};

await executeQueries();
