import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import { DataGrid } from "@mui/x-data-grid";

import "./TableInformation.css";
import { Button } from "@mui/material";

function TableInformation() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [addRowData, setAddRowData] = useState({});
  const [addRowStatus, setAddRowStatus] = useState(false);

  const handleRowSelection = (row) => {
    setSelectedRows(row);
  };

  const getTableData = useCallback(() => {
    Axios.get(`http://localhost:3002/api/getTable/${id}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, [id]);

  const searchRow = useCallback(() => {
    const column = columns.map((column) => column.field);
    Axios.get(`http://localhost:3002/api/search/${id}/${column}/${search}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, [id, columns, search]);

  const getRowId = (row) => {
    return row.Id;
  };

  useEffect(() => {
    getTableData();
  }, [getTableData]);

  useEffect(() => {
    if (data.length > 0) {
      const columns = Object.keys(data[0]).map((key) => ({
        field: key,
        headerName: key,
        width: 250,
      }));
      setColumns(columns);
    }
  }, [data]);

  useEffect(() => {
    if (search.length > 0) {
      searchRow();
    } else {
      getTableData();
    }
  }, [search]);

  const handleDelete = () => {
    // If no rows are selected, return
    if (selectedRows.length === 0) return;

    const body = JSON.stringify({
      ids: selectedRows,
    });

    fetch(`http://localhost:3002/api/deleteRows/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        getTableData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddRowListener = (e, columnName) => {
    e.preventDefault();

    if (e.target.type === "number") {
      setAddRowData({ ...addRowData, [columnName]: Number(e.target.value) });
    } else {
      setAddRowData({ ...addRowData, [columnName]: e.target.value });
    }
  };

  const handleAddRow = (e) => {
    e.preventDefault();
    fetch(`http://localhost:3002/api/addRow/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: addRowData,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        getTableData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="TableInformation">
      <h3>Table Information for {id}</h3>
      <div className="searchContainer">
        <input
          type="text"
          placeholder="Search by attributes..."
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="contained" onClick={handleDelete}>
          Drop Row
        </Button>
        <Button
          variant="contained"
          onClick={() => setAddRowStatus(!addRowStatus)}
        >
          Add Row
        </Button>
      </div>

      {addRowStatus && (
        <div className="addRowContainer">
          <form onSubmit={handleAddRow}>
            {columns.map((column) => (
              <div className="addRowWrapper" key={column.field}>
                <label htmlFor={column.field}>{column.field}</label>
                <input
                  type={column.field === "Id" ? "number" : "text"}
                  placeholder={`Value for ${column.field}`}
                  onChange={(e) => {
                    handleAddRowListener(e, column.field);
                  }}
                  required
                />
              </div>
            ))}
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </form>
        </div>
      )}

      <div className="tableContainer">
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={getRowId}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          onRowSelectionModelChange={(row) => handleRowSelection(row)}
        />
      </div>
    </div>
  );
}

export default TableInformation;
