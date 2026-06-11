// App.js
import React, { useState, useEffect, useMemo } from "react";
import { TuringMachineTwoTapes, regrasPalindromo } from "./TuringMachineLogic";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./App.css";

function App() {
  const [inputWord, setInputWord] = useState("1001");
  const [simulationData, setSimulationData] = useState(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [chartData, setChartData] = useState([]);

  const simulador = useMemo(
    () => new TuringMachineTwoTapes(regrasPalindromo),
    [],
  );

  const handleStartSimulation = () => {
    const result = simulador.runSimulation(inputWord);
    setSimulationData(result);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    let interval = null;
    if (
      isPlaying &&
      simulationData &&
      currentStepIdx < simulationData.history.length - 1
    ) {
      interval = setInterval(() => {
        setCurrentStepIdx((prev) => prev + 1);
      }, 300);
    } else {
      setIsPlaying(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStepIdx, simulationData]);

  useEffect(() => {
    const data = [];
    for (let tam = 10; tam <= 150; tam += 20) {
      const metade = Array.from({ length: tam / 2 }, () =>
        Math.round(Math.random()).toString(),
      ).join("");
      const palindromo = metade + metade.split("").reverse().join("");
      const res = simulador.runSimulation(palindromo);
      data.push({ tamanho: tam, passos: res.totalPassos });
    }
    setChartData(data);
  }, [simulador]);

  const currentFrame = simulationData?.history[currentStepIdx];

  const RenderFita = ({ fita, headIdx, label }) => (
    <div className="fita-container">
      <h4>{label}</h4>
      <div className="fita-track">
        {fita.map((char, idx) => {
          const isHead = idx === headIdx;
          return (
            <div
              key={idx}
              className={`fita-celula ${isHead ? "head-active" : ""}`}
            >
              {char}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard Interativo: Máquina de Turing de 2 Fitas</h2>
        <p>{"Reconhecimento de Palíndromos com Complexidade Linear O(n)"}</p>
      </div>

      <div className="dashboard-grid">
        {/* COLUNA DA ESQUERDA: CONTROLES E ANIMAÇÃO */}
        <div className="card">
          <h3>Simulador em Tempo Real</h3>

          <div className="input-group">
            <input
              type="text"
              value={inputWord}
              onChange={(e) =>
                setInputWord(e.target.value.replace(/[^01]/g, ""))
              }
              placeholder="Digite uma palavra binária..."
              className="input-minimal"
            />
            <button onClick={handleStartSimulation} className="btn btn-primary">
              Carregar
            </button>
          </div>

          {simulationData && currentFrame && (
            <div>
              <div className="controls-group">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="btn"
                >
                  {isPlaying ? "Pausar" : "Iniciar"}
                </button>
                <button
                  onClick={() =>
                    setCurrentStepIdx((prev) =>
                      Math.min(simulationData.history.length - 1, prev + 1),
                    )
                  }
                  disabled={
                    currentStepIdx === simulationData.history.length - 1
                  }
                  className="btn"
                >
                  Avançar Passo
                </button>
                <button onClick={() => setCurrentStepIdx(0)} className="btn">
                  Reiniciar
                </button>
              </div>

              <div className="status-panel">
                <p>
                  <strong>Passo Atual:</strong> {currentFrame.step} /{" "}
                  {simulationData.totalPassos}
                </p>
                <p>
                  <strong>Estado do Autômato:</strong>{" "}
                  <span className="status-text-highlight">
                    {currentFrame.state}
                  </span>
                </p>
                {currentFrame.state === "q_aceita" && (
                  <div className="alert alert-success">
                    Palavra Aceita: É um Palíndromo.
                  </div>
                )}
                {currentFrame.state === "q_rejeita" && (
                  <div className="alert alert-danger">
                    Palavra Rejeitada: Não é um Palíndromo.
                  </div>
                )}
              </div>

              <RenderFita
                fita={currentFrame.fita1}
                headIdx={currentFrame.head1}
                label="Fita 1 (Entrada / Leitura)"
              />
              <RenderFita
                fita={currentFrame.fita2}
                headIdx={currentFrame.head2}
                label="Fita 2 (Cópia / Memória Auxiliar)"
              />
            </div>
          )}
        </div>

        {/* COLUNA DA DIREITA: EXPERIMENTO EMPÍRICO (GRÁFICO) */}
        <div className="card">
          <h3>Gráfico de Complexidade</h3>
          <p className="card-description">
            Comportamento empírico do modelo de 2 fitas avaliado sobre
            diferentes tamanhos de entrada (n).
          </p>

          <div style={{ width: "100%", height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                <XAxis
                  dataKey="tamanho"
                  stroke="#71717a"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="passos"
                  stroke="#18181b"
                  strokeWidth={2}
                  name="Simulador 2 Fitas"
                  dot={{ stroke: "#18181b", strokeWidth: 1, r: 3 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="analysis-box">
            <strong>Análise Crítica:</strong>{" "}
            {
              "Observe como a curva se mantém estritamente retilínea. Isso valida empiricamente que a inclusão de uma segunda fita reduz o limite superior assintótico de palíndromos para O(n)."
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
