  import React, { useEffect, useState, useCallback } from "react";
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
  import { ElipseIcon, LogoIcon } from "@/icons/icon";
  import MainLayout from "@/components/mainlayout";
  import CustomMenu from "@/components/custommenu";
  import { ArrowLeftIcon } from "@/icons/icon";
  import { fetchParticipantData } from "../api/applicationapi";
  import DeleteOutlined from "@ant-design/icons";
  import dayjs from "dayjs";
  import CustomMobileMenu from "@/components/custommobilemenu";
  import { ViewStatusFirstSvg, ViewStatusThirdSvg } from "@/icons/svgs";

  export default function ViewStatus() {
  const router = useRouter();
  const { Step } = Steps;
  const [username, setUsername] = useState("");
  const [status1, setStatus] = useState("");
  const [token, setToken] = useState("");
  const [appliid, setAppliid] = useState("");
  const [referenceCode, setReferenceCode] = useState("");
  const [adults, setAdults] = useState("0");
  const [childrens, setChildrens] = useState("0");
  const [particpantdata, setParticipantData] = useState<any>([]);
  const [data, setData] = useState<any>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [startdate, setStartdate] = useState("");
  const [enddate, setEnddate] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  // const baseUrl = "https://hterp.tejgyan.org/django-app/";
  const baseUrl = "http://192.168.1.247:8000/";
  const eventUrl = `${baseUrl}event/`;

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
  const sessionResponse = await fetch("/api/getsession");
  const sessionData = await sessionResponse.json();
  setUsername(sessionData?.session?.user.name);
  setToken(sessionData?.session?.access_token);

  if (sessionData?.session) {
  const apiUrl = `${eventUrl}applications/?ordering=-created_at`;

  const getApplicationId = await fetch(apiUrl, {
  headers: {
  Authorization: `Bearer ${sessionData?.session?.access_token}`,
  "Content-Type": "application/json",
  },
  });
  const appliidres = await getApplicationId.json();
  const userDataResults1 = appliidres.results ?? [];
  setAppliid(userDataResults1[0]?.id);
  setReferenceCode(userDataResults1[0]?.reference_code);
  setAdults(userDataResults1[0]?.age_counts?.adults);
  setChildrens(userDataResults1[0]?.age_counts?.childrens);
  console.log("applicationdata", userDataResults1);

  const participantresp = userDataResults1[0]?.participants;
  console.log("participant", participantresp);
  if (participantresp.length > 0) {
  setParticipantData(participantresp);
  console.log("participantresp", participantresp);
  }

  const userApiUrl = `${eventUrl}applications/?ordering=-created_at`;

  const userResponse = await fetch(userApiUrl, {
  headers: {
  Authorization: `Bearer ${sessionData?.session?.access_token}`,
  "Content-Type": "application/json",
  },
  });
  const userDataResponse = await userResponse.json();
  const userDataResults = userDataResponse.results[0] ?? [];
  setData(userDataResponse);
  setStatus(userDataResults?.status);
  } else {
  router.push("/");
  }
  } catch (error) {
  console.error("Error fetching data:", error);
  }
  };

  fetchData();
  }, [router, eventUrl]);

  const handleOpenModal = () => {
  setIsModalVisible(true);
  };

  const handleCloseModal = () => {
  setIsModalVisible(false);
  };

  const handleConfirmClick = async () => {
  try {
  const apiUrl = `${eventUrl}applications/${appliid}/`;
  const response = await fetch(
  apiUrl,
  {
  method: "PATCH",
  headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ status: "ACCEPTED_BY_KHOJI" }),
  }
  );

  if (!response.ok) {
  throw new Error("Failed to update application status");
  } else {
  const responseData = await response.json();
  console.log("Updated application:", responseData);
  alert("Your application is confirmed");
  window.location.reload();
  return responseData;
  }
  } catch (error) {
  console.error("Error updating application status:", error);
  throw error;
  }
  };

  const handleFormSubmit = async () => {
  try {
  const response = await fetch(
  `https://hterp.tejgyan.org/django-app/event/applications/${appliid}/reschedule/`,
  {
  method: "POST",
  headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
  preferred_start_date: startdate,
  preferred_end_date: enddate,
  }),
  }
  );

  if (!response.ok) {
  throw new Error("Failed to update application status");
  } else {
  const responseData = await response.json();
  console.log("Updated application:", responseData);
  alert("Your application reschedule");
  setIsModalVisible(false);
  window.location.reload();
  return responseData;
  }
  } catch (error) {
  console.error("Error submitting form:", error);
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
  const [showPopup, setShowPopup] = useState(false);
  const [displayedRecords, setDisplayedRecords] = useState(2);

  const handleViewMore = () => {
  setShowPopup(true);
  };

  const handleClosePopup = () => {
  setShowPopup(false);
  };

  const cardData = [
  {
  title: "Application received",
  content:
  "Your application has been successfully submitted to the admin. You will be notified of further updates. Kindly check your status within 24 hours.",
  },
  { title: "Event assigned", content: "Content for card 2" },
  {
  title: "Event Confirmed",
  content:
  "Congratulations! Your application has been confirmed by the admin.",
  },
  ];
  const stepsItems = cardData.map((card, index) => ({
  title: card.title,
  description: card.content,
  status: (status1 === 'SUBMITTED' && index === 0) ||
  (status1 === 'APPROVED_BY_DKD' && index < 2) ||
  (status1 === 'ACCEPTED_BY_KHOJI' && index === 2) ? 'finish' : 'wait' // Adjust the status here
  }));

  return (
  <MainLayout
  siderClassName={isMobileView ? "" : "leftMenuPanel"}
  siderChildren={!isMobileView && <CustomMenu />}
  >
  {isMobileView && (
  <div
  style={{
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  paddingLeft: "15px",
  paddingRight: "15px",
  paddingTop: "10px",
  paddingBottom: "15px",
  backgroundColor: "white",
  boxShadow: "0px 0px 1.7px 0px rgba(0, 0, 0, 0.25)",
  width: "100%",
  }}
  >
  {" "}
  <>
  <LogoIcon className="logomenu" />
  <div>
  {" "}
  <CustomMobileMenu />
  </div>
  </>
  </div>
  )}

  <div>
  <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
  <ArrowLeftIcon onClick={() => router.back()} />
  Apply for Gyan Darshan
  </div>
  <div style={{ marginLeft: "1.2rem" }}>
  <label className="Descriptionlabel">View Status</label>
  </div>

  <div className="center-steps">
  {isMobileView ? (
  <ViewStatusThirdSvg />
  ) : (
  <Steps
  current={2}
  style={{ width: "50%" }}
  labelPlacement="vertical"
  responsive={false} // or responsive={false}
  >
  <Steps.Step title="Add application details" />
  <Steps.Step title="Complete & apply" />
  <Steps.Step title="View status" />
  </Steps>
  )}
  </div>
  </div>
  <Divider className="divider" />
  <div
  className="StatusMessageLabel"
  style={{
  display: "flex",
  flexDirection: "row",
  fontWeight: "bold",
  fontSize: "22px",
  }}
  >
  {status1 === "SUBMITTED" &&
  "Congratulations! Your application has been submitted successfully"}
  {status1 === "APPROVED_BY_DKD" &&
  "Congratulations! Your application has been event assigned"}
  {status1 === "ACCEPTED_BY_KHOJI" &&
  "Congratulations! Your application has been accepted"}
  </div>

  <div style={{ padding: "0 20px" }}>
  <Row>
  <Col xs={24} sm={24} md={12} lg={12} xl={8}>
  {" "}
  {isMobileView ? (
  <div
  style={{
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: "2rem",
  }}
  >
  <div>
  <div style={{ fontWeight: "bold", marginTop: "2rem" }}>
  Application History
  </div>
  <label>{referenceCode}</label>

  <div style={{ fontWeight: "bold", marginTop: "2rem" }}>
  Application Type
  </div>
  <label>Gyandarshan</label>

  <div style={{ fontWeight: "bold", marginTop: "2rem" }}>
  Total Applicants
  </div>
  <label>Adults: {adults}</label>
  <label>Children: {childrens}</label>
  </div>
  <div>
  <div>
  {particpantdata ? (
  <>
  {particpantdata
  .slice(0, displayedRecords)
  .map((participant: any) => (
  <div
  key={participant.id}
  style={{
  marginBottom: "1rem",
  fontWeight: "bold",
  marginTop: "0.5rem",
  }}
  >
  <Avatar
  size={64}
  icon={<ElipseIcon />}
  style={{ marginRight: "2rem" }}
  />
  {`${participant.first_name} ${participant.last_name}`}
  </div>
  ))}
  {particpantdata.length > 2 && (
  <Button
  type="link"
  onClick={handleViewMore}
  style={{ alignItems: "center" }}
  >
  View More
  </Button>
  )}
  </>
  ) : (
  <div>No participant data available</div>
  )}

  <Modal
  title="Additional Participants"
  open={showPopup}
  onCancel={handleClosePopup}
  footer={null}
  >
  {particpantdata
  .slice(displayedRecords)
  .map((participant: any) => (
  <div
  key={participant.id}
  style={{
  marginBottom: "1rem",
  fontWeight: "bold",
  marginTop: "0.5rem",
  }}
  >
  <Avatar size={64} icon={<ElipseIcon />} />
  {`${participant.first_name} ${participant.last_name}`}
  </div>
  ))}
  </Modal>
  </div>
  </div>
  </div>
  ) : (
  <Col xs={24} sm={24} md={12} lg={16} xl={12}>
  <div style={{ fontWeight: "bold", marginTop: "2rem" }}>
  Application History
  </div>
  <label>{referenceCode}</label>

  <div style={{ fontWeight: "bold", marginTop: "2rem" }}>
  Application Type
  </div>
  <label>Gyandarshan</label>

  <div style={{ fontWeight: "bold", marginTop: "2rem" }}>
  Total Applicants
  </div>
  <label>Adults: {adults}</label>
  <label>Children: {childrens}</label>

  <Divider />
  <div>
  {particpantdata && particpantdata.length > 0 ? (
  particpantdata.map((participant: any) => (
  <div
  key={participant.id}
  style={{ marginBottom: "1rem", fontWeight: "bold" }}
  >
  <Avatar
  size={64}
  icon={<ElipseIcon />}
  style={{ marginRight: "1rem" }}
  />
  {`${participant.first_name} ${participant.last_name}`}
  </div>
  ))
  ) : (
  <div>No participant data available</div>
  )}
  </div>
  </Col>
  )}
  </Col>
  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
  <div style={{ marginTop: "1rem", textAlignLast: "center" }}>
  <div style={{ marginBottom: "1rem", fontWeight: "bold" }}>
  Hi {username},
  </div>
  <label
  style={{ textWrap: "nowrap" }}
  >{`Here's the status of your Gyan Darshan application`}</label>
  </div>
  <Row gutter={[16, 16]}>
  <Col span={24}>

  </Col>
  {cardData.map((card, index) => (
  <Col span={24} key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1rem' }}>
  <Col span={8}>
  <div className={`step-item ${status1 === "ACCEPTED_BY_KHOJI" && index <= 2 ? "completed" : ""}`}>
  <div className="step-circle">{index + 1}</div>
  </div>
  {index < cardData.length - 1 && (
  <div className="vertical-line" style={{ marginLeft: '10px', height: '100%', width: '1px', backgroundColor: '#e8e8e8' }} />
  )}
  </Col>
  <Col span={16}>
  <Card
  title={card.title}
  style={{ marginTop: isMobileView ? '2rem' : '5rem' }}
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
  open={isModalVisible}
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
  <DeleteOutlined />
  </div>
  ) : null}
  </Card>
  </Col>
  </Col>
  ))}
  </Row>
  </Col>
  </Row>
  </div>
  </MainLayout>
  );
  }

