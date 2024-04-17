import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
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
  AutoComplete,
} from "antd";
import MainLayout from "@/components/mainlayout";
import CustomMenu from "@/components/custommenu";
import axios, { AxiosResponse, AxiosError } from "axios";
import { VerifiedIcon } from "@/icons/icon";
import { ArrowLeftIcon } from "@/icons/icon";
import { PlusOutlined } from "@ant-design/icons";
import {
  fetchParticipantData,
  fetchPurposeData,
  fetchUserData,
  submitApplication,
} from "../api/applicationapi";

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
  const [note, setNote] = useState(""); // State to track the note text
  const [data, setData] = useState<any>([]);
  const [inputType, setInputType] = useState("khojiID"); // State to track the selected input type
  const [khojiID, setKhojiID] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [khojifirstName, setkhojifirstName] = useState("");
  const [khojilastName, setkhojilastName] = useState("");
  const [khojiemail, setkhojiemail] = useState("");
  const [khojimobile, setkhojimobile] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [options, setOptions] = useState<Option[]>([]); // Specify Option[] as the type
  const [userid, setUserid] = useState("");
  const [token, setToken] = useState("");
  const [startdate, setStartdate] = useState("");
  const [enddate, setEnddate] = useState("");
  const [addnote, setAddNote] = useState("");
  const [khojirel, setKhojirel] = useState("");
  const [guestrel, setguestrel] = useState("");
  const [purposeOptions, setPurposeOptions] = useState<any[]>([]); // Define purposeOptions state
  const [selectedPurpose, setSelectedPurpose] = useState<any[]>([]); // Define state for selected purpose
  const [participantuserid, setParticipantUserid] = useState<any[]>([]); // Define state for selected purpose

  const { isFamilyKrupaDarshan } = router.query;
  const [selectedRecord, setSelectedRecord] = useState(null); // State to store the selected record
  const [searchdata, setsearchdata] = useState([]); // State to store the fetched data
  const [form] = Form.useForm(); // Create a form instance
  const [dobValue, setDobValue] = useState<Date | null>(null);
  const [khojiuserid, setkhojiuserid] = useState("");
  const [userdata, setUserData] = useState<any>([]);
  console.log("isFamilyKrupaDarshan", isFamilyKrupaDarshan);

  useEffect(() => {
    const loadMoreData = async () => {
      try {
        const sessionresponse = await fetch("/api/getsession");
        const sessionData = await sessionresponse.json();
        setToken(sessionData?.session?.access_token);
  
        const purposeOptionsResponse = await fetchPurposeData(
          sessionData?.session?.access_token
        );
        setPurposeOptions(purposeOptionsResponse);
        console.log("purposeDataResponse", purposeOptionsResponse);
  
        const userDataResponse = await fetchUserData(
          sessionData?.session?.access_token
        );
        setData(userDataResponse);
        console.log("userDataResults", userDataResponse);
  
        setFirstName(userDataResponse?.user?.first_name);
        setLastName(userDataResponse?.user?.last_name);
        setMobile(userDataResponse?.contact_no);
        setEmail(userDataResponse?.user?.email);
        setUserid(userDataResponse?.user?.id);
  
        const participantUserResponseData = await fetchParticipantData(
          sessionData?.session?.access_token
        );
        if (participantUserResponseData && Array.isArray(participantUserResponseData.results)) {
          // Map over the results array and append userProfileId to each participant object
          const updatedParticipantData = participantUserResponseData.results.map((participant:any) => participant.id);
  console.log("participantUserResponseData", updatedParticipantData)
          setParticipantUserid(updatedParticipantData);
          setUserData(participantUserResponseData);
          console.log("participantUserResponseData", participantUserResponseData);
          console.log("userids", updatedParticipantData);
        
 
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
  
    loadMoreData();
  }, []);
  

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
    setInputType("khoji");
    setIsPopupVisible(true);
  };

  const onFinish = () => {
    form
      .validateFields() // Validate all fields
      .then((values) => {
        // Proceed with the desired action if validation passes
        // For example, navigate to the next step
        onclickNextBtn();
      })
      .catch((errorInfo) => {
        // Handle validation errors if any
        console.log('Validation failed:', errorInfo);
      });
  };

  const handleaddclick = async () => {
    try {
      const requestBody = {
        status: "PUB",
        sort: 1,
        user: userid,
        relation_with: khojiuserid,
        relation: khojirel.toUpperCase(),
      };

      const requestBodyJSON = JSON.stringify(requestBody);

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: requestBodyJSON,
      };

      fetch(
        "https://hterp.tejgyan.org/django-app/event/participants/",
        requestOptions
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Response from server:", data);
          alert("Participant Added successfully");
          form.resetFields();
        })
        .catch((error) => {
          console.error(
            "There was a problem with your fetch operation:",
            error
          );
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleseachclick = async () => {
    // let url ='https://hterp.tejgyan.org/django-app/iam/users/?';
    let url = "";
    try {
      const requestOption = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      // if(khojiID)
      //   {
      //     url = `192.168.1.248:8000/iam/users/?khoji_id=${khojiID}`;

      //   }
      //   else if(firstName){
      //     url = `192.168.1.248:8000/iam/users/?firat_Name=${firstName}&last_name=${lastName}`;
      //   }
      if (khojiID) {
        url = `https://hterp.tejgyan.org/django-app/iam/users/?khoji_id=${khojiID}`;
      } else if (firstName) {
        url = `https://hterp.tejgyan.org/django-app/iam/users/?first_name=${firstName}`;
      }
      const response = await fetch(url, requestOption);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();

      console.log("search data", responseData.results[0]);
      setkhojiuserid(responseData.results[0].user.id);
      if (searchdata && searchdata.length <= 1) {
        console.log("hi");
        form.setFieldsValue(responseData.results[0]);

        setsearchdata(responseData.results[0]);
        console.log("searchdata[0]", searchdata[0]);
      } else {
        alert("No data found");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onclickNextBtn = async () => {
    const requestBody = {
      user: userid,
      status: "SUBMITTED",
      have_participants: isFamilyKrupaDarshan,
      participants: isFamilyKrupaDarshan ? participantuserid : null,
      purposes: selectedPurpose,
      preferred_start_date: startdate,
      preferred_end_date: enddate,
      khoji_note: {
        property1: addnote,
        property2: addnote,
      },
    };

    const applicationSubmitted = await submitApplication(requestBody, token);
    if (applicationSubmitted) {
      alert("Application Submitted successfully");
      router.push("/krupadarshan/completeandapply");
    } else {
      // Handle submission error
      console.error("Application submission failed");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleVerification = async () => {
    try {
      let apiUrl = "";
      let payload = {};

      if (inputType === "khojiID") {
        apiUrl = "https://example.com/api/verify-khoji";
        payload = { khoji_id: khojiID };
      } else {
        apiUrl = "https://example.com/api/verify-email-mobile";
        payload = { email, mobile };
      }

      const response = await axios.post(apiUrl, payload);

      console.log(response.data);
    } catch (error) {
      console.error("Error verifying data:", error);
    }
  };

  const handleInputTypeChange = (type: string) => {
    if (type === "View all") {
      setInputType(type);
      setIsModalVisible(true);
    } else {
      setInputType(type);
    }
  };
  const renderInputComponent = () => {
    if (inputType === "khoji") {
      return (
        <Form form={form}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Enter Khoji ID"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                name="khojiID"
              >
                <Input
                  placeholder="Enter Khoji ID"
                  value={khojiID}
                  onChange={(e) => setKhojiID(e.target.value)}
                  style={{
                    borderRadius: "2rem",
                    height: "2rem",
                    width: "100%",
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
                name={["user", "first_name"]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input
                  style={{
                    borderRadius: "2rem",
                    height: "2rem",
                    width: "auto",
                  }}
                  onChange={(e) => setkhojifirstName(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Last Name"
                name={["user", "last_name"]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input
                  style={{
                    borderRadius: "2rem",
                    height: "2rem",
                    width: "auto",
                  }}
                  onChange={(e) => setkhojilastName(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Email ID"
                name={["user", "email"]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input
                  style={{
                    borderRadius: "2rem",
                    height: "2rem",
                    width: "100%",
                  }}
                  onChange={(e) => setkhojiemail(e.target.value)}
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
                wrapperCol={{ span: 24 }}
              >
                <Input
                  style={{
                    borderRadius: "2rem",
                    height: "2rem",
                    width: "100%",
                  }}
                  onChange={(e) => setkhojimobile(e.target.value)}
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
                wrapperCol={{ span: 24 }}
              >
                <Select
                  style={{
                    borderRadius: "2rem",
                    height: "2rem",
                    width: "100%",
                  }}
                  value={khojirel}
                
                />
              </Form.Item>
            </Col>
          </Row>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Button
              type="primary"
              style={{
                marginTop: "1rem",
                backgroundColor: "black",
                width: "8rem",
                height: "2.4888rem",
                marginBottom: "1rem",
                borderRadius: "1rem",
                fontSize: "11.38px",
              }}
              onClick={handleseachclick}
            >
              Search
            </Button>
            <Button
              type="primary"
              style={{
                marginTop: "1rem",
                backgroundColor: "black",
                width: "8rem",
                height: "2.4888rem",
                marginBottom: "1rem",
                borderRadius: "1rem",
                fontSize: "11.38px",
              }}
              onClick={handleaddclick}
            >
              Add
            </Button>
          </div>
        </Form>
      );
    } else if (inputType === "guest") {
      return (
        <Form>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="First Name"
                // name={['user', 'first_name']}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input
                  style={{
                    borderRadius: "2rem",
                    height: "2rem",
                    width: "auto",
                  }}
                  // value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Last Name"
                // name={['user', 'last_name']}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input
                  style={{
                    borderRadius: "2rem",
                    height: "2rem",
                    width: "auto",
                  }}
                  // value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
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
                wrapperCol={{ span: 24 }}
              >
                <DatePicker
                  style={{
                    borderRadius: "2rem",
                    height: "2rem",
                    width: "100%",
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
                wrapperCol={{ span: 24 }}
              >
                <Input
                  style={{
                    borderRadius: "2rem",
                    height: "2rem",
                    width: "100%",
                  }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                wrapperCol={{ span: 24 }}
              >
                <Input
                  style={{
                    borderRadius: "2rem",
                    height: "2rem",
                    width: "100%",
                  }}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
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
                wrapperCol={{ span: 24 }}
              >
                <Input
                  style={{
                    borderRadius: "2rem",
                    height: "2rem",
                    width: "100%",
                  }}
                  value={guestrel}
                  onChange={(e) => setguestrel(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Button
            type="primary"
            style={{
              marginTop: "1rem",
              backgroundColor: "black",
              width: "100%",
              marginBottom: "1rem",
            }}
          >
            Add
          </Button>
        </Form>
      );
    } else if (inputType === "View all") {
      if (userdata && userdata.results && Array.isArray(userdata.results)) {
        const users = userdata.results;
        return (
          <Row gutter={[16, 16]} style={{ justifyContent: "space-between" }}>
            {users.map((user: any, index: any) => (
              <Col
                key={index}
                xs={12}
                sm={24}
                md={12}
                lg={12}
                xl={12}
                style={{ marginBottom: "16px", marginLeft: "1rem" }}
              >
                {buildUserdataCard(user, index)}
              </Col>
            ))}
          </Row>
        );
      } else {
        return <div>No user data available</div>;
      }
    }

    return null;
  };
  function buildUserdataCard(user: any, index: any) {
    return user ? (
      <div
        className={`${
          index === 1 ? "userProfileRightCard" : "userProfileLeftCard"
        }`}
        key={user.id}
      >
        <div className="userProfileTopSection" />
        <div className="displayFlex flexDirectionRow alignItemsCenter jusitfyContentSpaceBetween">
          <Avatar className="userProfileImage" src={user.avtar} />
          <div className="userProfileVerifiedBadge">
            <label className="userProfileVerifiedBadgeLabel">Verified</label>
            <VerifiedIcon />
          </div>
        </div>
        <div className="displayFlex flexDirectionColumn marginLeft16">
          <label className="userNameLabel">{user.relation_with?.email}</label>
          <div className="displayFlex flexDirectionRow alignItemsCenter marginTop16">
            <div
              className="displayFlex flexDirectionColumn flex1"
              style={{ marginTop: "1rem" }}
            >
              <label className="userProfileInfoTitle">Name</label>
              <label className="userProfileInfoValue">
                {user.relation_with?.first_name} {user.relation_with?.last_name}{" "}
              </label>
            </div>
            <div
              className="displayFlex flexDirectionColumn flex1"
              style={{ marginTop: "1rem" }}
            >
              <label className="userProfileInfoTitle">Relation</label>
              <label className="userProfileInfoValue">{user.relation}</label>
            </div>
            <div
              className="displayFlex flexDirectionColumn flex1"
              style={{ marginTop: "1rem" }}
            >
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

  function buildUserCard(user: any, index: any) {
    return user ? (
      <div
        className={`${
          index === 1 ? "userProfileRightCard" : "userProfileLeftCard"
        }`}
        key={user.id}
      >
        <div className="userProfileTopSection" />
        <div className="displayFlex flexDirectionRow alignItemsCenter jusitfyContentSpaceBetween">
          <Avatar className="userProfileImage" src={user.avtar} />
          <div className="userProfileVerifiedBadge">
            <label className="userProfileVerifiedBadgeLabel">Verified</label>
            <VerifiedIcon />
          </div>
        </div>
        <div className="displayFlex flexDirectionColumn marginLeft16">
          <label className="userNameLabel">{user?.user?.email}</label>
          <div className="displayFlex flexDirectionRow alignItemsCenter marginTop16">
            <div
              className="displayFlex flexDirectionColumn flex1"
              style={{ marginTop: "1rem" }}
            >
              <label className="userProfileInfoTitle">Name</label>
              <label className="userProfileInfoValue">
                {user?.user?.first_name} {user?.user?.last_name}{" "}
              </label>
            </div>
            <div
              className="displayFlex flexDirectionColumn flex1"
              style={{ marginTop: "1rem" }}
            >
              <label className="userProfileInfoTitle">Address</label>
              <label className="userProfileInfoValue">{user.location}</label>
            </div>
            <div
              className="displayFlex flexDirectionColumn flex1"
              style={{ marginTop: "1rem" }}
            >
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
    if (true) {
      return (
        <div className="displayFlex flexDirectionColumn">
          <div className="displayFlex flexDirectionRow marginRight16 alignSelfCenter">
            {buildUserCard(data, 0)}
          </div>
        </div>
      );
    }
  }
  
  return (
    <MainLayout siderClassName="leftMenuPanel" siderChildren={<CustomMenu />}>
      <div style={{ marginLeft: "3rem" }}>
        <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
          <ArrowLeftIcon onClick={() => router.back()} />
          Apply for Krupa Darshan
        </div>
        <label className="verifyKhojiSubtitle">Add Application details</label>
        <div className="center-steps">
          <Steps
            current={0}
            style={{ width: "50%" }}
            className="my-custom-steps"
            labelPlacement="vertical"
          >
            <Step title="Add Application details" />
            <Step title="Complete & Apply" />
            <Step title="view status" />
          </Steps>
        </div>
      </div>
      <Divider style={{ marginTop: "3rem" }} />
      <div
        style={{ fontWeight: "bold", fontSize: "0.8rem", marginLeft: "3rem" }}
      >
        Add Personal details
      </div>
      <div
        className="verifyKhojiSubtitle"
        style={{ whiteSpace: "pre-wrap", marginLeft: "3rem" }}
      >
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry.
        <br /> {`Lorem Ipsum has been the industry's standard dummy text ever`}
      </div>
      <div style={{ marginLeft: "3rem" }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Form
              style={{ width: "100%", maxWidth: "500px" }}
              onFinish={onFinish}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="First Name"
                    name={firstName}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    initialValue={firstName}
                    rules={[
                      {
                        required: true,
                        message: "Please input your first name!",
                      },
                    ]}
                  >
                    <Input
                      style={{
                        borderRadius: "2rem",
                        height: "2rem",
                        width: "100%",
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
                    initialValue={lastName}
                    rules={[
                      {
                        required: true,
                        message: "Please input your last name!",
                      },
                    ]}
                  >
                    <Input
                      style={{
                        borderRadius: "2rem",
                        height: "2rem",
                        width: "100%",
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
                    initialValue={email}
                    rules={[
                      {
                        required: true,
                        message: "Please input your email!",
                      },
                    ]}
                  >
                    <Input
                      style={{
                        borderRadius: "2rem",
                        height: "2rem",
                        width: "100%",
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
                    initialValue={mobile}
                    rules={[
                      {
                        required: true,
                        message: "Please input your Mobile number!",
                      },
                    ]}
                  >
                    <Input
                      style={{
                        borderRadius: "2rem",
                        height: "2rem",
                        width: "100%",
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
                    rules={[
                      {
                        required: true,
                        message: "Please select your puppose!",
                      },
                    ]}
                  >
                    <Select
                      mode="tags"
                      style={{ width: "100%", height: "auto" }}
                      placeholder="Select Purpose"
                      value={selectedPurpose} // Set the value of the selected option
                      onChange={(value) => setSelectedPurpose(value)}
                      // Update selectedPurpose state when an option is selected
                    >
                      {purposeOptions.map((option) => (
                        <Option key={option.key} value={option.value}>
                          {option.label}
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
                    wrapperCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: "Please select preferred start date!",
                      },
                    ]}
                  >
                    <DatePicker
                      style={{
                        borderRadius: "2rem",
                        height: "2rem",
                        width: "100%",
                      }}
                      onChange={(date, dateString) => {
                        if (typeof dateString === "string") {
                          setStartdate(dateString);
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="    "
                    name={["user", "last_name"]}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: "Please select preferred end date!",
                      },
                    ]}
                  >
                    <DatePicker
                      style={{
                        borderRadius: "2rem",
                        height: "2rem",
                        width: "100%",
                      }}
                      onChange={(date, dateString) => {
                        if (typeof dateString === "string") {
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
                    wrapperCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: "Please input your Add note!",
                      },
                    ]}
                  >
                    <TextArea
                      style={{
                        width: "30.75rem",
                        height: "4rem",
                        borderRadius: "1rem",
                      }}
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
                      borderRadius: "2rem",
                      marginLeft: "1rem",
                      width: "12rem",
                      height: "2rem",
                      backgroundColor: "black",
                      marginBottom: "1rem",
                    }}
                    onClick={onclickNextBtn}
                  >
                    Next
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Row gutter={[16, 16]} style={{ justifyContent: "space-between" }}>
              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                xl={12}
                style={{ marginBottom: "16px" }}
              >
                {buildProfiles()}
              </Col>

              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                xl={12}
                style={{ marginBottom: "16px" }}
              >
                {isFamilyKrupaDarshan === "true" && (
                  <div
                    style={{
                      width: "80%",
                      height: "20rem",
                      overflow: "auto",
                      marginLeft: "2rem",
                    }}
                  >
                    <Card onClick={showModal}>
                      <div
                        style={{
                          textAlign: "center",
                          color: "gray",
                          fontSize: "2.8rem",
                        }}
                      >
                        <PlusOutlined />
                        <br />
                        <Text style={{ color: "gray" }}>
                          Add Family Member Here
                        </Text>
                      </div>
                    </Card>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: "8px",
                      }}
                    >
                      <Button
                        style={{
                          marginTop: "1rem",
                          marginRight: "16px",
                          borderRadius: "1rem",
                          backgroundColor: "#1E1E1E",
                          color: "white",
                        }}
                        onClick={() => handleInputTypeChange("View all")}
                      >
                        View all
                      </Button>
                    </div>
                    <Modal
                      title={
                        inputType === "View all"
                          ? "Added Family Members"
                          : "Family Member 1"
                      }
                      visible={isModalVisible}
                      footer={null}
                      style={{ top: 20 }}
                      onCancel={handleCancel}
                    >
                      <div
                        style={{
                          maxHeight: "60vh",
                          overflowY: "auto",
                          padding: "0 24px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <div style={{ marginBottom: 16 }}>
                            {inputType !== "View all" && (
                              <>
                                <Button
                                  type="link"
                                  style={{
                                    marginRight: 10,
                                    color:
                                      inputType === "khoji" ? "blue" : "black",
                                  }}
                                  onClick={() => handleInputTypeChange("khoji")}
                                >
                                  Khoji
                                </Button>
                                <Button
                                  type="link"
                                  style={{
                                    marginRight: 10,
                                    color:
                                      inputType === "guest" ? "blue" : "black",
                                  }}
                                  onClick={() => handleInputTypeChange("guest")}
                                >
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
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
}
