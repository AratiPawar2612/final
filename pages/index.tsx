import useSafeReplace from "@/components/useSafeReplace";
import { Button, Col, Flex, Row } from "antd";
import { signIn, useSession,signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { GoogleIcon, AppleIcon, InfoIcon, LoginIcon } from "@/icons/icon";
import jwt, { JwtPayload } from 'jsonwebtoken';
import Router, { useRouter } from "next/router";


export default function Index() {
  const { data: session, status } = useSession();
  const [isSessionLoading, setIsSessionLoading] = useState(false);
  const { safeReplace } = useSafeReplace();
  const gapRem = "3.125rem";
  const [isMobileView, setIsMobileView] = useState(false);
  const router=useRouter();
 
  useEffect(() => {
    console.log("Session data:", session);
    const fetchData = async () => {
        const now = new Date();
        const response = await fetch("/api/getsession");
        const sessionData = await response.json();
        console.log("Session:", sessionData);

        setIsSessionLoading(status === "loading");

        const decodedToken = jwt.decode(sessionData?.session?.access_token) as JwtPayload;
        if (decodedToken !== null && typeof decodedToken.exp === 'number') {
            const expirationTime = new Date(decodedToken.exp * 1000);
            console.log("Token expiration time:", expirationTime);
            
            if (status === "authenticated" && session && expirationTime >= now) {
             // if (status === "authenticated" && session && sa) {
              console.log("on homepage")
              router.push("/onboarding/homepage");
          } else {
              console.log("User remains on the same page");
             
          }
        }

        
    };

    fetchData();
}, [status, session, router,setIsSessionLoading]);

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

      <div >
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
                        <div className="loginTitle" style={{ alignItems: "center" }}>
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
