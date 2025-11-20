"use client";
import { useState } from "react";
import RTExperiment from "./components/RTExperiment";
import AdvancedRTExperiment from "./components/AdvancedRTExperiment";

export default function Home() {
  const [currentView, setCurrentView] = useState("menu"); // 'menu', 'normal', 'advanced'

  const handleBackToMenu = () => {
    setCurrentView("menu");
  };

  if (currentView === "normal") {
    return (
      <div>
        <button
          onClick={handleBackToMenu}
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            padding: "10px 20px",
            backgroundColor: "#007acc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            zIndex: 1000,
          }}
        >
          ← Voltar ao Menu
        </button>
        <RTExperiment />
      </div>
    );
  }

  if (currentView === "advanced") {
    return (
      <div>
        <button
          onClick={handleBackToMenu}
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            padding: "10px 20px",
            backgroundColor: "#007acc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            zIndex: 1000,
          }}
        >
          ← Voltar ao Menu
        </button>
        <AdvancedRTExperiment />
      </div>
    );
  }

  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f2f5",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: "40px",
          backgroundColor: "white",
          borderRadius: "15px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          maxWidth: "500px",
          width: "90%",
        }}
      >
        <h1
          style={{
            color: "#333",
            marginBottom: "10px",
            fontSize: "2.5rem",
          }}
        >
          🧠 jsPsych Demo
        </h1>

        <p
          style={{
            color: "#666",
            marginBottom: "40px",
            fontSize: "1.1rem",
            lineHeight: "1.5",
          }}
        >
          Escolha um experimento para começar
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => setCurrentView("normal")}
            style={{
              padding: "15px 30px",
              fontSize: "1.1rem",
              backgroundColor: "#007acc",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              width: "250px",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 4px rgba(0, 122, 204, 0.3)",
            }}
            onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
              const target = e.currentTarget;
              target.style.backgroundColor = "#005a9e";
              target.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
              const target = e.currentTarget;
              target.style.backgroundColor = "#0078d4";
              target.style.transform = "translateY(0)";
            }}
          >
            🎯 Experimento Básico
          </button>

          <button
            onClick={() => setCurrentView("advanced")}
            style={{
              padding: "15px 30px",
              fontSize: "1.1rem",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              width: "250px",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 4px rgba(40, 167, 69, 0.3)",
            }}
            onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
              const el = e.currentTarget;
              el.style.backgroundColor = "#218838";
              el.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
              const el = e.currentTarget;
              el.style.backgroundColor = "#28a745";
              el.style.transform = "translateY(0)";
            }}
          >
            🔬 Experimento Avançado
          </button>
        </div>

        <div
          style={{
            marginTop: "40px",
            padding: "20px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            textAlign: "left",
          }}
        >
          <h3 style={{ color: "#333", marginBottom: "10px" }}>
            Descrição dos Experimentos:
          </h3>
          <ul style={{ color: "#666", lineHeight: "1.6", paddingLeft: "20px" }}>
            <li>
              <strong>Básico:</strong> Pressione ESPAÇO quando ver círculos
              azuis
            </li>
            <li>
              <strong>Avançado:</strong> Use F (azul) e J (laranja) para
              diferentes cores
            </li>
          </ul>
        </div>
      </div>

      <footer
        style={{
          marginTop: "30px",
          color: "#999",
          fontSize: "0.9rem",
        }}
      >
        Desenvolvido com Next.js + jsPsych
      </footer>
    </main>
  );
}
