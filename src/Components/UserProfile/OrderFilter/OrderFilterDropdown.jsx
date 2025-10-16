// import React, { useState, useRef, useEffect } from 'react';

// const OrderFilterDropdown = ({ selectedFilter, handleFilterwallete, children }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef();

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleSelect = (year) => {
//     handleFilterwallete(year);
//     setIsOpen(false);
//   };

//   const filters = ['Last Three Months', '2025', '2024', '2023', '2022', '2021', 'Custome'];

//   return (
//     <div className="orderfilterdata flex-wrap d-flex align-items-center border-bottom justify-content-between gap-3">
//       <h4 className="orders-title">Orders &amp; Returns</h4>

//       {selectedFilter === 'Custome' && children}

//       <div className="position-relative" ref={dropdownRef}>
//         <button
//         style={{width:"150px"}}
//           className="btn btn-outline-secondary dropdown-toggle"
//           onClick={() => setIsOpen((prev) => !prev)}
//         >
//           {selectedFilter}
//         </button>

//         {isOpen && (
//           <ul className="dropdown-menu show position-absolute mt-1" style={{ display: 'block' }}>
//             {filters.map((year) => (
//               <li key={year}>
//                 <button
//                   className="dropdown-item"
//                   onClick={() => handleSelect(year)}
//                 >
//                   {year}
//                 </button>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OrderFilterDropdown;

import React, { useState, useRef, useEffect } from "react";

const OrderFilterDropdown = ({
  selectedFilter,
  handleFilterwallete,
  children,
}) => {

  const filters = [
    "Last Three Months",
    "2025",
    "2024",
    "2023",
    "2022",
    "2021",
    "Custome",
  ];

  return (
    <div className="orderfilterdata flex-wrap d-flex align-items-center border-bottom justify-content-md-between justify-content-center gap-3">
      <h4 className="orders-title">Orders &amp; Returns</h4>

      {selectedFilter === "Custome" && children}
      <select style={{ width: "150px" }} className="form-select  " value={selectedFilter} onChange={(e) => handleFilterwallete(e.target.value)}>
        {filters.map((item, index) => {
          return <option key={index} value={item}>{item}</option>
        })}
      </select>
    </div>
  );
};

export default OrderFilterDropdown;
