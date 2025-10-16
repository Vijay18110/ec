import React, { useEffect, useState } from "react";

const ProDetails = ({ productdetails }) => {
  const [active, setActive] = useState();
  const handleActive = (val) => {
    setActive(val);
  };
  useEffect(() => {
    const firstKey = Object.keys(productdetails).find(
      (key) => productdetails[key] // ensure it's not null/undefined
    );
    if (firstKey) {
      setActive(firstKey);
    }
  }, [productdetails]);
  // console.log("productdetails", Object.entries(productdetails))
  return (
    productdetails && (
      <>
        <div className="container-fluid">
          <div className="product-discription-tab-shop mt--50 ">
            <ul className="nav nav-tabs d-flex" id="myTab" role="tablist">
              {Object.entries(productdetails).map(
                ([sectionTitle, sectionData], index) =>
                  sectionData && (
                    <li key={index} className="nav-item" role="presentation">
                      <button
                        className={
                          active == sectionTitle
                            ? "nav-link active"
                            : "nav-link "
                        }
                        id={`${sectionTitle}-tab`}
                        data-bs-toggle="tab"
                        data-bs-target={`#${sectionTitle}-tab-pane`}
                        type="button"
                        onClick={() => handleActive(sectionTitle)}
                        role="tab"
                        aria-controls={`${sectionTitle}-tab-pane`}
                        aria-selected={
                          active == sectionTitle ? "false" : "true"
                        }
                      >
                        {sectionTitle}
                      </button>
                    </li>
                  )
              )}
            </ul>
            {Object.entries(productdetails).map(
              ([sectionTitle, sectionData]) => (
                sectionData && <div key={sectionTitle} className="tab-content" id="myTabContent">
                  <div
                    className={
                      active === sectionTitle
                        ? " tab-pane fade show active"
                        : "tab-pane fade  "
                    }
                    id={`${sectionTitle}-tab-panes`}
                    role="tabpanel"
                    aria-labelledby={`${sectionTitle}-tab`}

                  >
                    <div className="">
                      {Object.entries(sectionData).map(([key, value]) => (
                        value && (
                          <>
                            {key && <h4 key={key} className="fw-bold">{key}</h4>}
                            {value && <p>{value}</p>}
                          </>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

      </>
    )
  );
};

export default ProDetails;
