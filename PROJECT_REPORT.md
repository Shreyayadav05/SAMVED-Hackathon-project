# EquiFlow AI - Smart Water Pressure Management
## Final Year Project Report Summary

### 1. Project Overview
EquiFlow AI is an intelligent water distribution management system designed for Solapur Municipal Corporation. It addresses the critical issue of unequal water pressure distribution across different urban wards using IoT sensors and AI-driven predictive analytics.

### 2. System Architecture
- **IoT Layer**: Virtual pressure and flow sensors (simulated) streaming data via WebSockets.
- **Backend**: Node.js/Express server with SQLite for high-performance data logging.
- **AI Engine**: Google Gemini API for demand forecasting, leak detection, and valve optimization.
- **Frontend**: React.js with Tailwind CSS, featuring real-time dashboards and GIS visualizations.

### 3. Key Features
- **Real-time Monitoring**: Live telemetry from all wards.
- **AI Optimization**: Automated valve control suggestions to balance pressure.
- **Leak Detection**: Anomaly detection algorithms to identify potential pipe bursts.
- **GIS Heatmap**: Visual representation of network health.
- **Role-Based Access**: Secure dashboards for Admin, Engineers, and Operators.

### 4. REST API Documentation

#### User Authentication
- `POST /api/auth/register`: Create a new user account.
- `POST /api/auth/login`: Authenticate and receive a JWT.
- `POST /api/auth/logout`: Invalidate session (client-side).

#### Sensor Data
- `GET /api/sensors`: List all sensors and their last readings.
- `POST /api/sensors/:id/readings`: Submit a manual sensor reading.
- `GET /api/wards/:id/history`: Get historical pressure logs for a ward.

#### Ward Management
- `GET /api/wards`: List all wards with current pressure.
- `GET /api/wards/:id/pressure`: Get current pressure for a specific ward.

#### Valve Control
- `GET /api/valves`: List current valve statuses across all wards.
- `POST /api/valves/:id/control`: Manually adjust valve opening percentage.

#### Alerting & AI
- `GET /api/alerts`: List recent leak alerts and anomalies.
- `GET /api/demand/predictions`: Get AI-generated demand forecasts.
- `POST /api/ai/optimize`: Trigger AI pressure optimization.
- `POST /api/models/retrain`: Simulate AI model retraining.

### 5. Real-Time WebSocket Events
The system uses Socket.io for bi-directional real-time communication:
- `sensor_update`: Pushed when a sensor reading changes.
- `new_alert`: Pushed when a leak or anomaly is detected.
- `valve_update`: Pushed when a valve setting is adjusted.
- `optimization_applied`: Pushed when AI optimization completes.
- `model_update`: Pushed when AI model retraining status changes.

### 6. Database Schema
- `users`: Authentication and roles.
- `wards`: Ward metadata and target parameters.
- `sensors`: IoT device registry.
- `pressure_logs`: Historical telemetry data.
- `leak_alerts`: AI-generated anomaly reports.
- `valve_controls`: History of automated and manual control actions.

### 5. AI/ML Implementation
The system utilizes the Gemini 3 Flash model for:
1. **Demand Forecasting**: Predicting future consumption based on historical trends.
2. **Pressure Balancing**: Calculating optimal valve positions to ensure equitable supply.
3. **Anomaly Detection**: Identifying leaks through pattern recognition in pressure logs.

### 6. Future Scalability
- Integration with real LoRaWAN/NB-IoT hardware.
- Mobile application for field engineers.
- Integration with SCADA systems.
- Predictive maintenance for aging infrastructure.

### 7. Installation Guide
1. `npm install`
2. Set `GEMINI_API_KEY` in `.env`
3. `npm run dev`
4. Access at `http://localhost:3000`
5. Login: `admin` / `admin123`
