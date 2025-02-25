import { connection } from "./connection.js";

const setupAuthorsTable = async () => {
  try {
    console.log("Setting up the authors table...");

    const createAuthorsTableQuery = `
      CREATE TABLE IF NOT EXISTS authors (
        author_id INT PRIMARY KEY AUTO_INCREMENT,
        author_name VARCHAR(50) NOT NULL,
        university VARCHAR(40),
        date_of_birth DATE,
        h_index INT,
        gender VARCHAR(10)
      );
    `;
    await connection.execute(createAuthorsTableQuery);
    console.log("Authors table created successfully.");

    const [columns] = await connection.execute(
      "SHOW COLUMNS FROM authors LIKE 'mentor'"
    );
    if (columns.length === 0) {
      const addMentorColumnQuery = `
        ALTER TABLE authors 
        ADD COLUMN mentor INT,
        ADD CONSTRAINT fk_mentor FOREIGN KEY (mentor) REFERENCES authors(author_id) ON DELETE SET NULL
      `;
      await connection.execute(addMentorColumnQuery);
      console.log("Mentor column added with foreign key constraint.");
    } else {
      console.log("Mentor column already exists, skipping addition.");
    }

    const authorsWithoutMentors = [
      ["John Doe", "Harvard", "1980-01-15", 25, "Male"],
      ["Jane Smith", "MIT", "1975-05-20", 30, "Female"],
      ["Michael Johnson", "Stanford", "1990-03-10", 20, "Male"],
      ["Emily Davis", "Yale", "1988-11-05", 28, "Female"],
      ["Chris Brown", "Oxford", "1985-07-18", 35, "Male"],
      ["Laura Wilson", "Cambridge", "1979-09-25", 40, "Female"],
      ["David Miller", "Columbia", "1992-06-12", 22, "Male"],
      ["Sophia Taylor", "Princeton", "1986-12-01", 27, "Female"],
      ["James Anderson", "Berkeley", "1991-04-22", 32, "Male"],
      ["Olivia Thomas", "UCLA", "1983-08-19", 29, "Female"],
      ["William Martinez", "NYU", "1987-03-30", 24, "Male"],
      ["Emma Garcia", "USC", "1984-10-14", 26, "Female"],
      ["Liam Harris", "Chicago", "1989-02-27", 23, "Male"],
      ["Isabella Moore", "Cornell", "1993-01-09", 21, "Female"],
      ["Ethan Martinez", "Duke", "1982-07-04", 34, "Male"],
    ];

    const insertQuery = `
      INSERT INTO authors (author_name, university, date_of_birth, h_index, gender)
      VALUES ?;
    `;

    await connection.query(insertQuery, [authorsWithoutMentors]);

    console.log("Authors inserted successfully.");

    const authorCount = authorsWithoutMentors.length;

    for (let i = 0; i < authorCount; i++) {
      const menteeId = i + 1;
      const mentorId = ((i + 1) % authorCount) + 1;

      await connection.execute(
        "UPDATE authors SET mentor = ? WHERE author_id = ?",
        [mentorId, menteeId]
      );
    }

    console.log("Mentor relationships updated successfully.");
  } catch (err) {
    console.error("Error setting up the authors table:", err.message);
  } finally {
    await connection.end();
    console.log("Database connection closed.");
  }
};

await setupAuthorsTable();
