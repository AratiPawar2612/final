import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Button,
  Divider,
  Steps,
  Select,
  DatePicker,
  Form,
  Row,
  Col,
  Input,
  Card,
} from 'antd';
import MainLayout from '@/components/mainlayout';
import CustomMenu from '@/components/custommenu';
import dayjs from 'dayjs';
import axios from 'axios';
import { ArrowLeftIcon } from '@/icons/icon';
;

export default function Selectprefrreddatepage() {
  const { Step } = Steps;
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState('');
  const [buttonColor, setButtonColor] = useState('gray');
  const [buttonText, setButtonText] = useState('Continue');
  
  const disabledDate = (current: any) => {
    return current && current < dayjs().endOf('day');
  };
  const handleContinueClick = () => {
    router.push('/krupadarshan/addappallicationdetails');
  };
  const handleCardClick = (cardTitle: any, cardDate: any) => {
    setSelectedCard(cardDate);
    setButtonColor('black');
    setButtonText(`Continue - ${cardDate}`);
  };
  return (
    <MainLayout siderClassName="leftMenuPanel" siderChildren={<CustomMenu />}>
      <div>
        <div
          style={{
            fontWeight: 'bold',
            
          }}>
          <ArrowLeftIcon onClick={() => router.back()} /> Apply for Krupa
          Darshan
          <div>
            <label className="verifyKhojiSubtitle">Select Preferred Date</label>
          </div>
        </div>
        <div className="center-steps">
          <Steps
            current={-1}
            style={{ width: '50%' }}
            className="my-custom-steps"
            >
            <Step title="Add details" />
            <Step title="Add Application details" />
            <Step title="Complete & Apply" />
            <Step title="view status" />
          </Steps>
        </div>
      </div>
      <Divider style={{ marginTop: '3rem' }} />
      <div
        style={{
          fontWeight: 'bold',
          fontSize: '0.8rem',
          marginLeft: '3.5rem',
          marginTop: '2rem',
        }}>
        Upcoming Opportunities
      </div>
      <div
        className="verifyKhojiSubtitle"
        style={{ whiteSpace: 'pre-wrap', marginLeft: '3.5rem' }}>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry.
        <br />
        {`Lorem Ipsum has been the industry's standard dummy text ever`}
      </div>

      <Row
        gutter={[16, 16]}
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginLeft: '3rem',
          marginRight: '1rem',
          marginTop: '1rem',
        }}>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card
            title={
              <>
                <div style={{ fontSize: '1rem' }}>04</div>
                <div style={{ lineHeight: '1.5' }}>JANUARY</div>
              </>
            }
            bordered={selectedCard === '04 JANUARY'}
            onClick={() => handleCardClick('Card Title 1', '04 JANUARY')}
            style={{
              backgroundColor:
                selectedCard === '04 JANUARY' ? 'lightblue' : 'white',
            }}>
            <div style={{ marginTop: '2rem' }}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </div>
            <div style={{ marginTop: '2rem' }}>10:30 AM - 11:30 AM</div>
            <label>@Manan Ashram, Pune India</label>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card
            title={
              <>
                <div style={{ fontSize: '1rem' }}>05</div>
                <div style={{ lineHeight: '1.5' }}>JANUARY</div>
              </>
            }
            bordered={selectedCard === '05 JANUARY'}
            onClick={() => handleCardClick('Card Title 1', '05 JANUARY')}
            style={{
              backgroundColor:
                selectedCard === '05 JANUARY' ? 'lightblue' : 'white',
            }}>
            <div style={{ marginTop: '2rem' }}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </div>
            <div style={{ marginTop: '2rem' }}>10:30 AM - 11:30 AM</div>
            <label>@Manan Ashram, Pune India</label>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card
            title={
              <>
                <div style={{ fontSize: '1rem' }}>06</div>
                <div style={{ lineHeight: '1.5' }}>JANUARY</div>
              </>
            }
            bordered={selectedCard === '06 JANUARY'}
            onClick={() => handleCardClick('Card Title 1', '06 JANUARY')}
            style={{
              backgroundColor:
                selectedCard === '06 JANUARY' ? 'lightblue' : 'white',
            }}>
            <div style={{ marginTop: '2rem' }}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </div>
            <div style={{ marginTop: '2rem' }}>10:30 AM - 11:30 AM</div>
            <label>@Manan Ashram, Pune India</label>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card
            title={
              <>
                <div style={{ fontSize: '1rem' }}>07</div>
                <div style={{ lineHeight: '1.5' }}>JANUARY</div>
              </>
            }
            bordered={selectedCard === '07 JANUARY'}
            onClick={() => handleCardClick('Card Title 1', '07 JANUARY')}
            style={{
              backgroundColor:
                selectedCard === '07 JANUARY' ? 'lightblue' : 'white',
            }}>
            <div style={{ marginTop: '2rem' }}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </div>
            <div style={{ marginTop: '2rem' }}>10:30 AM - 11:30 AM</div>
            <label>@Manan Ashram, Pune India</label>
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'row' }}>
        <Button
          type="primary"
          onClick={handleContinueClick}
          style={{
            borderRadius: '2rem',
            marginLeft: '3rem',
            width: '8rem',
            height: '1.8rem',
            backgroundColor: buttonColor,
          }}>
          Continue
        </Button>
      </div>
    </MainLayout>
  );
}
