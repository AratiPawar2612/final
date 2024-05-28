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
import { fetchApplicationData,updateApplicationStatus,submitRescheduleForm } from "../api/applicationapi";
import DeleteOutlined from "@ant-design/icons";
import dayjs from "dayjs";
import CustomMobileMenu from "@/components/custommobilemenu";
import { ViewStatusThirdSvg } from "@/icons/svgs";

export default function ViewStatusPage() {
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
          const applicationData = await fetchApplicationData(sessionData?.session?.access_token);
  
          if (applicationData.length > 0) {
            const firstApplication = applicationData[0];
            setAppliid(firstApplication?.id);
            setReferenceCode(firstApplication?.reference_code);
            setAdults(firstApplication?.adults);
            setChildrens(firstApplication?.childrens);
            console.log("applicationdata", firstApplication);
  
            const participantresp = firstApplication?.participants;
            console.log("participant", participantresp);
            if (participantresp.length > 0) {
              setParticipantData(participantresp);
              console.log("participantresp", participantresp);
            }
  
            setStatus(firstApplication?.status);
          } else {
            console.error("No application data found");
          }
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [router]);
  

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleConfirmClick = async () => {
    try {
      await updateApplicationStatus(appliid, "ACCEPTED_BY_KHOJI", token);
      alert("Your application is confirmed");
    router.push("/onboarding/homepage");
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };


  const handleFormSubmit = async () => {
    try {
      await submitRescheduleForm(appliid, startdate, enddate, token);
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

  return (
    <MainLayout
      siderClassName={isMobileView ? "" : "leftMenuPanel"}
      siderChildren={!isMobileView && <CustomMenu />}
    >
      {isMobileView && (
        <div
        // style={{  
        //   display: "flex",
        //   flexDirection: "row",
        //   justifyContent: "space-between",
        //   paddingLeft:"15px",
        //   paddingRight:"15px",
        //   paddingTop: "10px",
        //   paddingBottom: "15px",
        //   backgroundColor: "white",
        //   boxShadow: "0px 0px 1.7px 0px rgba(0, 0, 0, 0.25)", 
        //   width: "100%", 
        //   boxSizing: "border-box", 
        // }}
        className="mobilecontainer"
      >
          {" "}
          <>
            <LogoIcon className="logomenu" />
            <div style={{marginTop:"10px"}}> <CustomMobileMenu /></div>
          </>
        </div>
      )}

      <div className="marginLeft1rem"> 
        <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
          {/* <ArrowLeftIcon onClick={() => router.back()} /> */}
          Apply for Gyan Darshan
        </div>
        <div>
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
                    Application ID
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



            <Row gutter={[6, 28]}>
      {cardData.map((card, index) => (
        <Col key={index} span={24} style={{ display: "flex", alignItems: "flex-start", marginBottom: "1rem" }}>
          {/* Step and Line Column */}
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <div
              className="custom"
              style={{ marginTop: isMobileView ? "3rem" : "7rem", borderRight: "1px solid #e8e8e8", paddingRight: "1rem" }}
            >
              <div
                className={`step-item ${((status1 === "SUBMITTED" || status1 === "RESCHEDULED_BY_KHOJI") && index === 0) ||
                  ((status1 === "APPROVED_BY_DKD" || status1 === "RESCHEDULED_BY_KHOJI") && index === 1) ||
                  (status1 === "ACCEPTED_BY_KHOJI" && index <= 2) ? "completed" : ""}`}
                style={{ backgroundColor: ((status1 === "SUBMITTED" && index === 0) ||
                  (status1 === "APPROVED_BY_DKD" && index === 1) ||
                  (status1 === "ACCEPTED_BY_KHOJI" && index === 2)) ? "red" : "" }}
              >
                {/* Removed index + 1 from here */}
                <div className="step-circle"></div>
              </div>
            </div>
          </div>
          {/* Card Column */}
          <Col xs={20} sm={24} md={24} lg={12} xl={12}>
            <Card
              title={card.title}
              style={{ marginTop: isMobileView ? "2rem" : "5rem" }}
              className={`${
                ((status1 === "SUBMITTED" || status1 === "RESCHEDULED_BY_KHOJI") && index === 0) ||
                ((status1 === "APPROVED_BY_DKD" || status1 === "RESCHEDULED_BY_KHOJI") && index === 1) ||
                (status1 === "ACCEPTED_BY_KHOJI" && index <= 2)
                  ? "enabled-card"
                  : "disabled-card"
              }`}
            >
              {card.content}
              {index === 1 && (status1 === "APPROVED_BY_DKD" || status1 === "RESCHEDULED_BY_KHOJI") && (
                <div
                  style={{
                    marginTop: "1rem",
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Button
                    style={{ marginRight: "1rem" }}
                    type="default"
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
                  <Button
                    onClick={handleConfirmClick}
                    type="primary"
                    style={{ backgroundColor: "green" }}
                  >
                    Confirm
                  </Button>
                  <DeleteOutlined />
                </div>
              )}
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
