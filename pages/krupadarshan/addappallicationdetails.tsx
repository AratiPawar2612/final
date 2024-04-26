import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Divider, Steps, Row, Col, Card } from 'antd';
import MainLayout from '@/components/mainlayout';
import CustomMenu from '@/components/custommenu';
import { ArrowLeftIcon } from '@/icons/icon';
import { TeamOutlined, UserOutlined, CheckOutlined } from '@ant-design/icons';
import CustomFooter from '@/components/customrightpanel';

export default function AddApplicationDetailsPage() {
  const { Step } = Steps;
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [buttonColor, setButtonColor] = useState('gray');
  const [continueButtonText, setContinueButtonText] = useState('Continue');
  const [buttonSize, setButtonSize] = useState<'large' | 'middle' | 'small'>('large');
  const [isContinueDisabled, setIsContinueDisabled] = useState(true); // State to manage continue button disable/enable
  
  const handleCardClick = (cardName: string) => {
    setButtonColor('black');
    setSelectedCard(cardName);
    setIsContinueDisabled(false); // Enable continue button when a card is selected
    if (cardName === 'Family Krupa Darshan') {
      setContinueButtonText('Continue with Family Darshan');
      setButtonSize('large');
    } else if (cardName === 'Darshan For Yourself') {
      setContinueButtonText('Continue Darshan with Yourself');
      setButtonSize('middle');
    }
  };
  

  const handleContinueClick = () => {
    const isFamilyKrupaDarshan = selectedCard === 'Family Krupa Darshan';
    router.push(`/krupadarshan/addpersonaldetails?isFamilyKrupaDarshan=${isFamilyKrupaDarshan}`);
  };
  
  return (
    <MainLayout siderClassName="leftMenuPanel" siderChildren={<CustomMenu />}>
     <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
          <ArrowLeftIcon onClick={() => router.back()} style={{ marginRight: '10px' }} /> Apply for Krupa Darshan
        </div>
        <div style={{ marginLeft: '2rem' }}>
          <label className="Descriptionlabel">Add Application details</label>
        </div>
        <div className="center-steps">
          <Steps current={0} style={{ width: "50%" }} className="my-custom-steps" labelPlacement="vertical">
            <Step title="Add Application details" />
            <Step title="Complete & Apply" />
            <Step title="View status" />
          </Steps>
        </div>
        </div>
<Divider style={{ marginTop: '3rem' }} />
      <div style={{ fontWeight: 'bold', fontSize: '0.8rem', marginLeft: '3rem' }}>
        Select Your Type
      </div>

      <Row gutter={[16, 16]} style={{ marginLeft: '3rem' }}>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card
            title={<TeamOutlined style={{ fontSize: '1.5rem' }} />}
            style={{
              marginTop: '2rem',
              backgroundColor: selectedCard === 'Family Krupa Darshan' ? 'lightblue' : 'white',
              minHeight: '300px',
            }}
            onClick={() => handleCardClick('Family Krupa Darshan')}>
            <div style={{ marginTop: '2rem', fontWeight: 'bold', fontSize: '1.3rem' }}>
              Family Krupa Darshan
            </div>
            <div style={{ marginTop: '2rem' }}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            </div>
            {selectedCard === 'Family Krupa Darshan' && (
              <div style={{ position: 'absolute', top: '0.625rem', right: '0.625rem' }}>
                <CheckOutlined style={{ color: 'green', fontSize: '1.25rem' }} />
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card
            title={<UserOutlined style={{ fontSize: '1.5rem' }} />}
            style={{
              marginTop: '2rem',
              backgroundColor: selectedCard === 'Darshan For Yourself' ? 'lightblue' : 'white',
              minHeight: '300px',
            }}
            onClick={() => handleCardClick('Darshan For Yourself')}>
            <div style={{ marginTop: '2rem', fontWeight: 'bold', fontSize: '1.3rem' }}>
              Darshan For
              <br /> Yourself
            </div>
            <div style={{ marginTop: '2rem' }}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            </div>
            {selectedCard === 'Darshan For Yourself' && (
              <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                <CheckOutlined style={{ color: 'green', fontSize: '20px' }} />
              </div>
            )}
          </Card>
        </Col>
      </Row>
      <div style={{ marginTop: '2rem', marginLeft: '3rem' }}>
        <Button
          type="primary"
          onClick={handleContinueClick}
          style={{
            borderRadius: '2rem',
            marginLeft: '1rem',
            width: '100%',
            maxWidth: '15rem',
            height: '2rem',
            backgroundColor: buttonColor,
          }}
          size={buttonSize}
          disabled={isContinueDisabled} 
        >
          {continueButtonText}
        </Button>
      </div>
    </MainLayout>
  );
}
