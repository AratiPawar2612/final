import React from 'react';
import { useRouter } from 'next/router';
import { Button, Divider, Steps, Card, Row, Col, Avatar } from 'antd';
import MainLayout from '@/components/mainlayout';
import CustomMenu from '@/components/custommenu';
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';

export default function ViewStatusPage() {
  const { Step } = Steps;
  const router = useRouter();

  const cardData = [
    { title: 'Lorem Ipsum 1', content: 'Content for card 1' },
    { title: 'Lorem Ipsum 2', content: 'Content for card 2' },
    { title: 'Lorem Ipsum 3', content: 'Content for card 3' },
    { title: 'Lorem Ipsum 4', content: 'Content for card 4' },
    { title: 'Lorem Ipsum 5', content: 'Content for card 5' },
    { title: 'Lorem Ipsum 6', content: 'Content for card 6' },
    { title: 'Lorem Ipsum 7', content: 'Content for card 7' },
  ];

  return (
    <MainLayout siderClassName="leftMenuPanel" siderChildren={<CustomMenu />}>
      <div>
        <div
          style={{
            fontWeight: 'bold',
            fontSize: '1rem',
            marginLeft: '3rem',
            marginTop: '2rem',
          }}>
          <ArrowLeftOutlined onClick={() => router.back()} /> Apply for Krupa
          Darshan
        </div>
        <div style={{ marginLeft: '4rem' }}>
          {' '}
          <label className="verifyKhojiSubtitle">View status</label>
        </div>

        <div className="center-steps">
          <Steps
            current={2}
            className="my-custom-steps"
            labelPlacement="vertical"
            style={{ width: '50%' }}>
            <Step title="Add Application details" />
            <Step title="Complete & Apply" />
            <Step title="View status" />
          </Steps>
        </div>
      </div>
      <Divider style={{ marginTop: '3rem' }} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '1.2rem',
        }}>
        {' '}
        Congratulations! You’re application had been submitted successfully
      </div>
      <div style={{ marginTop: '1rem', marginLeft: '36rem' }}>
        <div style={{ marginBottom: '1rem', fontWeight: 'bold' }}>Hi Xyz,</div>
        <label style={{ textWrap: 'nowrap' }}>
          {`Here's the status of your Krupa Darshan application`}
        </label>
      </div>
      <Row
        gutter={[16, 16]}
        style={{ marginTop: '2rem', display: 'flex', marginLeft: '3rem' }}>
        <Col span={6}>
          <Card style={{ marginBottom: '1rem', textAlign: 'center' }} bordered>
            <div style={{ fontWeight: 'bold' }}>Application History</div>
            <label>#1234567</label>
          </Card>
          <Card style={{ marginBottom: '1rem', textAlign: 'center' }} bordered>
            <div style={{ fontWeight: 'bold' }}>Application Type</div>
            <label>Krupadarshan</label>
          </Card>
          <Card style={{ marginBottom: '1rem', textAlign: 'center' }} bordered>
            <div style={{ fontWeight: 'bold' }}>Total Applicants</div>
            <label>2 Adults 1 Child</label>
          </Card>
          <Divider />
          <Card style={{ marginBottom: '1rem', textAlign: 'center' }} bordered>
            <div style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>
              <Avatar size={64} icon={<UserOutlined />} />
              Lorem Ipsum
            </div>
          </Card>
          <Card style={{ marginBottom: '1rem', textAlign: 'center' }} bordered>
            <div style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>
              <Avatar size={64} icon={<UserOutlined />} />
              Lorem Ipsum
            </div>
          </Card>
          <Card style={{ marginBottom: '1rem', textAlign: 'center' }} bordered>
            <div style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>
              <Avatar size={64} icon={<UserOutlined />} />
              Lorem Ipsum
            </div>
          </Card>
        </Col>
        <Col span={10}>
          <Row
            gutter={[16, 16]}
            style={{ marginBottom: '1rem', marginLeft: '8rem' }}>
            {cardData.map((card, index) => (
              <React.Fragment key={index}>
                <Col span={12}>
                  <Steps current={-1} className="customs-steps">
                    <Step />
                  </Steps>
                </Col>
                <Col span={12}>
                  <Card title={`Card ${index + 1}`}>{card.content}</Card>
                </Col>
              </React.Fragment>
            ))}
          </Row>
        </Col>
      </Row>
    </MainLayout>
  );
}
