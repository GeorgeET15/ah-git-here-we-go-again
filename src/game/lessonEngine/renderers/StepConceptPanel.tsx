/**
 * Step Renderer for Concept Steps
 */

import React from "react";
import { useLessonEngine } from "../LessonContext";
import { ConceptStep } from "../types";
import { ConceptPanel, ConceptExplanation } from "@/components/concept/ConceptPanel";
import { conceptExplanations } from "@/data/conceptExplanations";
import { useState, useEffect } from "react";

interface StepConceptPanelProps {
  step: ConceptStep;
}

export const StepConceptPanel: React.FC<StepConceptPanelProps> = ({ step }) => {
  const { nextStep, goToStep } = useLessonEngine();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (step.autoShow !== false) {
      // Delay showing concept panel to allow animations to complete
      // Timeline animations take ~0.6-1.2s, particles ~2s, so wait 2.5s total
      const timer = setTimeout(() => {
        setShow(true);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [step.autoShow, step.id]);

  const concept: ConceptExplanation | undefined = conceptExplanations[step.conceptId];

  if (!concept) {
    console.warn(`Concept not found: ${step.conceptId}`);
    return null;
  }

  const handleContinue = () => {
    setShow(false);
    if (step.nextStep) {
      // Go to specific step by ID
      goToStep(step.nextStep);
    } else {
      nextStep();
    }
  };

  return (
    <ConceptPanel
      concept={concept}
      onContinue={handleContinue}
      show={show}
    />
  );
};

