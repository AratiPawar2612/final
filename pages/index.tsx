import useSafeReplace from "@/components/useSafeReplace";
import { Button, Col, Flex, Row } from "antd";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { GoogleIcon, AppleIcon, InfoIcon, LoginIcon } from "@/icons/icon";
import MainLayout from "@/components/mainlayout";

export default function Index() {
  const { data: session, status } = useSession();
  const [isSessionLoading, setIsSessionLoading] = useState(false);
  const { safeReplace } = useSafeReplace();
  const gapRem = "3.125rem";
  const [isMobileView, setIsMobileView] = useState(false);

  const handleSessionExpired = () => {
    // Implement how to handle an expired session
    // Replace the following line with your actual handling logic
    window.location.href = "/"; // Redirect to login page
  };

  useEffect(() => {
    const isSessionValid = (session:any) => {
      return session && !isSessionExpired(session);
    };

    const isSessionExpired = (session:any) => {
      return session.expiryTime < Date.now();
    };

    setIsSessionLoading(status === "loading");
    if (status === "authenticated" && session && safeReplace) {
      if (isSessionValid(session)) {
        console.log("Redirected to homepage");
        safeReplace("/onboarding/homepage");
      } else {
        console.log("Session has expired");
        handleSessionExpired();
      }
    }
  }, [status, session, safeReplace, setIsSessionLoading]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
     
    };

    handleResize(); // Call once on component mount
    window.addEventListener("resize", handleResize); // Listen for window resize events

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup on component unmount
    };
  }, [isMobileView]);

  const handleSignInGoogle = () => {
    signIn("keycloak", {}, { kc_idp_hint: "google" });
  };

  const handleSignInApple = () => {
    signIn("keycloak", {}, { kc_idp_hint: "apple" });
  };

  return (

      <div>
        {isSessionLoading ? (
          <div>Loading...</div>
        ) : status === "unauthenticated" ? (
          <div>
            <div className="topPart">
              <Row>
                <Col>
                  {!isMobileView && (
                    <div>
                      <div
                        style={{
                          display: "flex",
                          width: "auto",
                          height: "1rem",
                          gap: "2.1875rem",
                        }}
                      >
                        <LoginIcon className="logo" />
                        <div className="loginTitle" style={{ justifyContent: "center" }}>
                          Welcome to
                          <br />
                          Tejgyan Global Foundation
                        </div>
                      </div>
                    </div>
                  )}
                  {isMobileView && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <LoginIcon className="logo" />
                      <div className="loginTitle">
                        Welcome to <br />
                        Tejgyan Global Foundation
                      </div>
                    </div>
                  )}
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
                <Col span={24} style={{ justifyContent: "center", marginLeft: "2rem", marginTop: gapRem }}>
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
                    {/* <label className="loginRightPanelSubtitle"> <InfoIcon /> When you click continue you agree to follow our Privacy Policy and our Terms an Conditions.</label> */}
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        ) : (
          <div />
        )}
      </div>
    
  );
}
