import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import MainLayout from "./mainlayout";
import { Row, Col, Button, Avatar } from "antd";
import { GoogleIcon, AppleIcon, InfoIcon, LoginIcon } from "@/icons/icon";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const gapRem = "50px";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/getsession");
        const sessionData = await response.json();

        if (sessionData?.session) {
          router.push("/onboarding/homepage");
        } else {
          console.log("User is not authenticated. Redirecting to Login page.");
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSignInGoogle = () => {
    signIn("keycloak", {}, { kc_idp_hint: "google" });
  };

  const handleSignInApple = () => {
    signIn("keycloak", {}, { kc_idp_hint: "apple" });
  };

  return (
    <MainLayout>
      <div className="topPart">
        <Row>
          <Col>
            <div className="logoTitleWrapper">
              <div
                style={{
                  display: "flex",
                  width: "Hug (647.92px)px",
                  height: "Hug (112px)px",
                  top: "171px",
                  left: "396px",
                  gap: "35px",
                  opacity: "0px",
                }}
              >
                <LoginIcon />
                <div className="loginTitle">
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
                opacity: "0rem",
                marginRight: "2rem",
              }}
            >
              <InfoIcon />
              <label className="infolabel">
                {" "}
                Lorem ipsum Lorem ipsum doplet lorem ipsum doplet sit. Lorem
                ipsum Lorem ipsum doplet lorem ipsum doplet sit
              </label>{" "}
            </div>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
}
