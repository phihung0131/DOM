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

const PromotionEffectivenessChart = ({ selectedDate }) => {
    const [data, setData] = useState([]);
    const [detailData, setDetailData] = useState([]);
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
                `https://domstore.azurewebsites.net/api/v1/reports/promotion-effectiveness/${date}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                },
            );

            if (response.data.status === "success") {
                const apiData = response.data.data;
                setData([
                    {
                        name: "Tổng số KM",
                        value: apiData["Tong So Khuyen Mai "],
                    },
                    {
                        name: "Số KM được sử dụng",
                        value: apiData["So Khuyen mai duoc su dung"],
                    },
                    {
                        name: "Sản phẩm bán được có KM",
                        value: apiData["So san pham da ban duoc co khuyen mai"],
                    },
                ]);
                setDetailData(apiData["Chi tiet"]);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            const message =
                "Lỗi khi lấy dữ liệu hiệu quả khuyến mãi: " + error.message;
            setErrorMessage(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Hiệu quả chương trình khuyến mãi</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                    <div style={{ marginTop: "20px" }}>
                        <h3>Chi tiết chương trình khuyến mãi</h3>
                        <ul style={{ listStyleType: "none", padding: 0 }}>
                            {detailData.map((item, index) => (
                                <li
                                    key={index}
                                    style={{
                                        marginBottom: "10px",
                                        padding: "10px",
                                        border: "1px solid #ddd",
                                        borderRadius: "5px",
                                        backgroundColor: item.DuocSuDung
                                            ? "#e0f7fa"
                                            : "#ffebee",
                                    }}
                                >
                                    <strong>{item.name}</strong> -{" "}
                                    {item.DuocSuDung
                                        ? "Đã sử dụng"
                                        : "Chưa sử dụng"}
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <ToastContainer />
        </div>
    );
};

export default PromotionEffectivenessChart;
