import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import html2canvas from "html2canvas";
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
  DatePicker,
  message,
} from "antd";
import MainLayout from "@/components/mainlayout";
import CustomMenu from "@/components/custommenu";
import {
  InfoIcon,
  VerifiedIcon,
  NotVerifiedIcon,
  ElipseIcon,
  LogoIcon,
  DownloadIcon,
} from "@/icons/icon";
import axios from "axios";
import { FileExclamationTwoTone, CheckOutlined } from "@ant-design/icons";
import {
  fetchApplicationData,
  fetchUserData,
  submitRescheduleForm,
} from "../api/applicationapi";
import CustomMobileMenu from "@/components/custommobilemenu";
import jsPDF from "jspdf";
import moment from "moment";
import jwt, { JwtPayload } from "jsonwebtoken";
import { QRCode } from "antd";
import dayjs, { Dayjs } from "dayjs"; // Import Dayjs instead of Moment

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
  const slicedData = isMobileView
    ? applicationdata.slice(0, 2)
    : applicationdata.slice(0, 5);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [startdate, setStartdate] = useState("");
  const [enddate, setEnddate] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const now = new Date();
        const response = await fetch("/api/getsession");
        const sessionData = await response.json();
        console.log("session", sessionData);
        const capitalizedName = sessionData?.session?.user?.name.replace(
          /(^|\s)\S/g,
          (match: any) => match.toUpperCase()
        );
        setUserName(capitalizedName);

        const decodedToken = jwt.decode(
          sessionData?.session?.access_token
        ) as JwtPayload;
        let expirationTime: Date | null = null;

        if (decodedToken !== null && typeof decodedToken.exp === "number") {
          expirationTime = new Date(decodedToken.exp * 1000);
          console.log("Token expiration time:", expirationTime);

          // if (expirationTime < now) {
          //   console.log("Session has expired. Redirecting to Login page.");
          //   router.push("/");
          //   return;
          // }
        }
        // if (sessionData?.session && expirationTime && expirationTime >= now) {
        if (sessionData?.session) {
          const accessToken = sessionData.session.access_token;
          setToken(accessToken);
          const userDataResponse = await fetchUserData(accessToken);
          setData(userDataResponse);

          const applicationData = await fetchApplicationData(accessToken);
          setApplicationdata(applicationData);
          console.log("applicationdata", applicationData);
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

  const [hoveredWeek, setHoveredWeek] = useState<number | undefined>(undefined);

  const highlightWeek = (weekNumber: number) => {
    return hoveredWeek === weekNumber ? "highlighted-week" : "";
  };

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
  const dateParts = (data?.created_at || "").split("T")[0];

  const handleFormSubmit = async () => {
    try {
      const reschedulecount = applicationdata?.[0]?.reschedule_count;
      console.log("reschedulecount", applicationdata?.[0]?.reschedule_count);
      console.log("apllicationdate", applicationdata);
      if (applicationdata?.[0]?.reschedule_count < 3) {
        const res = await submitRescheduleForm(
          applicationdata?.[0]?.id,
          startdate,
          enddate,
          token
        );
        if (res) {
          //message.success("Your application has been rescheduled");
          message.success("Your application has been rescheduled");

          setIsModalVisible(false);
          window.location.reload();
        }
      } else {
        message.warning("USER CANNOT RESCHEDULE APPLICATION MORE THAN 3 TIMES");
      }
    } catch (error) {
      console.error("Error rescheduling application:", error);
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
    const verificationSuccessful = true;

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
                name="Dob"
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
        className={`${index === 1 ? "userProfileCard" : "userProfileCard"}`}
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
          <label
            className="userProfileInfoTitle"
            style={{ marginRight: "12rem", marginTop: "10px" }}
          >
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
              // style={{ marginTop: "1rem", marginLeft: "1rem" }}
            >
              {/* <ScannerIcon /> */}
              <QRCode value={applicationdata[0]?.user?.id} size={80} />
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

  const passRef = useRef<HTMLDivElement>(null);
  const handleDownload = () => {
    const passElement = passRef.current;

    if (passElement) {
      html2canvas(passElement).then((canvas: any) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        const imgWidth = 190; // A4 width in mm, adjusted for margins
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const margin = 10; // Margin in mm
        const pageHeight = 295; // A4 height in mm
        let heightLeft = imgHeight;
        let position = margin;

        pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - 2 * margin;

        while (heightLeft >= 0) {
          pdf.addPage();
          position -= pageHeight;
          pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save("gyan_darshan_pass.pdf");
      });
    } else {
      console.error("passRef.current is null.");
    }
  };

  return (
    <MainLayout
      siderClassName={isMobileView ? "" : "leftMenuPanel"}
      siderChildren={!isMobileView && <CustomMenu />}
    >
      {isMobileView && (
        <div className="flexContainer">
          <>
            <LogoIcon className="logomenu" />
            <div style={{ marginTop: "10px" }}>
              {" "}
              <CustomMobileMenu />
            </div>
          </>
        </div>
      )}
      <div style={{ padding: "0 20px" }}>
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
            <Card className="FlexDirectionColumnCenter">
              {status === "ACCEPTED_BY_KHOJI" ? (
                <div ref={passRef}>
                  <div className="FlexDirectionRowSpacebetween marginBottom1rem">
                    <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                      Gyan Darshan Pass
                    </span>
                    <Button
                      type="primary"
                      style={{
                        backgroundColor: "black",
                        borderRadius: "1rem",
                        width: "6.75rem",
                        height: "1.9375rem",
                        textAlign: "center",
                        boxShadow: "none",
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
                        {/* <Form.Item
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
                    </Form.Item> */}
                        <Form.Item
                          label="Select preferred date range"
                          name={["week"]}
                          labelCol={{ span: 24 }}
                          wrapperCol={{ span: 24 }}
                          rules={[
                            {
                              required: true,
                              message: "Please select a preferred week!",
                            },
                          ]}
                        >
                          <div>
                            <DatePicker
                              style={{
                                borderRadius: "2rem",
                                height: "2rem",
                                width: "100%",
                              }}
                              format="YYYY-MM-DD"
                              disabledDate={(current: Dayjs) => {
                                const today = dayjs();
                                const startOfCurrentMonth =
                                  dayjs().startOf("month");
                                const endOfFirstWeek = startOfCurrentMonth.add(
                                  7,
                                  "day"
                                );

                                // Disable the current week (first 7 days of the month)
                                if (
                                  current.isBefore(today, "day") ||
                                  current.isBefore(endOfFirstWeek, "day")
                                ) {
                                  return true;
                                }
                                return false;
                              }}
                              suffixIcon={
                                startdate &&
                                enddate && (
                                  <div>
                                    <b>
                                      Start Date: {startdate} To End Date:{" "}
                                      {enddate}
                                    </b>
                                  </div>
                                )
                              }
                              onChange={(date, dateString) => {
                                console.log("Received dateString:", dateString);

                                // Check if dateString is defined and has the expected format
                                if (typeof dateString === "string") {
                                  const match = dateString.match(
                                    /^(\d{4})-(\d{1,2})-(\d{1,2})$/
                                  );
                                  if (match) {
                                    const year = parseInt(match[1], 10);
                                    const month = parseInt(match[2], 10);
                                    const day = parseInt(match[3], 10);
                                    let startDateOfWeek, endDateOfWeek;

                                    // Determine the start and end dates of the week based on the selected day
                                    if (day <= 7) {
                                      startDateOfWeek = dayjs()
                                        .year(year)
                                        .month(month - 1)
                                        .date(1)
                                        .format("YYYY-MM-DD");
                                      endDateOfWeek = dayjs()
                                        .year(year)
                                        .month(month - 1)
                                        .date(7)
                                        .format("YYYY-MM-DD");
                                    } else if (day <= 14) {
                                      startDateOfWeek = dayjs()
                                        .year(year)
                                        .month(month - 1)
                                        .date(8)
                                        .format("YYYY-MM-DD");
                                      endDateOfWeek = dayjs()
                                        .year(year)
                                        .month(month - 1)
                                        .date(14)
                                        .format("YYYY-MM-DD");
                                    } else if (day <= 21) {
                                      startDateOfWeek = dayjs()
                                        .year(year)
                                        .month(month - 1)
                                        .date(15)
                                        .format("YYYY-MM-DD");
                                      endDateOfWeek = dayjs()
                                        .year(year)
                                        .month(month - 1)
                                        .date(21)
                                        .format("YYYY-MM-DD");
                                    } else {
                                      startDateOfWeek = dayjs()
                                        .year(year)
                                        .month(month - 1)
                                        .date(22)
                                        .format("YYYY-MM-DD");
                                      endDateOfWeek = dayjs()
                                        .year(year)
                                        .month(month - 1)
                                        .endOf("month")
                                        .format("YYYY-MM-DD");
                                    }

                                    // Update state with start and end dates
                                    setStartdate(startDateOfWeek);
                                    setEnddate(endDateOfWeek);
                                  } else {
                                    console.error(
                                      "Invalid dateString format:",
                                      dateString
                                    );
                                  }
                                }
                              }}
                            />
                            <div className="marginTop1rem">
                              {" "}
                              Selected Week: {startdate} To {enddate}
                            </div>
                          </div>
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
                    <span className="passlabel">
                      Your pass is valid till the date of Darshan.
                      <br />
                      Please carry your pass while coming.
                    </span>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <Button
                        icon={<DownloadIcon />}
                        onClick={handleDownload}
                      />
                      {/* <Button icon={<ShareIcon />} onClick={handleSharePass} /> */}
                    </div>
                  </div>

                  <div className="FlexDirectionRowSpacebetween">
                    <div style={{}}>
                      <b>Date</b>
                      <br />
                      <label>
                        {applicationdata[0]?.event?.start_date &&
                          moment(applicationdata[0]?.event?.start_date).format(
                            "DD.MM.YYYY"
                          )}
                      </label>
                      <div style={{ marginTop: "10px" }}>
                        <b> Reporting Time</b>
                        <div>10:30</div>
                      </div>
                    </div>
                    <div style={{ textWrap: "wrap", marginLeft: "10px" }}>
                      <b>Address</b>
                      <br />
                      <label className="passlabel">
                        Happy Thoughts Building, Vikrant Complex,
                        <br /> Savta Mali Nagar,Pimpri Colony, Pune,
                        <br /> Maharashtra 411017
                      </label>
                    </div>
                    <div>
                      <ElipseIcon />
                      <br />
                      <label className="passlabel">
                        {applicationdata && applicationdata.length > 0
                          ? `${
                              applicationdata[0]?.adults !== undefined
                                ? applicationdata[0]?.adults
                                : ""
                            } adults * ${
                              applicationdata[0]?.childrens || 0
                            } child`
                          : "0 adults * 0 child"}
                      </label>
                    </div>
                  </div>
                  <Divider className="dividerStyle" dashed={true} />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ whiteSpace: "wrap" }}>
                      <b style={{ fontSize: "0.9rem" }}>
                        Scan the QR code before you enter the hall
                      </b>
                      <br />
                      <span className="passlabel">
                        Please update your status if you wish to cancel or
                        reschedule your application
                      </span>
                    </span>

                    <QRCode
                      value={`${applicationdata[0]?.user?.id}-${applicationdata[0]?.event?.id}`}
                      size={100}
                    />
                  </div>
                </div>
              ) : status === "SUBMITTED" ||
                status === "RESCHEDULED_BY_KHOJI " ||
                status == "APPROVED_BY_DKD" ? (
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
                    <span className="EligibleLabel">{`In Process`}</span>
                    {/* <InfoIcon /> */}
                  </div>
                  <div style={{ marginBottom: "1rem" }}>
                    <div
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Your Application Details:
                    </div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <div style={{ marginRight: "1rem" }}>
                        <span className="bold">Application Id:</span>
                        <br />
                        <span>{applicationdata[0]?.reference_code}</span>
                      </div>
                      <div>
                        <span className="bold">Status:</span>
                        <br />
                        <span>{applicationdata[0]?.status}</span>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: "1rem",
                      }}
                    >
                      <div style={{ marginRight: "1rem" }}>
                        <span className="bold">Preffered Weeks</span>
                        <br />
                        <span>
                          {moment(
                            applicationdata[0]?.preferred_start_date
                          ).format("DD/MM/YYYY")}
                        </span>
                      </div>
                      <div>
                        <span className="bold"></span>
                        <br />
                        <span>
                          {moment(
                            applicationdata[0]?.preferred_end_date
                          ).format("DD/MM/YYYY")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button
                      type="primary"
                      style={{
                        backgroundColor: "black",
                        marginTop: "0.8rem",
                        borderRadius: "1rem",
                        width: "159.31px",
                        height: "auto",
                        textAlign: "center",
                        boxShadow: "none",
                      }}
                      onClick={() =>
                        router.push("/krupadarshan/viewstatuspage")
                      }
                      disabled={
                        applicationdata[0]?.status == "ACCEPTED_BY_KHOJI"
                      }
                    >
                      View Status
                    </Button>
                    {/* <div style={{ marginTop: "0.8rem" }}>
                      <label>
                        5 + opportunities <br /> this month
                      </label>
                    </div> */}
                  </div>
                </div>
              ) : (
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
                      This option is available for individuals who have
                      completed MahaAasmani Paramgyan shivir from Tejgyan
                      Foundation.
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button
                      type="primary"
                      style={{
                        backgroundColor: "black",
                        marginTop: "0.8rem",
                        borderRadius: "1rem",
                        width: "159.31px",
                        height: "auto",
                        textAlign: "center",
                        boxShadow: "none",
                      }}
                      onClick={() =>
                        router.push("/krupadarshan/addappallicationdetails")
                      }
                      disabled={
                        applicationdata[0]?.status == "ACCEPTED_BY_KHOJI"
                      }
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

          <Col xs={20} sm={24} md={12} lg={12} xl={12}>
            {buildProfiles()}
          </Col>
        </Row>

        <div
          style={{ fontSize: "1.2rem", fontWeight: "bold", marginTop: "1rem" }}
        >
          History
        </div>
        <Row gutter={[16, 16]} className="historycontainer">
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <div className="FlexDirectionRowSpacebetween">
              {applicationdata.length > 0 ? (
                slicedData.map((data: any, index: any) => {
                  const isClickable = index === 0;
                  const isLastRecord = !isMobileView
                    ? index === 5
                    : index === 2;
                  const hasBorder = isClickable ? "1px solid blue" : "none";

                  return (
                    <Card
                      key={index}
                      style={{
                        width: "15rem",
                        border: hasBorder,
                        borderRadius: "5px",
                        marginBottom: "1rem",
                        marginLeft: "0.5rem",
                      }}
                      onClick={() =>
                        router.push("/krupadarshan/viewstatuspage")
                      }
                    >
                      <Meta
                        className="FlexDirectionColumnCenter"
                        title={
                          index === 0
                            ? "Current Application "
                            : "Past Application"
                        }
                        description={
                          index === 0 ? (
                            <>
                              <span className="bold">Application Id:</span>
                              {data?.reference_code} <br />
                              <span className="bold">Created on:</span>
                              <br /> {dateParts}.
                              <span className="bold">
                                <br />
                                Status:
                              </span>
                              <br />
                              <span className="info-block">
                                {data?.status}.
                              </span>
                            </>
                          ) : (
                            <div>
                              <span className="bold">Application Id:</span>
                              <br />
                              <span className="info-block">
                                {data?.reference_code}
                              </span>
                              <span className="bold">
                                <br />
                                Created on:
                              </span>
                              <span className="info-block">
                                <br />
                                {dateParts}.
                              </span>
                              <span className="bold">
                                <br />
                                Status:
                              </span>
                              <br />
                              <span className="info-block">
                                {data?.status}.
                              </span>
                            </div>
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
    </MainLayout>
  );
}
