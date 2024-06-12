import React from "react";
import { Steps } from "antd";


interface StepComponentProps {
  currentStep: number;
}

const StepComponent: React.FC<StepComponentProps> = ({ currentStep }) => {
  return (
    <Steps
      current={currentStep}
      style={{ width: "40%" }}
      labelPlacement="vertical"
      responsive={false}
      className="center-steps"
      
    >
      <Steps.Step
        title="Add application details"
        status={currentStep > 0 ? "finish" : "process"}
      />
      <Steps.Step
        title="Complete & apply"
        status={currentStep > 1 ? "finish" : currentStep === 1 ? "process" : "wait"}
      />
      <Steps.Step
        title="View status"
        status={currentStep > 2 ? "finish" : currentStep === 2 ? "process" : "wait"}
      />
    </Steps>
  );
};



export default StepComponent;
