
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
import moment from 'moment';


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
  const [userid,setUserid]=useState('');
  const [token, setToken] = useState('');
  const [startdate, setStartdate] = useState('');
  const [enddate, setEnddate] = useState('');
  const [addnote, setAddNote] = useState('');
  const [khojirel, setKhojirel] = useState('');
  const [guestrel, setguestrel] = useState('');
  const [purposeOptions, setPurposeOptions] = useState<any[]>([]); // Define purposeOptions state
  const [selectedPurpose, setSelectedPurpose] = useState<any[]>([]); // Define state for selected purpose
  const isFamilyKrupaDarshan: boolean | undefined =
  typeof router.query === 'boolean' ? router.query : undefined;
  const [selectedRecord, setSelectedRecord] = useState(null); // State to store the selected record
  const [searchdata, setsearchdata] = useState([]); // State to store the fetched data
  const [form] = Form.useForm(); // Create a form instance
  const [dobValue, setDobValue] = useState<Date | null>(null);
  const [khojiuserid, setkhojiuserid] = useState('');
  const [userdata, setUserData] = useState<any>([]);
  const handleRowSelect = (record:any) => {
    setSelectedRecord(record); // Update the selected record state
  };

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
        const sessionresponse = await fetch('/api/getsession');
        const sessionData = await sessionresponse.json();
        console.log('Session Data:', sessionData?.session?.accessToken);
        setToken(sessionData?.session?.accessToken);

        const purposeApiUrl = 'https://hterp.tejgyan.org/django-app/event/purposes/';
                      const purposeResponse = await fetch(purposeApiUrl, {
                          headers: {

                              Authorization: `Bearer ${ sessionData?.session?.accessToken}`,
                              "Content-Type": "application/json",
                          },
                      });
                      const purposeDataResponse = await purposeResponse.json();
                      const options = purposeDataResponse.results.map((purpose: any) => ({
                        key: purpose.id,
                        value: purpose.id,
                        label: purpose.label
                      }));
                    
                     setPurposeOptions(options); // Update purposeOptions state
                      console.log("purposeDataResponse",purposeDataResponse);
                      // const userApiUrl = 'https://hterp.tejgyan.org/django-app/iam/users/';
                      const userApiUrl = 'https://hterp.tejgyan.org/django-app/iam/users/me/';
                      const userResponse = await fetch(userApiUrl, {
                          headers: {

                              Authorization: `Bearer ${ sessionData?.session?.accessToken}`,
                              "Content-Type": "application/json",
                          },
                      });
                      const userDataResults = await userResponse.json();
                      //const userDataResults1 = userDataResponse.results ?? [];
                   // const userDataResults =  userDataResponse;
                      setData(userDataResults);
                      console.log("userDataResults",userDataResults);
                     
                          setFirstName(userDataResults?.user?.first_name);
                          setLastName(userDataResults?.user?.last_name);
                          setMobile(userDataResults?.contact_no);
                          setEmail(userDataResults?.user?.email);
                          setUserid(userDataResults?.user?.id)
                          console.log(userDataResults?.user?.email);
if(true)
  {
    const getRequestOptions = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${sessionData?.session?.accessToken}`
      }
    };
  
    // Make the GET request
    const getResponse = await fetch('https://hterp.tejgyan.org/django-app/event/participants/', getRequestOptions);
    if (!getResponse.ok) {
      throw new Error('Network response was not ok');
    }
  
    // Parse the response data for GET request
    const responseData = await getResponse.json();
    console.log('Response data from GET request:', responseData);
    const participantdata = responseData.results ?? [];
    setUserData(participantdata);

  }
                        
                        
                    
    };

    loadMoreData();
  }, []);
  // useEffect(() => {
  //   if (userdata.length > 0) {
  //      setVisibleData(data(0, 2));
  //     setRemainingData(userdata.slice(2));
  //   }
  // }, [data]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible1, setIsModalVisible1] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
    setInputType('khoji');
    setIsPopupVisible(true);
  };

  const handleaddclick = async () => {
  
    try {
     
      const requestBody = {
      status: "PUB",
      sort: 1,
      user:userid,
      relation_with:khojiuserid,
      relation: khojirel.toUpperCase()
    };
    
    // Convert JavaScript object to JSON string
    const requestBodyJSON = JSON.stringify(requestBody);
    
    // Fetch request configuration
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: requestBodyJSON
    };
    
    fetch('https://hterp.tejgyan.org/django-app/event/participants/', requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Response from server:', data);
        alert("Participant Added successfully");
        form.resetFields();
      })
      .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
      });

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
   
  const handleseachclick = async () => {
    // let url ='https://hterp.tejgyan.org/django-app/iam/users/?';
    let url ='';
    try {
      const requestOption = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      // if(khojiID)
      //   {
      //     url = `192.168.1.248:8000/iam/users/?khoji_id=${khojiID}`;

      //   }
      //   else if(firstName){
      //     url = `192.168.1.248:8000/iam/users/?firat_Name=${firstName}&last_name=${lastName}`;
      //   }
      const response = await fetch(`https://hterp.tejgyan.org/django-app/iam/users/?khoji_id=${khojiID}`, requestOption);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const responseData = await response.json();
     
      console.log("search data",responseData.results[0]);
      setkhojiuserid(responseData.results[0].user.id);
    ;
      if (searchdata.length = 1) {
        console.log("hi");
        form.setFieldsValue(responseData.results[0]);
       
        setsearchdata(responseData.results[0]);
        console.log("searchdata[0]", searchdata[0]);
    
      } else {
        setsearchdata(responseData.results[0]);
     
       
      }
     
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
   
    
  const renderRows = () => {
    return data.map((record:any) => (
      <tr key={record.id}>
        <td>{record.id}</td>
        <td>{record.name}</td>
        <td>{record.email}</td>
        <td>
          <button onClick={() => handleRowSelect(record)}>Select</button>
        </td>
      </tr>
    ));
  };


  const onclickNextBtn  = async () => {
   
    const requestBody = {
      user: userid,
      status: "Submitted",
      sort: null,
      have_participant: isFamilyKrupaDarshan === true, // Assign true or false based on isFamilyKrupaDarshan
      participant: null, 
      // purpose: selectedPurpose?.map((purpose) => purpose?.id),
      purpose: selectedPurpose,
      preferred_start_date: startdate,
      preferred_end_date: enddate,
      khoji_note: {
        property1: addnote,
        property2: addnote
      }
    };
    const formData = new FormData();

    Object.entries(requestBody).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        // Handle null or undefined values by converting them to an empty string
        formData.append(key, '');
      } else if (typeof value === 'boolean') {
        // Handle boolean values by converting them to a string representation
        formData.append(key, value.toString());
      } else if (typeof value === 'object') {
        // Handle objects (like khoji_note) by stringifying them
        formData.append(key, JSON.stringify(value));
      } else {
        // For other types (like string or number), directly append the value
        formData.append(key, String(value));
      }
    });
    
    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    };
    console.log("request body",requestBody)
    
    // Make the POST request
    try {
      const response = await fetch('https://hterp.tejgyan.org/django-app/event/applications/', requestOptions);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      else{
        alert("Application Submitted successfully")
        router.push('/krupadarshan/completeandapply');
      }
      const data = await response.json();
      console.log('API Response:', data);
    } catch (error) {
      console.error('There was a problem with your fetch operation:');
    }
  
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
  
    if (inputType === 'khoji') {
      return (
        <Form form={form}> 
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Enter Khoji ID"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                name="khojiID">
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
                wrapperCol={{ span: 24 }}
               >
                <Input
                  style={{
                    borderRadius: '2rem',
                    height: '2rem',
                    width: 'auto',
                  }}
                 
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
                  
                  onChange={e => setLastName(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          {/* <Row gutter={16}>
                <Col span={24}>
                <Form.Item
  label="Date of birth"
  name="dob" // Make sure this matches the name of the field in your form
  labelCol={{ span: 24 }}
  wrapperCol={{ span: 24 }}
>
  <DatePicker
    style={{
      borderRadius: '2rem',
      height: '2rem',
      width: '100%',
    }}
    // Set the value of dob here
    // Assuming dobValue is the variable containing the date of birth value
    value={moment(dobValue)}
    onChange={(date, dateString) => {
      if (date) {
        setDobValue(date.toDate()); // Convert Moment object to Date
      } else {
        setDobValue(null);
      }
    }}// Assuming setDobValue is the function to update the dobValue state
  />
</Form.Item>
     
                </Col>
            </Row> */}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Email ID"
                name={['user', 'email']}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}>
                <Input
                  style={{
                    borderRadius: '2rem',
                    height: '2rem',
                    width: '100%',
                  }}
                 
                  onChange={e => setEmail(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Mobile Number"
                name="contact_no"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}>
                <Input
                  style={{
                    borderRadius: '2rem',
                    height: '2rem',
                    width: '100%',
                  }}
                  onChange={e => setMobile(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* <Row gutter={16}>
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
          </Row> */}
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
                  value={khojirel}
                  onChange={e => setKhojirel(e.target.value)}
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
            }}
            onClick={handleaddclick}
            >
            Add
          </Button>
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
            }}
            onClick={handleseachclick}
            >
            Search
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
                // name={['user', 'first_name']}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}>
                <Input
                  style={{
                    borderRadius: '2rem',
                    height: '2rem',
                    width: 'auto',
                  }}
                  // value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Last Name"
                // name={['user', 'last_name']}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}>
                <Input
                  style={{
                    borderRadius: '2rem',
                    height: '2rem',
                    width: 'auto',
                  }}
                  // value={lastName}
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
          {/* <Row gutter={16}>
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
          </Row> */}
          {/* <Row gutter={16}>
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
          </Row> */}
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
                  value={guestrel}
                  onChange={e => setguestrel(e.target.value)}
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
              {buildUserCard(user, 0)}
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
            <Form style={{ width: '100%', maxWidth: '500px' }}  >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="First Name"
                    name={firstName}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    initialValue={firstName}
                    >
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
                    name={lastName}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    initialValue={lastName}>
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
                    name={email}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    initialValue={email}>
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
                    name={mobile}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    initialValue={mobile}>
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
                    labelCol={{ span: 24 }}>
                    <Select
                    mode='tags'
  style={{ width: '100%', height: 'auto' }}
  placeholder="Select Purpose"
  value={selectedPurpose} // Set the value of the selected option
  onChange={value => setSelectedPurpose(value)} // Update selectedPurpose state when an option is selected
>
  {purposeOptions.map(option => (
    <Option key={option.key} value={option.value}>
      {option.title}
    </Option>
  ))}
</Select>

                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Select preferred date"
                    name={["startdate"]}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}>
                    <DatePicker
                      style={{
                        borderRadius: '2rem',
                        height: '2rem',
                        width: '100%',
                      
                      }}
                      onChange={(date, dateString) => {
                        if (typeof dateString === 'string') {
                          setStartdate(dateString);
                        }
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
                      onChange={(date, dateString) => {
                        if (typeof dateString === 'string') {
                          setEnddate(dateString);
                        }
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
        value={addnote}
        onChange={(e) => setAddNote(e.target.value)}
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
                xl={10}
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

