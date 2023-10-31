import React, { useReducer, useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const initialState = {
  conversionResult: [],
  to: "USD",
  from: "EUR",
};

function reducer(state, action) {
  switch (action.type) {
    case "updateConversionResult":
      return { ...state, conversionResult: action.payload };
    case "updateInput":
      return { ...state, [action.field]: action.value };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [firstInput, setFirstInput] = useState("");
  const [result, setResult] = useState("");
  useEffect(() => {
    const convertCurrency = async () => {
      try {
        const response = await axios.get(
          `https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_k0PX9ITW3DKQnnAjxJh6Ll2Bmqg3qR3boRIR7zKA&currencies=&base_currency=${state.to}`
        );
        dispatch({
          type: "updateConversionResult",
          payload: response?.data.data,
        });
      } catch (error) {
        console.error("API Request Error:", error);
      }
    };

    convertCurrency();
  }, [state.to]);

  const handleChange = (e) => {
    const dates = e.target.value;
    dispatch({ type: "updateInput", payload: dates });
  };

  useEffect(() => {
    const firstInputNumber = parseFloat(firstInput);

    const from1 = state.conversionResult[state.from];
    const result = firstInputNumber * from1;

    setResult(result);
  }, [state.conversionResult, state.from, firstInput]);
  return (
    <>
      <div>
        <h1>Currency Converter</h1>
        <div>
          <input
            className="firstInput"
            type="text"
            value={firstInput}
            onChange={(e) => setFirstInput(e.target.value)}
          />
          <select onChange={handleChange} value={state.from1}>
            {Object.keys(state.conversionResult).map((prev) => (
              <option key={prev} value={prev}>
                {prev}
              </option>
            ))}
          </select>
        </div>
        <br />
        <div>
          <input
            className="secondInput"
            type="text"
            value={result ? result : undefined}
          />
          <select
            onChange={(e) =>
              dispatch({ type: "updateInput", payload: e.target.value })
            }
            value={state.from1}
          >
            {Object.keys(state.conversionResult).map((prev) => (
              <option key={prev} value={prev}>
                {prev}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}

export default App;
