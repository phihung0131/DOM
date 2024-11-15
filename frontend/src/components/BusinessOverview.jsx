import { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaDollarSign, FaFileAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const BusinessOverview = ({ selectedDate }) => {
    const [businessData, setBusinessData] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalCustomers: 0,
    });

    const fetchBusinessOverview = async (date) => {
        try {
            const response = await axios.get(
                `https://domstore.azurewebsites.net/api/v1/reports/business-overview/${date}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                },
            );

            if (response.data.status === "success") {
                setBusinessData(response.data.data);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            toast.error(
                "Lỗi khi lấy dữ liệu tổng quan kinh doanh: " + error.message,
            );
        }
    };

    useEffect(() => {
        if (selectedDate) {
            fetchBusinessOverview(selectedDate);
        }
    }, [selectedDate]);

    return (
        <header className="flex gap-10 flex-wrap">
            <div className="flex flex-1 min-w-fit justify-between items-center p-4 bg-white rounded-xl font-semibold shadow">
                <div>
                    <p>Tổng số người dùng</p>
                    <p className="text-lg">{businessData.totalCustomers}</p>
                </div>
                <div className="w-14 object-cover">
                    <FaUser size={30} />
                </div>
            </div>

            <div className="flex flex-1 min-w-fit justify-between items-center p-4 bg-white rounded-xl font-semibold shadow">
                <div>
                    <p>Tổng doanh thu</p>
                    <p className="text-lg">{businessData.totalRevenue} VNĐ</p>
                </div>
                <div className="w-14 object-cover">
                    <FaDollarSign size={30} />
                </div>
            </div>

            <div className="flex flex-1 min-w-fit justify-between items-center p-4 bg-white rounded-xl font-semibold shadow">
                <div>
                    <p>Tổng số đơn hàng</p>
                    <p className="text-lg">{businessData.totalOrders}</p>
                </div>
                <div className="w-14 object-cover">
                    <FaFileAlt size={30} />
                </div>
            </div>
        </header>
    );
};

export default BusinessOverview;
