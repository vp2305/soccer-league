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

  const handleRowSelection = (row) => {
    // Lower the index by 1 to match the index of the data
    const sRows = row.map((row) => row - 1);
    // Set the selected rows to the state
    setSelectedRows(sRows);
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
    fetch(`http://localhost:3002/api/deleteRow/${id}`, {
      body: JSON.stringify({
        ids: selectedRows,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        }),
    });
    // Axios.delete(
    //   `http://localhost:3002/api/deleteRow/${id}/${selectedRows}`,
    //   (err, result) => {
    //     if (result) {
    //       console.log(result);
    //     } else {
    //       console.log(err);
    //     }
    //   }
    // );
  };
  return (
    <div className="TableInformation">
      <h3>Table Information for {id}</h3>
      <div className="searchContainer">
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
        />
        {
          <Button variant="contained" onClick={handleDelete}>
            drop row
          </Button>
        }
        {<Button variant="contained">add row</Button>}
      </div>
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
