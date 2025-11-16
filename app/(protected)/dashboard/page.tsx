"use client";

import { useEffect, useState } from "react";
import { dashboardAPI } from "@/lib/dashboard";
import { KPIsTrend, MapApiResponse } from "@/lib/dashboard";
import dynamic from "next/dynamic";
import MapView from "@/components/MapView";

const Chart = dynamic(() => import("react-apexcharts").then((mod) => mod.default), {
  ssr: false,
  loading: () => (
    <div className="h-[350px] flex items-center justify-center text-gray-500">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-sm">Carregando gráfico...</p>
      </div>
    </div>
  ),
}) as any;

type KpiFilter = "ARPU" | "Retenção" | "Churn" | "Conversão";

export default function DashboardPage() {
  const [kpisTrend, setKpisTrend] = useState<KPIsTrend | null>(null);
  const [mapData, setMapData] = useState<MapApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedKpi, setSelectedKpi] = useState<KpiFilter>("ARPU");
  const [selectedLocation, setSelectedLocation] = useState("Todos os locais");
  const [selectedType, setSelectedType] = useState("Todos os tipos");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpis, map] = await Promise.all([
          dashboardAPI.getKPIsTrend(),
          dashboardAPI.getMapData(),
        ]);
        setKpisTrend(kpis);
        setMapData(map);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="h-64 bg-gray-800/50 rounded-lg animate-pulse"></div>
        <div className="h-64 bg-gray-800/50 rounded-lg animate-pulse"></div>
        <div className="h-96 bg-gray-800/50 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  const getAreaChartData = () => {
    if (!kpisTrend) return { labels: [], data: [] };

    let data: number[] = [];
    let name = "";

    switch (selectedKpi) {
      case "ARPU":
        data = kpisTrend.arpuTrend.data.map((val) => val / 1000);
        name = kpisTrend.arpuTrend.name;
        break;
      case "Retenção":
        data = kpisTrend.retentionTrend?.data || [];
        name = kpisTrend.retentionTrend?.name || "";
        break;
      case "Churn":
        data = kpisTrend.churnTrend?.data || [];
        name = kpisTrend.churnTrend?.name || "";
        break;
      case "Conversão":
        data = kpisTrend.conversionTrend?.data || [];
        name = kpisTrend.conversionTrend?.name || "";
        break;
    }

    return { labels: kpisTrend.labels, data, name };
  };

  const areaChartData = getAreaChartData();

  const areaChartOptions = {
    chart: {
      type: "area" as const,
      height: 350,
      toolbar: { show: false },
      sparkline: { enabled: false },
      offsetX: 0,
      offsetY: 0, 
      zoom: { enabled: false }, 
      animations: { enabled: true },
      events: {
        dataPointMouseEnter: function(event: any, chartContext: any, config: any) {
        },
        dataPointMouseLeave: function(event: any, chartContext: any, config: any) {
        },
      },
    },
    markers: {
      size: 0,
      hover: {
        size: 6, 
        sizeOffset: 2,
      },
      strokeWidth: 2,
      strokeColors: "#60C5F8",
      fillColors: "#ffffff",
    },
    dataLabels: {
      enabled: false, 
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.75,
        opacityTo: 0.08,
        stops: [0, 100],
        colorStops: [
          { offset: 0, color: "#60C5F8", opacity: 0.85 },
          { offset: 100, color: "#2EC4B6", opacity: 0.12 },
        ],
        type: "vertical",
      },
    },
    stroke: {
      curve: "smooth" as const,
      width: 2.5,
      colors: ["#60C5F8"], 
    },
    xaxis: {
      categories: areaChartData.labels,
      labels: {
        style: { 
          colors: "#9CA3AF", 
          fontSize: "11px", 
          fontWeight: 400,
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: {
        enabled: false,
      },
    },
    legend: {
      show: false,
    },
    yaxis: {
      labels: {
        style: { 
          colors: "#9CA3AF", 
          fontSize: "11px", 
          fontWeight: 400,
        },
        formatter: (val: number) => {
          if (selectedKpi === "ARPU") {
            return `R$ ${val.toFixed(0)}k`;
          }
          return val.toString();
        },
      },
      min: 0,
      max:
        selectedKpi === "ARPU"
          ? 380
          : selectedKpi === "Retenção"
          ? 100
          : selectedKpi === "Conversão"
          ? 100
          : undefined,
      tickAmount: 4,
      decimalsInFloat: 0,
      forceNiceScale: true,
    },
    grid: {
      show: true,
      borderColor: "#374151",
      strokeDashArray: 3,
      xaxis: { 
        lines: { 
          show: true,
        },
      },
      yaxis: { 
        lines: { 
          show: true,
        },
      },
      padding: {
        top: 5,
        right: 15,
        bottom: 0,
        left: 15, 
      },
      row: {
        colors: undefined,
        opacity: 0.05,
      },
      column: {
        colors: undefined,
        opacity: 0.05,
      },
    },
    tooltip: {
      enabled: true,
      theme: "dark",
      style: {
        fontSize: "12px",
        fontFamily: "inherit",
      },
      marker: {
        show: true,
        fillColors: ["#60C5F8"],
      },
      shared: false,
      intersect: false, 
      x: {
        show: true,
      },
      y: {
        formatter: (val: number) => {
          if (selectedKpi === "ARPU") {
            return `R$ ${val.toFixed(1)}k`;
          }
          return val.toString();
        },
      },
    },
    colors: ["#60C5F8"], 
  };

  const conversionData = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    data: [100, 75, 110, 50, 75, 75],
  };

  const barChartOptions = {
    chart: {
      type: "bar" as const,
      height: 350,
      toolbar: { show: false },
      offsetX: 0,
      offsetY: 0, 
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "45%", 
        distributed: false,
        dataLabels: {
          position: "top",
        },
        horizontal: false, 
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: conversionData.labels,
      labels: {
        style: { 
          colors: "#9CA3AF", 
          fontSize: "11px", 
          fontWeight: 400,
        },
        offsetY: 0,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: {
        enabled: false,
      },
      position: "bottom",
    },
    legend: {
      show: false,
    },
    yaxis: {
      labels: {
        style: { 
          colors: "#9CA3AF", 
          fontSize: "11px", 
          fontWeight: 400,
        },
        formatter: (val: number) => val.toString(),
      },
      min: 0,
      max: 125,
      tickAmount: 5,
      decimalsInFloat: 0,
      forceNiceScale: true,
    },
    grid: {
      show: true,
      borderColor: "#374151",
      strokeDashArray: 3,
      xaxis: { 
        lines: { 
          show: true,
        },
      },
      yaxis: { 
        lines: { 
          show: true,
        },
      },
      padding: {
        top: 5,
        right: 15, 
        bottom: 0,
        left: 15, 
      },
      row: {
        colors: undefined,
        opacity: 0.05,
      },
      column: {
        colors: undefined,
        opacity: 0.05,
      },
    },
    tooltip: {
      theme: "dark",
      style: {
        fontSize: "12px",
        fontFamily: "inherit",
      },
      marker: {
        show: true,
        fillColors: ["#60C5F8"],
      },
      shared: false,
      intersect: true,
      y: {
        formatter: (val: number) => `${val} novos clientes`,
      },
    },
    colors: ["#60C5F8"],
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 1,
        gradientToColors: ["#2EC4B6"], 
        inverseColors: false,
        opacityFrom: 0.9,
        opacityTo: 0.5,
        stops: [0, 100],
        colorStops: [
          { offset: 0, color: "#60C5F8", opacity: 0.9 },
          { offset: 100, color: "#2EC4B6", opacity: 0.5 },
        ],
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#0f1117] p-6">
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800/50 shadow-xl shadow-black/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Evolução dos KPIs</h2>
              <div className="flex gap-2">
                {(["Retenção", "Conversão", "Churn", "ARPU"] as KpiFilter[]).map((kpi) => (
                  <button
                    key={kpi}
                    onClick={() => setSelectedKpi(kpi)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                      selectedKpi === kpi
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/40"
                        : "bg-gray-700/80 text-gray-300 hover:bg-gray-600/80 hover:text-white"
                    }`}
                  >
                    {kpi}
                  </button>
                ))}
              </div>
            </div>
            {areaChartData.data.length > 0 && areaChartData.labels.length > 0 ? (
              <div className="w-full" style={{ pointerEvents: "auto" }}>
                <Chart
                  options={areaChartOptions}
                  series={[{ name: areaChartData.name || "KPI", data: areaChartData.data }]}
                  type="area"
                  height={350}
                />
              </div>
            ) : kpisTrend ? (
              <div className="h-[350px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <p className="text-sm">Dados não disponíveis para este KPI</p>
                </div>
              </div>
            ) : (
              <div className="h-[350px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm">Carregando dados do gráfico...</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800/50 shadow-xl shadow-black/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Taxa de conversão</h2>
              <button className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-700/50">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
            <Chart
              options={barChartOptions}
              series={[{ name: "Novos Clientes", data: conversionData.data }]}
              type="bar"
              height={350}
            />
          </div>
        </div>

        <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800/50 shadow-xl shadow-black/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Mapa de clientes por região</h2>
            <div className="flex gap-3">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-gray-700/80 border border-gray-600/50 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all cursor-pointer"
              >
                <option value="Todos os locais">Todos os locais</option>
                <option value="São Paulo">São Paulo</option>
                <option value="Rio de Janeiro">Rio de Janeiro</option>
                <option value="Belo Horizonte">Belo Horizonte</option>
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-gray-700/80 border border-gray-600/50 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all cursor-pointer"
              >
                <option value="Todos os tipos">Todos os tipos</option>
                <option value="Residencial">Residencial</option>
                <option value="Comercial">Comercial</option>
                <option value="Industrial">Industrial</option>
              </select>
            </div>
          </div>

          <div className="h-[500px] bg-gray-900/50 rounded-xl border border-gray-800/50 overflow-hidden relative z-0">
            {(() => {
              const locations = mapData?.data?.locations;
              const hasValidData = locations && Array.isArray(locations) && locations.length > 0;
              
              if (hasValidData && mapData.data) {
                const [lng, lat] = mapData.data.center;
                const center: [number, number] = [lat, lng];
                
                return (
              <div className="w-full h-full relative">
                <MapView
                  center={center}
                  zoom={mapData.data.zoom || 12}
                  locations={locations}
                />
                <div className="absolute bottom-4 left-4 text-xs text-gray-300 bg-gray-900/90 px-3 py-1.5 rounded-lg backdrop-blur-sm z-10">
                  {locations.length} localização{locations.length !== 1 ? "es" : ""} encontrada{locations.length !== 1 ? "s" : ""}
                </div>
              </div>
                );
              }
              
              return (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <p className="text-sm mb-2">
                      {loading ? "Carregando mapa..." : mapData ? `Nenhuma localização encontrada (${mapData?.data?.locations?.length || 0})` : "Erro ao carregar mapa"}
                    </p>
                    {!loading && mapData && (
                      <p className="text-xs text-gray-600">Verifique os filtros selecionados</p>
                    )}
                    {!loading && !mapData && (
                      <p className="text-xs text-gray-600">Verifique o console para mais detalhes</p>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
