interface FeedbackTrend {
    app_name: string;
    user_role: string;
    feedback_date: string;
    feedback_count: number;
}
interface TrendsChartProps {
    initialData: FeedbackTrend[];
    userRole?: string;
}
export default function TrendsChart({ initialData, userRole }: TrendsChartProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=TrendsChart.d.ts.map