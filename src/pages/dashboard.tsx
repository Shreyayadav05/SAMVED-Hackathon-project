import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../lib/firebase";

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any>({
    pressure: 0,
    flow: 0
  });

  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    // ✅ SENSOR LISTENER
    const sensorRef = ref(db, "sensor/ward1");

    onValue(sensorRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setData({
          pressure: val.pressure || 0,
          flow: val.flow || 0
        });
      }
    });

    // ✅ ALERT LISTENER
    const alertRef = ref(db, "alerts");

    onValue(alertRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        const list = Object.values(val);
        setAlerts(list.reverse());
      }
    });

  }, []);

  return (
    <div style={{
      padding: "30px",
      background: "#0f172a",
      minHeight: "100vh",
      color: "white",
      fontFamily: "sans-serif"
    }}>

      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
        🚰 Smart Water Dashboard
      </h1>

      {/* STATS */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>

        <div style={card}>
          <h3>Pressure</h3>
          <p style={value}>{data.pressure.toFixed(2)} bar</p>
        </div>

        <div style={card}>
          <h3>Flow</h3>
          <p style={value}>{data.flow}</p>
        </div>

        <div style={card}>
          <h3>Status</h3>
          <p style={{
            ...value,
            color: data.pressure < 1.5 ? "red" : "lightgreen"
          }}>
            {data.pressure < 1.5 ? "Leak Detected ⚠️" : "Normal ✅"}
          </p>
        </div>

      </div>

      {/* ALERTS */}
      <div>
        <h2 style={{ marginBottom: "10px" }}>Recent Alerts</h2>

        {alerts.length === 0 ? (
          <p>No alerts</p>
        ) : (
          alerts.slice(0, 5).map((a: any, i: number) => (
            <div key={i} style={alertCard}>
              ⚠️ {a.type} — Ward {a.ward}
            </div>
          ))
        )}
      </div>

    </div>
  );
};

// STYLES
const card = {
  flex: 1,
  padding: "20px",
  background: "#1e293b",
  borderRadius: "12px",
  textAlign: "center" as const
};

const value = {
  fontSize: "22px",
  fontWeight: "bold"
};

const alertCard = {
  background: "#7f1d1d",
  padding: "10px",
  borderRadius: "8px",
  marginBottom: "10px"
};

export default Dashboard;