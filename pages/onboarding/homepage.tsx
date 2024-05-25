import React, { useEffect, useState ,useRef} from "react";
import { useRouter } from "next/router";
import html2canvas from 'html2canvas';
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
  DatePicker
} from "antd";
import MainLayout from "@/components/mainlayout";
import CustomMenu from "@/components/custommenu";
import {
  InfoIcon,
  VerifiedIcon,
  NotVerifiedIcon,
  ScannerIcon,
  ElipseIcon,
  LogoIcon,
  DownloadIcon,
  ShareIcon,
} from "@/icons/icon";
import axios from "axios";
import { FileExclamationTwoTone, CheckOutlined } from "@ant-design/icons";
import { fetchApplicationData, fetchUserData ,submitRescheduleForm} from "../api/applicationapi";
import CustomMobileMenu from "@/components/custommobilemenu";
import dayjs from "dayjs";
import jsPDF from 'jspdf';

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
  const [isMobileView, setIsMobileView] = useState(false);
  const slicedData = isMobileView ? applicationdata.slice(0, 2) : applicationdata.slice(0, 5);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [startdate, setStartdate] = useState("");
  const [enddate, setEnddate] = useState("");
  const [token,setToken]=useState("");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/getsession");
        const sessionData = await response.json();
        const capitalizedName = sessionData?.session?.user?.name.replace(/(^|\s)\S/g, (match:any) => match.toUpperCase());
       
        setUserName(capitalizedName);

        if (sessionData?.session) {
          const accessToken = sessionData.session.access_token;
          setToken(accessToken);
          const userDataResponse = await fetchUserData(accessToken);
          setData(userDataResponse);

          const applicationData = await fetchApplicationData(accessToken);
   
          setApplicationdata(applicationData);
          console.log("applicationdata",applicationData);
          setApplicationid(applicationData[0]?.reference_code);
          setStatus(applicationData[0]?.status);
        } else {
          console.log("User is not authenticated. Redirecting to Login page.");
          router.push("/");
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
     
    };

    handleResize(); 
    window.addEventListener("resize", handleResize); 

    return () => {
      window.removeEventListener("resize", handleResize); 
    };
  }, [isMobileView]);

  const showModal = () => {
    setVisible(true);
  };
  const handleCancel = () => {
    setVisible(false);
  };

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleFormSubmit = async () => {
    try {
      await submitRescheduleForm(applicationdata[0]?.id, startdate, enddate, token);
      alert("Your application has been rescheduled");
      setIsModalVisible(false);
      window.location.reload();
    } catch (error) {
      console.error("Error rescheduled application:", error);
    }
  };
  const disabledDate = (current: any, startDate: any, endDate: any) => {
    return (
      current &&
      (current < dayjs().startOf("day") ||
        (startDate && current < dayjs(startDate).startOf("day")) ||
        (endDate && current > dayjs(endDate).endOf("day")))
    );
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
              open={successModalVisible}
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
              open={failureModalVisible}
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
          index === 1 ? "userProfileRightCard" : "userProfileLeftCards"
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
        <div
          className="displayFlex flexDirectionColumn"
          style={{ textAlign: "center" }}
        >
          <label className="userNameLabel" style={{ marginRight: "12rem" }}>
            {user?.user?.first_name} {user?.user?.last_name}
          </label>
          <div className="displayFlex flexDirectionRow alignItemsCenter marginTop16">
            <div
              className="displayFlex flexDirectionColumn flex1"
              style={{ marginTop: "1rem" }}
            >
              <label className="userProfileInfoTitle">Khoji Id</label>
              <label className="userProfileInfoValue">{user.khoji_id}</label>
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
              style={{ marginTop: "1rem", marginLeft: "1rem" }}
            >
              <ScannerIcon />
            </div>
          </div>
          <div className="displayFlex flexDirectionRow alignItemsCenter marginTop16">
            <div
              className="displayFlex flexDirectionColumn flex1"
              style={{ marginTop: "1rem" }}
            >
              <label className="userProfileInfoTitle">Tejsthan</label>
              <label className="userProfileInfoValue">
                {user?.current_tejsthan?.name}
              </label>
            </div>
            <div
              className="displayFlex flexDirectionColumn flex1"
              style={{ marginTop: "1rem" }}
            >
              <label className="userProfileInfoTitle">Shivir level</label>
              <label className="userProfileInfoValue">{user.shivir_name}</label>
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
    return user ? (
      <div
        className={`${
          index === 1 ? "userProfileRightCard" : "userProfileLeftCard"
        }`}
        key={user.id}
      >
        <div className="userProfileTopSection" />
        <div className="displayFlex flexDirectionRow alignItemsCenter justifyContentSpaceBetween">
          <ElipseIcon />
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
          open={visible}
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
      router.push("/krupadarshan/viewstatuspage");
    } else {
    }
  };

  const handleGetStarted = () => {
    router.push("/krupadarshan/addappallicationdetails");
  };


  const passRef = useRef(null);
  const handleDownload = () => {
    const passElement = passRef.current;
  
    if (passElement) {
      html2canvas(passElement).then((canvas: any) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 190; // A4 width in mm, adjusted for margins
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const margin = 10; // Margin in mm
        const pageHeight = 295; // A4 height in mm
        let heightLeft = imgHeight;
        let position = margin;
  
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - 2 * margin;
  
        while (heightLeft >= 0) {
          pdf.addPage();
          position -= pageHeight;
          pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
  
        pdf.save('gyan_darshan_pass.pdf');
      });
    } else {
      console.error('passRef.current is null.');
    }
  };
  
  const handleSharePass = () => {
    const passElement = passRef.current;
  
    if (passElement) {
      html2canvas(passElement).then((canvas) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const filesArray = [new File([blob], 'gyan_darshan_pass.png', { type: 'image/png' })];
            
            if (navigator.canShare && navigator.canShare({ files: filesArray })) {
              navigator.share({
                files: filesArray,
                title: 'Gyan Darshan Pass',
                text: 'Please find the Gyan Darshan Pass attached.',
              }).then(() => {
                console.log('Pass shared successfully.');
              }).catch((error) => {
                console.error('Error sharing pass:', error);
                // Fallback mechanism if sharing fails
                // Implement your custom share dialog or offer alternative sharing methods here
                // For example:
                alert('Sharing failed. You can copy the link to share.');
              });
            } else {
              console.error('Sharing pass not supported.');
              // Fallback mechanism if sharing is not supported
              // Implement your custom share dialog or offer alternative sharing methods here
              // For example:
              alert('Sharing not supported. You can copy the link to share.');
            }
          } else {
            console.error('Blob is null.');
          }
        }, 'image/png');
      });
    } else {
      console.error('passRef.current is null.');
    }
  };
  
  
  
  

  return (
    <MainLayout siderClassName={isMobileView ? "" : "leftMenuPanel"} siderChildren={!isMobileView && <CustomMenu />}>
      
   {isMobileView && (
  <div
  style={{  
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft:"15px",
    paddingRight:"15px",
    paddingTop: "10px",
    paddingBottom: "15px",
    backgroundColor: "white",
    boxShadow: "0px 0px 1.7px 0px rgba(0, 0, 0, 0.25)", // Shadow effect
    width: "100%", 
    boxSizing: "border-box", 
  }}
>
   
    <>
      <LogoIcon className="logomenu" />
      <div style={{marginTop:"10px"}}> <CustomMobileMenu /></div>
     
    </>
  
</div>
)}
<div style={{ padding: "0 20px", }}>
      <div className="WelcomeLabel">
         Welcome,
          <br />
          {username}
        </div>

        <Row
          gutter={[16, 16]}
          style={{ marginTop: "0.8rem" }}
          justify="space-between"
        >
      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
  <Card
    style={{
      width: "auto",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
    }}
  >
    {status === "ACCEPTED_BY_KHOJI" ? (
        <div ref={passRef}>
          <div
            style={{
              marginBottom: "1rem",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: "0.8rem",
            }}
          >
            <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>Gyan Darshan Pass</span>
            <Button
              type="primary"
              style={{
                backgroundColor: "black",
                borderRadius: "1rem",
                width: "6.75rem",
                height: "1.9375rem",
                textAlign: "center",
              }}
              onClick={handleOpenModal}
            >
              Reschedule
            </Button>
            <Modal
                  title="Reschedule Application"
                  open={isModalVisible}
                  onCancel={handleCloseModal}
                  footer={[
                    <Button key="cancel" onClick={handleCloseModal}>
                      Cancel
                    </Button>,
                    <Button
                      key="submit"
                      type="primary"
                      onClick={handleFormSubmit}
                    >
                      Submit
                    </Button>,
                  ]}
                >
                  <Form layout="vertical" onFinish={handleFormSubmit}>
                    <Form.Item
                      label="Preferred Start Date"
                      name="preferredStartDate"
                    >
                      <DatePicker
                        value={startdate}
                        onChange={(date) => setStartdate(date)}
                        format="YYYY-MM-DD"
                        disabledDate={(current) =>
                          disabledDate(current, null, startdate)
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      label="Preferred End Date"
                      name="preferredEndDate"
                    >
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
          </div>
          <div
  style={{
    marginBottom: "1rem",
    display: "flex",
    flexDirection: "row",
    alignItems: "center", // Align items vertically
    justifyContent: "space-between",
  }}
>
  <span style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
    Your pass is valid till the date of Darshan.<br/>
    Please carry your pass while coming.
  </span>
  <div style={{ display: "flex", gap: "0.5rem" }}> {/* Adjust gap between icons */}
    <Button icon={<DownloadIcon />} onClick={handleDownload} />
    <Button icon={<ShareIcon />} onClick={handleSharePass} />
  </div>
</div>

          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <div style={{ }}>
              <b>Date</b><br/>
              <label>10/10/2024</label>
              <div style={{ }}>
              <b> Reporting Time</b> <br/>
                <div>10:30</div>
              </div>
            </div>
            <div style={{ textWrap:"wrap" }}>
              <b>Address</b><br/>
              <label>Happy Thoughts Building, Vikrant Complex, Savta Mali Nagar,<br/>Pimpri Colony, Pune, Maharashtra 411017</label>
            </div>
            <div style={{ width: "5.5625rem", height: "17", fontSize: "0.75rem", fontWeight: "bold" }}>
              <ElipseIcon /><br/>
              <label className="passlabel">
                {applicationdata && applicationdata.length > 0 ? 
                  `${applicationdata[0]?.age_counts?.adults !== undefined ? applicationdata[0]?.age_counts?.adults : ''} adults * ${applicationdata[0]?.age_counts?.childrens || 0} child`
                  :
                  "0 adults * 0 child"
                }
              </label>
            </div>
          </div>
          <Divider orientationMargin={0.05} dashed={true} />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: "1rem", fontWeight: "bold" }}>
              Scan the QR code before you enter the hall
            </span>
           
            <ScannerIcon />
           
          </div>
          <div style={{ fontSize: "1rem"}}>
            Please update your status if you wish to cancel or reschedule your application
          </div>
          
        </div>
) 
: (
      <div>
        <div
          style={{
            marginBottom: "1rem",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: "0.8rem",
          }}
        >
          <span className="EligibleLabel">{`You're eligible`}</span>
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
            Apply for Gyan Darshan
          </div>
          <div style={{ marginTop: "0.8rem" }}>
            This option is available for individuals who have completed Maha Asamani Paramgyan shivir from Tejgyan Foundation.
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
              height: "auto",
              textAlign: "center",
            }}
            onClick={handleGetStarted}
            // disabled={!applicationdata || !applicationdata[0] || applicationdata[0].status !== "ACCEPTED_BY_KHOJI"}
           
          >
            Get Started
          </Button>
          <div style={{ marginTop: "0.8rem" }}>
            <label>
              5 + opportunities <br /> this month
            </label>
          </div>
        </div>
      </div>
    )}
  </Card>
</Col>


          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
        
            <div
              style={{
                width: "90%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              {buildProfiles()}
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
         <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
  {applicationdata.length > 0 ? (
    slicedData.map((data: any, index: any) => {
      const dateParts = (data?.created_at || '').split('T')[0];

      const isClickable = index === 0;
      const isLastRecord = !isMobileView ? index === 5 : index === 2;
      const hasBorder = isClickable ? "1px solid blue" : "none";

      return (
        <Card
          key={index}
          style={{
            width: "15rem",
            border: hasBorder,
            borderRadius: "5px",
            marginBottom: "1rem",
            marginLeft:"0.5rem"
          }}
          onClick={isClickable ? handleHistoryCardClick : undefined}
        >
          <Meta
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textWrap: "wrap",
              width: "auto",
            }}
            title={index === 0 ? "Current Application " : "Past Application"}
            description={
              index === 0
                ? ` Application Id: ${data?.reference_code} Created on ${dateParts}.`
                : (
                  <>
                   Application Id: {data?.reference_code}<br/>
                    Created on {dateParts}.
                    <br />
                    Your past Darshan appointments will reflect here
                  </>
                )
            }
          />
          {isClickable && "Click here to view your status"}
        </Card>
      );
    })
  ) : (
    <Card style={{ width: "15rem" }}>
      <Meta
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textWrap: "wrap",
          width: "auto",
        }}
        title="No record available"
        description="Your past Darshan appointments will reflect here"
        avatar={<Avatar icon={<FileExclamationTwoTone />} />}
      />
    </Card>
  )}
</div>

</Col>


        </Row>
        </div>
        {/* </div> */}
     
    </MainLayout>
  );
}
