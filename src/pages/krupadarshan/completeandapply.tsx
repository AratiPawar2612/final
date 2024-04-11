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

  const handleChange = (selectedItems: any) => {
    setSelectedValues(selectedItems);
  };

  const onclicksaveandapplybtn = () => {
    router.push('/krupadarshan/viewstatus');
  };

  useEffect(() => {
    const loadMoreData = () => {
      axios
        .get(
          'https://randomuser.me/api/?results=2&inc=name,gender,email,nat,picture&noinfo',
        )
        .then((response: AxiosResponse<any>) => {
          // Handle the successful response.
          const postData = response.data;
          setData(postData.results);
        })
        .catch((error: AxiosError) => {
          // Handle any errors that occurred during the request.

          if (error.response) {
            // The request was made, but the server responded with a status code other than 2xx.
            console.error(
              'Server responded with an error:',
              error.response.status,
            );
            console.error('Data:', error.response.data);
          } else if (error.request) {
            // The request was made, but no response was received.
            console.error(
              'No response received. Check your internet connection or the server.',
            );
          } else {
            // Something happened in setting up the request that triggered an error.
            console.error('Error:', error.message);
          }
        });
    };

    loadMoreData();
  }, []);

  //   function buildUserCard(user: any, index: any) {
  //     return user ? (
  //       <div
  //         className={`${
  //           index === 1 ? "userProfileRightCard" : "userProfileLeftCard"
  //         }`}
  //         key={user.id}
  //       >
  //         <div className="userProfileTopSection" />
  //         <div className="displayFlex flexDirectionRow alignItemsCenter jusitfyContentSpaceBetween">
  //           <Avatar className="userProfileImage" src={user.picture.large} />
  //           <div className="userProfileVerifiedBadge">
  //             <label className="userProfileVerifiedBadgeLabel">Verified</label>
  //             <VerifiedIcon />
  //           </div>
  //         </div>
  //         <div className="displayFlex flexDirectionColumn marginLeft16">
  //           <label className="userNameLabel">{user.email}</label>
  //           <div className="displayFlex flexDirectionRow alignItemsCenter marginTop16">
  //             <div className="displayFlex flexDirectionColumn flex1">
  //               <label className="userProfileInfoTitle">Tejashtan</label>
  //               <label className="userProfileInfoValue">Lorem Ipsum</label>
  //             </div>
  //             <div className="displayFlex flexDirectionColumn flex1">
  //               <label className="userProfileInfoTitle">Address</label>
  //               <label className="userProfileInfoValue">Lorem Ipsum</label>
  //             </div>
  //             <div className="displayFlex flexDirectionColumn flex1">
  //               <label className="userProfileInfoTitle">DOB</label>
  //               <label className="userProfileInfoValue">Lorem Ipsum</label>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     ) : (
  //       <div className="userProfilePlaceholderCard" />
  //     );
  //   }

  //   function buildProfiles() {
  //     return (
  //       <div className="userProfileContainer">
  //         {data.map((user:any, index:any) => (
  //           <div key={index} className="userProfileCard">
  //             {buildUserCard(user, index)}
  //           </div>
  //         ))}
  //       </div>
  //     );
  //   }
  function buildUserCard(user: any, index: any) {
    return user ? (
      <div
        className={`${
          index === 1 ? 'userProfileRightCard' : 'userProfileLeftCard'
        }`}
        key={user.id}>
        <div className="userProfileTopSection" />
        <div className="displayFlex flexDirectionRow alignItemsCenter jusitfyContentSpaceBetween">
          <Avatar className="userProfileImage" src={user.picture.large} />
          <div className="userProfileVerifiedBadge">
            <label className="userProfileVerifiedBadgeLabel">Verified</label>
            <VerifiedIcon />
          </div>
        </div>
        <div className="displayFlex flexDirectionColumn marginLeft16">
          <label className="userNameLabel">{user.email}</label>
          <div className="displayFlex flexDirectionRow alignItemsCenter marginTop16">
            <div className="displayFlex flexDirectionColumn flex1">
              <label className="userProfileInfoTitle">Tejashtan</label>
              <label className="userProfileInfoValue">Lorem Ipsum</label>
            </div>
            <div className="displayFlex flexDirectionColumn flex1">
              <label className="userProfileInfoTitle">Address</label>
              <label className="userProfileInfoValue">Lorem Ipsum</label>
            </div>
            <div className="displayFlex flexDirectionColumn flex1">
              <label className="userProfileInfoTitle">DOB</label>
              <label className="userProfileInfoValue">Lorem Ipsum</label>
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
        industry. Lorem Ipsum has been the industry's standard dummy text ever`}
      </div>

      <Row gutter={16}>{buildProfiles()}</Row>
      <div>
        <Row gutter={[16, 16]}>
          {' '}
          {/* Adjust the values as per your spacing requirement */}
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
              mode="multiple"
              style={{ width: '100%', height: '2rem' }}
              placeholder="Select Purpose"
              value={selectedValues} // Controlled by state
              onChange={handleChange} // Handle change event
            >
              <Option value="option1">Lorem Ipsum</Option>
              <Option value="option2">Lorem Dopler</Option>
              <Option value="option3">Lorem Dopler sit</Option>
              <Option value="option1">Lorem Ipsum</Option>
              <Option value="option2">Lorem Dople</Option>
              <Option value="option3">Lorem Dopler sit</Option>
              {/* Add more options as needed */}
            </Select>
          </Col>
        </Row>
      </div>

      <div style={{ marginLeft: '1rem' }}>
        <div style={{ fontSize: '0.9rem', marginTop: '2rem' }}>Note added</div>
        <div className="verifyKhojiSubtitle" style={{ whiteSpace: 'pre-wrap' }}>
          {`Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever`}
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
