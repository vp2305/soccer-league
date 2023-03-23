import React, { useCallback, useEffect, useState } from "react";
import "./Landing.css";
import Axios from "axios";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Landing() {
  const [tableNames, setTableNames] = useState([]);
  const history = useNavigate();

  const getAvailableTables = useCallback(() => {
    Axios.get("http://localhost:3002/api/getTableNames")
      .then((response) => {
        setTableNames(response.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);

  useEffect(() => {
    getAvailableTables();
  }, [getAvailableTables]);

  const viewTable = (tableName) => {
    history(`/table/${tableName}`);
  };

  return (
    <div className="Landing">
      <h3>Soccer League</h3>
      <p>
        This application is designed to help you manage your data efficiently.
      </p>
      <p>
        You can log in to the application to access your data and perform CRUD
        operations.
      </p>

      <div className="availableTablesContainer">
        <h5>Available Tables</h5>
        <ul className="tablesWrapper">
          {tableNames.map((tableName, i) => (
            <Button
              variant="contained"
              key={tableName.Tables}
              onClick={(e) => viewTable(tableName.Tables)}
            >
              {tableName.Tables}
            </Button>
          ))}
        </ul>
      </div>

      {/* Create Table */}

      {/* Delete Table */}
    </div>
  );
}

export default Landing;
