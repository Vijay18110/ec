import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./MainPortal.module.css";
import CloseButton from "../../Widgets/Close/CloseBTN";
const OverLay = ({ children, handleCloseModal }) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div onClick={handleCloseModal} className={styles.overLay}>
      {children}
    </div>
  );
};
const Modal = ({ children, handleCloseModal, classs }) => {
  return (
    <>
      <div className={classs ? styles.classs : styles.modal}>
        {!classs && (
          <div className={styles.CloseButtonCont}>
            <CloseButton handleCloseModal={handleCloseModal} />
          </div>
        )}
        {children}
      </div>
    </>
  );
};
const MainPortal = ({ children, handleCloseModal, classs }) => {
  return (
    <>
      {createPortal(
        <OverLay handleCloseModal={handleCloseModal} />,
        document.getElementById("modal")
      )}
      {createPortal(
        <Modal classs={classs} handleCloseModal={handleCloseModal}>
          {children}
        </Modal>,
        document.getElementById("modal")
      )}
    </>
  );
};
export default MainPortal;
