import React from "react";
import { CECCalculator } from "@Calculadoras/components/CECCalculator";
import "./styles.css";

export default function App() {
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <CECCalculator />
    </div>
  );
}
