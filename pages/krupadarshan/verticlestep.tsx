import React from 'react';
import { Steps, Button, message } from 'antd';
import { CheckCircleOutlined, SolutionOutlined, LoadingOutlined, SmileOutlined } from '@ant-design/icons';

const { Step } = Steps;

const VerticalStepper = () => {
  const [current, setCurrent] = React.useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [
    {
      title: 'First Step',
      content: 'First-step content.',
      icon: <SolutionOutlined />
    },
    {
      title: 'Second Step',
      content: 'Second-step content.',
      icon: <LoadingOutlined />
    },
    {
      title: 'Third Step',
      content: 'Third-step content.',
      icon: <SmileOutlined />
    },
    {
      title: 'Completed',
      content: 'This is the completed step.',
      icon: <CheckCircleOutlined />
    }
  ];

  return (
    <div>
      <Steps
        direction="vertical"
        current={current}
        style={{ marginLeft: '2rem' }}
      >
        {steps.map((item, index) => (
          <Step
            key={index}
            title={item.title}
            icon={item.icon}
            description={item.content}
            status={index === current ? 'process' : index < current ? 'finish' : 'wait'}
          />
        ))}
      </Steps>
      <div className="steps-content" style={{ margin: '2rem' }}>
        {steps[current].content}
      </div>
      <div className="steps-action" style={{ margin: '2rem' }}>
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => message.success('Process complete!')}>
            Done
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
    </div>
  );
};

export default VerticalStepper;
