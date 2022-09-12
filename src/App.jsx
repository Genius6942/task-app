import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import { useEffectOnce } from "react-use";

function App() {
  const [cards, setCards] = useState([
    {
      id: 0,
      value: 1,
    },
  ]);

  useEffectOnce(() => {
    document.getElementById("splash").classList.add("hidden");
  });

  return (
    <div className="app">
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/dashboard" element={<Dashboard />} />

          {/* 404 page */}
          <Route path="*" element={<div>404</div>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
