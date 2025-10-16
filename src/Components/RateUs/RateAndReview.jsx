
import React, { useState } from 'react';
import { IoIosStar } from 'react-icons/io';
import { Link } from 'react-router-dom';
import ApiEncryptDecrypt from '../../Utils/Encryption';
import axiosInstance from '../../Utils/axiosInstance';
import { Key } from '../../Utils/Key';
import { uiAction } from '../../Redux/Slices/uiSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import pdfIcon from "../../assets/Images/pdf.png";
import { wishlistActions } from '../../Redux/Slices/wishlistSlice';
import PreviewImage from '../../ExternalLib/PreviewImage/PreviewImage.jsx';
import { validateFileType1 } from '../../Utils/CheckFileValidation.jsx';
const RateAndReview = ({ show, handleClose, productId, orderId }) => {
  // console.log(show)
  const dispatch = useDispatch();
  const rateNo = [1, 2, 3, 4, 5];
  const [rate, setRate] = useState(0);
  const [form, setForm] = useState({
    title: '',
    email: '',
    name: '',
    age: '',
    gender: '',
    comment: '',
    files: [],
    rating: "",
  });
  const [errors, setErrors] = useState({});
  const validate = () => {
    const err = {};
    if (!form.rating) {
      // toast.warn("Rate First !", {
      //   toastId: "rate",
      //   icon: "warn"
      // })
      err.rating = 'Rating is required !'
    }
    if (!form.title.trim()) err.title = 'Title is required';
    if (!form.email.trim()) err.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) err.email = 'Email is invalid';
    if (!form.name.trim()) err.name = 'Name is required';
    if (!form.age) err.age = 'Age is required';
    if (!form.gender) err.gender = 'Gender is required';
    return err;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    try {
      if (loggedInUser) {
        const formdata = new FormData();
        Array.from(form.files).forEach((file) => formdata.append("files", file));
        const data = {
          OrderId: orderId,
          ProductID: productId,
          ProductRating: form.rating,
          ReviewTitle: form.title,
          Review: form.comment,
          CustomerId: loggedInUser.CustomerId,
          EmailId: form.email,
          CustomerName: form.name,
          CustGender: form.gender,
          CustAge: form.age,
        };
        const encryptedData = await ApiEncryptDecrypt.encryptString(
          Key,
          JSON.stringify(data)
        );
        formdata.append("Body", encryptedData);
        const result = await axiosInstance.post("/ProductReview", formdata, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        const decryptedRes = await ApiEncryptDecrypt.decryptString(Key, result.data.body);
        let obj = JSON.parse(decryptedRes);
        if (obj.Status === 1 && obj.Response === null) {
          toast.error(obj.Message);
        }
        if (obj.Status === 0) {
          dispatch(uiAction.settabs("myOrders"));
          dispatch(wishlistActions.setIsOrderDetail(false));
          toast.success(obj.Message);
        }
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
    handleClose();
  };
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      if (Array.from(files).some((file) => !validateFileType1(file))) return;
    }
    setForm((prev) => ({ ...prev, [name]: files ? files : value }));
  };
  const handleRate = (p) => {
    setRate(p);
    setForm((pre) => ({ ...pre, rating: p }));
  };
  const renderFilePreview = () => {
    if (form.files.length === 0) return null;
    return Array.from(form.files).map((file, index) => (
      <div key={index} style={{ display: 'inline-block', position: 'relative' }}>
        <span
          className="bg-danger px-2 text-white"
          style={{ position: 'absolute', right: '0%', top: '0%', cursor: 'pointer' }}
          onClick={() => handleRemoveReview(index)}
        >
          X
        </span>
        {file.type.startsWith("image/") ? (
          <PreviewImage imgurl={file} />
        ) : [
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "video/mp4",
        ].includes(file.type) ? (
          <a href={URL.createObjectURL(file)} target="_blank" rel="noopener noreferrer">
            <img
              src={pdfIcon}
              alt="PDF preview"
              width="100"
              className="imgPreview"
              style={{
                aspectRatio: "1/1",
                objectFit: "contain",
                background: "#f5f5f5",
                padding: "10px",
                borderRadius: 6,
              }}
            />
          </a>
        ) : (
          <p style={{ fontSize: "12px" }}>Unsupported file</p>
        )}
      </div>
    ));
  };
  const handleRemoveReview = (fileIndex) => {
    const updatedFiles = Array.from(form.files).filter((_, index) => index !== fileIndex);
    setForm((pre) => ({ ...pre, files: updatedFiles }));
  };
  return (
    <div className="modal-dialog modal-lg product-rating">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Product Rating*</h5>
          {/* <button type="button" className="btn-close" onClick={handleClose}></button> */}
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className='mb-3'>
              <div className='rating mb-3'>
                {rateNo.map((no, index) => (
                  <Link key={index} onClick={() => handleRate(no)}><i style={rate > index ? { color: "gold" } : {}}><IoIosStar size={25} /></i></Link>
                ))}
              </div>
              {errors.rating && <div className="text-danger">{errors.rating}</div>}

            </div>

            <div className="mb-3">
              <label className="form-label">Review Title *</label>
              <input className="form-control" name="title" value={form.title} onChange={handleInputChange} />
              {errors.title && <div className="text-danger">{errors.title}</div>}
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Name *</label>
                <input className="form-control" name="name" value={form.name} onChange={handleInputChange} />
                {errors.name && <div className="text-danger">{errors.name}</div>}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Email ID *</label>
                <input className="form-control" name="email" value={form.email} onChange={handleInputChange} />
                {errors.email && <div className="text-danger">{errors.email}</div>}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Gender *</label>
                <div className="d-flex gap-2">
                  {['Male', 'Female'].map((g) => (
                    <button type="button" key={g} className={`btn ${form.gender === g ? 'btn-success' : 'btn-outline-secondary'}`} onClick={() => setForm(prev => ({ ...prev, gender: g }))}>{g}</button>
                  ))}
                </div>
                {errors.gender && <div className="text-danger mt-1">{errors.gender}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Age *</label>
                <select className="form-select" name="age" value={form.age} onChange={handleInputChange}>
                  <option value="">--Select age--</option>
                  <option value="0-17">Under 18</option>
                  <option value="18-24">18 to 24</option>
                  <option value="25-34">25 to 34</option>
                  <option value="35-44">35 to 44</option>
                  <option value="45-54">45 to 54</option>
                  <option value="55-64">55 to 64</option>
                  <option value="65-74">65 to 74</option>
                  <option value="75+">75 and older</option>
                </select>
                {errors.age && <div className="text-danger">{errors.age}</div>}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Comment</label>
              <textarea className="form-control" rows={3} name="comment" value={form.comment} onChange={handleInputChange}></textarea>
              {/* {errors.comment && <div className="text-danger">{errors.comment}</div>} */}
            </div>

            <div className="mb-3">
              <label className="form-label">Choose Files</label>
              <input type="file" className="form-control" name="files" multiple onChange={handleInputChange} />
            </div>

            {renderFilePreview()}

            <button type="submit" className="btn btn-success w-100">SUBMIT</button>
          </form>
        </div>
      </div>
    </div>

  );
};

export default RateAndReview;
