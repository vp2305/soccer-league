import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import { DataGrid } from "@mui/x-data-grid";

import "./TableInformation.css";

function TableInformation() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  const getTableData = useCallback(() => {
    Axios.get(`http://localhost:3002/api/getTable/${id}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, [id]);

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

  return (
    <div className="TableInformation">
      <h3>Table Information for {id}</h3>
      <div className="tableContainer">
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={getRowId}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
        />
      </div>
    </div>
  );
}

export default TableInformation;
