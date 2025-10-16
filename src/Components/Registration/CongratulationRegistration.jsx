// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./Congratulations.css"; // optional for extra styling
// import img from '../../assets/Images/logo.png'
// import { uiAction } from "../../Redux/Slices/uiSlice";
// import { useDispatch } from "react-redux";
// const RegisterCongratulations = ({ strCode, password }) => {
//   const navigate = useNavigate();
//   const { search } = useLocation();
//   const urldata = new URLSearchParams(search);
//   const pass = atob(urldata.get("pass"));
//   const str = atob(urldata.get("str"));
//   const dispatch = useDispatch()
//   return (
//     <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
//       <div className="congrats-card bg-white shadow p-4 rounded-4 text-center">
//         <img
//           src={img}
//           alt="Congratulations"
//           className="congrats-img mx-auto mb-3"
//         />
//         <h2 className="text-success fw-bold">🎉 Congratulations!</h2>
//         <p className="text-muted">
//           You have successfully registered with <strong>RAVOrganics</strong>.
//         </p>

//         <div className="code-box border border-success bg-success-subtle rounded-3 p-3 my-3 text-start">
//           <p className="mb-2 text-success-emphasis">
//             <strong>Store Code:</strong> {str}
//           </p>
//           <p className="mb-0 text-success-emphasis">
//             <strong>Password:</strong> {pass}
//           </p>
//         </div>

//         <div className="d-grid gap-2 mt-3">

//           <button className="btn btn-outline-success" onClick={() => navigate("/home")}>
//             Go to Home
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default RegisterCongratulations;
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Congratulations.css"; // optional for extra styling
import img from '../../assets/Images/logo.png'
import { useDispatch } from "react-redux";
const RegisterCongratulations = ({ strCode, password }) => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const urldata = new URLSearchParams(search);
  const pass = atob(urldata.get("pass"));
  const str = atob(urldata.get("str"));
  const dispatch = useDispatch()
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="congrats-card bg-white shadow p-4 rounded-4 text-center">
        <img
          src={img}
          alt="Congratulations"
          className="congrats-img mx-auto mb-3"
        />
        <h2 className="text-success fw-bold">🎉 Congratulations!</h2>
        <p className="text-muted">
          You have successfully registered with <strong>RAVOrganics</strong>.
        </p>

        <div className="code-box border border-success bg-success-subtle rounded-3 p-3 my-3 text-start">
          <p className="mb-2 text-success-emphasis">
            <strong>Customer Code:</strong> {str}
          </p>
          <p className="mb-0 text-success-emphasis">
            <strong>Password:</strong> {pass}
          </p>
        </div>

        <div className="d-grid gap-2 mt-3">

          <button className="btn btn-outline-success" onClick={() => navigate("/home")}>
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterCongratulations;
