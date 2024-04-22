import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Divider,
  Form,
  Input,
  Row,
  Col,
  Avatar,
  Card,
  Modal,
  Image,
} from "antd";
import MainLayout from "@/components/mainlayout";
import CustomMenu from "@/components/custommenu";
import {
  InfoIcon,
  VerifiedIcon,
  NotVerifiedIcon,
  UserAvatarIcon,
  ScannerIcon,
} from "@/icons/icon";
import axios from "axios";
import { FileExclamationTwoTone, CheckOutlined } from "@ant-design/icons";
import { fetchApplicationData,fetchUserData } from "../api/applicationapi";



const { Meta } = Card;

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [applicationdata, setApplicationdata] = useState<any>([]);
  const [data, setData] = useState<any>([]);
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [inputType, setInputType] = useState("khojiID"); // State to track the selected input type
  const [khojiID, setKhojiID] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [username, setUserName] = useState("");
  const [ismigrated, setIsMigrated] = useState("");
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [failureModalVisible, setFailureModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState("khojiID");
  const [status, setStatus] = useState("");
  const [applicationid, setApplicationid] = useState("");



  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const response = await fetch("/api/getsession");
        const sessionData = await response.json();
        console.log("Session Data:", sessionData);
   

        setUserName(sessionData?.session?.user?.name);

        if (sessionData?.session) {
          const accessToken = sessionData.session.access_token;
          const userDataResponse = await fetchUserData(accessToken);
          setData(userDataResponse);

          const applicationData = await fetchApplicationData(accessToken);
          setApplicationdata(applicationData);
          setApplicationid(applicationData[0]?.reference_code)
          setStatus(applicationData[0]?.status)
          console.log("status", applicationData[0]?.status);
          console.log("userDataResultsimverified", userDataResponse);
          console.log("Fetched application data:", applicationData);
        } else {
          console.log('User is not authenticated. Redirecting to Login page.');
          router.push('/');
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const showModal = () => {
    setVisible(true);
  };
  const handleCancel = () => {
    setVisible(false);
  };

  const handleVerification = async () => {
    try {
      let apiUrl = "";
      let payload = {};

      if (inputType === "khojiID") {
        apiUrl = "https://example.com/api/verify-khoji";
        payload = { khoji_id: khojiID };
        setInputType("Verify");
        renderInputComponent();
      } else if (inputType === "emailMobile") {
        apiUrl = "https://example.com/api/verify-email-mobile";
        payload = { email, mobile };
        setInputType("Verify");
        renderInputComponent();
      } else if (inputType === "registerd") {
        apiUrl = "https://example.com/api/verify-email-mobile";
        payload = { email, mobile };
        setInputType("Verify");
        renderInputComponent();
      }
      const response = await axios.post(apiUrl, payload);

      console.log(response.data);
    } catch (error) {
      console.error("Error verifying data:", error);
    }
  };

  const handleInputTypeChange = (type: string) => {
    setInputType(type);
    setSelectedType(type);
  };
  const showSuccessModal = () => {
    setSuccessModalVisible(true);
  };

  const hideSuccessModal = () => {
    setSuccessModalVisible(false);
  };

  const showFailureModal = () => {
    setFailureModalVisible(true);
  };

  const hideFailureModal = () => {
    setFailureModalVisible(false);
  };
  const handleverifyotpbtn = () => {
    // Your verification logic here
    const verificationSuccessful = true; // Example: Set to true/false based on verification result

    if (verificationSuccessful) {
      showSuccessModal();
    } else {
      showFailureModal();
    }
  };
  const renderInputComponent = () => {
    if (inputType === "khojiID") {
      return (
        <div>
          <Form.Item
            label="Enter Khoji ID"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Input
              placeholder="Enter Khoji ID"
              value={khojiID}
              onChange={(e) => setKhojiID(e.target.value)}
            />
          </Form.Item>
          <Button
            type="primary"
            onClick={handleVerification}
            style={{
              marginTop: "3rem",
              backgroundColor: "black",
              width: "50%",
              marginLeft: "3rem",
            }}
          >
            Verify
          </Button>
        </div>
      );
    } else if (inputType === "emailMobile") {
      return (
        <div>
          <Form.Item
            label="Email Id"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Input
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <Divider>Or</Divider>
          <Form.Item
            label="Phone Number"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Input
              placeholder="Enter Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </Form.Item>
          <div style={{ color: "gray", fontSize: "12px" }}>
            <InfoIcon /> To verify the details, ensure they match the
            information given in all TGF retreats (e.g., MA, MTS, SSP, HS).
            <div>
              <Button
                type="primary"
                onClick={handleVerification}
                style={{
                  marginTop: "3rem",
                  backgroundColor: "black",
                  width: "50%",
                  marginLeft: "4rem",
                }}
              >
                Verify
              </Button>
            </div>
          </div>
        </div>
      );
    } else if (inputType === "registered") {
      return (
        <Form>
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
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
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
                  value={lastName}
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
                <Input
                  style={{
                    borderRadius: "2rem",
                    height: "2rem",
                    width: "100%",
                  }}
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
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
                    width: "auto",
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
          <div>
            <Button
              type="primary"
              onClick={handleVerification}
              style={{
                marginTop: "3rem",
                backgroundColor: "black",
                width: "50%",
                marginLeft: "4rem",
              }}
            >
              Verify
            </Button>
          </div>
        </Form>
      );
    } else if (inputType === "Verify") {
      return (
        <div>
          <div
            style={{
              marginBottom: "2rem",
              fontWeight: "900",
              color: "lightgray",
            }}
          >
            We have sent an OTP on your registered mobile number *******245 and
            Email ***xyz@gmail.com
          </div>
          <Form.Item
            label="Enter OTP"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Input.Password placeholder="xxxxxx" />
          </Form.Item>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              marginTop: "3rem",
            }}
          >
            <Button type="default">Not you?</Button>
            <Button
              type="primary"
              style={{ marginLeft: "1rem", backgroundColor: "black" }}
              onClick={handleverifyotpbtn}
            >
              {" "}
              Verify
            </Button>
            <Modal
              title=<VerifiedIcon />
              visible={successModalVisible}
              onCancel={hideSuccessModal}
              footer={null}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontWeight: "bold" }}>Congratulation!</div>
                <label style={{ color: "gray" }}>You have been verified</label>
                <div
                  style={{
                    marginTop: "1rem",
                    textWrap: "wrap",
                    color: "gray",
                  }}
                >
                  Following Deatils of the Khoji Verification for your
                  reference!Click on done to go to homescreen
                </div>
                <div
                  style={{
                    marginTop: "1rem",
                    textWrap: "wrap",
                    color: "lightblack",
                  }}
                >
                  Name:xyz
                  <br />
                  Register ID:16753
                  <br />
                  From Type:Verification
                </div>
                <Button
                  type="primary"
                  style={{
                    backgroundColor: "black",
                    borderRadius: "2rem",
                    marginTop: "3rem",
                    marginBottom: "4rem",
                  }}
                  onClick={() => router.push("/onboarding/homepage")}
                >
                  {" "}
                  Done
                </Button>
              </div>
            </Modal>

            <Modal
              title="Failure"
              visible={failureModalVisible}
              onCancel={hideFailureModal}
              footer={null}
            >
              Verification failed. Please try again.
            </Modal>
          </div>
        </div>
      );
    }
    return null;
  };

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
        <div className="displayFlex flexDirectionColumn" style={{textAlign:"center"}}>
          <label className="userNameLabel" style={{marginRight:"12rem"}}>   
          {user?.user?.first_name} {user?.user?.last_name}</label>
          <div className="displayFlex flexDirectionRow alignItemsCenter marginTop16">
            <div
              className="displayFlex flexDirectionColumn flex1"
              style={{ marginTop: "1rem"}}
            >
              <label className="userProfileInfoTitle">Khoji Id</label>
              <label className="userProfileInfoValue">
                {user.khoji_id}
              </label>
            </div>
            <div
              className="displayFlex flexDirectionColumn flex1"
              style={{ marginTop: "1rem" }}
            >
              <label className="userProfileInfoTitle"></label>
              <label className="userProfileInfoValue"></label>
            </div>
            <div
              className="displayFlex flexDirectionColumn flex1"
              style={{ marginTop: "1rem",marginLeft:"1rem" }}
            >
              <ScannerIcon/>
            </div>
          </div>
          <div className="displayFlex flexDirectionRow alignItemsCenter marginTop16">
            <div
              className="displayFlex flexDirectionColumn flex1"
              style={{ marginTop: "1rem"}}
            >
              <label className="userProfileInfoTitle">Tejsthan</label>
              <label className="userProfileInfoValue">
              {user.location}
              </label>
            </div>
            <div
              className="displayFlex flexDirectionColumn flex1"
              style={{ marginTop: "1rem" }}
            >
              <label className="userProfileInfoTitle">Shivir level</label>
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

  function buildNonVerifiedUserCard(user: any, index: any) {
    console.log("hi");
    return user ? (
      <div
        className={`${
          index === 1 ? "userProfileRightCard" : "userProfileLeftCard"
        }`}
        key={user.id}
      >
        <div className="userProfileTopSection" />
        <div className="displayFlex flexDirectionRow alignItemsCenter justifyContentSpaceBetween">
          <Avatar className="userProfileImage" />
          <div className="userProfileVerifiedBadge">
            <label
              className="userProfileVerifiedBadgeLabel"
              style={{ textWrap: "nowrap" }}
            >
              Not Verified
            </label>
            <NotVerifiedIcon />
          </div>
        </div>
        <div className="displayFlex flexDirectionColumn marginLeft16">
          <div className="displayFlex flexDirectionRow alignItemsCenter marginTop16">
            <div className="displayFlex flexDirectionColumn flex1">
              <label
                className="userProfileInfoTitle"
                style={{ fontWeight: "bolder" }}
              >
                Please Update Your Profile
              </label>
              <label
                className="userProfileInfoValue"
                style={{ marginTop: "1rem" }}
              >
                Lorem Ipsum hrough one of our <br />
                built-in providers or through a custom provider.
              </label>
            </div>
          </div>
          <Button
            type="primary"
            style={{
              borderRadius: "2rem",
              backgroundColor: "black",
              height: "1.5rem",
              marginTop: "2rem",
              alignItems: "center",
            }}
            onClick={showModal}
          >
            Verify Now
          </Button>
        </div>
        <Modal
          className="modelpopup"
          title="Verify Your Profile"
          visible={visible}
          centered
          footer={null}
          onCancel={handleCancel}
          style={{
            minWidth: "25rem",
            maxWidth: "37.5rem",
            minHeight: "18.75rem",
            maxHeight: "28.125rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div
                style={{
                  borderBottom:
                    selectedType === "khojiID"
                      ? "1px solid black"
                      : "1px solid transparent",
                  paddingBottom: "5px",
                }}
              >
                <Button
                  type="link"
                  style={{
                    marginRight: 10,
                    color: "black",
                    fontWeight: selectedType === "khojiID" ? "bold" : "normal",
                  }}
                  onClick={() => handleInputTypeChange("khojiID")}
                >
                  With Khoji ID
                </Button>
              </div>
              <div
                style={{
                  borderBottom:
                    selectedType === "emailMobile"
                      ? "1px solid black"
                      : "1px solid transparent",
                  paddingBottom: "5px",
                }}
              >
                <Button
                  type="link"
                  style={{
                    marginRight: 10,
                    color: "black",
                    fontWeight:
                      selectedType === "emailMobile" ? "bold" : "normal",
                  }}
                  onClick={() => handleInputTypeChange("emailMobile")}
                >
                  Without Khoji ID
                </Button>
              </div>
            </div>
            {renderInputComponent()} {/* Render input component */}
            {inputType === "emailMobile" && (
              <div style={{ marginTop: "1rem" }}>
                {`If you don't have registered details, click${" "}`}
                <Button
                  type="link"
                  onClick={() => handleInputTypeChange("registered")}
                >
                  here
                </Button>
                .
              </div>
            )}
          </div>
        </Modal>
      </div>
    ) : (
      <div className="userProfilePlaceholderCard" />
    );
  }

  function buildProfiles() {
 

    if (true) {
      // Render verified user card
      return (
        <div className="displayFlex flexDirectionColumn">
          <div className="displayFlex flexDirectionRow marginRight16 alignSelfCenter">
            {buildUserCard(data, 0)}
          </div>
        </div>
      );
    } else {
      // Render non-verified user card
      return (
        <div className="displayFlex flexDirectionColumn">
          <div className="displayFlex flexDirectionRow marginRight16 alignSelfCenter">
            {buildNonVerifiedUserCard(data, 0)}
          </div>
        </div>
      );
    }
  }

  const handleHistoryCardClick = () => {
   
    if (applicationdata.length > 0) {

      router.push("/krupadarshan/viewstatus");
    } else {
      
    }
  };

  const handleGetStarted = () => {
    router.push("/krupadarshan/addappallicationdetails");
  };
  function UserProfileCard() {
    return (
      <div className="user-profile-card">
        <Image className="profile-picture" src="profile-picture.jpg" alt="Profile Picture" />
        <div className="user-details">
          <h2 className="name">John Doe</h2>
          <p className="username">@johndoe</p>
          <p className="bio">Frontend Developer | Coffee Lover | Music Enthusiast</p>
          <p className="location">New York, USA</p>
          <a className="website" href="https://www.example.com">www.example.com</a>
          <div className="social-links">
            <a href="https://twitter.com/johndoe">Twitter</a>
            <a href="https://www.linkedin.com/in/johndoe">LinkedIn</a>
          </div>
          <div className="stats">
            <p>Followers: 1000</p>
            <p>Posts: 500</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <MainLayout siderClassName="leftMenuPanel" siderChildren={<CustomMenu />}>
      <div style={{ padding: "1rem" }}>
        <div
          style={{
            marginTop: "0.8rem",
            fontSize: " 28px",
            fontWeight: "700",
            lineHeight: "39.2px",
            letterSpacing: "-0.7111111283302307px",
            textAlign: "left",
          }}
        >
          Welcome,
          <br />
          {username}
        </div>

        <Row gutter={[16, 16]} style={{ marginTop: "0.8rem" }} justify="space-between">
  <Col xs={12} sm={24} md={12} lg={12} xl={12}>
    <Card
      style={{
        width: "90%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%", // Set the height to 100%
      }}
    >
              
              <div
                style={{
                  marginBottom: "1rem",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: "0.8rem",
                }}
              >
                <Button style={{ marginRight: "1rem", fontWeight: "bolder" }}>
                  {`You're eligible`}
                </Button>
                <InfoIcon />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <div
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    marginBottom: "0.5rem",
                  }}
                >
                  Apply for Krupa
                  <br />
                  Darshan
                </div>
                <div style={{ marginTop: "0.8rem" }}>
                  If you are using an OAuth provider either through one of our
                  built-in providers or through a custom provider.
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
  type="primary"
  style={{
    backgroundColor: "black",
    marginTop: "0.8rem",
    borderRadius: "1rem",
    width: "159.31px",
    height: "39.82px",
  }}
  onClick={handleGetStarted}
  disabled={applicationdata.length >0 && applicationdata[0].status !== "ACCEPTED_BY_KHOJI" } // Disable the button if applicationdata is empty
>
  Get Started
</Button>
                <div style={{ marginTop: "0.8rem" }}>
                  {" "}
                  <label>
                    5 + opportunities this <br />
                    month
                  </label>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {buildProfiles()}
              {/* {UserProfileCard()} */}
              
            </div>
          </Col>
        </Row>

        <div
          style={{ fontSize: "1.2rem", fontWeight: "bold", marginTop: "1rem" }}
        >
          History
        </div>
        <Row
          gutter={[16, 16]}
          style={{
            marginTop: "2rem",
            width: "165px",
            height: "195px",
            top: "696px",
            left: "259px",
            gap: "8px",
            borderRadius: "16px 0px 0px 0px",
            borderTop: "1px solid transparent",
            justifyContent: "space-between",
          }}
        >
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
{applicationdata.length > 0 && applicationdata[0].status !== "ACCEPTED_BY_KHOJI" && (
  <Card style={{ width: "15rem" }} onClick={handleHistoryCardClick}>
    <Meta
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        textWrap: "wrap",
        width: "auto",
      }}
      title="Your Application ID"
      description={applicationid}
    />
    click here to view your status
  </Card>
)} 
{applicationdata.length === 0 || applicationdata[0].status === "ACCEPTED_BY_KHOJI" && (
  <Card style={{ width: "15rem" }}>
    <Meta
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        textWrap: "wrap",
        width: "auto",
      }}
      avatar={<Avatar icon={<FileExclamationTwoTone />} />}
      title="No application yet"
      description="Your past Darshan appointments will reflect here"
    />
  </Card>
)}

</Col>

        </Row>
      </div>
    </MainLayout>
  );
}
