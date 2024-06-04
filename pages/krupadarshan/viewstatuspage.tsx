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
  message,
} from "antd";
import { DeleteIcon, ElipseIcon, LogoIcon } from "@/icons/icon";
import MainLayout from "@/components/mainlayout";
import CustomMenu from "@/components/custommenu";
import {
  fetchApplicationData,
  confirmApplicationStatus,
  submitRescheduleForm,
  updateApplicationStatus,
} from "../api/applicationapi";
import CustomMobileMenu from "@/components/custommobilemenu";
import { ViewStatusThirdSvg } from "@/icons/svgs";
import moment, { Moment } from "moment";
import dayjs, { Dayjs } from "dayjs";

export default function ViewStatusPage() {
  const router = useRouter();
  const { Step } = Steps;
  const [username, setUsername] = useState("");
  const [status1, setStatus] = useState("");
  const [token, setToken] = useState("");
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
          const applicationData = await fetchApplicationData(
            sessionData?.session?.access_token
          );

          if (applicationData.length > 0) {
            const firstApplication = applicationData[0];
            console.log("applicationdata", firstApplication);
            setData(firstApplication);
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

  const handleActionClick = async () => {
    try {
      const res = await confirmApplicationStatus(data?.id, "ACCEPTED_BY_KHOJI", token);
      if (res) {
        alert("Your application is confirmed");
        window.location.reload();
        router.push("/onboarding/homepage");
      }
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const handleDeletAction = async () => {
    try {
      const res = await updateApplicationStatus(data?.id, "CANCELLED", token);
      if (res) {
        alert("Your application is cancelled");
      }
      router.push("/onboarding/homepage");
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const handleFormSubmit = async () => {
    try {
      if(data?.reschedule_count<3)
        {
          const res = await submitRescheduleForm(
            data?.id,
            startdate,
            enddate,
            token
          );
          if (res) {
            //message.success("Your application has been rescheduled");
            alert("Your application has been rescheduled");
            setIsModalVisible(false);
            window.location.reload();
          } 
        }
        else{
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
      title: <strong>Application received</strong>,
      content:
        "Your application has been successfully submitted to the admin. You will be notified of further updates. Kindly check your status within 24 hours.",
    },
    {
      title: <strong>Event assigned</strong>,
      content: data?.event?.start_date ? (
        <strong>{dayjs(data.event.start_date).format("Do MMMM YYYY")}</strong>
      ) : null,
    },

    {
      title: <strong>Event Confirmed</strong>,
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
        <div className="mobilecontainer">
          {" "}
          <>
            <LogoIcon className="logomenu" />
            <div style={{ marginTop: "10px" }}>
              {" "}
              <CustomMobileMenu />
            </div>
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
          "Congratulations! Your application has been saved successfully"}
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
                  <label>{data?.reference_code}</label>

                  <div style={{ fontWeight: "bold", marginTop: "2rem" }}>
                    Application Type
                  </div>
                  <label>Gyandarshan</label>

                  <div style={{ fontWeight: "bold", marginTop: "2rem" }}>
                    Total Applicants
                  </div>
                  <label>Adults: {data?.adults}</label>
                  <label>Children: {data?.childrens}</label>
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
                <label>{data?.reference_code}</label>

                <div style={{ fontWeight: "bold", marginTop: "2rem" }}>
                  Application Type
                </div>
                <label>Gyandarshan</label>

                <div style={{ fontWeight: "bold", marginTop: "2rem" }}>
                  Total Applicants
                </div>
                <label>Adults: {data?.adults}</label>
                <label>Children: {data?.childrens}</label>

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
  <Col key={index} span={24} style={{ display: "flex" }}>
    {/* Step and Line Column */}
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <div
        className="custom"
        style={{
          marginTop: isMobileView ? "3rem" : "7rem",
          borderRight: "1px solid #e8e8e8",
          paddingRight: "1rem",
        }}
      >
        <div
          className={`step-item ${
            ((status1 === "SUBMITTED" || status1 === "RESCHEDULED_BY_KHOJI") && index === 0) ||
            (status1 === "APPROVED_BY_DKD" && index === 1) ||
            (status1 === "ACCEPTED_BY_KHOJI" && index <= 2)
              ? "completed"
              : ""
          }`}
          style={{
            backgroundColor:
              (((status1 === "SUBMITTED" && index === 0) ||
              (status1 === "APPROVED_BY_DKD" && index === 1) ||
              (status1 === "ACCEPTED_BY_KHOJI" && index === 2)) &&
           //   ((status1 === "SUBMITTED" || status1 === "RESCHEDULED_BY_KHOJI") && index === 0) ||(status1 === "APPROVED_BY_DKD" && index === 1) ||
              (status1 === "ACCEPTED_BY_KHOJI" && index === 2))
                ? "red"
                : "",
          }}
        >
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
          (status1 === "APPROVED_BY_DKD" && index === 1) ||
          (status1 === "ACCEPTED_BY_KHOJI" && index <= 2)
            ? "enabled-card"
            : "disabled-card"
        }`}
      >
        {card.content}
        {index === 0 &&
          (status1 === "SUBMITTED" || status1 === "RESCHEDULED_BY_KHOJI") && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: "1rem",
              }}
            >
              <Button type="default" disabled>
                Edit
              </Button>
              <DeleteIcon onClick={() => handleDeletAction()} />
            </div>
          )}
           {index === 2 &&
          (status1 === "ACCEPTED_BY_KHOJI") && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
               justifyContent:"flex-end",
                marginTop: "1rem",
              }}
            >
              <DeleteIcon onClick={() => handleDeletAction()} />
            </div>
          )}
        {index === 1 && status1 === "APPROVED_BY_DKD" && (
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div>
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
                <Form
                  layout="vertical"
                  onFinish={handleFormSubmit}
                >
                  <Form.Item
                    label="Select preferred Week"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message:
                          "Please select a preferred week!",
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
          const startOfCurrentMonth = dayjs().startOf("month");
          const endOfFirstWeek = startOfCurrentMonth.add(7, "day");

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
                Start Date: {startdate} To End Date: {enddate}
              </b>
            </div>
          )
        }
        onChange={(date, dateString) => {
          console.log("Received dateString:", dateString);

          // Check if dateString is defined and has the expected format
          if (typeof dateString === "string") {
            const match = dateString.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
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
              console.error("Invalid dateString format:", dateString);
            }
          }
        }}
      />
     <div className="marginTop1rem"> Selected Week: {startdate} To {enddate}
              </div>
    </div>
                  </Form.Item>
                </Form>
              </Modal>
              <Button
                onClick={() => handleActionClick()}
                type="primary"
                style={{ backgroundColor: "green" }}
              >
                Confirm
              </Button>
            </div>
            <DeleteIcon onClick={() => handleDeletAction()} />
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
