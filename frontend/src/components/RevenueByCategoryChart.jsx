import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RevenueByCategoryChart = ({ selectedDate }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (selectedDate) {
            fetchData(selectedDate);
        }
    }, [selectedDate]);

    const fetchData = async (date) => {
        setLoading(true);
        setErrorMessage("");

        try {
            const response = await axios.get(
                `https://domstore.azurewebsites.net/api/v1/reports/revenue-by-category/${date}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                },
            );

            if (response.data.status === "success") {
                setData(response.data.data.revenueByCategory);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            const message = "Lỗi khi lấy dữ liệu báo cáo: " + error.message;
            setErrorMessage(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Báo cáo doanh thu theo danh mục</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                            dataKey="totalRevenue"
                            name="Doanh thu"
                            fill="#8884d8"
                        />
                    </BarChart>
                </ResponsiveContainer>
            )}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <ToastContainer />
        </div>
    );
};

export default RevenueByCategoryChart;
