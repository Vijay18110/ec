import React, { useState } from "react";
import { Range } from "react-range";
import { useDispatch, useSelector } from "react-redux";
import { chatAction } from "../../../Redux/Slices/chatSlice";
import "./PriceRange.css";
const PriceRangeSlider = () => {
  const STEP = 100;
  const MIN = 0;
  const MAX = 10000;
  const dispatch = useDispatch();
  const pricevalues = useSelector((state) => state.chatreducer.priceValues);
  console.log("pricevalues", pricevalues);
  return (
    <div
      style={{
        backgroundColor: "white",
        boxShadow:
          "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px",
      }}
      className="border mb-2 PriceRange rounded bg-white"
    >
      <h6 style={{ fontSize: "15px", fontWeight: "700" }} className="categories-h6">Price Range</h6>
      <div className="p-2 content">
        <Range
          values={pricevalues}
          step={STEP}
          min={MIN}
          max={MAX}
          onChange={(vals) => dispatch(chatAction.setPriceValues(vals))}
          renderTrack={({ props, children }) => {
            const { key, ...restProps } = props;
            return (
              <div
                {...restProps}
                key={key}
                style={{
                  ...props.style,
                  height: "4px",
                  background: `linear-gradient(to right, #ddd ${((pricevalues[0] - MIN) / (MAX - MIN)) * 100
                    }%, #597545 ${((pricevalues[0] - MIN) / (MAX - MIN)) * 100
                    }% , #597545 ${((pricevalues[1] - MIN) / (MAX - MIN)) * 100
                    }%, #ddd ${((pricevalues[1] - MIN) / (MAX - MIN)) * 100}%)`,
                  borderRadius: "4px",
                  marginTop: "10px",
                  marginLeft: "10px",
                }}
              >
                {children}
              </div>
            );
          }}
          renderThumb={({ props, index }) => {
            const { key, ...restProps } = props;
            return (
              <div
                key={key}
                {...restProps}
                style={{
                  ...props.style,
                  height: "15px",
                  width: "15px",
                  backgroundColor: "#597545",
                  borderRadius: "50%",
                  outline: "none",
                  boxShadow: "0 0 0 2px rgba(89,117,69,0.4)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-21px",
                    color: "#000",
                    fontSize: "12px",
                  }}
                >
                  ₹{pricevalues[index]}
                </div>
              </div>
            );
          }}
        />

        <div className="d-flex justify-content-between mt-4 gap-3">
          <div className="flex-fill">
            <label className="form-label">Min</label>
            <input
              type="number"
              className="form-control"
              value={pricevalues[1]}
              readOnly={true}
              onChange={(e) =>
                dispatch(
                  chatAction.setPriceValues([
                    Math.min(Number(e.target.value), pricevalues[1]),
                    pricevalues[1],
                  ])
                )
              }
              min={MIN}
              max={MAX}
            />
          </div>
          <div className="flex-fill">
            <label className="form-label">Max</label>
            <input
              type="number"
              className="form-control"
              value={pricevalues[0]}
              readOnly={true}
              onChange={(e) =>
                dispatch(
                  chatAction.setPriceValues([
                    pricevalues[0],
                    Math.max(Number(e.target.value), pricevalues[0]),
                  ])
                )
              }
              min={MIN}
              max={MAX}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
