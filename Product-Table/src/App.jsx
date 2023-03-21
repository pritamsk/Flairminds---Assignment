import React, { useState, useRef } from "react";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import classnames from "classnames";
import { WEEKDAYS, PRODUCT_LIST } from "./Component/Utils/utils";

function App() {
  // State hooks to manage form inputs, table data and quantity error message
  const [product, setProduct] = useState("");
  const [weekday, setWeekday] = useState("");
  const [quantity, setQuantity] = useState("");
  const quantityRef = useRef(null);
  const [tableData, setTableData] = useState([]);
  const [quantityError, setQuantityError] = useState("");

  // Event handlers for form input changes
  const handleProductChange = (event) => {
    setProduct(event.target.value);
  };

  const handleWeekdayChange = (event) => {
    setWeekday(event.target.value);
  };

  const handleQuantityChange = (event) => {
    // Validate that quantity input is a natural number
    const { value } = event.target;
    if (value === "" || /^\d+$/.test(value)) {
      setQuantity(value);
      setQuantityError("");
    } else {
      setQuantityError("Quantity must be a natural number.");
    }
  };
   
  // Event handler for Add button
  const handleAdd = () => {
    // Validate that all required form inputs are present and quantity is a positive number
    if (product && weekday && quantity > 0) {
      const data = { product, weekday, quantity };
       // Update table data with new row and reset form inputs
      setTableData([...tableData, data]);
      setProduct("");
      setWeekday("");
      setQuantity("");
      quantityRef.current.value = "";
    }
  };

  // Event handler for Finish button
  const handleFinish = () => {
    console.log(tableData);
  };

  // Function to validate quantity input
  const validateQuantity = () => {
    if (quantity <= 0 || isNaN(quantity)) {
      return "Quantity should be a natural number only";
    }
  };
  // Define button and input classes based on form input and quantity validation state
  const addButtonClasses = classnames("btn", "btn-sm");
  const quantityClasses = classnames("form-control", {
    "is-invalid": quantityError,
  });
  const finishButtonClasses = classnames("btn", "btn-sm");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        flexWrap: "wrap",
        height: "100vh",
        background: "#c4e3ed",
      }}
    >
       {/* Form to add new table rows */}
      <div className="" style={{ width: "305px", marginBottom: "20px" }}>
        <form style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="d-flex flex-column">
              {/* Dropdown to select product */}
            <select value={product} onChange={handleProductChange}>
              <option value="">-- Select a product --</option>
              {PRODUCT_LIST.map((product) => (
                <option key={product} value={product}>
                  {product}
                </option>
              ))}
            </select>
            {/* Dropdown to select weekday */}
            <select
              value={weekday}
              onChange={handleWeekdayChange}
              className="my-3"
            >
              <option value="">-- Select a weekday --</option>
              {WEEKDAYS.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <input
              type="text"
              className={quantityClasses}
              value={quantity}
              onChange={handleQuantityChange}
              placeholder="Quantity"
              ref={quantityRef}
            />
            {quantityError && (
              <div className="invalid-feedback" style={{ color: "red" }}>
                {quantityError}
              </div>
            )}
          </div>
          <div
            className="button-container"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <button
              type="button"
              onClick={handleAdd}
              disabled={!product || !weekday || validateQuantity()}
              className={addButtonClasses}
              style={{
                backgroundColor: quantityError ? "#0754c8" : "#0754c8",
                padding: "5px",
                width: "80px",
                height: "30px",
                marginRight: "5px",
                color: "white",
              }}
            >
              Add
            </button>
          </div>
        </form>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          width: "450px",
        }}
      >
        <div style={{ width: "100%", marginBottom: "20px" }}>
          <Table
            bordered
            style={{
              backgroundColor: "white",
              borderRadius: "5px",
              border: "1px solid grey",
              tableLayout: "fixed",
              width: "100%",
            }}
          >
            <thead>
              <tr style={{ color: "#3ca1c3" }}>
                <th>Weekday</th>
                <th>Product</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
               {/* Filter the weekdays array to only include those with data in the table */}
              {WEEKDAYS.filter((day) =>
                tableData.some((data) => data.weekday === day)
              ).map((day) => (
                <tr key={day}>
                  <td>{day}</td>
                  <td style={{ display: "contents" }}>
                    <Table>
                      {/* Filter the tableData to only include data for the current weekday */}
                      {tableData
                        .filter((data) => data.weekday === day)
                        .map((data, index) => (
                          <React.Fragment key={data.product}>
                            <tr>
                              <td style={{ padding: "8px" }}>{data.product}</td>
                            </tr>
                            {index !==
                              tableData.filter((data) => data.weekday === day)
                                .length -
                                1 && (
                              <tr
                                style={{ borderBottom: "1px solid grey" }}
                              ></tr>
                            )}
                          </React.Fragment>
                        ))}
                    </Table>
                  </td>
                  <td style={{ display: "table-cell", padding: "0px" }}>
                    <Table>
                       {/* Filter the tableData to only include data for the current weekday */}
                      {tableData
                        .filter((data) => data.weekday === day)
                        .map((data, index) => (
                          <React.Fragment key={data.product}>
                            <tr>
                              <td
                                className="text-center"
                                style={{ padding: "8px" }}
                              >
                                {data.quantity}
                              </td>
                            </tr>
                            {index !==
                              tableData.filter((data) => data.weekday === day)
                                .length -
                                1 && (
                              <tr
                                style={{ borderBottom: "1px solid grey" }}
                              ></tr>
                            )}
                          </React.Fragment>
                        ))}
                    </Table>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div
            className="button-container"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <button
              type="button"
              onClick={handleFinish}
              disabled={tableData.length === 0}
              className={finishButtonClasses}
              style={{
                backgroundColor: tableData.length === 0 ? "#0754c8" : "#0754c8",
                padding: "-5px 10px",
                width: "75px",
                marginRight: "5px",
                color: "white",
              }}
            >
              Finish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
