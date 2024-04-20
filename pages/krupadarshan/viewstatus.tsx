import React from 'react';
import { useRouter } from 'next/router';
import { Button, Divider, Steps, Card, Row, Col, Avatar } from 'antd';
import MainLayout from '@/components/mainlayout';
import CustomMenu from '@/components/custommenu';
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';
import { useEffect,useState } from 'react';
import useSafeReplace from "@/components/useSafeReplace";
import { useSession } from 'next-auth/react';

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


  useEffect(() => {
    const loadMoreData = async() => {
      const sessionresponse = await fetch('/api/getsession');
      const sessionData = await sessionresponse.json();
      console.log('Session Data:', sessionData?.session?.access_token);
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
      console.log("userDat",userDataResults1);
      setappliid(userDataResults1[0]?.id);
      setReferenceCode(userDataResults1[0]?.reference_code)


     

      // const participantUserResponseData = await fetchParticipantData(
      //   sessionData?.session?.access_token
      // );
      // if(participantUserResponseData.length>0)
      //   {

      //     setParticpantdata(participantUserResponseData);
      //   }
     


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
      
      console.log("userDataResults",userDataResponse);
     
      setStatus(userDataResults?.status);
      console.log("status",userDataResults?.status);
    }
    else{
      router.push("/")
    }
  };

  loadMoreData();
  }, [router]);
  const [selectedCardIndex, setSelectedCardIndex] = useState(-1);

  const cardData = [
    { title: 'Application received', content: 'Content for card 1' },
    { title: 'Event assigned', content: 'Content for card 2' },
    { title: 'Event Confirmed', content: 'Content for card 3' },
   
  ];

  const handleconfirmclick = async () => {
    try {
      const response = await fetch(`https://hterp.tejgyan.org/django-app/event/applications/${appliid}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the access token in the Authorization header
        },
        body: JSON.stringify({ status: "ACCEPTED_BY_KHOJI" }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update application status');
      } else {
        const responseData = await response.json();
        console.log('Updated application:', responseData);
        alert("Your application is confirmed");
        // Refresh the page
        window.location.reload();
        return responseData; // Return the updated data if needed
      }
  
      // If the request is successful, you may handle the response here
  
    } catch (error) {
      console.error('Error updating application status:', error);
      // Handle error scenarios
      throw error;
    }
  }
  
 
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
       {status1 === 'SUBMITTED' && 'Congratulations! Your application has been submitted successfully'}
  {status1 === 'APPROVED_BY_DKD' && 'Congratulations! Your application has been event assigned'}
  {status1 === 'ACCEPTED_BY_KHOJI' && 'Congratulations! Your application has been accepted'}

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
            <label>{reference_code}</label>
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
        <div className="customs-step">
          <div className={`step-item ${status1 === 'ACCEPTED_BY_KHOJI' && index <= 2 ? 'completed' : ''}`}>
            <div className="step-circle">{index + 1}</div>
            {index < cardData.length - 1 && <div className="vertical-line"></div>}
          </div>
        </div>
      </Col>
      <Col span={18}>
        <Card
          title={card.title}
          className={
            (status1 === 'SUBMITTED' && index === 0) ||
            (status1=== 'APPROVED_BY_DKD' && index < 2) ||
            (status1 === 'ACCEPTED_BY_KHOJI' && index === 2)
              ? 'enabled-card'
              : 'disabled-card'
          }
        >
          {card.content}
          {(status1 === 'APPROVED_BY_DKD' && index === 1) ||
          (status1 === 'ACCEPTED_BY_KHOJI' && index === 1) ? (
            <div style={{ marginTop: '1rem', display: "flex", flexDirection: "row" }}>
              <Button style={{ marginRight: '1rem' }} type="default">Reschedule</Button>
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
