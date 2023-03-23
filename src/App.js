import { useEffect } from "react";
import "./App.css";
import Axios from "axios";

function App() {
  // Way to get data from the backend
  useEffect(() => {
    Axios.get("http://localhost:3002/api/getTable/League")
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);
  return (
    <div className="App">
      <h1>Hello</h1>
    </div>
  );
}

export default App;
