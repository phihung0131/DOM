import React, { useState, useEffect } from "react";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import axios from "axios";
import { formatPrice } from "../utils/formatter";

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        status: "",
        search: "",
        startDate: "",
        endDate: "",
        minTotal: "",
        maxTotal: "",
    });

    // Updated authentication config
    const getAuthConfig = () => {
        const authToken = localStorage.getItem("authToken");
        return {
            headers: {
                "Content-Type": "application/json",
                Authorization: authToken ? `Bearer ${authToken}` : "",
            },
            validateStatus: (status) => status < 500,
        };
    };

    useEffect(() => {
        const authToken = localStorage.getItem("authToken");
        if (authToken) {
            setIsAuthenticated(true);
        }
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);

            const authConfig = getAuthConfig();
            if (!authConfig.headers.Authorization) {
                setIsAuthenticated(false);
                toast.error("Please login to continue");
                setError("Authentication required");
                return;
            }

            const queryParams = new URLSearchParams({
                page: filters.page,
                limit: filters.limit,
                ...(filters.status && { status: filters.status }),
                ...(filters.search && { search: filters.search }),
                ...(filters.startDate && { startDate: filters.startDate }),
                ...(filters.endDate && { endDate: filters.endDate }),
                ...(filters.minTotal && { minTotal: filters.minTotal }),
                ...(filters.maxTotal && { maxTotal: filters.maxTotal }),
            }).toString();

            const response = await axios.get(`https://domstore.azurewebsites.net/api/v1/admin/orders?${queryParams}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });
            if (response.status === 401) {
                setIsAuthenticated(false);
                localStorage.removeItem("authToken");
                toast.error("Session expired. Please login again.");
                setError("Session expired");
                return;
            }

            // Ensure orders is always an array
            //   console.log(response.data);
            const data = response.data;
            const ordersData = data.data.orders || [];
            //   console.log(ordersData);

            setOrders(ordersData);
            setIsAuthenticated(true);
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
            // Set empty array in case of error
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const authConfig = getAuthConfig();
            if (!authConfig.headers.Authorization) {
                setIsAuthenticated(false);
                toast.error("Please login to continue");
                return;
            }

            const response = await axios.put(
                `https://domstore.azurewebsites.net/api/v1/admin/orders/${orderId}`,
                { status: newStatus },
                authConfig
            );

            if (response.status === 401) {
                setIsAuthenticated(false);
                localStorage.removeItem("authToken");
                toast.error("Session expired. Please login again.");
                return;
            }

            toast.success("Order status updated successfully");
            fetchOrders();
        } catch (err) {
            toast.error(err.message);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        }
    }, [filters, isAuthenticated]);

    const handleSearch = (e) => {
        setFilters((prev) => ({ ...prev, search: e.target.value }));
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handlePageChange = (newPage) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    };

    // Error Boundary Component
    const ErrorFallback = ({ error, resetErrorBoundary }) => (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
                <p className="text-gray-600 mb-4">{error.message}</p>
                <button
                    onClick={resetErrorBoundary}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                >
                    Try again
                </button>
            </div>
        </div>
    );

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <p className="text-red-600 text-lg">Please login to access this page</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-6">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Filters Section */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm đơn hàng..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={filters.search}
                            onChange={handleSearch}
                        />
                        <FiSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>

                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">Tất cả</option>
                        <option value="Success">Giao thành công</option>
                        <option value="Failure">Thất bại</option>
                        <option value="Delivering">Đang vận chuyển</option>
                        <option value="Order successful">Đặt thành công</option>
                        <option value="Preparing goods">Đang chuẩn bị hàng</option>
                        <option value="Waiting for payment">Chờ thanh toán</option>
                    </select>

                    <input
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    <input
                        type="date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                    {error}
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                /* Orders Table */
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Mã đơn hàng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ngày đặt
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Khách hàng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tổng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders && orders.length > 0 ? (
                                    orders.map((order) => (
                                        <tr key={order._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{order._id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {format(new Date(order.createdAt), "dd/MM/yyyy")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">{order.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{formatPrice(order.totalPrice)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                              order.status === "Success"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "Delivering" ||
                                    order.status === "Waiting for payment" ||
                                    order.status === "Preparing goods"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : order.status === "Failure"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                          }
                        `}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                    className="text-sm border rounded p-1"
                                                    value={order.status}
                                                >
                                                    <option value="Delivering">Đang giao hàng</option>
                                                    <option value="Preparing goods">Đang chuẩn bị hàng</option>
                                                    <option value="Order successful">Đặt thành công</option>
                                                    <option value="Success">Giao thành công</option>
                                                    <option value="Waiting for payment">Chờ thanh toán</option>
                                                    <option value="Failure">Thất bại</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                            No orders found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pagination */}
            <div className="mt-6 flex justify-between items-center">
                <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    className="flex items-center px-4 py-2 border rounded-md bg-white disabled:opacity-50"
                >
                    <FiChevronLeft className="mr-2" />
                    Trước
                </button>

                <span className="text-gray-600">Trang {filters.page}</span>

                <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={!Array.isArray(orders) || orders.length < filters.limit}
                    className="flex items-center px-4 py-2 border rounded-md bg-white disabled:opacity-50"
                >
                    Tiếp
                    <FiChevronRight className="ml-2" />
                </button>
            </div>
        </div>
    );
};

export default OrderManagement;
