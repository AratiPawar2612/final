import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Divider,
  Steps,
  Card,
  Form,
  Row,
  Col,
  Avatar,
  Modal,
  DatePicker,
} from "antd";
import { ElipseIcon,LogoIcon } from "@/icons/icon";
import MainLayout from "@/components/mainlayout";
import CustomMenu from "@/components/custommenu";
import {ArrowLeftIcon} from "@/icons/icon";
import {
  fetchParticipantData} from "../api/applicationapi";
import dayjs from "dayjs";
import CustomMobileMenu from "@/components/custommobilemenu";




export default function ViewStatusPage() {
    const router = useRouter();
    const { Step } = Steps;
 const [username, setUsername] = useState('');
    const [status1, setStatus] = useState('');
    const [token, setToken] = useState('');
    const [appliid, setAppliid] = useState('');
    const [referenceCode, setReferenceCode] = useState('');
    const [particpantdata, setParticpantdata] = useState<any>([]);
    const [data, setData] = useState<any>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [startdate, setStartdate] = useState('');
    const [enddate, setEnddate] = useState('');
    const [isMobileView, setIsMobileView] = useState(false);


  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768); 
    };

    handleResize();
    window.addEventListener("resize", handleResize); 
    return () => {
      window.removeEventListener("resize", handleResize); 
    };
  }, []);


 
    useEffect(() => {
   
        const fetchData = async () => {
          try {
            const sessionResponse = await fetch('/api/getsession');
            const sessionData = await sessionResponse.json();
            setUsername(sessionData?.session?.user.name);
            setToken(sessionData?.session?.access_token);
    
            if (sessionData?.session) {
              const apiUrl = 'https://hterp.tejgyan.org/django-app/event/applications/';
              const getApplicationId = await fetch(apiUrl, {
                headers: {
                  Authorization: `Bearer ${sessionData?.session?.access_token}`,
                  'Content-Type': 'application/json',
                },
              });
              const appliidres = await getApplicationId.json();
              const userDataResults1 = appliidres.results ?? [];
              setAppliid(userDataResults1[0]?.id);
              setReferenceCode(userDataResults1[0]?.reference_code);
              setData(userDataResults1);
              console.log("applicationdata",userDataResults1);  
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
                  'Content-Type': 'application/json',
                },
              });
              const userDataResponse = await userResponse.json();
              const userDataResults = userDataResponse.results[0] ?? [];
              setData(userDataResponse);
              setStatus(userDataResults?.status);
            } else {
              router.push('/');
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
       
        fetchData();
    
        
      }, [router]); // Dependency on router to refetch data when router changes
    
      const handleOpenModal = () => {
        setIsModalVisible(true);
      };
    
      const handleCloseModal = () => {
        setIsModalVisible(false);
      };
    
      const handleConfirmClick = async () => {
        try {
          const response = await fetch(
            `https://hterp.tejgyan.org/django-app/event/applications/${appliid}/`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ status: 'ACCEPTED_BY_KHOJI' }),
            }
          );
    
          if (!response.ok) {
            throw new Error('Failed to update application status');
          } else {
            const responseData = await response.json();
            console.log('Updated application:', responseData);
            alert('Your application is confirmed');
            window.location.reload();
            return responseData;
          }
        } catch (error) {
          console.error('Error updating application status:', error);
          throw error;
        }
      };
    
      const handleFormSubmit = async () => {
        try {
          const response = await fetch(
            `https://hterp.tejgyan.org/django-app/event/applications/${appliid}/reschedule/`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ preferred_start_date: startdate, preferred_end_date: enddate }),
            }
          );
    
          if (!response.ok) {
            throw new Error('Failed to update application status');
          } else {
            const responseData = await response.json();
            console.log('Updated application:', responseData);
            alert('Your application reschedule');
            setIsModalVisible(false);
            window.location.reload();
            return responseData;
          }
        } catch (error) {
          console.error('Error submitting form:', error);
        }
      };
    
      const disabledDate = (current: any, startDate: any, endDate: any) => {
        return (
          current &&
          (current < dayjs().startOf('day') ||
            (startDate && current < dayjs(startDate).startOf('day')) ||
            (endDate && current > dayjs(endDate).endOf('day')))
        );
      };
    
      const cardData = [
        { title: 'Application received', content: 'Your application has been successfully submitted to the admin. You will be notified of further updates. Kindly check your status within 24 hours.' },
        { title: 'Event assigned', content: 'Content for card 2' },
        { title: 'Event Confirmed', content: 'Congratulations! Your application has been confirmed by the admin.' },
      ];

 
 
  return (
    <MainLayout siderClassName={isMobileView ? "" : "leftMenuPanel"} siderChildren={!isMobileView && <CustomMenu />}>
   <div style={{ display: "flex",flexDirection:"row", justifyContent: "space-between" }}>
  {isMobileView && (
    <>
      <LogoIcon className="logomenu" />
      <div> <CustomMobileMenu /></div>
     
    </>
  )}
</div>

        <div style={{ marginLeft: "3rem" }}>
        <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
          <ArrowLeftIcon onClick={() => router.back()} />
          Apply for Gyan Darshan
        </div>
        <div style={{ marginLeft: '1.2rem' }}>
        <label className="Descriptionlabel">View Status</label>
        </div>
        <div className={isMobileView ? "horizontal-steps" : "center-steps"}>
          <Steps current={2} style={{ width: "50%" }} labelPlacement="vertical">
            <Step title="Add application details" />
            <Step title="Complete & apply" />
            <Step title="View status" />
          </Steps>
        </div>
      </div>
      <Divider className="divider"/>
      <div className="StatusMessageLabel" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
        {status1 === 'SUBMITTED' && 'Congratulations! Your application has been submitted successfully'}
        {status1 === 'APPROVED_BY_DKD' && 'Congratulations! Your application has been event assigned'}
        {status1 === 'ACCEPTED_BY_KHOJI' && 'Congratulations! Your application has been accepted'}
      </div>
      <div className="viewstatusLabel" style={{ marginTop: '1rem'}}>
        <div style={{ marginBottom: '1rem', fontWeight: 'bold' }}>Hi {username},</div>
        <label style={{ textWrap: 'nowrap' }}>{`Here's the status of your Gyan Darshan application`}</label>
      </div>
       <Row gutter={[16, 16]} style={{ marginTop: '2rem', display: 'flex', marginLeft: '3rem' }}>
        <Col xs={24} sm={24} md={12} lg={12} xl={6}>
          <Card style={{ marginBottom: '1rem', textAlign: 'center' }} bordered>
            <div style={{ fontWeight: 'bold' }}>Application History</div>
            <label>{referenceCode}</label>
          </Card>
          <Card style={{ marginBottom: '1rem', textAlign: 'center' }} bordered>
            <div style={{ fontWeight: 'bold' }}>Application Type</div>
            <label>Gyandarshan</label>
          </Card>
          <Card style={{ marginBottom: '1rem', textAlign: 'center' }} bordered>
            <div style={{ fontWeight: 'bold' }}>Total Applicants</div>
            <label>------</label>
          </Card>
          <Divider />
          <div>
            {particpantdata ? (
              particpantdata.map((participant: any) => (
                <Card key={participant.id} style={{ marginBottom: '1rem', textAlign: 'center' }} bordered>
                  <div style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>
                    <Avatar size={64} icon={<ElipseIcon/>} />
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
                      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'row' }}>
                        <Button style={{ marginRight: '1rem' }} type="default" onClick={handleOpenModal}>
                          Reschedule
                        </Button>
                        <Modal
                          title="Reschedule Application"
                          visible={isModalVisible}
                          onCancel={handleCloseModal}
                          footer={[
                            <Button key="cancel" onClick={handleCloseModal}>
                              Cancel
                            </Button>,
                            <Button key="submit" type="primary" onClick={handleFormSubmit}>
                              Submit
                            </Button>,
                          ]}
                        >
                          <Form layout="vertical" onFinish={handleFormSubmit}>
                            <Form.Item label="Preferred Start Date" name="preferredStartDate">
                              <DatePicker
                                value={startdate}
                                onChange={(date) => setStartdate(date)}
                                format="YYYY-MM-DD"
                                disabledDate={(current) => disabledDate(current, null, startdate)}
                              />
                            </Form.Item>
                            <Form.Item label="Preferred End Date" name="preferredEndDate">
                              <DatePicker
                                value={enddate}
                                onChange={(date) => setEnddate(date)}
                                format="YYYY-MM-DD"
                                disabledDate={(current) => disabledDate(current, null, enddate)}
                              />
                            </Form.Item>
                          </Form>
                        </Modal>
                        <Button onClick={handleConfirmClick} type="primary" style={{ backgroundColor: 'green' }}>
                          Confirm
                        </Button>
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
