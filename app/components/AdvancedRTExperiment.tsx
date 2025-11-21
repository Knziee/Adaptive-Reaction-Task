"use client";
import { useEffect, useRef } from "react";
import type { JsPsych } from "jspsych";
import { TrialData } from "../types/types";
import { saveResult } from "@/app/service/saveResult";
import toast from "react-hot-toast";

const AdvancedRTExperiment = ({ onFinish }: { onFinish: () => void }) => {
  const experimentContainer = useRef<HTMLDivElement>(null);
  const jsPsychRef = useRef<JsPsych | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (
      jsPsychRef.current ||
      !experimentContainer.current ||
      initializedRef.current
    )
      return;
    initializedRef.current = true;

    const initialize = async () => {
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

      Object.assign(experimentContainer.current!.style, {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        flexDirection: "column",
      });

      const timeline = [];

      timeline.push({
        type: HtmlKeyboardResponsePlugin,
        stimulus: `
          <div style="text-align: center; max-width: 800px; line-height: 1.6;">
            <h1>Advanced Experiment</h1>
            <p>Instructions:</p>
            <ul style="text-align: left; display: inline-block;">
              <li>Press <strong style="color: blue;">F</strong> when you see a BLUE circle</li>
              <li>Press <strong style="color: orange;">J</strong> when you see an ORANGE circle</li>
              <li>Respond as fast and accurately as possible</li>
            </ul>
            <p style="margin-top: 30px; color: #666;">Press SPACE to start</p>
          </div>
        `,
        choices: [" "],
      });

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

      const trialProcedure = {
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

      timeline.push(trialProcedure);

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
                <p>Accuracy: <strong>${accuracy}%</strong></p>
                <p>Average Reaction Time: <strong>${rt}ms</strong></p>
                <p>Total Trials: <strong>${data.count()}</strong></p>
              </div>
              <p style="margin-top: 30px; color: #666;">Press SPACE to return</p>
            </div>
          `;
        },
        choices: [" "],
      });

      async function sendResults() {
        try {
          const trials = jsPsych.data.get().values();

          const data = jsPsych.data.get().filter({ test_part: "test" });
          const correctTrials = data.filter({ correct: true });

          const accuracy = Math.round(
            (correctTrials.count() / data.count()) * 100
          );

          const meanRT = Math.round(correctTrials.select("rt").mean());

          await saveResult({
            participantId: crypto.randomUUID(),
            accuracy,
            meanRT,
            rawTrials: trials,
            advanced: false,
          });

          toast.success("Experiment data successfully saved to Firebase!");
        } catch (err) {
          toast.error("Failed to save experiment data.");
          console.error(err);
        }
      }

      jsPsych.run(timeline).then(async () => {
        await sendResults();
        onFinish?.();
      });
    };

    initialize();

    return () => {
      if (jsPsychRef.current) {
        const element = jsPsychRef.current.getDisplayElement();
        if (element && element.innerHTML) element.innerHTML = "";
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
