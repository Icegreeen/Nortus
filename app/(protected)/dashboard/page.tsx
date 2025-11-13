"use client";

import { useEffect, useState } from "react";
import { kpiAPI } from "@/lib/api";
import { KPI } from "@/types";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { 
  ssr: false,
  loading: () => <div className="h-[350px] flex items-center justify-center text-gray-500">Carregando gráfico...</div>
}) as any;

export default function DashboardPage() {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const data = await kpiAPI.getKPIs();
        setKpis(data);
      } catch (error) {
        console.error("Erro ao carregar KPIs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchKPIs();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const latestKPI = kpis[kpis.length - 1];
  const chartData = {
    arpu: kpis.map((k) => k.arpu),
    retention: kpis.map((k) => k.retention),
    churn: kpis.map((k) => k.churn),
    conversion: kpis.map((k) => k.conversion),
    periods: kpis.map((k) => k.period),
  };

  const arpuChartOptions = {
    chart: {
      type: "line" as const,
      height: 350,
      toolbar: { show: false },
    },
    stroke: { curve: "smooth" as const, width: 3 },
    xaxis: { categories: chartData.periods },
    colors: ["#4F46E5"],
    title: { text: "ARPU (Receita Média por Usuário)", align: "left" as const },
  };

  const retentionChartOptions = {
    chart: {
      type: "line" as const,
      height: 350,
      toolbar: { show: false },
    },
    stroke: { curve: "smooth" as const, width: 3 },
    xaxis: { categories: chartData.periods },
    colors: ["#10B981"],
    title: { text: "Taxa de Retenção (%)", align: "left" as const },
  };

  const churnChartOptions = {
    chart: {
      type: "line" as const,
      height: 350,
      toolbar: { show: false },
    },
    stroke: { curve: "smooth" as const, width: 3 },
    xaxis: { categories: chartData.periods },
    colors: ["#EF4444"],
    title: { text: "Taxa de Churn (%)", align: "left" as const },
  };

  const conversionChartOptions = {
    chart: {
      type: "line" as const,
      height: 350,
      toolbar: { show: false },
    },
    stroke: { curve: "smooth" as const, width: 3 },
    xaxis: { categories: chartData.periods },
    colors: ["#F59E0B"],
    title: { text: "Taxa de Conversão (%)", align: "left" as const },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard de KPIs</h1>
        <p className="text-gray-600 mt-1">Acompanhe a evolução dos principais indicadores</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">ARPU</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                R$ {latestKPI?.arpu.toFixed(2)}
              </p>
            </div>
            <div className="text-3xl">📈</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Retenção</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {latestKPI?.retention}%
              </p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Churn</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {latestKPI?.churn}%
              </p>
            </div>
            <div className="text-3xl">⚠️</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conversão</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {latestKPI?.conversion}%
              </p>
            </div>
            <div className="text-3xl">🎯</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <Chart
            options={arpuChartOptions}
            series={[{ name: "ARPU", data: chartData.arpu }]}
            type="line"
            height={350}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <Chart
            options={retentionChartOptions}
            series={[{ name: "Retenção", data: chartData.retention }]}
            type="line"
            height={350}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <Chart
            options={churnChartOptions}
            series={[{ name: "Churn", data: chartData.churn }]}
            type="line"
            height={350}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <Chart
            options={conversionChartOptions}
            series={[{ name: "Conversão", data: chartData.conversion }]}
            type="line"
            height={350}
          />
        </div>
      </div>
    </div>
  );
}

