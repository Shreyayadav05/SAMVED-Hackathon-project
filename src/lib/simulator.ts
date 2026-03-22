import { ref, set } from "firebase/database";
import { db } from "./firebase";

let basePressure = 2.5;

export const startSimulation = () => {
  setInterval(() => {
    const variation = (Math.random() - 0.5) * 0.3;
    const pressure = basePressure + variation;
    const flow = Math.random() * 40 + 30;

    const isLeak = Math.random() < 0.1;

    set(ref(db, "sensor/ward1"), {
      pressure: isLeak ? 1.2 : Number(pressure.toFixed(2)),
      flow: isLeak ? flow + 40 : Math.floor(flow),
      timestamp: Date.now()
    });

    if (isLeak) {
      set(ref(db, "alerts/" + Date.now()), {
        ward: 1,
        type: "PIPE BURST",
        severity: "HIGH",
        message: "Pressure drop detected",
        timestamp: Date.now()
      });
    }

  }, 2000);
};