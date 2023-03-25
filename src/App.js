import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Landing from "./Pages/Landing";
import TableInformation from "./Pages/TableInformation";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/table/:id" element={<TableInformation />} />
          <Route path="/" element={<Landing />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
