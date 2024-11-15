import { useState } from "react";
import BusinessOverview from "./BusinessOverview";
import RevenueByCategoryChart from "./RevenueByCategoryChart";
import RevenueReportTable from "./RevenueReportTable";
import PromotionEffectivenessChart from "./PromotionEffectivenessChart";
import OrderSummaryOverview from "./OrderSummaryOverview";
import { DatePicker } from "antd";

const ReportsScreen = () => {
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
        const formattedDate = date ? date.format("YYYY-MM-DD") : null;
        setSelectedDate(formattedDate);
    };

    return (
        <div>
            <h1>Báo cáo theo ngày</h1>
            <DatePicker onChange={handleDateChange} />
            <BusinessOverview selectedDate={selectedDate} />
            <RevenueByCategoryChart selectedDate={selectedDate} />
            <PromotionEffectivenessChart selectedDate={selectedDate} />
            <RevenueReportTable selectedDate={selectedDate} />
            <OrderSummaryOverview />
        </div>
    );
};

export default ReportsScreen;
