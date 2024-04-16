import React from 'react';
import { useRouter } from 'next/router';
import { Button, Divider, Steps, Card, Row, Col, Avatar } from 'antd';
import MainLayout from '@/components/mainlayout';
import CustomMenu from '@/components/custommenu';
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';
import { useEffect,useState } from 'react';
import { title } from 'process';

export default function ViewStatusPage() {
  const { Step } = Steps;
  const router = useRouter();
  const [data, setData] = useState<any>([]);
  const[username,serUsername]=useState('');
  const[status,setStatus]=useState('');



  useEffect(() => {
    const loadMoreData = async() => {
      const sessionresponse = await fetch('/api/getsession');
      const sessionData = await sessionresponse.json();
      console.log('Session Data:', sessionData?.session?.accessToken);
      serUsername(sessionData?.session?.user.name);
     

      const userApiUrl = 'https://hterp.tejgyan.org/django-app/event/applications/';
      const userResponse = await fetch(userApiUrl, {
          headers: {

              Authorization: `Bearer ${sessionData?.session?.access_token}`,
              "Content-Type": "application/json",
          },
      });
      const userDataResponse = await userResponse.json();
    const userDataResults = userDataResponse.results[0] ?? [];
      setData(userDataResponse);
      
      console.log("userDataResults",userDataResponse);
     
      setStatus(userDataResults?.status);
      console.log("status",status);
  };

  loadMoreData();
  }, [status]);
  const [selectedCardIndex, setSelectedCardIndex] = useState(-1);

  const cardData = [
    { title: 'Application reviewed', content: 'Content for card 1' },
    { title: 'Event assigned', content: 'Content for card 2' },
    { title: 'Event Confirmed', content: 'Content for card 3' },
   
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
      <div style={{ marginTop: '1rem', marginLeft: '33.5rem' }}>
        <div style={{ marginBottom: '1rem', fontWeight: 'bold' }}>Hi {username},</div>
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
        <Row gutter={[16, 16]} style={{ marginBottom: '1rem', marginLeft: '8rem' }}>
  {cardData.map((card, index) => (
    <React.Fragment key={index}>
      <Col span={6}>
        <Steps
          current={
            status === 'SUBMITTED'
              ? index === 0
                ? 0
                : -1
              : status === 'APPROVED_BY_DKD'
              ? index < 2
                ? index
                : -1
              : status === 'EVENT_CONFIRM'
              ? index
              : -1
          }
          className="customs-steps"
        >
          <Step />
        </Steps>
      </Col>
      <Col span={18}>
        <Card
          title={card.title}
          className={
            (status === 'SUBMITTED' && index === 0) ||
            (status === 'APPROVED_BY_DKD' && index < 2) ||
            (status === 'EVENT_CONFIRM' && index === 2)
              ? 'enabled-card'
              : 'disabled-card'
          }
        >
          {card.content}
          {card.title === 'Event assigned' && (
            <div style={{ marginTop: '1rem', display: "flex", flexDirection: "row" }}>
              <Button style={{ marginRight: '1rem' }}>Reschedule</Button>
              <Button type="primary" style={{ backgroundColor: 'green' }}>Confirm</Button>
            </div>
          )}
        </Card>
      </Col>
    </React.Fragment>
  ))}
</Row>

        </Col>
      </Row>
    </MainLayout>
  );
}
