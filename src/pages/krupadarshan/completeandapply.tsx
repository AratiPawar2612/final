import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Divider, Steps, Select, Row, Avatar, Col } from 'antd';
import MainLayout from '@/components/mainlayout';
import CustomMenu from '@/components/custommenu';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { VerifiedIcon } from '@/icons/icon';
import { ArrowLeftIcon } from '@/icons/icon';
const { Option } = Select;

export default function CompleteAndApplyPage() {
  const { Step } = Steps;
  const router = useRouter();
  const [data, setData] = useState<any>([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [purposeOptions, setPurposeOptions] = useState<any[]>([]); // Define purposeOptions state
  const [selectedPurpose, setSelectedPurpose] = useState<any[]>([]); // Define state for selected purpose


  const handleChange = (selectedItems: any) => {
    setSelectedValues(selectedItems);
  };

  const onclicksaveandapplybtn = () => {
    router.push('/krupadarshan/viewstatus');
  };

  useEffect(() => {
    const loadMoreData = async() => {
      const sessionresponse = await fetch('/api/getsession');
      const sessionData = await sessionresponse.json();
      console.log('Session Data:', sessionData?.session?.accessToken);
     

            const userApiUrl = 'https://hterp.tejgyan.org/django-app/iam/users/';
                    const userResponse = await fetch(userApiUrl, {
                        headers: {

                            Authorization: `Bearer ${ sessionData?.session?.accessToken}`,
                            "Content-Type": "application/json",
                        },
                    });
                    const userDataResponse = await userResponse.json();
                    const userDataResults1 = userDataResponse.results ?? [];
                  const userDataResults = userDataResponse.results[0] ?? [];
                    setData(userDataResults1);
                    console.log("userDataResults",userDataResponse.results[0].user?.id);
                    const userid=userDataResponse.results[0].user?.id;
                    const purposeApiUrl = `https://hterp.tejgyan.org/django-app/event/applications/?user=${userid}`;
const purposeResponse = await fetch(purposeApiUrl, {
    headers: {
        Authorization: `Bearer ${sessionData?.session?.accessToken}`,
        "Content-Type": "application/json",
    },
});
const purposeDataResponse = await purposeResponse.json();

if (purposeDataResponse.results.length > 0) {
  const purpose = purposeDataResponse.results[0];
  const options = [{
      key: purpose.id,
      value: purpose.id,
      label: purpose.label
  }];
  // Now you have options array containing data from the first record of the API response
  console.log(options);
  setPurposeOptions(options); // Update purposeOptions state
                  
} else {
  console.error("No data available in purposeDataResponse.results");
}
                    
                   
                        
                      
                  
  };

  loadMoreData();
  }, []);

  
  function buildUserCard(user: any, index: any) {
    return user ? (
      <div
        className={`${
          index === 1 ? 'userProfileRightCard' : 'userProfileLeftCard'
        }`}
        key={user.id}>
        <div className="userProfileTopSection" />
        <div className="displayFlex flexDirectionRow alignItemsCenter jusitfyContentSpaceBetween">
          <Avatar className="userProfileImage" src={user.avtar} />
          <div className="userProfileVerifiedBadge">
            <label className="userProfileVerifiedBadgeLabel">Verified</label>
            <VerifiedIcon />
          </div>
        </div>
        <div className="displayFlex flexDirectionColumn marginLeft16">
          <label className="userNameLabel">{user.user.email}</label>
          <div className="displayFlex flexDirectionRow alignItemsCenter marginTop16">
            <div
              className="displayFlex flexDirectionColumn flex1"
              style={{ marginTop: '1rem' }}>
              <label className="userProfileInfoTitle">Name</label>
              <label className="userProfileInfoValue">
                {user.user.first_name} {user.user.last_name}{' '}
              </label>
            </div>
            <div
              className="displayFlex flexDirectionColumn flex1"
              style={{ marginTop: '1rem' }}>
              <label className="userProfileInfoTitle">Address</label>
              <label className="userProfileInfoValue">{user.location}</label>
            </div>
            <div
              className="displayFlex flexDirectionColumn flex1"
              style={{ marginTop: '1rem' }}>
              <label className="userProfileInfoTitle">DOB</label>
              <label className="userProfileInfoValue">{user.dob}</label>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="userProfilePlaceholderCard" />
    );
  }

  function buildProfiles() {
    // Manually split data into arrays of 2 elements each
    const chunkedData = [];
    for (let i = 0; i < data.length; i += 2) {
      const chunk = [data[i], i + 1 < data.length ? data[i + 1] : null];
      chunkedData.push(chunk);
    }

    return (
      <div className="displayFlex flexDirectionColumn">
        {chunkedData.map((chunk, index) => (
          <div
            key={index}
            className="displayFlex flexDirectionRow marginRight16 alignSelfCenter"
            style={{ marginLeft: '2rem' }}>
            {buildUserCard(chunk[0], 0)}
            {buildUserCard(chunk[1], 1)}
          </div>
        ))}
      </div>
    );
  }
  return (
    <MainLayout siderClassName="leftMenuPanel" siderChildren={<CustomMenu />}>
      <div style={{ marginLeft: '1rem' }}>
        <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>
          <ArrowLeftIcon onClick={() => router.back()} /> Apply for Krupa
          Darshan
        </div>
        <div style={{ marginLeft: '1.8rem' }}>
          <label className="verifyKhojiSubtitle">Complete and apply</label>
        </div>
        <div className="center-steps">
          <Steps
            style={{ width: '50%' }}
            current={1}
            className="my-custom-steps"
            labelPlacement="vertical">
            <Step title="Add Application details" />
            <Step title="Complete & Apply" />
            <Step title="view status" />
          </Steps>
        </div>
      </div>
      <Divider style={{ marginTop: '3rem' }} />
      <div style={{ fontWeight: 'bold', fontSize: '1rem', marginLeft: '2rem' }}>
        Summery
      </div>
      <div
        className="verifyKhojiSubtitle"
        style={{ whiteSpace: 'pre-wrap', marginLeft: '2rem' }}>
        {`Lorem Ipsum is simply dummy text of the printing and typesetting
       `}
      </div>

      <Row gutter={16}>{buildProfiles()}</Row>
      <div>
        <Row gutter={[16, 16]}>
          
          <Col span={4}>
            <div style={{ fontSize: '0.9rem', marginLeft: '1rem' }}>
              Preferred Date
            </div>
            <div style={{ marginTop: '1rem', marginLeft: '1rem' }}>
              4th Jan, 2024 <br />@ Manan Ashram
            </div>
          </Col>
          <Col span={12}>
            <div style={{ fontSize: '0.9rem', marginLeft: '1rem' }}>
              Purpose of Darshan
            </div>
            
                    <Select
                    mode='tags'
  style={{ width: '100%', height: 'auto' }}
  placeholder="Select Purpose"
  value={purposeOptions} // Set the value of the selected option
  onChange={value => setSelectedPurpose(value)} // Update selectedPurpose state when an option is selected
>
  {purposeOptions.map(option => (
    <Option key={option.key} value={option.value}>
      {option.title}
    </Option>
  ))}
</Select>
          </Col>
        </Row>
      </div>

      <div style={{ marginLeft: '1rem' }}>
        <div style={{ fontSize: '0.9rem', marginTop: '2rem' }}>Note added</div>
        <div className="verifyKhojiSubtitle" style={{ whiteSpace: 'pre-wrap' }}>
          {`Lorem Ipsum is simply dummy text of the printing and typesetting
         `}
        </div>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <Button
          style={{
            borderRadius: '2rem',
            marginLeft: '1rem',
            width: '10rem',
            height: '2rem',
          }}>
          Edit
        </Button>
        <Button
          type="primary"
          style={{
            borderRadius: '2rem',
            marginLeft: '1rem',
            width: '12rem',
            height: '2rem',
            backgroundColor: 'black',
          }}
          onClick={onclicksaveandapplybtn}>
          Save and apply
        </Button>
      </div>
    </MainLayout>
  );
}
