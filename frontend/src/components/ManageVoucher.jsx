import React, { useState, useEffect } from "react";
import { FiTrash2, FiEdit2, FiEye, FiAlertCircle } from "react-icons/fi";
import axios from "axios";
import { authConfig } from "../utils/axiosConfig";
import { formatDateTime } from "../utils/formatter";

const ManageVoucher = () => {
    const [vouchers, setVouchers] = useState([]);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [voucherStats, setVoucherStats] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        code: "",
        discountPercentage: "",
        expirationDate: "",
        quantity: "",
    });
    const [errors, setErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    const fetchVouchers = async () => {
        try {
            const response = await axios.get("https://domstore.azurewebsites.net/api/v1/vouchers", authConfig);
            const data = response.data;

            setVouchers(data.data.vouchers);
            console.log("vouchers", data.data.vouchers);
        } catch (error) {
            console.error("Error fetching vouchers:", error);
        }
    };

    useEffect(() => {
        fetchVouchers();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.code) newErrors.code = "Code is required";
        if (!formData.discountPercentage) newErrors.discountPercentage = "Discount percentage is required";
        if (!formData.expirationDate) newErrors.expirationDate = "Expiration date is required";
        if (!formData.quantity) newErrors.quantity = "Quantity is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            if (isEditing) {
                await axios.put(
                    `https://domstore.azurewebsites.net/api/v1/vouchers/${selectedVoucher.id}`,
                    formData,
                    authConfig
                );
            } else {
                await axios.post("https://domstore.azurewebsites.net/api/v1/vouchers", formData, authConfig);
            }
            fetchVouchers();
            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            console.error("Error saving voucher:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://domstore.azurewebsites.net/api/v1/vouchers/${id}`, authConfig);
            fetchVouchers();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error("Error deleting voucher:", error);
        }
    };

    const handleViewDetails = async (voucher) => {
        try {
            const [detailsResponse, statsResponse] = await Promise.all([
                axios.get(`https://domstore.azurewebsites.net/api/v1/vouchers/${voucher._id}`, authConfig),
                axios.get(`https://domstore.azurewebsites.net/api/v1/vouchers/${voucher._id}/stats`, authConfig),
            ]);
            setSelectedVoucher(detailsResponse.data);
            setVoucherStats(statsResponse.data);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching voucher details:", error);
        }
    };

    const handleEdit = (voucher) => {
        setIsEditing(true);
        setSelectedVoucher(voucher);
        setFormData({
            code: voucher.code,
            discountPercentage: voucher.discountPercentage,
            expirationDate: voucher.expirationDate,
            quantity: voucher.quantity,
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            code: "",
            discountPercentage: "",
            expirationDate: "",
            quantity: "",
        });
        setIsEditing(false);
        setSelectedVoucher(null);
        setErrors({});
    };

    const deactivateExpiredVouchers = async () => {
        try {
            await axios.post("https://domstore.azurewebsites.net/api/v1/vouchers/deactivate_expired", authConfig);
            fetchVouchers();
            alert("Expired vouchers have been deactivated successfully");
        } catch (error) {
            console.error("Error deactivating expired vouchers:", error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Quản lý Voucher</h1>
                <div className="space-x-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Tạo Voucher
                    </button>
                    <button
                        onClick={deactivateExpiredVouchers}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                        Vô hiệu hóa voucher hết hạn
                    </button>
                </div>
            </div>

            {/* Voucher List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Code
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Phần trăm giảm
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hạn sử dụng
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Số lượng
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {vouchers &&
                            vouchers.map((voucher) => (
                                <tr key={voucher._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{voucher.code}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{voucher.discountPercent}%</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {formatDateTime(voucher.expirationDate)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{voucher.quantity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap space-x-4">
                                        <button
                                            onClick={() => handleViewDetails(voucher)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <FiEye className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(voucher)}
                                            className="text-green-600 hover:text-green-900"
                                        >
                                            <FiEdit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedVoucher(voucher);
                                                setIsDeleteModalOpen(true);
                                            }}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <FiTrash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* Voucher Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{isEditing ? "Sửa voucher" : "Tạo voucher"}</h2>
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    resetForm();
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Code</label>
                                    <input
                                        type="text"
                                        name="code"
                                        value={formData.code}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Phần trăm giảm giá
                                    </label>
                                    <input
                                        type="number"
                                        name="discountPercentage"
                                        value={formData.discountPercentage}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.discountPercentage && (
                                        <p className="text-red-500 text-sm mt-1">{errors.discountPercentage}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Hạn sử dụng</label>
                                    <input
                                        type="date"
                                        name="expirationDate"
                                        value={formData.expirationDate}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.expirationDate && (
                                        <p className="text-red-500 text-sm mt-1">{errors.expirationDate}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Số lượng</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    {isEditing ? "Cập nhật" : "Tạo"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                <FiAlertCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">Xóa voucher</h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500">Bạn có chắc muốn xóa voucher này không?</p>
                            </div>
                            <div className="flex justify-center mt-4 space-x-4">
                                <button
                                    onClick={() => handleDelete(selectedVoucher._id)}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                                >
                                    Xóa
                                </button>
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                                >
                                    Hủy bỏ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageVoucher;
