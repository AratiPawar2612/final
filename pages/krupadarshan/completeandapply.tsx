import React, { useEffect, useState,useCallback } from "react";
import { useRouter } from "next/router";
import { Button, Divider, Steps, Select, Row, Avatar, Col } from "antd";
import MainLayout from "@/components/mainlayout";
import CustomMenu from "@/components/custommenu";
import {
  VerifiedIcon,
  LogoIcon,
  DeleteIcon,
  ViewStatusSecondIcon,
} from "@/icons/icon";
import { ArrowLeftIcon } from "@/icons/icon";
import {
  fetchApplicationData,fetchPurposeData
} from "../api/applicationapi";
import CustomMobileMenu from "@/components/custommobilemenu";
import StepComponent from "@/components/customstep";

const { Option } = Select;
interface Option {
  value: string;
  label: string;}

export default function CompleteAndApplyPage() {
  const { Step } = Steps;
  const router = useRouter();
  const [data, setData] = useState<any>([]);
  const [addnote, setaddnote] = useState("");
  const [purpose, setPurpose] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState<any[]>([]); // Define state
  const [startdate, setStartDate] = useState("");
  const [enddate, setEndDate] = useState("");
  const [isMobileView, setIsMobileView] = useState(false); // Define isMobileView state
  const [purposeOptions, setPurposeOptions] = useState<any[]>([]); // Define purposeOptions state

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

  const loadMoreData = useCallback(async () => {
    const sessionresponse = await fetch("/api/getsession");
    const sessionData = await sessionresponse.json();
    if (sessionData?.session) {
      const applicationData = await fetchApplicationData(
        sessionData?.session?.access_token
      );
      console.log("applicationData", applicationData);
      setaddnote(applicationData[0]?.khoji_note);

      const userid = applicationData[0]?.user?.id;
      console.log("userid", userid);
      if (applicationData[0]?.purposes && applicationData[0]?.purposes.length > 0) {
        const purposes = applicationData[0]?.purposes.map(
          (purpose:any) => purpose.description
        );
        // Join the descriptions into a single string separated by a delimiter
        const formattedPurposes = purposes.join(", ");
        setPurpose(formattedPurposes);
      }
      



      setData(applicationData[0]?.participants);
      console.log("userDataResults", applicationData[0]?.participants);

      setStartDate(convertDate(applicationData[0]?.preferred_start_date));
      setEndDate(convertDate(applicationData[0]?.preferred_end_date));


      const purposeOptionsResponse = await fetchPurposeData(
        sessionData?.session?.access_token
      );
      setPurposeOptions(purposeOptionsResponse);
    } else {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    loadMoreData();
  }, [loadMoreData]); 


  const onclicksaveandapplybtn = () => {
    router.push("/krupadarshan/viewstatuspage");
  };

  const handleDeletAction=()=>{

  }
  

 
  function buildUserdataCard(user: any, index: any) {
    return user ? (
      <div
        className={`${
          index === 1 ? "userProfileLeftCards" : "userProfileLeftCards"
        }`}
        // style={{ width: "20rem", height: "20rem" }}
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
          <label className="userProfileInfoTitle" style={{ marginRight: "9rem" ,marginTop:"10px"}}>
         {`${user?.first_name?.charAt(0).toUpperCase()}${user?.first_name?.slice(1)} ${user?.last_name?.charAt(0).toUpperCase()}${user?.last_name?.slice(1)}`}

          </label>
          <div className="displayFlex flexDirectionRow alignItemsCenter marginTop16">
           
            <div
              className="displayFlex flexDirectionColumn flex1"
              style={{ marginTop: "1rem" }}
            >
              <label className="userProfileInfoTitle"></label>
              <label className="userProfileInfoValue"></label>
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
              <label className="userProfileInfoTitle">Address</label>
              <label className="userProfileInfoValue"></label>
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
          className="flexContainer"
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

      <div  className="marginLeft3rem marginTop5rem">
        <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
          {/* <ArrowLeftIcon onClick={() => router.back()} /> */}
          Apply for Gyan Darshan
        </div>
        <div >
          <label className="Descriptionlabel">complete and apply</label>
        </div>

        <div className="center-steps">
         
            <StepComponent  currentStep={1} />
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
              className="FlexDirectionRowSpacebetween marginTop1rem"
             
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
              className="marginLeft2rem marginTop1rem"
                style={{
                  fontSize: "0.9rem",
                }}
              >
                Preferred Date
              </div>
              <div
               className="marginLeft2rem marginTop1rem"
                style={{
                 
                  textWrap: "nowrap",
                }}
              >
                {startdate} to {enddate}
              </div>
            </Col>
            <Col span={12}>
              <div
               className="marginLeft3rem marginTop1rem"
                style={{
                  fontSize: "0.9rem",
                }}
              >
                Purpose of Darshan
              </div>
              
<div className="purpose-container marginLeft2rem marginTop1rem">
      {purpose.split(',').map((item, index) => (
        <label key={index} className="purpose-label">{item}</label>
      ))}
    </div>

                   
            </Col>
          </Row>
        </div>
        {addnote && (
          <div style={{ marginLeft: "2rem" }}>
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
             className="editButton"
             disabled
            >
              Edit
            </Button>
          </Col>
          <Col xs={12} sm={12} md={8} lg={6}>
            <Button
              type="primary"
             className="saveApplyButton"
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
