import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import  HomePage  from "./pages/HomePage";
import  StatsPage  from "./pages/StatsPage";
import  RedirectHandler  from "./pages/RedirecterHandler";
import { LoggerProvider } from "./context/LoggerContext";

function App() {
  return (
    <LoggerProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/:shortcode" element={<RedirectHandler />} />
        </Routes>
      </Router>
    </LoggerProvider>
  );
}

export default App;
