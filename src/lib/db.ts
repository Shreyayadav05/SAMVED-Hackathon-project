import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.resolve(process.cwd(), 'equiflow.db');
const db = new Database(dbPath);

// Initialize Database Schema
export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('ADMIN', 'ENGINEER', 'OPERATOR')) NOT NULL,
      name TEXT NOT NULL,
      avatar TEXT
    );

    CREATE TABLE IF NOT EXISTS wards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      target_pressure REAL DEFAULT 2.5,
      population INTEGER,
      coordinates TEXT -- JSON string of [lat, lng]
    );

    CREATE TABLE IF NOT EXISTS sensors (
      id TEXT PRIMARY KEY,
      ward_id INTEGER NOT NULL,
      type TEXT CHECK(type IN ('PRESSURE', 'FLOW')) NOT NULL,
      status TEXT DEFAULT 'ACTIVE',
      FOREIGN KEY (ward_id) REFERENCES wards(id)
    );

    CREATE TABLE IF NOT EXISTS pressure_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sensor_id TEXT NOT NULL,
      value REAL NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sensor_id) REFERENCES sensors(id)
    );

    CREATE TABLE IF NOT EXISTS leak_alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ward_id INTEGER NOT NULL,
      severity TEXT CHECK(severity IN ('LOW', 'MEDIUM', 'HIGH')) NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'OPEN',
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (ward_id) REFERENCES wards(id)
    );

    CREATE TABLE IF NOT EXISTS valve_controls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ward_id INTEGER NOT NULL,
      opening_percentage INTEGER NOT NULL, -- 0 to 100
      controlled_by TEXT DEFAULT 'AI',
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (ward_id) REFERENCES wards(id)
    );

    CREATE TABLE IF NOT EXISTS demand_predictions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ward_id INTEGER NOT NULL,
      predicted_demand REAL NOT NULL,
      prediction_for DATETIME NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (ward_id) REFERENCES wards(id)
    );
  `);

  // Seed initial data if empty
  const userCount = db.prepare('SELECT count(*) as count FROM users').get() as { count: number };
  if (userCount.count === 0) {
    // Default password 'admin123' hashed (using a placeholder for now, will use bcrypt in routes)
    // For seeding, we'll just insert a known hash or handle it in the server start
  }

  const wardCount = db.prepare('SELECT count(*) as count FROM wards').get() as { count: number };
  if (wardCount.count === 0) {
    const wards = [
      { name: 'Ward 1 - Jule Solapur', population: 45000, coords: '[17.6599, 75.9064]' },
      { name: 'Ward 2 - Navi Peth', population: 32000, coords: '[17.6750, 75.9100]' },
      { name: 'Ward 3 - Ashok Chowk', population: 28000, coords: '[17.6800, 75.9200]' },
      { name: 'Ward 4 - Saat Rasta', population: 55000, coords: '[17.6650, 75.9150]' },
      { name: 'Ward 5 - Hotgi Road', population: 40000, coords: '[17.6500, 75.9250]' },
    ];

    const insertWard = db.prepare('INSERT INTO wards (name, population, coordinates) VALUES (?, ?, ?)');
    wards.forEach(w => insertWard.run(w.name, w.population, w.coords));

    // Seed Sensors
    const allWards = db.prepare('SELECT id FROM wards').all() as { id: number }[];
    const insertSensor = db.prepare('INSERT INTO sensors (id, ward_id, type) VALUES (?, ?, ?)');
    allWards.forEach(w => {
      insertSensor.run(`P-SENS-${w.id}`, w.id, 'PRESSURE');
      insertSensor.run(`F-SENS-${w.id}`, w.id, 'FLOW');
    });
  }
}

export default db;
