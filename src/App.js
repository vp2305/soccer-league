import { useEffect } from "react";
import "./App.css";

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
      <h1>Hello</h1>
    </div>
  );
}

export default App;
