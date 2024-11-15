import { useEffect, useState } from "react";
import axios from "axios";
import {
    FaShoppingCart,
    FaChartLine,
    FaExclamationTriangle,
} from "react-icons/fa";
import { toast } from "react-toastify";

const OrderSummaryOverview = () => {
    const [orderSummary, setOrderSummary] = useState({
        totalOrders: 0,
        overallAverageValue: 0,
        failureCount: 0,
        failureAverageValue: 0,
        orderSuccessCount: 0,
        orderSuccessAverageValue: 0,
        successCount: 0,
        successAverageValue: 0,
    });

    const fetchOrderSummary = async () => {
        try {
            const response = await axios.get(
                "https://domstore.azurewebsites.net/api/v1/reports/orders/summary",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                },
            );

            if (response.data.status === "success") {
                const data = response.data.data.ordersSumary;
                const failureData = data.statusBreakdown.find(
                    (item) => item._id === "Failure",
                );
                const orderSuccessData = data.statusBreakdown.find(
                    (item) => item._id === "Order successful",
                );
                const successData = data.statusBreakdown.find(
                    (item) => item._id === "Success",
                );

                setOrderSummary({
                    totalOrders: data.totalOrders,
                    overallAverageValue: data.overallAverageValue,
                    failureCount: failureData ? failureData.count : 0,
                    failureAverageValue: failureData
                        ? failureData.averageValue
                        : 0,
                    orderSuccessCount: orderSuccessData
                        ? orderSuccessData.count
                        : 0,
                    orderSuccessAverageValue: orderSuccessData
                        ? orderSuccessData.averageValue
                        : 0,
                    successCount: successData ? successData.count : 0,
                    successAverageValue: successData
                        ? successData.averageValue
                        : 0,
                });
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error("Chi tiết lỗi:", error);
            toast.error(
                "Lỗi khi lấy dữ liệu tổng hợp đơn hàng: " + error.message,
            );
        }
    };

    useEffect(() => {
        fetchOrderSummary();
    }, []);

    return (
        <header className="flex gap-10 flex-wrap">
            <div className="flex flex-1 min-w-fit justify-between items-center p-4 bg-white rounded-xl font-semibold shadow">
                <div>
                    <p>Tổng số đơn hàng</p>
                    <p className="text-lg">{orderSummary.totalOrders}</p>
                </div>
                <div className="w-14 object-cover">
                    <FaShoppingCart size={30} />
                </div>
            </div>

            <div className="flex flex-1 min-w-fit justify-between items-center p-4 bg-white rounded-xl font-semibold shadow">
                <div>
                    <p>Giá trị đơn trung bình</p>
                    <p className="text-lg">
                        {orderSummary.overallAverageValue.toLocaleString()} VNĐ
                    </p>
                </div>
                <div className="w-14 object-cover">
                    <FaChartLine size={30} />
                </div>
            </div>

            <div className="flex flex-1 min-w-fit justify-between items-center p-4 bg-white rounded-xl font-semibold shadow">
                <div>
                    <p>Đơn hàng thất bại</p>
                    <p className="text-lg">{orderSummary.failureCount}</p>
                    <p className="text-sm">
                        Giá trị TB:{" "}
                        {orderSummary.failureAverageValue.toLocaleString()} VNĐ
                    </p>
                </div>
                <div className="w-14 object-cover">
                    <FaExclamationTriangle size={30} />
                </div>
            </div>

            <div className="flex flex-1 min-w-fit justify-between items-center p-4 bg-white rounded-xl font-semibold shadow">
                <div>
                    <p>Đặt hàng thành công</p>
                    <p className="text-lg">{orderSummary.orderSuccessCount}</p>
                    <p className="text-sm">
                        Giá trị TB:{" "}
                        {orderSummary.orderSuccessAverageValue.toLocaleString()}{" "}
                        VNĐ
                    </p>
                </div>
                <div className="w-14 object-cover">
                    <FaChartLine size={30} />
                </div>
            </div>

            <div className="flex flex-1 min-w-fit justify-between items-center p-4 bg-white rounded-xl font-semibold shadow">
                <div>
                    <p>Giao hàng thành công</p>
                    <p className="text-lg">{orderSummary.successCount}</p>
                    <p className="text-sm">
                        Giá trị TB:{" "}
                        {orderSummary.successAverageValue.toLocaleString()} VNĐ
                    </p>
                </div>
                <div className="w-14 object-cover">
                    <FaChartLine size={30} />
                </div>
            </div>
        </header>
    );
};

export default OrderSummaryOverview;
