import React from "react";
import Logo from "../../assets/Images/logo.png";
import Payment1 from "../../assets/Images/cart-2.png";
import Payment2 from "../../assets/Images/cart-3.png";
import Payment3 from "../../assets/Images/cart-5.png";
import { Link, useNavigate } from "react-router-dom";
import { setScrollTarget } from "../../Redux/Slices/scrollSlice";
import "./Footermodule.css";
import { uiAction } from "../../Redux/Slices/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaXTwitter } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import { categoriesName } from "../../StaticData/CategoriesName";
import Container from "../../Container/Container";

const Footer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSupport = () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      dispatch(uiAction.openModal());
    } else {
      navigate("/support");
    }
  };
  const handleNavigate = (path) => {
    navigate(path)
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }
  const handleFooterClick = (item) => {
    dispatch(setScrollTarget(item));
    navigate("/home"); // or the route where your section refs live
  };
  const zoompic = useSelector(state => state.chatreducer.zoompic)
  return (
    <Container>
      <div className="footer-dark">
        <div className="footer-top">
          <div className="container">
            <div className="footer-widget-warp">
              <div className="row d-flex justify-content-center">
                <div className="col-lg-6">
                  <div className="axil-footer-widget footer-widget-newsletter">
                    <div className="logo-footer">
                      <div className="logo-footer">
                        <Link>
                          <img loading="lazy" src={Logo} alt="Rav Download" />
                        </Link>
                      </div>
                    </div>
                    <strong>An E-Commerce venture of RAV Group.</strong>
                    <div className="footer-address">
                      <p>
                        C-83, RAV House, Vibhuti Khand, Gomti Nagar, Lucknow
                        (U.P.) India – 226010
                      </p>

                      <p>
                        <a href="tel:+91-92 0544 0544">+91-92 0544 0544</a>
                      </p>

                      <p>
                        <a href="mailto:care@ravorganics.com">
                          care@ravdownload.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>


                {/* Explore Links */}
                <div className="col-xl-3 axil-footer-widget widget-flex  col-lg-2 col-md-6">
                  <h5 className="widget-title text-start">Quick links</h5>
                  <div className="row d-flex newssection ">
                    <div className="col-lg-12">
                      <ul className="news">
                        <li>

                          <span onClick={() => handleNavigate("/about-us")}> <Link> About Us    </Link></span>

                        </li>
                        <li>
                          <span onClick={() => handleNavigate("/support")} > <Link>Support</Link></span>
                        </li>
                        <li>
                          <span onClick={() => handleNavigate("/Privacy-Policy")}  ><Link>Privacy Policy</Link></span>
                        </li>
                        <li>
                          <span onClick={() => handleNavigate("/term-conditions")}  ><Link>Terms & Conditions</Link></span>
                        </li>
                        <li>
                          <span onClick={() => handleNavigate("/Return-Policy")}  ><Link>Return Policy</Link></span>
                        </li>
                        <li>
                          <span onClick={() => handleNavigate("/Shipping-Policy")}  ><Link>Shipping Policy</Link></span>
                        </li>
                        <li>
                          <span onClick={() => handleNavigate("/Contact")}  ><Link>Contact Us</Link></span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 axil-footer-widget widget-flex  col-lg-2 col-md-6">
                  <h5 className="widget-title text-start">Categories</h5>
                  <div className="row d-flex newssection ">
                    <div className="col-lg-12">
                      <ul className="news">
                        {categoriesName?.map((item, index) => (<li key={index} onClick={() => handleFooterClick(item)}>
                          <Link>{item}</Link>
                        </li>))}
                        {/* <li onClick={() => dispatch(setScrollTarget("category"))}>
                          <Link>Personal Care</Link>
                        </li>
                        <li onClick={() => dispatch(setScrollTarget("category"))}>
                          <Link  >Organic Kitchen</Link>
                        </li>
                        <li onClick={() => dispatch(setScrollTarget("exclusive"))}>
                          <Link  >RAV Exclusive</Link>
                        </li>
                        <li onClick={() => dispatch(setScrollTarget("deities"))}>
                          <Link rel="noopener noreferrer">
                            Divine Home
                          </Link>
                        </li>
                        <li onClick={() => dispatch(setScrollTarget("health"))}>
                          <Link rel="noopener noreferrer">
                            Health Care
                          </Link>
                        </li>
                        <li onClick={() => dispatch(setScrollTarget("sundara"))}>
                          <Link rel="noopener noreferrer">
                            Unceasing Fashion
                          </Link>
                        </li> */}
                      </ul>
                    </div>
                  </div>
                </div>



              </div>
            </div>
          </div>
          <div className="footer-middle">
            <div className="container">
              <div className="row">
                <div className="col-lg-6">
                  <div className="payment-method">
                    <h6 className="title">Accept For</h6>
                    <ul className="payment-icons">
                      <li><img loading="lazy" src={Payment1} alt="Payment" /></li>
                      <li><img loading="lazy" src={Payment2} alt="Payment" /></li>
                      <li><img loading="lazy" src={Payment3} alt="Payment" /></li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="payment-method footer-social-link">
                    <h6 className="title">Social Network</h6>
                    <ul className="social-link">
                      <li>
                        <a
                          href="https://www.facebook.com/ravdownload"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fa-brands fa-facebook-f"></i>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://twitter.com/ravdownload"
                          target="_blank"
                        >
                          <i>
                            <FaXTwitter />
                          </i>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.instagram.com/rav_organics/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fa-brands fa-instagram"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="copyright-area copyright-default">
          <div className="container">
            <div className="copyright-left d-flex flex-wrap justify-content-center">
              <ul className="quick-link">
                <li>&copy; Copyright 2025 - RAV Organics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="DetailsPopup"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-end">
              <i style={{ cursor: "pointer" }} data-bs-dismiss="modal"><RxCross1 /></i>
            </div>
            <div className="modal-body">
              <div className="wrap-modal-slider w-100">
                <div className="product-slider">
                  <img loading="lazy" src={zoompic} style={{ width: "100%" }} alt="RAV organics" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </    Container>
    
  );
};

export default Footer;
