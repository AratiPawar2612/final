import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button, Divider, Steps, Row, Col, Card } from "antd";
import MainLayout from "@/components/mainlayout";
import CustomMenu from "@/components/custommenu";
import {
  ArrowLeftIcon,
  LogoIcon,
  CheckICon,
  WithFamilyIcon,
  YourSelfIcon,
} from "@/icons/icon";

import CustomMobileMenu from "@/components/custommobilemenu";
import { ViewStatusFirstSvg } from "@/icons/svgs";

export default function AddApplicationDetailsPage() {
  const { Step } = Steps;
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [buttonColor, setButtonColor] = useState("gray");
  const [continueButtonText, setContinueButtonText] = useState("Continue");
  const [buttonSize, setButtonSize] = useState<"large" | "middle" | "small">(
    "large"
  );
  const [isContinueDisabled, setIsContinueDisabled] = useState(true); // State to manage continue button disable/enable
  const [isMobileView, setIsMobileView] = useState(false); // Define isMobileView state

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768); // Update isMobileView based on window width
      console.log("size", window.innerWidth < 768);
    };

    handleResize(); // Call once on component mount
    window.addEventListener("resize", handleResize); // Listen for window resize events

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup on component unmount
    };
  }, []);

  const handleCardClick = (cardName: string) => {
    setButtonColor("black");
    setSelectedCard(cardName);
    setIsContinueDisabled(false); // Enable continue button when a card is selected
    if (cardName === "Family Gyan Darshan") {
      setContinueButtonText("Continue with Family Darshan");
      setButtonSize("large");
    } else if (cardName === "Darshan For Yourself") {
      setContinueButtonText("Continue Darshan with Yourself");
      setButtonSize("middle");
    }
  };

  const handleContinueClick = () => {
    const isFamilyGyanDarshan = selectedCard === "Family Gyan Darshan";
    router.push(
      `/krupadarshan/addpersonaldetails?isFamilyKrupaDarshan=${isFamilyGyanDarshan}`
    );
  };

  return (
    <MainLayout
      siderClassName={isMobileView ? "" : "leftMenuPanel"}
      siderChildren={!isMobileView && <CustomMenu />}
    >
      {isMobileView && (
        <div
        
          className="mobilecontainer"
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
      <div style={{ padding: "0 20px" }}>
        <div
          style={
            isMobileView
              ? { fontWeight: "bold", fontSize: "1rem", marginLeft: "1rem" }
              : { fontWeight: "bold", fontSize: "1rem", marginLeft: "3rem" }
          }
        >
          {/* <ArrowLeftIcon onClick={() => router.back()} /> */}
          Apply for Gyan Darshan
        </div>
        <div style={
            isMobileView
              ? { marginLeft: "1rem" }
              : { marginLeft: "3rem" }
          }>
          <label className="Descriptionlabel">Add Application details</label>
        </div>

        <div className="center-steps">
          {isMobileView ? (
            <ViewStatusFirstSvg /> // Use uppercase for component name
          ) : (
            <Steps
              current={-1}
              style={{ width: "50%" }}
              labelPlacement="vertical"
              responsive={false}
            >
              <Steps.Step title="Add application details" />
              <Steps.Step title="Complete & apply" />
              <Steps.Step title="View status" />
            </Steps>
          )}
        </div>

        <Divider className="divider" />
        <div
          style={
            isMobileView
              ? { fontWeight: "bold", fontSize: "0.8rem", marginLeft: "1rem" }
              : { fontWeight: "bold", fontSize: "0.8rem", marginLeft: "3rem" }
          }
        >
          Select Your Type
        </div>
        <div
          style={
            isMobileView
              ? { fontSize: "0.8rem", marginLeft: "1rem" }
              : { fontSize: "0.8rem", marginLeft: "3rem" }
          }
        >
          {" "}
          Please choose one option to proceed.
        </div>
        <Row gutter={[16, 16]} style={isMobileView ? { marginLeft: "0px" } : { marginLeft: "3rem" }}>
  <Col xs={12} sm={24} md={12} lg={12} xl={6}>
    <div  className="marginTop3rem" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Card
         className={`cardContainer ${selectedCard === "Darshan For Yourself" ? "lightBlueBackground" : "whiteBackground"}`}
  
        onClick={() => handleCardClick("Darshan For Yourself")}
      >
        <YourSelfIcon style={{ fontSize: "1.5rem" }} />
        <div style={{ marginTop: "2rem", fontWeight: "bold", fontSize: "1.3rem" }}>
          Darshan For<br /> Yourself
        </div>
        <div style={{ marginTop: "2rem" }}>
          Select this option for Gyandarshan with yourself
        </div>
        {selectedCard === "Darshan For Yourself" && (
          <div style={{ position: "absolute", top: "10px", right: "10px" }}>
            <CheckICon style={{ color: "green", fontSize: "20px" }} />
          </div>
        )}
      </Card>
    </div>
  </Col>
  <Col xs={12} sm={24} md={12} lg={12} xl={6}>
    <div  className="marginTop3rem" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Card
        className={`cardContainer ${selectedCard === "Family Gyan Darshan" ? "lightBlueBackground" : "whiteBackground"}`}
  
        onClick={() => handleCardClick("Family Gyan Darshan")}
      >
        <WithFamilyIcon style={{ fontSize: "1.5rem" }} />
        <div style={{ marginTop: "2rem", fontWeight: "bold", fontSize: "1.3rem" }}>
          Family Gyan<br /> Darshan
        </div>
        <div style={{ marginTop: "2rem" }}>
          Select this option for Gyandarshan with your Family
        </div>
        {selectedCard === "Family Gyan Darshan" && (
          <div style={{ position: "absolute", top: "10px", right: "10px" }}>
            <CheckICon style={{ color: "green", fontSize: "20px" }} />
          </div>
        )}
      </Card>
    </div>
  </Col>
</Row>


        <div 
        className="marginLeft3rem marginTop2rem">
          <Button
          className="continuebutton marginTop2rem"
          style={{backgroundColor:buttonColor}}
            type="primary"
            onClick={handleContinueClick}
            size={buttonSize}
            disabled={isContinueDisabled}
          >
            {continueButtonText}
          </Button>
        </div>  
      </div>
    </MainLayout>
  );
}
