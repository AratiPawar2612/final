"use strict"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Button,
  Divider,
  Steps,  
  Typography,
  Card,
  Form,
  Row,
  Col,
  Input,
  Avatar,
  Modal,
  DatePicker,
  Select,
  AutoComplete
} from 'antd';
import MainLayout from '@/components/mainlayout';
import CustomMenu from '@/components/custommenu';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { VerifiedIcon } from '@/icons/icon';
import { ArrowLeftIcon } from '@/icons/icon';
import { PlusOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { getServerSession } from "next-auth/next"
import { authOptions } from '../api/auth/[...nextauth]';
authOptions
const { Option } = Select;
const { Text } = Typography;
const { TextArea } = Input;
interface Option {
  value: string;
  label: string;
}

export default function AddPersonalDeatilsPage() {
  const { Step } = Steps;
  const router = useRouter();
  const [note, setNote] = useState(''); // State to track the note text
  const [data, setData] = useState<any>([]);
  const [visibleData, setVisibleData] = useState<any>([]);
  const [remainingData, setRemainingData] = useState<any>([]);
  const [inputType, setInputType] = useState('khojiID'); // State to track the selected input type
  const [khojiID, setKhojiID] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [options, setOptions] = useState<Option[]>([]); // Specify Option[] as the type
  const { data: session } = useSession()
  console.log("session",session?.user?.name)
 

  const handleSearch = (value:any) => {
        const newOptions: Option[] = [
      { value: 'Option 1', label: 'Option 1' },
      { value: 'Option 2', label: 'Option 2' },
      { value: 'Option 3', label: 'Option 3' },
    ];
    setOptions(newOptions);
  };

  useEffect(() => {
    const loadMoreData = async() => {

      axios
        .get(
          'https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo',
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
  useEffect(() => {
    if (data.length > 0) {
      setVisibleData(data.slice(0, 2));
      setRemainingData(data.slice(2));
    }
  }, [data]);

  const [isModalVisible, setIsModalVisible] = useState(false);
 
  const showModal = () => {
    setIsModalVisible(true);
    setInputType('khoji');
    setIsPopupVisible(true);
  };
  


  const onclickNextBtn  = async () => {
    try {
      
         const session = await getServerSession(authOptions);
      
      const userApiUrl = 'https://hterp.tejgyan.org/django-app/iam/users/';
                    const userResponse = await fetch(userApiUrl, {
                        headers: {

                            Authorization: `Bearer ${session?.accessToken}`,
                            "Content-Type": "application/json",
                        },
                    });
                    const userDataResponse = await userResponse.json();
                  const userDataResults = userDataResponse.results ?? [];
                   // setUserData(userDataResults);
                    setData(userDataResults);
                    console.log("userDataResults",userDataResults);




//       const baseURL = 'https://hterp.tejgyan.org/django-app/';
//       const requestBody = {
//         "user": "76f62a58-5404-486d-9afc-07bded328704",
//   "status": "Submitted",
//   "sort": null,
//   "have_participant": false,  
//   "participant": "string",    
//   "purpose": "string",	     
//   "preferred_start_date": "2019-08-24T14:15:22Z",
//   "preferred_end_date": "2019-08-24T14:15:22Z",
//   "khoji_note": {
//     "property1": null,
//     "property2": null
//   },
//   "dkd_note": {
//     "property1": null,
//     "property2": null
//   }, 
//   headers: {

//     Authorization: `Bearer ${session?.accessToken}`,
//     "Content-Type": "application/json",
// },
//       };
  
//       // Make the POST request
//       const response = await axios.post(`${baseURL}/event/applications/`, requestBody);
  
//       // Handle the response
//       console.log('Response:', response.data);
// //       // Add your logic here to handle the response as needed
    } catch (error: unknown) {
      // If the error is of type AxiosError, handle it
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error('Axios Error:', axiosError.message);
        console.error('Axios Error Response:', axiosError.response);
        // Add your error handling logic here
      } else {
        // Handle other types of errors
        console.error('Unknown Error:', error);
        // Add your error handling logic here
      }
    }
  // router.push('/krupadarshan/completeandapply');
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleVerification = async () => {
    try {
      let apiUrl = '';
      let payload = {};

      if (inputType === 'khojiID') {
        apiUrl = 'https://example.com/api/verify-khoji';
        payload = { khoji_id: khojiID };
      } else {
        apiUrl = 'https://example.com/api/verify-email-mobile';
        payload = { email, mobile };
      }

      const response = await axios.post(apiUrl, payload);

      console.log(response.data);
    } catch (error) {
      console.error('Error verifying data:', error);
    }
  };

  const handleInputTypeChange = (type: string) => {
    if (type === 'View all') {
      setInputType(type);
      setIsModalVisible(true);
    } else {
      // For other types, simply set the inputType state
      setInputType(type);
    }
  };
  const renderInputComponent = () => {
    // Render input components based on inputType state
    if (inputType === 'khoji') {
      return (
        <Form>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Enter Khoji ID"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}>
                <Input
                  placeholder="Enter Khoji ID"
                  value={khojiID}
                  onChange={e => setKhojiID(e.target.value)}
                  style={{
                    borderRadius: '2rem',
                    height: '2rem',
                    width: '100%',
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Divider>Or enter</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="First Name"
                name={['user', 'first_name']}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}>
                <Input
                  style={{
                    borderRadius: '2rem',
                    height: '2rem',
                    width: 'auto',
                  }}
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Last Name"
                name={['user', 'last_name']}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}>
                <Input
                  style={{
                    borderRadius: '2rem',
                    height: '2rem',
                    width: 'auto',
                  }}
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Date of birth"
                name="purpose"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}>
                <DatePicker
                  style={{
                    borderRadius: '2rem',
                    height: '2rem',
                    width: '100%',
                  }}
                  value={dateOfBirth}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Email ID"
                name="email"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}>
                <Input
                  style={{
                    borderRadius: '2rem',
                    height: '2rem',
                    width: '100%',
                  }}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Mobile Number"
                name="mobile"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}>
                <Input
                  style={{
                    borderRadius: '2rem',
                    height: '2rem',
                    width: '100%',
                  }}
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Choose Purpose of Darshan"
                name="purpose"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}>
                 <AutoComplete
      style={{ width: 200 }}
      onSearch={handleSearch}
      placeholder="input here"
      options={options}
    />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Add Note"
                name="addnote"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}>
                <Input
                  style={{
                    borderRadius: '2rem',
                    height: '2rem',
                    width: '100%',
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Relation With Khoji"
                name="relation"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}>
                <Input
                  style={{
                    borderRadius: '2rem',
                    height: '2rem',
                    width: '100%',
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Button
            type="primary"
            style={{
              marginTop: '1rem',
              backgroundColor: 'black',
              width: '100%',
              height:"2.4888rem",
              marginBottom: '1rem',
              borderRadius:"1rem",
              fontSize:"11.38px"
            }}>
            Add
          </Button>
        </Form>
      );
    } else if (inputType === 'guest') {
      return (
        <Form>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="First Name"
                name={['user', 'first_name']}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}>
                <Input
                  style={{
                    borderRadius: '2rem',
                    height: '2rem',
                    width: 'auto',
                  }}
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Last Name"
                name={['user', 'last_name']}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}>
                <Input
                  style={{
                    borderRadius: '2rem',
                    height: '2rem',
                    width: 'auto',
                  }}
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Date of birth"
                name="purpose"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}>
                <DatePicker
                  style={{
                    borderRadius: '2rem',
                    height: '2rem',
                    width: '100%',
                  }}
                  value={dateOfBirth}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Email ID"
                name="email"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}>
                <Input
                  style={{
                    borderRadius: '2rem',
                    height: '2rem',
                    width: '100%',
                  }}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Mobile Number"
                name="mobile"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}>
                <Input
                  style={{
                    borderRadius: '2rem',
                    height: '2rem',
                    width: '100%',
                  }}
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Choose Purpose of Darshan"
                name="purpose"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}>
                <Input
                  style={{
                    borderRadius: '2rem',
                    height: '2rem',
                    width: '100%',
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Add Note"
                name="addnote"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}>
                <Input
                  style={{
                    borderRadius: '2rem',
                    height: '2rem',
                    width: '100%',
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Relation With Khoji"
                name="relation"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}>
                <Input
                  style={{
                    borderRadius: '2rem',
                    height: '2rem',
                    width: '100%',
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Button
            type="primary"
            style={{
              marginTop: '1rem',
              backgroundColor: 'black',
              width: '100%',
              marginBottom: '1rem',
            }}>
            Add
          </Button>
        </Form>
      );
    } else if (inputType === 'View all') {
      return (
        <Row gutter={[16, 16]} style={{ justifyContent: 'space-between' }}>
          {remainingData.map((user: any, index: any) => (
            <Col
              key={index}
              xs={24}
              sm={24}
              md={12}
              lg={12}
              xl={12}
              style={{ marginBottom: '16px' }}>
              {buildUserCard(user, index)}
            </Col>
          ))}
        </Row>
      );
    }

    return null;
  };

  function buildUserCard(user: any, index: any) {
    return user ? (
      <div
        className={`${
          index === 1 ? 'userProfileRightCard' : 'userProfileLeftCard'
        }`}
        key={user.id}
        style={{
          
          borderRadius: '0.625rem', // Keep the border radius
          padding: '1rem', // Add padding for better spacing
          marginBottom: '1rem', // Add margin to separate cards
          boxShadow: '0rem 0.25rem 0.5rem rgba(0, 0, 0, 0.1)', // Add box shadow for depth
          backgroundColor: 'white', // Set background color
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
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
            className="displayFlex flexDirectionRow marginRight16 alignSelfCenter">
            {buildUserCard(chunk[0], 0)}
            {buildUserCard(chunk[1], 1)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <MainLayout siderClassName="leftMenuPanel" siderChildren={<CustomMenu />}>
      <div style={{ marginLeft: '3rem' }}>
        <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>
          <ArrowLeftIcon onClick={() => router.back()} />
          Apply for Krupa Darshan
        </div>
        <label className="verifyKhojiSubtitle">Add Application details</label>
        <div className="center-steps">
          <Steps
            current={0}
            style={{ width: '50%' }}
            className="my-custom-steps"
            labelPlacement="vertical">
           
            <Step title="Add Application details" />
            <Step title="Complete & Apply" />
            <Step title="view status" />
          </Steps>
        </div>
      </div>
      <Divider style={{ marginTop: '3rem' }} />
      <div
        style={{ fontWeight: 'bold', fontSize: '0.8rem', marginLeft: '3rem' }}>
        Add Personal details
      </div>
      <div
        className="verifyKhojiSubtitle"
        style={{ whiteSpace: 'pre-wrap', marginLeft: '3rem' }}>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry.
        <br /> {`Lorem Ipsum has been the industry's standard dummy text ever`}
      </div>
      <div style={{ marginLeft: '3rem' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Form style={{ width: '100%', maxWidth: '500px' }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="First Name"
                    name={['user', 'first_name']}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}>
                    <Input
                      style={{
                        borderRadius: '2rem',
                        height: '2rem',
                        width: '100%',
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Last Name"
                    name={['user', 'last_name']}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}>
                    <Input
                      style={{
                        borderRadius: '2rem',
                        height: '2rem',
                        width: '100%',
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="Email ID"
                    name="email"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}>
                    <Input
                      style={{
                        borderRadius: '2rem',
                        height: '2rem',
                        width: '100%',
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="Mobile Number"
                    name="mobile"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}>
                    <Input
                      style={{
                        borderRadius: '2rem',
                        height: '2rem',
                        width: '100%',
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="Choose the purpose of the Darshan"
                    name="purpose"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}>
                    <Select
                      mode="multiple"
                      style={{ width: '100%', height: '2rem' }}
                      placeholder="Select Purpose">
                      <Option value="option1">Lorem Ipsum</Option>
                      <Option value="option2">Lorem Dopler</Option>
                      <Option value="option3">Lorem Dopler sit</Option>
                      <Option value="option1">Lorem Ipsum</Option>
                      <Option value="option2">Lorem Dople</Option>
                      <Option value="option3">Lorem Dopler sit</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Select preferred date"
                    name={['user', 'first_name']}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}>
                    <DatePicker
                      style={{
                        borderRadius: '2rem',
                        height: '2rem',
                        width: '100%',
                      
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="    "
                    name={['user', 'last_name']}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}>
                    <DatePicker
                      style={{
                        borderRadius: '2rem',
                        height: '2rem',
                        width: '100%',
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="Add Note"
                    name="addnote"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}>
                     <TextArea
        style={{width:"30.75rem",height:"4rem",borderRadius:"1rem"}}
        
        autoSize={{ minRows: 3, maxRows: 5 }}
      />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={24}>
                  <Button
                    type="primary"
                    style={{
                      borderRadius: '2rem',
                      marginLeft: '1rem',
                      width: '12rem',
                      height: '2rem',
                      backgroundColor: 'black',
                      marginBottom: '1rem',
                    }}
                    onClick={onclickNextBtn}>
                    Next
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Row gutter={[16, 16]} style={{ justifyContent: 'space-between' }}>
              {visibleData.map((user: any, index: any) => (
                <Col
                  key={index}
                  xs={24}
                  sm={24}
                  md={12}
                  lg={12}
                  xl={12}
                  style={{ marginBottom: '16px' }}>
                  {buildUserCard(user, index)}
                </Col>
              ))}

              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                xl={12}
                style={{ marginBottom: '16px' }}>
                <div
                  style={{
                    width: '80%',
                    height: '20rem',
                    overflow: 'auto',
                    marginLeft: '2rem',
                  }}>
                  <Card onClick={showModal}>
                    <div
                      style={{
                        textAlign: 'center',
                        color: 'gray',
                        fontSize: '2.8rem',
                      }}>
                      <PlusOutlined />
                      <br />
                      <Text style={{ color: 'gray' }}>
                        Add Family Member Here
                      </Text>
                    </div>
                  </Card>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      marginTop: '8px',
                    }}>
                    <Button
                      style={{
                        marginTop: '1rem',
                        marginRight: '16px',
                        borderRadius: '1rem',
                        backgroundColor: '#1E1E1E',
                        color: 'white',
                      }}
                      onClick={() => handleInputTypeChange('View all')}>
                      View all
                    </Button>
                  </div>
                  <Modal
                    title={
                      inputType === 'View all'
                        ? 'Added Family Members'
                        : 'Family Member 1'
                    }
                    visible={isModalVisible}
                    footer={null}
                    style={{ top: 20 }}
                    onCancel={handleCancel}>
                    <div
                      style={{
                        maxHeight: '60vh',
                        overflowY: 'auto',
                        padding: '0 24px',
                      }}>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}>
                        <div style={{ marginBottom: 16 }}>
                          {inputType !== 'View all' && (
                            <>
                            
                              <Button
                                type="link"
                                style={{
                                  marginRight: 10,
                                  color:
                                    inputType === 'khoji' ? 'blue' : 'black',
                                }}
                                onClick={() => handleInputTypeChange('khoji')}>
                                Khoji
                              </Button>
                              <Button
                                type="link"
                                style={{
                                  marginRight: 10,
                                  color:
                                    inputType === 'guest' ? 'blue' : 'black',
                                }}
                                onClick={() => handleInputTypeChange('guest')}>
                                Guest Khoji
                              </Button>
                            </>
                          )}
                        </div>
                        {renderInputComponent()}
                      </div>
                    </div>
                  </Modal>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
}
