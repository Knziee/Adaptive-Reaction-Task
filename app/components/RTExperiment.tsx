"use client";
import { useEffect, useRef } from "react";
import { TrialData } from "../types/types";
import type { JsPsych } from "jspsych";
import { saveResult } from "@/app/service/saveResult";
import toast from "react-hot-toast";

const RTExperiment = ({ onFinish }: { onFinish: () => void }) => {
  const experimentContainer = useRef<HTMLDivElement>(null);
  const jsPsychRef = useRef<JsPsych | null>(null);
  const initializedRef = useRef(false); // Ref para controlar inicialização

  useEffect(() => {
    // Prevenir inicialização dupla
    if (
      jsPsychRef.current ||
      !experimentContainer.current ||
      initializedRef.current
    )
      return;

    // Marcar como inicializado
    initializedRef.current = true;

    const initializeExperiment = async () => {
      const { initJsPsych } = await import("jspsych");
      const HtmlKeyboardResponsePlugin = (
        await import("@jspsych/plugin-html-keyboard-response")
      ).default;

      const jsPsych = initJsPsych({
        display_element: experimentContainer.current!,
        on_finish: () => {
          const data = jsPsych.data.get();
          console.log("Experiment data:", data);
          localStorage.setItem("experiment-data", JSON.stringify(data));
        },
      });

      jsPsychRef.current = jsPsych;

      // styling do container
      Object.assign(experimentContainer.current!.style, {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        flexDirection: "column",
      });

      const timeline = [];

      // Instruções
      timeline.push({
        type: HtmlKeyboardResponsePlugin,
        stimulus: `
          <div style="text-align: center; font-size: 24px; max-width: 90vw;">
            <h1>Reaction Time Experiment</h1>
            <p>Press <strong>SPACE</strong> when you see a blue circle on the screen.</p>
            <p>Press <strong>SPACE</strong> to start.</p>
          </div>
        `,
        choices: [" "],
      });

      // Trials
      const test_stimuli = [
        {
          stimulus: "<div style='color: blue; font-size: 48px;'>●</div>",
          data: { test_part: "test", correct_response: " " },
        },
        {
          stimulus: "<div style='color: blue; font-size: 48px;'>●</div>",
          data: { test_part: "test", correct_response: " " },
        },
        {
          stimulus: "<div style='color: blue; font-size: 48px;'>●</div>",
          data: { test_part: "test", correct_response: " " },
        },
      ];

      const fixation = {
        type: HtmlKeyboardResponsePlugin,
        stimulus: '<div style="font-size: 60px;">+</div>',
        choices: "NO_KEYS",
        trial_duration: 1000,
      };

      const trial = {
        type: HtmlKeyboardResponsePlugin,
        stimulus: jsPsych.timelineVariable("stimulus"),
        choices: [" "],
        data: jsPsych.timelineVariable("data"),
        on_finish: function (data: TrialData) {
          data.correct = data.response === data.correct_response;
        },
      };

      const test_procedure = {
        timeline: [fixation, trial],
        timeline_variables: test_stimuli,
        randomize_order: true,
      };

      timeline.push(test_procedure);

      // Resultados
      timeline.push({
        type: HtmlKeyboardResponsePlugin,
        stimulus: function () {
          const data = jsPsych.data.get().filter({ test_part: "test" });
          const correctTrials = data.filter({ correct: true });
          const accuracy = Math.round(
            (correctTrials.count() / data.count()) * 100
          );
          const rt = Math.round(correctTrials.select("rt").mean());

          return `
            <div style="text-align: center; font-size: 24px; max-width: 90vw;">
              <h2>Experiment Completed!</h2>
              <p><strong>Accuracy:</strong> ${accuracy}%</p>
              <p><strong>Average Reaction Time:</strong> ${rt}ms</p>
              <p>Press SPACE to finish.</p>
            </div>
          `;
        },
        choices: [" "],
      });

      async function sendResults() {
        try {
          const trials = jsPsych.data.get().values();

          const accuracy =
            (jsPsych.data.get().filter({ correct: true }).count() /
              trials.length) *
            100;

          const meanRT = jsPsych.data.get().select("rt").mean();
          console.log("Starting experiment...", trials);

          await saveResult({
            participantId: crypto.randomUUID(),
            accuracy,
            meanRT,
            rawTrials: trials,
            advanced: false,
          });
          toast.success("Experiment data successfully saved to Firebase!");
          console.log("Salvo com sucesso!");
        } catch (err) {
          toast.error("Failed to save experiment data.");
          console.error("Erro ao salvar:", err);
        }
      }
      jsPsych.run(timeline).then(async () => {
        await sendResults();
        console.log("results sended.");
        onFinish?.();
      });
    };

    initializeExperiment();

    return () => {
      if (jsPsychRef.current) {
        const displayElement = jsPsychRef.current.getDisplayElement();
        if (displayElement && displayElement.innerHTML) {
          displayElement.innerHTML = "";
        }
        // Também podemos resetar a flag se necessário
        // initializedRef.current = false;
      }
    };
  }, []);

  return (
    <div
      ref={experimentContainer}
      style={{
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: "#f0f0f0",
        margin: 0,
        padding: 0,
      }}
    />
  );
};

export default RTExperiment;
