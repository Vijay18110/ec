import React, { useState } from "react";
import { Range } from "react-range";
import { chatAction } from "../../../Redux/Slices/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import "./DiscountRange.css";
const DiscountRangeSlider = () => {
  const STEP = 1;
  const MIN = 0;
  const MAX = 100;
  const dispatch = useDispatch();

  const values = useSelector((state) => state.chatreducer.discountPrice);

  return (
    <div style={{
      backgroundColor: "white",
      boxShadow:
        "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px",
    }} className="border dicountRange rounded bg-white">
      <h6 style={{ fontSize: "15px", fontWeight: "700" }} className="categories-h6">Discount Range</h6>
      <div className="p-2 content">
        <Range
          values={values}
          step={STEP}
          min={MIN}
          max={MAX}
          onChange={(vals) => dispatch(chatAction.setDiscountValues(vals))}
          renderTrack={({ props, children }) => {
            const { key, ...restProps } = props;

            return (
              <div
                key={key}
                {...restProps}
                style={{
                  ...props.style,
                  height: "4px",
                  background: `linear-gradient(to right, #ddd ${((values[0] - MIN) / (MAX - MIN)) * 100
                    }%,#597545 ${((values[0] - MIN) / (MAX - MIN)) * 100
                    }% ,#597545 ${((values[1] - MIN) / (MAX - MIN)) * 100
                    }%, #ddd ${((values[1] - MIN) / (MAX - MIN)) * 100}%)`,
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
                  {values[index]}%
                </div>
              </div>
            );
          }}
        />

        <div className="d-flex justify-content-between mt-4 gap-3">
          <div className="flex-fill">
            <label className="form-label">Min %</label>
            <input
              type="number"
              readOnly={true}
              className="form-control"
              value={values[1]}
              onChange={(e) =>
                dispatch(
                  chatAction.setDiscountValues([
                    Math.min(Number(e.target.value), values[1]),
                    values[1],
                  ])
                )
              }
              min={MIN}
              max={MAX}
            />
          </div>
          <div className="flex-fill">
            <label className="form-label">Max %</label>
            <input
              type="number"
              className="form-control"
              value={values[0]}
              readOnly={true}
              onChange={(e) =>
                dispatch(
                  chatAction.setDiscountValues([
                    values[0],
                    Math.max(Number(e.target.value), values[0]),
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

export default DiscountRangeSlider;
