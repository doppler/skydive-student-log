/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql("SELECT SIGNUP_INSTRUCTOR('David Rose', 'doppler@gmail.com', 'billybutt')");
  pgm.sql(`
    INSERT INTO locations
      ("code", "name") VALUES ('spaceland-atlanta', 'Spaceland Atlanta')
  `);
  pgm.sql(`
    INSERT INTO instructor_locations
      ("instructorId", "locationId") VALUES (1, 1)
  `);
  pgm.sql(`
    INSERT INTO aircraft ("name") VALUES ('Caravan N-42FL1')
  `);
  pgm.sql(`
    INSERT INTO location_aircraft ("locationId", "aircraftId") VALUES (1, 1)
  `);
  pgm.sql(`
    INSERT INTO students
      ("name", "email", "phone", "hometown")
    VALUES
      ('Good Student', 'good@student.com', '555-555-5555', 'Nowhereland, NO')
  `);
  pgm.sql(`
    INSERT INTO jumps
      ("studentId", "jumpNumber", "diveFlowNumber", "instructorId", "locationId", "aircraftId", "exitAltitude", "deploymentAltitude", "logEntry")
    VALUES
      (1, 2, 1, 1, 1, 1, 14000, 5500, 'Did pretty good')
  `);
};

exports.down = pgm => {
  pgm.sql("DELETE FROM jumps");
  pgm.sql("DELETE FROM students");
  pgm.sql("DELETE FROM location_aircraft");
  pgm.sql("DELETE FROM aircraft");
  pgm.sql("DELETE FROM instructor_locations");
  pgm.sql("DELETE FROM locations");
  pgm.sql(`
    DELETE FROM instructors;
  `);
};
