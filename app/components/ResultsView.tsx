"use client";

import { useEffect, useState } from "react";
import { getRecentResults } from "../service/getResults";
import { ExperimentResult } from "../types/types";

export default function ResultsView() {
  const [results, setResults] = useState<ExperimentResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const r = await getRecentResults();
        if (!mounted) return;
        setResults(r);
      } catch (err) {
        console.error("Erro ao carregar resultados:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading)
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0f2f5",
        }}
      >
        <div
          style={{
            borderRadius: 999,
            width: 40,
            height: 40,
            borderWidth: 4,
            borderStyle: "solid",
            borderColor: "#cbd5e1",
            borderTopColor: "transparent",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
        display: "flex",
        justifyContent: "center",
        paddingTop: 30,
        paddingBottom: 20, // 🔥 reduzido
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: 600,
          background: "white",
          padding: 28,
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          position: "relative",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: 24,
            fontSize: "1.8rem", // 🔥 maior
            fontWeight: 700, // 🔥 mais forte
            color: "#111",
          }}
        >
          Resultados Recentes
        </h1>

        <div
          style={{
            maxHeight: "80vh", // 🔥 aumenta a área útil de scroll
            overflowY: "auto",
            paddingRight: 8,
            paddingBottom: 0, // 🔥 remove espaço em branco no final
          }}
        >
          {" "}
          {results.length === 0 ? (
            <p style={{ textAlign: "center" }}>Nenhum resultado salvo ainda.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {results.map((r) => (
                <li
                  key={r.id}
                  style={{
                    marginBottom: 14, // 🔥 menor
                    padding: 12,
                    background: "#fafafa",
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <strong>Acurácia:</strong> {r.accuracy.toFixed(2)}% <br />
                  <strong>RT Médio:</strong> {r.meanRT.toFixed(2)}ms <br />
                  <strong>Tipo:</strong> {r.advanced ? "Advanced" : "Basic"}{" "}
                  <br />
                  <strong>Data:</strong>{" "}
                  {r.createdAt?.toLocaleString() ?? "n/a"}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
