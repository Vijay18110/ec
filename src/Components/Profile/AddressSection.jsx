import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import useApiRequest from "../../Hooks/apiReq";

const AddressSection = () => {
    const [addresses, setAddresses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [formData, setFormData] = useState({
        address: "",
        type: "",
        pinCode: "",
        state: "",
        country: "",
        isDefault: true,
    });

    const { sendApiRequest, loading } = useApiRequest();

    // 🔹 Fetch user addresses
    const getAddresses = () => {
        sendApiRequest("GET", "/getAddresses", null, {
            onSuccess: (res) => setAddresses(res || []),
        });
    };

    // 🔹 Reset form fields
    const resetForm = () => {
        setFormData({
            address: "",
            type: "",
            pinCode: "",
            state: "",
            country: "",
            isDefault: true,
        });
    };

    // 🔹 Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        const url = editingAddress ? "/updateAddress" : "/addAddress";
        const payload = editingAddress ? { ...formData, id: editingAddress._id } : formData;

        sendApiRequest("POST", url, payload, {
            onSuccess: (res) => {
                toast.success(res?.message || "Address saved successfully!");
                getAddresses();
                setShowModal(false);
                setEditingAddress(null);
                resetForm();
            },
        });
    };

    // 🔹 Open modal for new or edit
    const handleEdit = (addr) => {
        setEditingAddress(addr);
        setFormData({
            address: addr.address,
            type: addr.type,
            pinCode: addr.pinCode,
            state: addr.state,
            country: addr.country,
            isDefault: addr.isDefault,
        });
        setShowModal(true);
    };

    const handleAddNew = () => {
        resetForm();
        setEditingAddress(null);
        setShowModal(true);
    };

    useEffect(() => {
        getAddresses();
    }, []);

    const handleDelete = (id) => {
        sendApiRequest("POST", "/deleteAddress", { id: id }, {
            onSuccess: (res) => {
                toast.success(res?.message || "Address Deleted successfully!");
                getAddresses();
            }
        })
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
        >
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold text-dark mb-0">
                    <i className="bi bi-geo-alt-fill text-primary me-2"></i>Saved Addresses
                </h4>
                <button
                    className="btn btn-primary rounded-pill px-3 shadow-sm"
                    onClick={handleAddNew}
                >
                    <i className="bi bi-plus-circle me-1"></i> Add Address
                </button>
            </div>

            {/* Address List */}
            <div className="row">
                {addresses.length === 0 ? (
                    <p className="text-muted text-center mt-3">No addresses found.</p>
                ) : (
                    addresses.map((addr) => (
                        <motion.div
                            key={addr._id}
                            layout
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="col-md-6 mb-4"
                        >
                            <div
                                className={`border rounded-4 p-3 shadow-sm bg-white position-relative h-100 ${addr.isDefault ? "border-primary border-2" : ""
                                    }`}
                            >
                                {addr.isDefault && (
                                    <span
                                        className="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-success px-3 py-2"
                                        style={{ fontSize: "0.7rem" }}
                                    >
                                        Default
                                    </span>
                                )}
                                <p className="fw-semibold mb-1 text-capitalize">{addr.address}</p>
                                <p className="text-muted small mb-1">
                                    {addr.state}, {addr.country} - {addr.pinCode}
                                </p>
                                <span className="badge bg-light text-dark border small">
                                    {addr.type}
                                </span>
                                <div className="d-flex  justify-content-between mt-3">
                                    <button
                                        className="btn btn-outline-primary btn-sm rounded-pill px-3"
                                        onClick={() => handleEdit(addr)}
                                    >
                                        <i className="bi bi-pencil me-1"></i>Edit
                                    </button>
                                    <button
                                        className="btn btn-outline-primary btn-sm rounded-pill px-3"
                                        onClick={() => handleDelete(addr._id)}
                                    >
                                        <i className="bi bi-delete me-1"></i>Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* 🔹 Add / Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <Modal
                        show={showModal}
                        onHide={() => setShowModal(false)}
                        centered
                        backdrop="static"
                        size="md"
                        className="modern-modal"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title className="fw-semibold text-dark">
                                {editingAddress ? "Update Address" : "Add New Address"}
                            </Modal.Title>
                        </Modal.Header>
                        <form onSubmit={handleSubmit}>
                            <Modal.Body>
                                <div className="mb-3">
                                    <label className="form-label fw-medium">Address</label>
                                    <textarea
                                        className="form-control rounded-3"
                                        rows={2}
                                        value={formData.address}
                                        onChange={(e) =>
                                            setFormData({ ...formData, address: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-medium">Type</label>
                                    <select
                                        className="form-select rounded-3"
                                        value={formData.type}
                                        onChange={(e) =>
                                            setFormData({ ...formData, type: e.target.value })
                                        }
                                        required
                                    >
                                        <option value="">Select Type</option>
                                        <option value="Home">Home</option>
                                        <option value="Office">Office</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-medium">State</label>
                                        <input
                                            type="text"
                                            className="form-control rounded-3"
                                            value={formData.state}
                                            onChange={(e) =>
                                                setFormData({ ...formData, state: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-medium">Country</label>
                                        <input
                                            type="text"
                                            className="form-control rounded-3"
                                            value={formData.country}
                                            onChange={(e) =>
                                                setFormData({ ...formData, country: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-medium">Pin Code</label>
                                    <input
                                        type="text"
                                        className="form-control rounded-3"
                                        value={formData.pinCode}
                                        onChange={(e) =>
                                            setFormData({ ...formData, pinCode: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="defaultSwitch"
                                        checked={formData.isDefault}
                                        onChange={(e) =>
                                            setFormData({ ...formData, isDefault: e.target.checked })
                                        }
                                    />
                                    <label
                                        className="form-check-label fw-medium"
                                        htmlFor="defaultSwitch"
                                    >
                                        Set as default
                                    </label>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary rounded-pill px-4"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary rounded-pill px-4"
                                    disabled={loading}
                                >
                                    {editingAddress ? "Update" : "Save"}
                                </button>
                            </Modal.Footer>
                        </form>
                    </Modal>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default AddressSection;
