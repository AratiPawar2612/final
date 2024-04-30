import React from 'react';
import { useRouter } from 'next/router';
import { Button, Divider, Steps, Card, Row, Col, Avatar } from 'antd';
import MainLayout from '@/components/mainlayout';
import CustomMenu from '@/components/custommenu';
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import useSafeReplace from "@/components/useSafeReplace";
import { useSession } from 'next-auth/react';
import { fetchParticipantData } from '../api/applicationapi';
import { Modal, Form, DatePicker } from 'antd';
import CustomMobileMenu from '@/components/custommobilemenu';
import dayjs from "dayjs";

export default function ViewStatusPage() {
  const { Step } = Steps;
  const router = useRouter();
  const [data, setData] = useState<any>([]);
  const [particpantdata, setParticpantdata] = useState<any>([]);
  const[username,serUsername]=useState('');
  const[status1,setStatus]=useState('');
  const[token,settoken]=useState('');
  const[appliid,setappliid]=useState('');
  const [reference_code, setReferenceCode] = useState('');
  const { data: session, status } = useSession();
  const [isSessionLoading, setIsSessionLoading] = useState(false);
  const { safeReplace } = useSafeReplace();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [startdate, setStartdate] = useState("");
  const [enddate, setEnddate] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);

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

  useEffect(() => {
    const loadMoreData = async() => {
      const sessionresponse = await fetch('/api/getsession');
      const sessionData = await sessionresponse.json();
      serUsername(sessionData?.session?.user.name);
      settoken(sessionData?.session?.access_token);
      if (sessionData?.session) {
        const ApiUrl = 'https://hterp.tejgyan.org/django-app/event/applications/';
        const getapplicationid = await fetch(ApiUrl, {
          headers: {
            Authorization: `Bearer ${sessionData?.session?.access_token}`,
            "Content-Type": "application/json",
          },
        });
        const appliidres = await getapplicationid.json();
        const userDataResults1 = appliidres.results ?? [];
        setappliid(userDataResults1[0]?.id);
        setReferenceCode(userDataResults1[0]?.reference_code);

        const participantUserResponseData = await fetchParticipantData(
          sessionData?.session?.access_token
        );
        const participantresp = participantUserResponseData.results ?? [];
        if (participantresp.length > 0) {
          setParticpantdata(participantresp);
        }

        const userApiUrl = `https://hterp.tejgyan.org/django-app/event/applications/`;
        const userResponse = await fetch(userApiUrl, {
          headers: {
            Authorization: `Bearer ${sessionData?.session?.access_token}`,
            "Content-Type": "application/json",
          },
        });
        const userDataResponse = await userResponse.json();
        const userDataResults = userDataResponse.results[0] ?? [];
        setData(userDataResponse);
        setStatus(userDataResults?.status);
      } else {
        router.push("/");
      }
    };
    loadMoreData();
  }, [router]);


  const handleOpenModal = () => {
    setIsModalVisible(true);
  };
  
  const disabledDate = (current: any, startDate: any, endDate: any) => {
    // Disable dates before today, and dates before the selected start date or after the selected end date
    return (
      current &&
      (current < dayjs().startOf("day") ||
        (startDate && current < dayjs(startDate).startOf("day")) ||
        (endDate && current > dayjs(endDate).endOf("day")))
    );
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleconfirmclick = async () => {
    try {
      const response = await fetch(`https://hterp.tejgyan.org/django-app/event/applications/${appliid}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "ACCEPTED_BY_KHOJI" }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update application status');
      } else {
        const responseData = await response.json();
        console.log('Updated application:', responseData);
        alert("Your application is confirmed");
        window.location.reload();
        return responseData; 
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  }

  const handleFormSubmit = async () => {
    try {
      const response = await fetch(`https://hterp.tejgyan.org/django-app/event/applications/${appliid}/reschedule/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ preferred_start_date: startdate ,preferred_end_date:enddate}),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update application status');
      } else {
        const responseData = await response.json();
        console.log('Updated application:', responseData);
        alert("Your application reschedule");
        setIsModalVisible(false);
        window.location.reload();
        return responseData; 
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const cardData = [
    { title: 'Application received', content: 'Content for card 1' },
    { title: 'Event assigned', content: 'Content for card 2' },
    { title: 'Event Confirmed', content: 'Content for card 3' },
  ];
  
  return (
    <MainLayout siderClassName={isMobileView ? "" : "leftMenuPanel"} siderChildren={!isMobileView && <CustomMenu />}>
<    div >
    {!isMobileView && <CustomMobileMenu />}
    </div>
    
   
        <div className="ArrowLeftIcon">
          <ArrowLeftOutlined onClick={() => router.back()} />  <label className="verifyKhojiSubtitle">Apply for Krupa Darshan</label>
        </div>
        <div style={{ marginLeft: '4rem' }}>
          <label>View status</label>
        </div>
        <div className="center-steps">
          <Steps current={2} className="my-custom-steps" labelPlacement="vertical" style={{ width: '50%' }}>
            <Step title="Add Application details" />
            <Step title="Complete & Apply" />
            <Step title="View status" />
          </Steps>
        </div>
      
      <Divider style={{ marginTop: '3rem' }} />
      <div  className="StatusMessageLabel" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
        {status1 === 'SUBMITTED' && 'Congratulations! Your application has been submitted successfully'}
        {status1 === 'APPROVED_BY_DKD' && 'Congratulations! Your application has been event assigned'}
        {status1 === 'ACCEPTED_BY_KHOJI' && 'Congratulations! Your application has been accepted'}
      </div>
      <div className="viewstatusLabel" style={{ marginTop: '1rem', marginLeft: '33.5rem' }}>
        <div style={{ marginBottom: '1rem', fontWeight: 'bold' }}>Hi {username},</div>
        <label style={{ textWrap: 'nowrap' }}>{`Here's the status of your Krupa Darshan application`}</label>
      </div>
      <Row gutter={[16, 16]} style={{ marginTop: '2rem', display: 'flex', marginLeft: '3rem' }}>
        <Col xs={24} sm={24} md={12} lg={12} xl={6}>
          <Card style={{ marginBottom: '1rem', textAlign: 'center' }} bordered>
            <div style={{ fontWeight: 'bold' }}>Application History</div>
            <label>{reference_code}</label>
          </Card>
          <Card style={{ marginBottom: '1rem', textAlign: 'center' }} bordered>
            <div style={{ fontWeight: 'bold' }}>Application Type</div>
            <label>Krupadarshan</label>
          </Card>
          <Card style={{ marginBottom: '1rem', textAlign: 'center' }} bordered>
            <div style={{ fontWeight: 'bold' }}>Total Applicants</div>
            <label>--------</label>
          </Card>
          <Divider />
          <div>
            {particpantdata ? (
              particpantdata.map((participant: any) => (
                <Card
                  key={participant.id}
                  style={{ marginBottom: '1rem', textAlign: 'center' }}
                  bordered
                >
                  <div style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>
                    <Avatar size={64} icon={<UserOutlined />} />
                    {participant.relation_with.first_name} {participant.relation_with.last_name}
                  </div>
                </Card>
              ))  
            ) : (
              <div>No participant data available</div>
            )}
          </div>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={18}>
          <Row gutter={[16, 16]} style={{ marginBottom: '1rem', marginLeft: '8rem' }}>
            {cardData.map((card, index) => (
              <React.Fragment key={index}>
                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                  <div className="customs-step">
                    <div className={`step-item ${status1 === 'ACCEPTED_BY_KHOJI' && index <= 2 ? 'completed' : ''}`}>
                      <div className="step-circle">{index + 1}</div>
                      {index < cardData.length - 1 && <div className="vertical-line"></div>}
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={24} md={12} lg={16} xl={16}>
                  <Card
                    title={card.title}
                    className={
                      (status1 === 'SUBMITTED' && index === 0) ||
                      (status1 === 'APPROVED_BY_DKD' && index < 2) ||
                      (status1 === 'ACCEPTED_BY_KHOJI' && index === 2)
                        ? 'enabled-card'
                        : 'disabled-card'
                    }
                  >
                    {card.content}
                    {(status1 === 'APPROVED_BY_DKD' && index === 1) ||
                    (status1 === 'ACCEPTED_BY_KHOJI' && index === 1) ? (
                      <div style={{ marginTop: '1rem', display: "flex", flexDirection: "row" }}>
                        <Button style={{ marginRight: '1rem' }} type="default" onClick={handleOpenModal} >Reschedule</Button>
                        <Modal
                          title="Reschedule Application"
                          visible={isModalVisible}
                          onCancel={handleCloseModal}
                          footer={[
                            <Button key="cancel" onClick={handleCloseModal}>Cancel</Button>,
                            <Button key="submit" type="primary" onClick={handleFormSubmit}>Submit</Button>,
                          ]}
                        >
                          <Form layout="vertical" onFinish={handleFormSubmit}>
                            <Form.Item label="Preferred Start Date" name="preferredStartDate">
                              <DatePicker
                                value={startdate}
                                onChange={(date) => setStartdate(date)}
                                format="YYYY-MM-DD"
                                disabledDate={(current) =>
                                  disabledDate(current, null, startdate)
                                }
                              />
                            </Form.Item>
                            <Form.Item label="Preferred End Date" name="preferredEndDate">
                              <DatePicker
                                value={enddate}
                                onChange={(date) => setEnddate(date)}
                                format="YYYY-MM-DD"
                                disabledDate={(current) =>
                                  disabledDate(current, null, enddate)
                                }
                              />
                            </Form.Item>
                          </Form>
                        </Modal>
                        <Button onClick={handleconfirmclick} type="primary" style={{ backgroundColor: 'green' }}>Confirm</Button>
                      </div>
                    ) : null}
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
