import React from "react";
import styles from './IntroCard.module.css'
const IntroCard = ({ img }) => {
  return (
    <>
      <div className="col-lg-6">
        <div className={styles.class_word_box}>
          <img loading="lazy" src={img} alt="word mouth" />
          <div className={styles.class_word_text}>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
            <strong>Shivkaran Singh</strong>
          </div>
        </div>
      </div>
    </>
  );
};

export default IntroCard;
