import { Server } from 'socket.io';
import db from './db';

export function startIoTSimulation(io: Server) {
  setInterval(() => {
    const wards = db.prepare('SELECT id, target_pressure FROM wards').all() as any[];
    
    wards.forEach(ward => {
      // Get latest valve opening
      const valve = db.prepare('SELECT opening_percentage FROM valve_controls WHERE ward_id = ? ORDER BY timestamp DESC LIMIT 1').get(ward.id) as any;
      const opening = valve ? valve.opening_percentage : 50;

      // Simulate pressure fluctuation around target, affected by valve opening
      // If opening is 100%, pressure is higher. If 5%, pressure is lower.
      const basePressure = ward.target_pressure * (opening / 100) * 2; 
      const noise = (Math.random() - 0.5) * 0.2;
      const currentPressure = Math.max(0.1, basePressure + noise);

      // Simulate flow based on pressure and opening
      const currentFlow = (currentPressure * (opening / 100) * 50).toFixed(1);

      // Log to DB
      const pSensorId = `P-SENS-${ward.id}`;
      const fSensorId = `F-SENS-${ward.id}`;
      db.prepare('INSERT INTO pressure_logs (sensor_id, value) VALUES (?, ?)').run(pSensorId, currentPressure);
      
      // Broadcast to clients
      io.emit('sensor_update', {
        ward_id: ward.id,
        pressure: currentPressure.toFixed(2),
        flow: currentFlow,
        valve_opening: opening,
        timestamp: new Date().toISOString()
      });

      // Random leak simulation (0.1% chance)
      if (Math.random() < 0.001) {
        db.prepare('INSERT INTO leak_alerts (ward_id, severity, description) VALUES (?, ?, ?)')
          .run(ward.id, 'HIGH', 'Sudden pressure drop detected at main junction.');
        
        io.emit('new_alert', {
          ward_id: ward.id,
          severity: 'HIGH',
          description: 'Sudden pressure drop detected at main junction.',
          timestamp: new Date().toISOString()
        });
      }
    });
  }, 5000);
}
