import { useEffect, useState } from "react";
import { Table, Typography, Spin, message } from "antd";
import axios from "axios";

const RevenueReportTable = ({ selectedDate }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);

    useEffect(() => {
        if (selectedDate) {
            fetchRevenueData(selectedDate);
        }
    }, [selectedDate]);

    const fetchRevenueData = async (date) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `https://domstore.azurewebsites.net/api/v1/reports/revenue/${date}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                },
            );

            if (response.data.status === "success") {
                const apiData = response.data.data.revenue;
                setData(apiData.orders);
                setTotalRevenue(apiData.totalRevenue);
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            message.error(`Lỗi khi lấy dữ liệu doanh thu: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: "Mã Đơn hàng",
            dataIndex: "_id",
            key: "_id",
        },
        {
            title: "ID Khách hàng",
            dataIndex: "customerId",
            key: "customerId",
        },
        {
            title: "Khách hàng",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Địa chỉ",
            dataIndex: "address",
            key: "address",
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (totalPrice) => `${totalPrice.toLocaleString()} VND`,
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (createdAt) => new Date(createdAt).toLocaleString(),
        },
    ];

    return (
        <div>
            <Typography.Title level={3}>
                Báo cáo Doanh thu Ngày
            </Typography.Title>
            {loading ? (
                <Spin tip="Đang tải dữ liệu..." />
            ) : (
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                />
            )}
        </div>
    );
};

export default RevenueReportTable;
