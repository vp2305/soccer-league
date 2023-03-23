import { useEffect } from "react";
import "./App.css";
import LandingPage from "./components/landing";
import Dashboard from "./components/Dashboard";

function App() {
  useEffect(() => {
    fetch("https://localhost:3002/api/getTables")
      .then((response) =>
        response.json().then((data) => {
          console.log(data);
        })
      )
      .catch((err) => {
        console.log(err.message);
      });
  }, []);
  return (
    <div className="App">
      <LandingPage />
      <Dashboard />\
    </div>
  );
}

export default App;
