"use client";

import { useState, useMemo } from "react";

type PlanType = "Básico" | "Intermediário" | "Premium";

interface Coverage {
  id: string;
  name: string;
  price: number;
}

const plans = {
  Básico: { price: 89.9, conversion: 75, roi: 80 },
  Intermediário: { price: 145.9, conversion: 48, roi: 114 },
  Premium: { price: 225.9, conversion: 25, roi: 176 },
};

const coverages: Coverage[] = [
  { id: "roubo", name: "Cobertura contra roubo e furto", price: 25.0 },
  { id: "colisao", name: "Danos por colisão", price: 35.0 },
  { id: "incendio", name: "Cobertura contra incêndio", price: 20.0 },
  { id: "fenomenos", name: "Fenômenos naturais (granizo, enchente)", price: 30.0 },
];

const benefits = ["Tudo do básico", "Carro reserva", "Vidros"];

export default function PlansPage() {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("Intermediário");
  const [vehicleValue, setVehicleValue] = useState(50000);
  const [clientAge, setClientAge] = useState(28);
  const [selectedCoverages, setSelectedCoverages] = useState<string[]>([
    "roubo",
    "colisao",
    "incendio",
  ]);

  const toggleCoverage = (id: string) => {
    setSelectedCoverages((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatVehicleValue = (value: number) => {
    return `R$ ${(value / 1000).toFixed(0)}.000`;
  };

  const vehiclePercentage = ((vehicleValue - 10000) / (500000 - 10000)) * 100;
  
  const agePercentage = ((clientAge - 18) / (90 - 18)) * 100;

  return (
    <>
      <div className="min-h-screen bg-[#0f1117] p-6 ">
        <div className="max-w-7xl mx-auto" >
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 ">
            <div className="space-y-6 border border-gray-600/50 rounded-2xl">
              <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800/50 shadow-xl shadow-black/20">
                <h2 className="text-xl font-semibold text-[20px] text-white mb-6">Planos personalizados</h2>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  {(["Básico", "Intermediário", "Premium"] as PlanType[]).map((plan) => (
                    <button
                      key={plan}
                      onClick={() => setSelectedPlan(plan)}
                      className={`relative rounded-2xl p-6 transition-all text-left ${
                        selectedPlan === plan
                          ? " border-2 border-blue-500 shadow-lg "
                          : "bg-[#202435] hover:bg-[#252838]"
                      }`}
                    >
                     <div className="flex items-center justify-between">
                     <div className="text-white font-semibold mb-2">{plan}</div>
                      {plan === "Premium" && (
                          <div className=" bg-[#43D2CB] text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
                            Recomendado
                          </div>
                        )}
                     </div>
                      <div className="text-white text-3xl font-bold mb-4 mt-4">
                        {formatCurrency(plans[plan].price)}
                      </div>
                      <div className="text-gray-400 text-sm">Por mês</div>
                    </button>
                  ))}
                </div>

                <div className="mb-8 ">
                  <label className="block text-white text-sm font-medium mb-3">
                    Valor do veículo: {formatVehicleValue(vehicleValue)}
                  </label>
                  <div className="relative py-2">
                    <input
                      type="range"
                      min={10000}
                      max={500000}
                      step={1000}
                      value={vehicleValue}
                      onChange={(e) => setVehicleValue(Number(e.target.value))}
                      className="relative w-full appearance-none cursor-pointer slider z-10"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${vehiclePercentage}%, #ffffff ${vehiclePercentage}%, #ffffff 100%)`,
                      }}
                    />
                    <div className="flex justify-between text-gray-400 text-[16px] mt-2">
                      <span>R$ 10.000</span>
                      <span>R$ 500.000</span>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-white text-sm font-medium mb-3">
                    Idade do Cliente: {clientAge} anos
                  </label>
                  <div className="relative py-2">
                    <input
                      type="range"
                      min={18}
                      max={90}
                      step={1}
                      value={clientAge}
                      onChange={(e) => setClientAge(Number(e.target.value))}
                      className="relative w-full appearance-none cursor-pointer slider z-10"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${agePercentage}%, #ffffff ${agePercentage}%, #ffffff 100%)`,
                      }}
                    />
                    <div className="flex justify-between text-gray-400 text-[16px] mt-2">
                      <span>18 anos</span>
                      <span>90 anos</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-semibold text-[20px] mb-4">Coberturas Adicionais</h3>
                  <div className="space-y-3">
                    {coverages.map((coverage) => (
                      <div
                        key={coverage.id}
                        className="flex items-center justify-between rounded-xl"
                      >
                        <div className="flex items-center gap-3 flex-1 mt-4">
                          <button
                            onClick={() => toggleCoverage(coverage.id)}
                            className={`w-4 h-4 border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                              selectedCoverages.includes(coverage.id)
                                ? "bg-blue-600 border-blue-600 rounded-sm"
                                : "border-white bg-transparent rounded-sm"
                            }`}
                          >
                            {selectedCoverages.includes(coverage.id) && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth={3}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </button>
                          <span className="text-white text-sm">{coverage.name}</span>
                        </div>
                        <span className="text-gray-400 text-sm whitespace-nowrap ml-4">
                          + {formatCurrency(coverage.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-600/50 ">
                <h3 className="text-white font-semibold text-[20px] mb-4">Benefícios Inclusos</h3>
                <div className="grid grid-cols-3 gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-1 p-3 border border-gray-700/50 bg-gray-700/20 rounded-xl justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      </div>
                      <span className="text-white text-[12px] whitespace-nowrap">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800/50 shadow-xl shadow-black/20">
                <h3 className="text-white font-semibold text-[20px] mb-6">Indicadores</h3>
                <div className="space-y-6">
                  {(["Básico", "Intermediário", "Premium"] as PlanType[]).map((plan, index) => (
                    <div
                      key={plan}
                      className={index < 3 ? "p-6 border border-gray-700/50  bg-gray-700/20 rounded-xl" : ""}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-white font-bold text-[20px]">{plan}</div>
                        <div className="text-white font-bold text-[18px]">{formatCurrency(plans[plan].price)}</div>
                      </div>
                      <div className="text-[#ffffff] flex items-center gap-2 text-sm ">
                        <div className="flex items-center gap-2">Conversão: <p className="text-green-700 font-bold">{plans[plan].conversion}%</p></div>
                        <div className="flex items-center gap-2">ROI: <p className="text-green-700 font-bold">{plans[plan].roi}%</p></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
