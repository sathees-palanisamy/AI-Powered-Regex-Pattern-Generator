import React from "react";
import { useRegexGenerator } from "./hooks/useRegexGenerator";

import DescriptionInput from "./components/DescriptionInput";
import SampleList from "./components/SampleList";
import Actions from "./components/Actions";
import PatternCard from "./components/PatternCard";
import TestPattern from "./components/TestPattern";

export default function App() {
  const state = useRegexGenerator();

  return (
    <div className="app">
      <div className="container">
        <h1>🔍 Regex Pattern Generator</h1>

        {/* Inputs */}
        <DescriptionInput
          description={state.description}
          setDescription={state.setDescription}
        />

        <SampleList
          samples={state.samples}
          updateSample={state.updateSample}
          removeSample={state.removeSample}
          addSample={state.addSample}
        />

        {state.error && <div className="error-message">{state.error}</div>}

        <Actions
          generatePattern={state.generatePattern}
          resetForm={state.resetForm}
          loading={state.loading}
        />

        {/* Results */}
        {state.generatedData && (
          <>
            <PatternCard generatedData={state.generatedData} />
            <TestPattern
              testInput={state.testInput}
              setTestInput={state.setTestInput}
              testPattern={state.testPattern}
              testResult={state.testResult}
            />
          </>
        )}
      </div>
    </div>
  );
}