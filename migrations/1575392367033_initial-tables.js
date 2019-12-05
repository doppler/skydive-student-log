/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable("instructors", {
    id: { type: "serial", notNull: true, primaryKey: true},
    createdAt: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp")
    },
    password: { type: "varchar" },
    isAdmin: { type: "boolean", default: false },
    name: { type: "varchar", notNull: true },
    email: { type: "varchar", notNull: true },
    phone: { type: "varchar", notNull: true },
    uspaNumber: { type: "integer", notNull: true },
    uspaLicense: { type: "varchar", notNull: true }
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
  pgm.createIndex("location_aircraft", "locationId");
  pgm.createIndex("location_aircraft", "aircraftId");
  pgm.createIndex("location_aircraft", "isActive");
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
};

exports.down = pgm => {
  pgm.dropTable("jumps", { ifExists: true });
  pgm.dropTable("students", { ifExists: true });
  pgm.dropTable("location_aircraft", { ifExists: true });
  pgm.dropTable("instructor_locations", { ifExists: true });
  pgm.dropTable("locations", { ifExists: true });
  pgm.dropTable("aircraft", { ifExists: true });
  pgm.dropTable("instructors", { ifExists: true });
};
