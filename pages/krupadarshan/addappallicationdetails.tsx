import React, { useState,useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Divider, Steps, Row, Col, Card } from 'antd';
import MainLayout from '@/components/mainlayout';
import CustomMenu from '@/components/custommenu';
import { ArrowLeftIcon } from '@/icons/icon';
import { TeamOutlined, UserOutlined, CheckOutlined } from '@ant-design/icons';
import CustomMobileMenu from '@/components/custommobilemenu';


export default function AddApplicationDetailsPage() {
  const { Step } = Steps;
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [buttonColor, setButtonColor] = useState('gray');
  const [continueButtonText, setContinueButtonText] = useState('Continue');
  const [buttonSize, setButtonSize] = useState<'large' | 'middle' | 'small'>('large');
  const [isContinueDisabled, setIsContinueDisabled] = useState(true); // State to manage continue button disable/enable
  const [isMobileView, setIsMobileView] = useState(false); // Define isMobileView state

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768); // Update isMobileView based on window width
    };

    handleResize(); // Call once on component mount
    window.addEventListener("resize", handleResize); // Listen for window resize events

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup on component unmount
    };
  }, []);

  
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
    <MainLayout siderClassName={isMobileView ? "" : "leftMenuPanel"} siderChildren={!isMobileView && <CustomMenu />}>
<div >
    {isMobileView && <CustomMobileMenu />}
    </div>
     <div style={{ marginLeft: "3rem" }}>
        <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
          <ArrowLeftIcon onClick={() => router.back()} />
          Apply for Krupa Darshan
        </div>
        <div style={{ marginLeft: '1.2rem' }}>
        <label className="Descriptionlabel">Add Application details</label>
        </div>
        <div className="center-steps">
          <Steps
            current={-1}
            style={{ width: "50%" }}
            className="my-custom-steps"
            labelPlacement="vertical"
          >
            <Step title="Add application details" />
            <Step title="Complete & apply" />
            <Step title="view status" />
          </Steps>
        </div>
      </div>
<Divider style={{ marginTop: '3rem' }} />
      <div style={{ fontWeight: 'bold', fontSize: '0.8rem', marginLeft: '3rem' }}>
        Select Your Type
      </div>
      <div style={{  fontSize: '0.8rem', marginLeft: '3rem' }}> Please choose one option to proceed.</div>
      <Row gutter={[16, 16]} style={{ marginLeft: '3rem' }}>
       
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
            Select this option for krupadarshan with yourself
            </div>
            {selectedCard === 'Darshan For Yourself' && (
              <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                <CheckOutlined style={{ color: 'green', fontSize: '20px' }} />
              </div>
            )}
          </Card>
        </Col>
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
             Select this option for Family Krupa Darshan
            </div>
            {selectedCard === 'Family Krupa Darshan' && (
              <div style={{ position: 'absolute', top: '0.625rem', right: '0.625rem' }}>
                <CheckOutlined style={{ color: 'green', fontSize: '1.25rem' }} />
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
            marginBottom:"1rem"
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
