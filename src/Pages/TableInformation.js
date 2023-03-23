import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import "./TableInformation.css";

function TableInformation() {
  const { id } = useParams();
  const [data, setData] = useState([]);

  const getTableData = useCallback(() => {
    Axios.get(`http://localhost:3002/api/getTable/${id}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, [id]);

  useEffect(() => {
    getTableData();
  }, [getTableData]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className="TableInformation">
      <h3>Table Information for {id}</h3>
    </div>
  );
}

export default TableInformation;
