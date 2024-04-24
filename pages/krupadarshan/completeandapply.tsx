import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Divider, Steps, Select, Row, Avatar, Col } from "antd";
import MainLayout from "@/components/mainlayout";
import CustomMenu from "@/components/custommenu";
import axios, { AxiosResponse, AxiosError } from "axios";
import { VerifiedIcon } from "@/icons/icon";
import { ArrowLeftIcon } from "@/icons/icon";
import { fetchParticipantData ,fetchPurposeOptions,fetchApplicationData} from "../api/applicationapi";
import CustomFooter from "@/components/customrightpanel";
const { Option } = Select;

export default function CompleteAndApplyPage() {
  const { Step } = Steps;
  const router = useRouter();
  const [data, setData] = useState<any>([]);
  const [purposeOptions, setPurposeOptions] = useState<any[]>([]);
  const [selectedPurpose, setSelectedPurpose] = useState<any[]>([]);
  const [addnote, setaddnote] = useState("");
  const [startdate, setStartDate] = useState("");
  const [enddate, setEndDate] = useState("");

  function convertDate(dateStr:any) {
    console.log("Input date string:", dateStr);
    
    if (!dateStr) {
        console.log("Date string is undefined or null");
        return ''; 
    }

    const [year, month, day] = dateStr.slice(0, 10).split('-');
    console.log("Day:", day, "Month:", month, "Year:", year);

    if (!day || !month || !year) {
        console.log("Date parts are missing");
        return ''; // Return empty string if any part of the date is missing
    }

    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year.slice(-2)}`;
}





  useEffect(() => {
    const loadMoreData = async () => {
      const sessionresponse = await fetch("/api/getsession");
      const sessionData = await sessionresponse.json();
      console.log("Session Data:", sessionData?.session?.access_token);
      if (sessionData?.session) {
      const participantUserResponseData = await fetchParticipantData(
        sessionData?.session?.access_token
      );
      
      setData(participantUserResponseData);

      console.log("userDataResults", participantUserResponseData);

      const applicationData = await fetchApplicationData(sessionData?.session?.access_token);
      console.log("applicationData", applicationData);
        setaddnote(applicationData[0]?.khoji_note);
       
       const userid = applicationData[0]?.user?.id;
       console.log("userid", userid);
       const Startdate = applicationData[0]?.preferred_start_date;
       const Enddate = applicationData[0]?.preferred_end_date;
       console.log("startdate",convertDate(Startdate));
       setStartDate(convertDate(Startdate));
       setEndDate(convertDate(Enddate));


      const options = await fetchPurposeOptions(userid, sessionData?.session?.access_token);
      setPurposeOptions(options);
    }
    else{
      router.push("/");
    }
    };

    loadMoreData();
  }, [router]);
 
  const onclicksaveandapplybtn = () => {
    router.push("/krupadarshan/viewstatus");
  };

  
function buildUserdataCard(user: any, index: any) {
    return user ? (
      <div
        className={`${
          index === 0  ? "userProfileRightCard" : "userProfileLeftCard"
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
                {user.relation_with?.first_name} {user.relation_with?.last_name}
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
  return (
    <MainLayout siderClassName="leftMenuPanel" siderChildren={<CustomMenu />}>
      <div style={{ marginLeft: "1rem" }}>
        <div style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
          <ArrowLeftIcon onClick={() => router.back()} /> Apply for Krupa
          Darshan
        </div>
        <div style={{ marginLeft: "1.8rem" }}>
          <label className="verifyKhojiSubtitle">Complete and apply</label>
        </div>
        <div className="center-steps">
          <Steps
            style={{ width: "50%" }}
            current={1}
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
      <div style={{ fontWeight:"bolder", fontSize: "1rem", marginLeft: "2rem" }}>
        Summary
      </div>
      <div
        className="verifyKhojiSubtitle"
        style={{ whiteSpace: "pre-wrap", marginLeft: "2rem" }}
      >
        {`Lorem Ipsum is simply dummy text of the printing and typesetting
       `}
      </div>
<div style={{ fontWeight: "bold", fontSize: "0.9rem", marginLeft: "2rem" }}>  Added Member</div>
      <Row gutter={16}>
      
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {data.results && data.results.length > 0 ? (
            <Row gutter={[16, 16]} style={{ flex: "1", flexWrap: "wrap" }}>
              {data.results.map((user: any, index: any) => (
                <Col
                  key={index}
                  xs={12}
                  sm={24}
                  md={12}
                  lg={12}
                  xl={12}
                  style={{
                    marginBottom: "16px",
                    marginLeft: "1rem",
                    flex: "0 0 auto",
                  }}
                >
                  {buildUserdataCard(user, index)}
                </Col>
              ))}
            </Row>
          ) : (
            <div  style={{marginLeft: "1rem"}} >No Added Member</div>
          )}
        </div>
      </Row>
      <div>
        <Row gutter={[16, 16]}>
          <Col span={4}>
            <div style={{ fontSize: "0.9rem", marginLeft: "1rem" }}>
              Preferred Date
            </div>
            <div style={{ marginTop: "1rem", marginLeft: "1rem" }}>
            {startdate} to {enddate} <br />@ Manan Ashram
            </div>
          </Col>
          <Col span={12}>
            <div style={{ fontSize: "0.9rem", marginLeft: "1rem" }}>
              Purpose of Darshan
            </div>

            <Select
  mode="tags"
  style={{ width: "100%", height: "auto" }}
  placeholder="Select Purpose"
  value={purposeOptions}
  onChange={(value) => setSelectedPurpose(value)}
>
  {purposeOptions.map((option) => (
    <Select.Option key={option.key} value={option.value}>
      {option.label} {/* Change 'title' to 'label' */}
    </Select.Option>
  ))}
</Select>
          </Col>
        </Row>
      </div>

      <div style={{ marginLeft: "1rem" }}>
        <div style={{ fontSize: "0.9rem", marginTop: "2rem" }}>Note added</div>
        <div className="verifyKhojiSubtitle" style={{ whiteSpace: "pre-wrap" }}>
         {addnote}
        </div>
      </div>
      <div style={{ marginTop: "2rem" }}>
        <Button
          style={{
            borderRadius: "2rem",
            marginLeft: "1rem",
            width: "10rem",
            height: "2rem",
          }}
        >
          Edit
        </Button>
        <Button
          type="primary"
          style={{
            borderRadius: "2rem",
            marginLeft: "1rem",
            width: "12rem",
            height: "2rem",
            backgroundColor: "black",
          }}
          onClick={onclicksaveandapplybtn}
        >
          Save and apply
        </Button>
      </div>
    </MainLayout>
  );
}
