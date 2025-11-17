"use client";

import { useState, useMemo } from "react";

type PlanType = "Básico" | "Intermediário" | "Premium";

interface Coverage {
  id: string;
  name: string;
  price: number;
}

const plans = {
  Básico: { basePrice: 89.9, conversion: 75, roi: 80, vehicleFactor: 0.0008 },
  Intermediário: { basePrice: 145.9, conversion: 48, roi: 114, vehicleFactor: 0.0012 },
  Premium: { basePrice: 225.9, conversion: 25, roi: 176, vehicleFactor: 0.0018 },
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

  const calculateAgeFactor = (age: number): number => {
    if (age < 25) return 1.15; 
    if (age >= 25 && age < 30) return 1.0; 
    if (age >= 30 && age < 50) return 1.05;
    if (age >= 50 && age < 70) return 1.1; 
    return 1.2;
  };

  const calculateTotalPrice = useMemo(() => {
    const plan = plans[selectedPlan];
    
    let basePrice = plan.basePrice;
    
    const vehiclePrice = vehicleValue * plan.vehicleFactor;
    
    const ageFactor = calculateAgeFactor(clientAge);
    const ageAdjustedPrice = (basePrice + vehiclePrice) * ageFactor;
    
    const coveragePrice = selectedCoverages.reduce((total, coverageId) => {
      const coverage = coverages.find((c) => c.id === coverageId);
      return total + (coverage ? coverage.price : 0);
    }, 0);
    
    return ageAdjustedPrice + coveragePrice;
  }, [selectedPlan, vehicleValue, clientAge, selectedCoverages]);

  const calculatePlanPrice = (planType: PlanType): number => {
    const plan = plans[planType];
    const vehiclePrice = vehicleValue * plan.vehicleFactor;
    const ageFactor = calculateAgeFactor(clientAge);
    const ageAdjustedPrice = (plan.basePrice + vehiclePrice) * ageFactor;
    const coveragePrice = selectedCoverages.reduce((total, coverageId) => {
      const coverage = coverages.find((c) => c.id === coverageId);
      return total + (coverage ? coverage.price : 0);
    }, 0);
    return ageAdjustedPrice + coveragePrice;
  };

  const vehiclePercentage = ((vehicleValue - 10000) / (500000 - 10000)) * 100;
  
  const agePercentage = ((clientAge - 18) / (90 - 18)) * 100;

  return (
    <>
      <div className="min-h-screen bg-[#0f1117] p-6 ">
        <div className="max-w-7xl mx-auto" >
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">
            <div className="border border-gray-600/50 rounded-2xl">
              <div className="bg-[#1a1d2e] rounded-2xl px-6 pt-6 pb-6 border border-gray-800/50 shadow-xl shadow-black/20">
                <h2 className="text-xl font-semibold text-[20px] text-white mb-6">Planos personalizados</h2>

                <div>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {(["Básico", "Intermediário", "Premium"] as PlanType[]).map((plan) => {
                    const planPrice = calculatePlanPrice(plan);
                    return (
                      <button
                        key={plan}
                        onClick={() => setSelectedPlan(plan)}
                        className={`relative rounded-2xl p-6 transition-all text-left ${
                          selectedPlan === plan
                            ? " border-2 border-blue-500 shadow-lg bg-[#1a1d2e]"
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
                        <div className="text-white text-3xl font-bold mb-4 mt-4 transition-all duration-300">
                          {formatCurrency(planPrice)}
                        </div>
                        <div className="text-gray-400 text-sm">Por mês</div>
                        {selectedPlan === plan && (
                          <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full"></div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mb-8 ">
                  <label className="block text-white text-sm font-medium mb-3">
                    Valor do veículo: <span className="text-blue-400 font-bold">{formatCurrency(vehicleValue)}</span>
                  </label>
                  <div className="relative py-2">
                    <input
                      type="range"
                      min={10000}
                      max={500000}
                      step={1000}
                      value={vehicleValue}
                      onChange={(e) => setVehicleValue(Number(e.target.value))}
                      className="relative w-full appearance-none cursor-pointer slider z-10 transition-all duration-200"
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
                    Idade do Cliente: <span className="text-blue-400 font-bold">{clientAge} anos</span>
                  </label>
                  <div className="relative py-2">
                    <input
                      type="range"
                      min={18}
                      max={90}
                      step={1}
                      value={clientAge}
                      onChange={(e) => setClientAge(Number(e.target.value))}
                      className="relative w-full appearance-none cursor-pointer slider z-10 transition-all duration-200"
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
                  <h3 className="text-white font-semibold text-[20px] mb-8">Coberturas Adicionais</h3>
                  <div>
                    {coverages.map((coverage, index) => {
                      const isSelected = selectedCoverages.includes(coverage.id);
                      const isLast = index === coverages.length - 1;
                      return (
                        <div
                          key={coverage.id}
                          className={`flex items-center justify-between rounded-xl p-3 transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? "bg-blue-600/20 border border-blue-500/50"
                              : "hover:bg-gray-800/30"
                          } ${!isLast ? "mb-3" : ""}`}
                          onClick={() => toggleCoverage(coverage.id)}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCoverage(coverage.id);
                              }}
                              className={`w-5 h-5 border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                                isSelected
                                  ? "bg-blue-600 border-blue-600 rounded-sm scale-110"
                                  : "border-gray-400 bg-transparent rounded-sm hover:border-blue-500"
                              }`}
                            >
                              {isSelected && (
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
                            <span className={`text-sm transition-colors ${isSelected ? "text-white font-medium" : "text-gray-300"}`}>
                              {coverage.name}
                            </span>
                          </div>
                          <span className={`text-sm whitespace-nowrap ml-4 transition-colors ${
                            isSelected ? "text-blue-400 font-semibold" : "text-gray-400"
                          }`}>
                            + {formatCurrency(coverage.price)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-2xl p-6 border-2 border-blue-500/50 shadow-xl shadow-blue-500/10">
                <h3 className="text-white font-semibold text-[20px] mb-2">Preço Total</h3>
                <div className="text-white text-4xl font-bold mb-2 transition-all duration-300">
                  {formatCurrency(calculateTotalPrice)}
                </div>
                <div className="text-gray-300 text-sm mb-4">Por mês</div>
                <div className="pt-4 border-t border-gray-600/50">
                  <div className="space-y-2 text-sm">
                    {useMemo(() => {
                      const plan = plans[selectedPlan];
                      const vehiclePrice = vehicleValue * plan.vehicleFactor;
                      const ageFactor = calculateAgeFactor(clientAge);
                      const basePlanPrice = (plan.basePrice + vehiclePrice) * ageFactor;
                      const coverageTotal = selectedCoverages.reduce((total, coverageId) => {
                        const coverage = coverages.find((c) => c.id === coverageId);
                        return total + (coverage ? coverage.price : 0);
                      }, 0);
                      
                      return (
                        <>
                          <div className="flex justify-between text-gray-300">
                            <span>Plano {selectedPlan}</span>
                            <span className="text-white font-semibold">
                              {formatCurrency(basePlanPrice)}
                            </span>
                          </div>
                          {selectedCoverages.length > 0 && (
                            <div className="flex justify-between text-gray-300">
                              <span>Coberturas adicionais ({selectedCoverages.length})</span>
                              <span className="text-white font-semibold">
                                +{formatCurrency(coverageTotal)}
                              </span>
                            </div>
                          )}
                        </>
                      );
                    }, [selectedPlan, vehicleValue, clientAge, selectedCoverages])}
                  </div>
                </div>
              </div>

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
                <h3 className="text-white font-semibold text-[20px] mb-2">Comparação de Planos</h3>
                <div className="space-y-6">
                  {(["Básico", "Intermediário", "Premium"] as PlanType[]).map((plan, index) => {
                    const planPrice = calculatePlanPrice(plan);
                    return (
                      <div
                        key={plan}
                        className={index < 3 ? "p-6 border border-gray-700/50  bg-gray-700/20 rounded-xl" : ""}
                      >
                        <div className="flex justify-between items-start">
                          <div className="text-white font-bold text-[20px]">{plan}</div>
                          <div className="text-white font-bold text-[18px]">{formatCurrency(planPrice)}</div>
                        </div>
                        <div className="text-[#ffffff] flex items-center gap-2 text-sm ">
                          <div className="flex items-center gap-2">Conversão: <p className="text-green-700 font-bold">{plans[plan].conversion}%</p></div>
                          <div className="flex items-center gap-2">ROI: <p className="text-green-700 font-bold">{plans[plan].roi}%</p></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
