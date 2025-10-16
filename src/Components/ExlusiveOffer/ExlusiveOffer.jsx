import React from "react";
import ExclusiveOffersCard from "../../Shared/ExclusiveOffers/ExclusiveOffersCard";
import SectionTitle from "../SectionTitle/SectionTitle";

const ExlusiveOffer = () => {
  return (
    <>
      <div className="container">
        <SectionTitle title=" Exclusive Offers" />
        <div className="row-cols-md-2 row-cols-1 row-cols-lg-3 row-cols-xxl-4">
          <ExclusiveOffersCard />
          <ExclusiveOffersCard />
          <ExclusiveOffersCard />
        </div>
      </div>
    </>
  );
};

export default ExlusiveOffer;
