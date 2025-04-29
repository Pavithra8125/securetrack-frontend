import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // 🛣️ import routing components
import SuspiciousNumbers from "./SuspiciousNumbers";  // Import SuspiciousNumbers page
import Login from "./Login"; // (We will create this Login page next)

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />  {/* Root path shows Login */}
        <Route path="/suspicious" element={<SuspiciousNumbers />} /> {/* Suspicious numbers page */}
      </Routes>
    </Router>
  );
}

export default App;
