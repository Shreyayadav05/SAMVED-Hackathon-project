# EquiFlow AI - API Documentation

## Authentication
All requests must include a Bearer token in the `Authorization` header.
`Authorization: Bearer <token>`

## Endpoints

### 1. System Stats
`GET /api/stats`
Returns the current system performance metrics.
- `equityIndex`: Current distribution fairness (0-100)
- `improvement`: Percentage improvement since activation
- `leakReduction`: Estimated reduction in water loss

### 2. Ward Management
`GET /api/wards`
Returns real-time telemetry for all wards.

`GET /api/wards/:id/history`
Returns historical pressure logs for a specific ward.

### 3. AI Optimization
`POST /api/ai/optimize`
Triggers the constrained optimization solver.
- Returns suggested valve settings and predicted equity improvement.

### 4. Simulation Gateway
`POST /api/simulation/trigger`
Injects anomalies into the virtual IoT network.
- `type`: `LEAK`, `DEMAND_SPIKE`, `SENSOR_FAILURE`, `RANDOMIZE`
- `wardId`: Target ward for the anomaly

### 5. System Configuration
`PUT /api/system/config`
Updates target pressure thresholds for wards.
