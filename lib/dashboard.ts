import http from "./http";
import axios from "axios";
import { API_BASE_URL } from "./config";

export type KPIsTrend = {
  labels: string[];
  arpuTrend: { name: string; data: number[] };
  retentionTrend?: { name: string; data: number[] };
  churnTrend?: { name: string; data: number[] };
  conversionTrend?: { name: string; data: number[] };
};

export type MapApiResponse = {
  data: {
    center: [number, number];
    zoom: number;
    locations: Array<{
      id: string;
      name: string;
      description?: string;
      coordinates: [number, number];
      category: string;
      address?: string;
      icon?: string;
      color?: string;
    }>;
  };
};

export const dashboardAPI = {
  getKPIsTrend: async (): Promise<KPIsTrend> => {
    try {
      const url = `${API_BASE_URL}/dash.json`;
      const response = await axios.get(url, {
        headers: {
        },
        withCredentials: false,
      });

      const apiData = response.data?.kpisTrend || response.data;
      
      if (apiData && (apiData.labels || apiData.arpuTrend)) {
        return {
          labels: apiData.labels || ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
          arpuTrend: apiData.arpuTrend || { name: "ARPU", data: [120000, 150000, 130000, 160000, 180000, 175000, 190000, 210000, 230000, 260000, 240000, 220000] },
          retentionTrend: apiData.retentionTrend,
          churnTrend: apiData.churnTrend,
          conversionTrend: apiData.conversionTrend,
        } as KPIsTrend;
      }
      
      return {
        labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        arpuTrend: { name: "ARPU", data: [120000, 150000, 130000, 160000, 180000, 175000, 190000, 210000, 230000, 260000, 240000, 220000] },
        retentionTrend: { name: "Retenção", data: [70, 72, 69, 75, 73, 71, 78, 76, 82, 80, 85, 88] },
        churnTrend: { name: "Churn", data: [5, 4.8, 5.2, 4.5, 4.7, 4.4, 4.2, 4.3, 4.0, 4.1, 3.9, 3.8] },
        conversionTrend: { name: "Conversão", data: [50, 55, 53, 58, 56, 54, 60, 59, 63, 62, 67, 70] },
      };
    } catch (error: any) {
      console.error("Erro ao buscar KPIs:", error);
      return {
        labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        arpuTrend: { name: "ARPU", data: [120000, 150000, 130000, 160000, 180000, 175000, 190000, 210000, 230000, 260000, 240000, 220000] },
        retentionTrend: { name: "Retenção", data: [70, 72, 69, 75, 73, 71, 78, 76, 82, 80, 85, 88] },
        churnTrend: { name: "Churn", data: [5, 4.8, 5.2, 4.5, 4.7, 4.4, 4.2, 4.3, 4.0, 4.1, 3.9, 3.8] },
        conversionTrend: { name: "Conversão", data: [50, 55, 53, 58, 56, 54, 60, 59, 63, 62, 67, 70] },
      };
    }
  },

  getMapData: async (): Promise<MapApiResponse> => {
    try {
      const url = `${API_BASE_URL}/map.json`;
      const response = await axios.get(url, {
        headers: {
        },
        withCredentials: false,
      });
      const apiData = response.data;
      
      if (apiData && apiData.data) {
        const result = {
          data: {
            center: apiData.data.center || [-34.8811, -8.0539],
            zoom: apiData.data.zoom || 12,
            locations: apiData.data.locations || [],
          },
        };
        return result as MapApiResponse;
      }

      return {
        data: {
          center: [-34.8811, -8.0539],
          zoom: 12,
          locations: [],
        },
      };
    } catch (error: any) {
      console.error("Erro ao buscar dados do mapa:", error);
      return {
        data: {
          center: [-34.8811, -8.0539],
          zoom: 12,
          locations: [],
        },
      };
    }
  },
};


