import useSafeReplace from "@/components/useSafeReplace";
import { Button, Col, Row } from "antd";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { GoogleIcon, AppleIcon, InfoIcon, LoginIcon } from "@/icons/icon";
import MainLayout from "@/components/mainlayout";
export default function Index() {
  const { data: session, status } = useSession();
  const [isSessionLoading, setIsSessionLoading] = useState(false);
  const { safeReplace } = useSafeReplace();
  const gapRem = "3.125rem";

  useEffect(() => {
    setIsSessionLoading(status === "loading");
    if (status === "authenticated" && session && safeReplace) {
       safeReplace("/onboarding/homepage");
     // safeReplace("/home");
      console.log("session",session);
    }
   
  }, [status, session, safeReplace]);

  const handleSignInGoogle = () => {
    signIn("keycloak", {}, { kc_idp_hint: "google" });
  };

  const handleSignInApple = () => {
    signIn("keycloak", {}, { kc_idp_hint: "apple" });
  };

  return (
    <MainLayout>{isSessionLoading ? (
    <div>Loading...</div>
  ) : status === "unauthenticated" ? (
    <div>
      <div className="topPart">
        <Row>
          <Col>
            <div className="logoTitleWrapper">
              <div
                style={{
                  display: "flex",
                  width: "40.495rem",
                  height: "7rem",
                  top: "10.6875rem",
                  left: "24.75rem",
                  gap: "2.1875rem",
                }}
              >
                <LoginIcon />
                <div className="loginTitle" style={{justifyContent:"center"}}>
                  Welcome to
                  <div />
                  Tejgyan Global Foundation
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <div className="bottomPart">
        <Row justify="center">
          <Col span={24}>
            <label className="loginRightPanelTitle">Sign in</label>
          </Col>
          <Col span={24}>
            <label className="loginRightPanelSubtitle">
              Please Sign in using
            </label>
          </Col>
          <Col span={24} style={{ textAlign: "center", marginTop: gapRem }}>
            <div className="buttonsContainer">
              <Button
                icon={<GoogleIcon />}
                className="continueWithGoogleButton"
                onClick={handleSignInGoogle}
              >
                Continue With Google
              </Button>
              <Button
                icon={<AppleIcon />}
                className="continueWithAppleButton"
                onClick={handleSignInApple}
              >
                Continue With Apple
              </Button>
            </div>
          </Col>
        </Row>
        <Row justify="center">
          <Col span={24}>
            <div
              style={{
                width: "19.0625rem",
                height: "3.75rem",
                top: "7.9825rem",
                left: "2.5rem",
                gap: " 0rem",
                marginRight: "2rem",
              }}
            >
              {/* <InfoIcon />
              <label className="infolabel">
                {" "}
                Lorem ipsum Lorem ipsum doplet lorem ipsum doplet sit. Lorem
                ipsum Lorem ipsum doplet lorem ipsum doplet sit
              </label>{" "} */}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  ) : (
    <div />
  )}
  
  </MainLayout> 
  )
}
