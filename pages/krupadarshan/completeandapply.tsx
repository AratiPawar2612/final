import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Divider, Steps, Select, Row, Avatar, Col } from "antd";
import MainLayout from "@/components/mainlayout";
import CustomMenu from "@/components/custommenu";
import {
  VerifiedIcon,
  LogoIcon,
  ViewStatusIcon,
  ViewStatusSecondIcon,
} from "@/icons/icon";
import { ArrowLeftIcon } from "@/icons/icon";
import {
  fetchParticipantData,
  fetchPurposeOptions,
  fetchApplicationData,
} from "../api/applicationapi";
import CustomMobileMenu from "@/components/custommobilemenu";

export default function CompleteAndApplyPage() {
  const { Step } = Steps;
  const router = useRouter();
  const [data, setData] = useState<any>([]);
  const [addnote, setaddnote] = useState("");
  const [purpose, setPurpose] = useState("");
  const [startdate, setStartDate] = useState("");
  const [enddate, setEndDate] = useState("");
  const [isMobileView, setIsMobileView] = useState(false); // Define isMobileView state

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768); // Update isMobileView based on window width

    };

    handleResize(); // Call once on component mount
    window.addEventListener("resize", handleResize); // Listen for window resize events

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup on component unmount
    };
  }, []);

  function convertDate(dateStr: any) {
    console.log("Input date string:", dateStr);

    if (!dateStr) {
      console.log("Date string is undefined or null");
      return "";
    }

    const [year, month, day] = dateStr.slice(0, 10).split("-");
    console.log("Day:", day, "Month:", month, "Year:", year);

    if (!day || !month || !year) {
      console.log("Date parts are missing");
      return ""; // Return empty string if any part of the date is missing
    }

    return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year.slice(
      -2
    )}`;
  }

  useEffect(() => {
    const loadMoreData = async () => {
      const sessionresponse = await fetch("/api/getsession");
      const sessionData = await sessionresponse.json();
      console.log("Session Data:", sessionData?.session?.access_token);
      if (sessionData?.session) {
        const applicationData = await fetchApplicationData(
          sessionData?.session?.access_token
        );
        console.log("applicationData", applicationData);
        setaddnote(applicationData[0]?.khoji_note);

        const userid = applicationData[0]?.user?.id;
        console.log("userid", userid);
        if (
          applicationData[0]?.purposes &&
          applicationData[0]?.purposes.length > 0
        ) {
          setPurpose(applicationData[0]?.purposes[0]?.description);
        }

        setData(applicationData[0]?.participants);
        console.log("userDataResults", applicationData[0]?.participants);

        setStartDate(convertDate(applicationData[0]?.preferred_start_date));
        setEndDate(convertDate(applicationData[0]?.preferred_end_date));
      } else {
        router.push("/");
      }
    };

    loadMoreData();
  }, [router]);

  const onclicksaveandapplybtn = () => {
    router.push("/krupadarshan/viewstatuspage");
  };

  function buildUserdataCard(user: any, index: any) {
    console.log("hi");
    return user ? (
      <div
        className={`${
          index === 0 ? "userProfileRightCard" : "userProfileLeftCard"
        }`}
        key={user.id}
      >
        <div className="userProfileTopSection" />
        <div className="displayFlex flexDirectionRow alignItemsCenter jusitfyContentSpaceBetween">
          <Avatar className="userProfileImage" src={user?.avtar} />
          <div className="userProfileVerifiedBadge">
            <label className="userProfileVerifiedBadgeLabel">Verified</label>
            <VerifiedIcon />
          </div>
        </div>
        <div className="displayFlex flexDirectionColumn marginLeft16">
          <label className="userNameLabel">{user?.relation_with?.email}</label>
          <div className="displayFlex flexDirectionRow alignItemsCenter marginTop16">
            <div
              className="displayFlex flexDirectionColumn flex1"
              style={{ marginTop: "1rem" }}
            >
              <label className="userProfileInfoTitle">Name</label>
              <label className="userProfileInfoValue">
                {user?.first_name} {user?.last_name}
              </label>
            </div>
            <div
              className="displayFlex flexDirectionColumn flex1"
              style={{ marginTop: "1rem" }}
            >
              <label className="userProfileInfoTitle">Relation</label>
              <label className="userProfileInfoValue">
                {/* {user?.relation} */}
              </label>
            </div>
            <div
              className="displayFlex flexDirectionColumn flex1"
              style={{ marginTop: "1rem" }}
            >
              <label className="userProfileInfoTitle">DOB</label>
              <label className="userProfileInfoValue">
                {/* {user?.dob} */}
              </label>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="userProfilePlaceholderCard" />
    );
  }

  const items = [
    {
      title: "Add application details",
    },
    {
      title: "Complete & apply",
    },
    {
      title: "View status",
    },
  ];
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
            boxShadow: "0px 0px 1.7px 0px rgba(0, 0, 0, 0.30)",
            width: "100%",
          }}
        >
          <>
            <LogoIcon className="logomenu" />
            <div>
              {" "}
              <CustomMobileMenu />
            </div>
          </>
        </div>
      )}

      <div style={{ marginLeft: "3rem" }}>
        <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
          <ArrowLeftIcon onClick={() => router.back()} />
          Apply for Gyan Darshan
        </div>
        <div style={{ marginLeft: "1.2rem" }}>
          <label className="Descriptionlabel">complete and apply</label>
        </div>

        <div className={isMobileView ? "center-step" : "center-steps"}>
          {/* {isMobileView ? (
            <ViewStatusSecondIcon /> // Use uppercase for component name
          ) : ( */}
          <Steps
            current={1}
            style={isMobileView ? { width: "auto" } : { width: "50%" }}
            labelPlacement="vertical"
            items={items}
            responsive={false}
          />
          {/* )}  */}
        </div>
      </div>
      <Divider className="divider" />
      <div style={{ padding: "0 20px" }}>
        <div
          style={{ fontWeight: "bolder", fontSize: "1rem", marginLeft: "2rem" }}
        >
          Summary
        </div>
        <div
          style={{
            marginLeft: "2rem",
            fontSize: "0.9rem",
            marginTop: "0.5rem",
          }}
        >
          Summary of Gyan Darshan based on the information you have gathered
        </div>
        {data && data.length > 0 && (
          <div>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "0.9rem",
                marginTop: "1rem",
                marginLeft: "2rem",
              }}
            >
              Added Member
            </div>
            <Row gutter={16}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Row gutter={[16, 16]} style={{ flex: "1", flexWrap: "wrap" }}>
                  {data.map((user: any, index: any) => (
                    <Col
                      key={index}
                      xs={12}
                      sm={24}
                      md={12}
                      lg={12}
                      xl={12}
                      style={{
                        marginBottom: "16px",
                        marginLeft: "2rem",
                        flex: "0 0 auto",
                      }}
                    >
                      {buildUserdataCard(user, index)}
                    </Col>
                  ))}
                </Row>
              </div>
            </Row>
          </div>
        )}

        <div>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <div
                style={{
                  fontSize: "0.9rem",
                  marginLeft: "1rem",
                  marginTop: "1rem",
                }}
              >
                Preferred Date
              </div>
              <div
                style={{
                  marginTop: "1rem",
                  marginLeft: "1rem",
                  textWrap: "nowrap",
                }}
              >
                {startdate} to {enddate}
              </div>
            </Col>
            <Col span={12}>
              <div
                style={{
                  fontSize: "0.9rem",
                  marginLeft: "2rem",
                  marginTop: "1rem",
                }}
              >
                Purpose of Darshan
              </div>
              <Select
                mode="tags"
                style={{
                  width: "100%",
                  height: "auto",
                  marginLeft: "1rem",
                  marginTop: "1.5rem",
                }}
                placeholder="Select Purpose"
                value={purpose}
                onChange={(value) => setPurpose(value)}
              />
            </Col>
          </Row>
        </div>
        {addnote && (
          <div style={{ marginLeft: "1rem" }}>
            <div style={{ fontSize: "0.9rem", marginTop: "2rem" }}>
              Note added
            </div>
            <div
              className="verifyKhojiSubtitle"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {addnote}
            </div>
          </div>
        )}
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={12} md={8} lg={6}>
            <Button
              style={{
                borderRadius: "2rem",
                width: "100%",
                height: "2rem",
                marginBottom: "2rem",
                marginTop: "1rem",
              }}
            >
              Edit
            </Button>
          </Col>
          <Col xs={12} sm={12} md={8} lg={6}>
            <Button
              type="primary"
              style={{
                borderRadius: "2rem",
                width: "100%",
                height: "2rem",
                backgroundColor: "black",
                marginTop: "1rem",
              }}
              onClick={onclicksaveandapplybtn}
            >
              Save and apply
            </Button>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
}
