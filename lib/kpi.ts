import { KPI } from "@/types";

export const kpiAPI = {
  getKPIs: async (): Promise<KPI[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [
      { arpu: 450, retention: 85, churn: 5, conversion: 12, period: "2024-01" },
      { arpu: 480, retention: 87, churn: 4, conversion: 14, period: "2024-02" },
      { arpu: 520, retention: 88, churn: 4, conversion: 15, period: "2024-03" },
      { arpu: 550, retention: 89, churn: 3, conversion: 16, period: "2024-04" },
      { arpu: 580, retention: 90, churn: 3, conversion: 17, period: "2024-05" },
      { arpu: 600, retention: 91, churn: 2, conversion: 18, period: "2024-06" },
    ];
  },
};


