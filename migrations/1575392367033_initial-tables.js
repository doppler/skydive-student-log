/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createExtension("pgcrypto");

  pgm.createRole("anonymous");
  pgm.sql("GRANT anonymous TO current_user");

  pgm.createRole("instructor");
  pgm.sql("GRANT instructor TO current_user");

  pgm.createType("jwt_token", {
    role: "text",
    instructorId: "integer",
    name: "text"
  });

  pgm.createFunction("signup_instructor", [
    { mode: "IN", name: "name", type: "text", default: null },
    { mode: "IN", name: "email", type: "text", default: null },
    { mode: "IN", name: "password", type: "text", default: null }    
  ], {
    returns: "jwt_token",
    language: "plpgsql",
    replace: true
  },`
    DECLARE
      token_information jwt_token;
    BEGIN
      INSERT INTO instructors (name, email, password) VALUES ($1, $2, crypt($3, gen_salt('bf', 8)));
      SELECT 'instructor', instructors.id as id, instructors.name as name
        INTO token_information
        FROM instructors
        WHERE instructors.email = $2;
      RETURN token_information::jwt_token;
    END;
  `);
  pgm.sql("GRANT EXECUTE ON FUNCTION SIGNUP_INSTRUCTOR(name TEXT, email TEXT, password TEXT) TO anonymous")

  pgm.createFunction("signin_instructor", [
    { mode: "IN", name: "email", type: "text", default: null },
    { mode: "IN", name: "password", type: "text", default: null }
  ], {
    returns: "jwt_token",
    language: "plpgsql",
    replace: true
  },`
    DECLARE
      token_information jwt_token;
    BEGIN
      SELECT 'instructor', instructors.id as id, instructors.name as name
      INTO token_information
      FROM instructors
      WHERE instructors.email = $1
        AND instructors.password = crypt($2, instructors.password);
    RETURN token_information::jwt_token;
  END;
  `);
  pgm.sql("GRANT EXECUTE ON FUNCTION SIGNIN_INSTRUCTOR(email TEXT, password TEXT) TO anonymous");

  pgm.createTable("instructors", {
    id: { type: "serial", notNull: true, primaryKey: true},
    createdAt: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp")
    },
    password: { type: "text", notNull: true },
    isAdmin: { type: "boolean", default: false },
    name: { type: "varchar", notNull: true },
    email: { type: "varchar", notNull: true },
    phone: { type: "varchar" },
    uspaNumber: { type: "integer" },
    uspaLicense: { type: "varchar" }
  });

  pgm.createTable("locations", {
    id: { type: "serial", notNull: true, primaryKey: true},
    code: { type: "varchar", notNull: true },
    name: { type: "varchar", notNull: true }
  });

  pgm.createTable("instructor_locations", {
    instructorId: {
      type: "integer",
      references: "instructors(id)",
      notNull: true
    },
    locationId: { type: "integer", references: "locations(id)", notNull: true },
    isActive: { type: "boolean", default: true }
  });
  pgm.createIndex("instructor_locations", "instructorId");
  pgm.createIndex("instructor_locations", "locationId");
  pgm.createIndex("instructor_locations", "isActive");
  pgm.createIndex("instructor_locations", ["instructorId", "locationId"]);

  pgm.createTable("aircraft", {
    id: { type: "serial", notNull: true, primaryKey: true},
    name: { type: "varchar", notNull: true }
  });

  pgm.createTable("location_aircraft", {
    locationId: { type: "integer", references: "locations(id)", notNull: true },
    aircraftId: { type: "integer", references: "aircraft(id)", notNull: true },
    isActive: { type: "boolean", default: true }
  });
  pgm.createIndex("location_aircraft", "isActive");
  pgm.createIndex("location_aircraft", "locationId");
  pgm.createIndex("location_aircraft", "aircraftId");
  pgm.createIndex("location_aircraft", ["locationId", "aircraftId"]);

  pgm.createTable("students", {
    id: { type: "serial", notNull: true, primaryKey: true},
    createdAt: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp")
    },
    name: { type: "varchar", notNull: true },
    email: { type: "varchar", notNull: true },
    phone: { type: "varchar", notNull: true },
    hometown: { type: "varchar" },
    uspaNumber: { type: "varchar" },
    uspaLicense: { type: "varchar" },
    hasCompletedFjc: { type: "boolean", default: false }
  });

  pgm.createTable("jumps", {
    id: { type: "serial", notNull: true, primaryKey: true},
    createdAt: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp")
    },
    studentId: { type: "integer", references: "students(id)", notNull: true },
    instructorId: {
      type: "integer",
      references: "instructors(id)",
      notNull: true
    },
    locationId: { type: "integer", references: "locations(id)", notNull: true },
    aircraftId: { type: "integer", references: "aircraft(id)", notNull: true },
    exitAltitude: { type: "integer", notNull: true },
    deploymentAltitude: { type: "integer", notNull: true },
    logEntry: { type: "text", notNull: true }
  });
  pgm.createIndex("jumps", "studentId");
  pgm.createIndex("jumps", "instructorId");
  pgm.createIndex("jumps", "locationId");
  pgm.createIndex("jumps", "aircraftId");
  pgm.createIndex("jumps", "createdAt");

  pgm.sql("GRANT SELECT ON ALL TABLES IN SCHEMA public TO instructor");
  pgm.sql("GRANT INSERT, UPDATE ON students, students_id_seq, jumps, jumps_id_seq TO instructor");
  pgm.sql("GRANT UPDATE ON students_id_seq, jumps_id_seq TO instructor");
};

exports.down = pgm => {
  pgm.dropTable("jumps", { ifExists: true });
  pgm.dropTable("students", { ifExists: true });
  pgm.dropTable("location_aircraft", { ifExists: true });
  pgm.dropTable("instructor_locations", { ifExists: true });
  pgm.dropTable("locations", { ifExists: true });
  pgm.dropTable("aircraft", { ifExists: true });
  pgm.dropTable("instructors", { ifExists: true });
  pgm.dropExtension("pgcrypto");
  pgm.dropFunction("signin_instructor", [
    { mode: "IN", name: "email", type: "text", default: null },
    { mode: "IN", name: "password", type: "text", default: null }
  ], { ifExists: true })
  pgm.dropFunction("signup_instructor", [
    { mode: "IN", name: "name", type: "text", default: null },
    { mode: "IN", name: "email", type: "text", default: null },
    { mode: "IN", name: "password", type: "text", default: null }    
  ], { ifExists: true});
  pgm.dropRole("instructor", { ifExists: true });
  pgm.dropRole("anonymous", { ifExists: true });
  pgm.dropType("jwt_token");
};
