import React, { useState,useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Divider, Steps, Row, Col, Card } from 'antd';
import MainLayout from '@/components/mainlayout';
import CustomMenu from '@/components/custommenu';
import { ArrowLeftIcon,LogoIcon, CheckICon, WithFamilyIcon, YourSelfIcon } from '@/icons/icon';

import CustomMobileMenu from '@/components/custommobilemenu';
import { ViewStatusFirstSvg } from '@/icons/svgs';


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
      console.log("size",window.innerWidth < 768);
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
    if (cardName === 'Family Gyan Darshan') {
      setContinueButtonText('Continue with Family Darshan');
      setButtonSize('large');
    } else if (cardName === 'Darshan For Yourself') {
      setContinueButtonText('Continue Darshan with Yourself');
      setButtonSize('middle');
    }
  };
  

  const handleContinueClick = () => {
    const isFamilyGyanDarshan = selectedCard === 'Family Gyan Darshan';
    router.push(`/krupadarshan/addpersonaldetails?isFamilyKrupaDarshan=${isFamilyGyanDarshan}`);
  };
  
  return (
      
    <MainLayout siderClassName={isMobileView ? "" : "leftMenuPanel"} siderChildren={!isMobileView && <CustomMenu />}> 
    <div
    style={{
      justifyContent: "center",
      padding: "0 20px", // Adjust padding for space on left and right
      boxSizing: "border-box", // Ensure padding is included in width calculation
    }}
  >

  {isMobileView && (
  <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: "5px",
        paddingBottom: "5px", // Add padding only at the bottom to create space for the border
        borderBottom: "1px solid #ccc", // Border only at the bottom with color #ccc
      }}
    > 
   
    <>
      <LogoIcon className="logomenu" />
      <div> <CustomMobileMenu /></div>
     
    </>
  
</div>
)}

        <div style={{ fontWeight: "bold", fontSize: "1rem",marginLeft:"3rem" }}>
          <ArrowLeftIcon onClick={() => router.back()} />
          Apply for Gyan Darshan
        </div>
        <div style={{ marginLeft: '4.2rem' }}>
        <label className="Descriptionlabel">Add Application details</label>
        </div>
        <Row justify="center">
      <Col xs={24} xl={24}>
        {/* <div className="center-steps">
          <Steps current={-1} style={{ width: "50%" }} direction="horizontal" labelPlacement='vertical'>
            <Step title="Add application details" />
            <Step title="Complete & apply" />
            <Step title="View status" />
          </Steps>
        </div> */}
         <div className="center-steps">
      {isMobileView ? (
        <ViewStatusFirstSvg /> // Use uppercase for component name
      ) : (
        <Steps current={-1} style={{ width: "50%" }} labelPlacement="vertical">
          <Steps.Step title="Add application details" />
          <Steps.Step title="Complete & apply" />
          <Steps.Step title="View status" />
        </Steps>
      )}
    </div>
      </Col>
    </Row>
    
<Divider className="divider" />
      <div style={{ fontWeight: 'bold', fontSize: '0.8rem', marginLeft: '3rem' }}>
        Select Your Type
      </div>
      <div style={{  fontSize: '0.8rem', marginLeft: '3rem' }}> Please choose one option to proceed.</div>
      <Row gutter={[16, 16]} style={{ marginLeft: '3rem' }}>
  <Col xs={12} sm={24} md={12} lg={12} xl={6}>
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Card
        title={<YourSelfIcon style={{ fontSize: '1.5rem' }} />}
        style={{
          flex: 1,
          marginTop: '2rem',
          backgroundColor: selectedCard === 'Darshan For Yourself' ? 'lightblue' : 'white',
        }}
        onClick={() => handleCardClick('Darshan For Yourself')}>
        <div style={{ marginTop: '2rem', fontWeight: 'bold', fontSize: '1.3rem' }}>
          Darshan For
          <br /> Yourself
        </div>
        <div style={{ marginTop: '2rem' }}>
          Select this option for Gyandarshan with yourself
        </div>
        {selectedCard === 'Darshan For Yourself' && (
          <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
            <CheckICon style={{ color: 'green', fontSize: '20px' }} />
          </div>
        )}
      </Card>
    </div>
  </Col>
  <Col xs={12} sm={24} md={12} lg={12} xl={6}>
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Card
        title={<WithFamilyIcon style={{ fontSize: '1.5rem' }} />}
        style={{
          flex: 1,
          marginTop: '2rem',
          backgroundColor: selectedCard === 'Family Gyan Darshan' ? 'lightblue' : 'white',
        }}
        onClick={() => handleCardClick('Family Gyan Darshan')}>
        <div style={{ marginTop: '2rem', fontWeight: 'bold', fontSize: '1.3rem' }}>
          Family Gyan Darshan
        </div>
        <div style={{ marginTop: '2rem' }}>
          Select this option for Family Gyan Darshan
        </div>
        {selectedCard === 'Family Gyan Darshan' && (
          <div style={{ position: 'absolute', top: '0.625rem', right: '0.625rem' }}>
            <CheckICon style={{ color: 'green', fontSize: '1.25rem' }} />
          </div>
        )}
      </Card>
    </div>
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
      </div>
    </MainLayout>
  );
}
