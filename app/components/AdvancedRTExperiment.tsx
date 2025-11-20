"use client";
import { useEffect, useRef } from "react";
import { TrialData } from "../types/types";
import type { JsPsych } from "jspsych";

const AdvancedRTExperiment = () => {
  const experimentContainer = useRef<HTMLDivElement>(null);
  const jsPsychRef = useRef<JsPsych | null>(null);

  useEffect(() => {
    if (jsPsychRef.current || !experimentContainer.current) return;

    const initializeExperiment = async () => {
      // ✅ IMPORTS DINÂMICOS — resolvem "window is not defined"
      const { initJsPsych } = await import("jspsych");
      const HtmlKeyboardResponsePlugin = (
        await import("@jspsych/plugin-html-keyboard-response")
      ).default;

      const jsPsych = initJsPsych({
        display_element: experimentContainer.current!,
        on_finish: function () {
          const data = jsPsych.data.get();
          console.log("Complete data:", data);
        },
      });

      jsPsychRef.current = jsPsych;

      // Container style
      Object.assign(experimentContainer.current!.style, {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        flexDirection: "column",
      });

      const timeline = [];

      // Instructions
      timeline.push({
        type: HtmlKeyboardResponsePlugin,
        stimulus: `
          <div style="text-align: center; max-width: 800px; line-height: 1.6;">
            <h1>Advanced Experiment</h1>
            <p>Instructions:</p>
            <ul style="text-align: left; display: inline-block;">
              <li>Press <strong style="color: blue;">F</strong> when you see a BLUE circle</li>
              <li>Press <strong style="color: orange;">J</strong> when you see an ORANGE circle</li>
              <li>Respond as quickly and accurately as possible!</li>
            </ul>
            <p style="margin-top: 30px; color: #666;">Press SPACE to start</p>
          </div>
        `,
        choices: [" "],
      });

      // Stimuli
      const stimuli = [
        {
          stimulus: "<div style='color: blue; font-size: 48px;'>●</div>",
          data: { condition: "blue", correct_response: "f", test_part: "test" },
        },
        {
          stimulus: "<div style='color: orange; font-size: 48px;'>●</div>",
          data: {
            condition: "orange",
            correct_response: "j",
            test_part: "test",
          },
        },
      ];

      // Trial procedure
      const trial_procedure = {
        timeline: [
          {
            type: HtmlKeyboardResponsePlugin,
            stimulus: '<div style="font-size: 60px; color: #333;">+</div>',
            choices: "NO_KEYS",
            trial_duration: 1000,
          },
          {
            type: HtmlKeyboardResponsePlugin,
            stimulus: jsPsych.timelineVariable("stimulus"),
            choices: ["f", "j"],
            data: jsPsych.timelineVariable("data"),
            trial_duration: 2000,
            on_finish: function (data: TrialData) {
              data.correct = data.response === data.correct_response;
            },
          },
        ],
        timeline_variables: stimuli,
        randomize_order: true,
        repetitions: 3,
      };

      timeline.push(trial_procedure);

      // Results
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
            <div style="text-align: center; max-width: 600px;">
              <h1>Final Results</h1>
              <div style="font-size: 1.2rem; line-height: 2;">
                <p>🎯 Accuracy: <strong>${accuracy}%</strong></p>
                <p>⚡ Average Reaction Time: <strong>${rt}ms</strong></p>
                <p>📊 Total Trials: <strong>${data.count()}</strong></p>
              </div>
              <p style="margin-top: 30px; color: #666;">Press SPACE to return to menu</p>
            </div>
          `;
        },
        choices: [" "],
      });

      jsPsych.run(timeline);
    };

    initializeExperiment();

    return () => {
      if (jsPsychRef.current) {
        const displayElement = jsPsychRef.current.getDisplayElement();
        if (displayElement && displayElement.innerHTML) {
          displayElement.innerHTML = "";
        }
      }
    };
  }, []);

  return (
    <div
      ref={experimentContainer}
      style={{
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        margin: 0,
        padding: 0,
      }}
    />
  );
};

export default AdvancedRTExperiment;
