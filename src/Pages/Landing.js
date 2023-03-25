import React, { useCallback, useEffect, useState } from "react";
import "./Landing.css";
import Axios from "axios";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Landing() {
  const [tableNames, setTableNames] = useState([]);
  const [createTable, setCreateTable] = useState([{ name: "Id", type: "int" }]);
  const [tableName, setTableName] = useState("");
  const [deleteTable, setDeleteTable] = useState("");
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

  const addColumnListener = () => {
    setCreateTable([...createTable, { name: "", type: "int" }]);
  };

  const createTableListener = (e) => {
    e.preventDefault();
    fetch(`http://localhost:3002/api/create/${tableName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: createTable,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          getAvailableTables();
          setCreateTable([{ name: "Id", type: "int" }]);
          setTableName("");
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const deleteTableListener = (e) => {
    e.preventDefault();
    fetch(`http://localhost:3002/api/delete/${deleteTable}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          getAvailableTables();
          setDeleteTable("");
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
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

        {tableNames.length === 0 && (
          <p>No tables available or unable to connect to the database.</p>
        )}

        {/* View Table */}
        <ul className="tablesWrapper">
          {tableNames.map((tableName) => (
            <Button
              variant="contained"
              key={tableName.Tables}
              onClick={() => viewTable(tableName.Tables)}
            >
              {tableName.Tables}
            </Button>
          ))}
        </ul>
      </div>

      {tableNames.length > 0 && (
        <div>
          {/* Create Table */}
          <div className="createTableContainer">
            <h5>Create Table</h5>
            <div className="createTableWrapper">
              <form className="createTableForm" onSubmit={createTableListener}>
                <label htmlFor="tableName">Table Name: </label>
                <input
                  type="text"
                  id="tableName"
                  placeholder="Name of the table to create..."
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                  required
                />

                {createTable.map((column, index) => (
                  <div key={index}>
                    <div className="columnsInformation">
                      <div id="nameOfColumn">
                        <label htmlFor="columnNames">Column Name: </label>
                        <input
                          type="text"
                          id="columnNames"
                          value={index === 0 ? "Id" : column.name}
                          onChange={(e) => {
                            const newCreateTable = [...createTable];
                            newCreateTable[index].name = e.target.value;
                            setCreateTable(newCreateTable);
                          }}
                          readOnly={index === 0}
                          required
                        />
                      </div>
                      <div id="typeOfColumn">
                        <label htmlFor="columnTypes">Column Type: </label>
                        <select
                          id="columnTypes"
                          value={column.type}
                          onChange={(e) => {
                            const newCreateTable = [...createTable];
                            newCreateTable[index].type = e.target.value;
                            setCreateTable(newCreateTable);
                          }}
                          disabled={index === 0}
                        >
                          <option value="int">int</option>
                          <option value="nvarchar(256)">nvarchar(256)</option>
                          <option value="datetime">datetime</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="buttonWrapper">
                  <Button
                    variant="contained"
                    id="addButton"
                    onClick={addColumnListener}
                  >
                    Add Column
                  </Button>
                  <Button type="submit" variant="contained" id="submitButton">
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </div>
          {/* Delete Table */}
          <div className="deleteTableContainer">
            <h5>Delete Table</h5>
            <form className="deleteTableWrapper" onSubmit={deleteTableListener}>
              <input
                type="text"
                placeholder="Name of the table..."
                value={deleteTable}
                onChange={(e) => setDeleteTable(e.target.value)}
                required
              />
              <Button variant="contained" type="submit">
                Delete Table
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Landing;
