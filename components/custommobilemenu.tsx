import React, { useState, useEffect } from "react";
import { Menu, Layout, Modal, Drawer, message } from "antd";
import { MenuOutlined, HomeOutlined } from "@ant-design/icons";
import {
  ElipseIcon,
  HomeIcon,
  SavedIcon,
  NotificationIcon,
  LogoutIcon,
  MobileMenuIcon,
} from "@/icons/icon";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

const { Sider } = Layout;
const { Item } = Menu;

const CustomMobileMenu = () => {
  const router = useRouter();
  const [notificationsData, setNotificationsData] = useState<any>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number | undefined>(undefined);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleTopMenuClick = (e: any) => {
    console.log("Top Menu Clicked:", e.key);
  };

  const handleHome = () => {
    router.push("/onboarding/homepage");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleNotificationClick = async () => {
    try {
      const res = await fetch("/api/getsession");
      const sessionData = await res.json();
      const notificationUrl = `https://hterp.tejgyan.org/django-app/notifications/notifications/application_notification/`;

      const response = await fetch(notificationUrl, {
        headers: {
          Authorization: `Bearer ${sessionData?.session?.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const notificationData = await response.json();
      const notifications = notificationData.results ?? [];
      setNotificationsData(notifications);
      setShowNotificationModal(true);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      message.error("Failed to fetch notifications. Please try again.");
    }
  };

  const handleNotificationModalClose = () => {
    setNotificationsData(null);
    setShowNotificationModal(false);
  };

  const updateWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    updateWindowWidth();
    window.addEventListener("resize", updateWindowWidth);
    return () => {
      window.removeEventListener("resize", updateWindowWidth);
    };
  }, []);

  const toggleDrawer = () => {
    setShowDrawer(!showDrawer);
  };
  const calculateHoursElapsed = (timestamp: any): number | null => {
    if (timestamp) {
      const now: Date = new Date();
      const updatedTime: Date = new Date(timestamp);
      const timeDifference: number = now.getTime() - updatedTime.getTime();
      const hours: number = Math.floor(timeDifference / (1000 * 60 * 60));
      return hours;
    }
    return null;
  };

  return (
    <Layout>
      {windowWidth && windowWidth <= 768 && (
        <div
          style={{
            backgroundColor: "#F4F4F4",
            fontSize: "2rem",
            fontWeight: "bolder",
          }}
        >
          <MenuOutlined onClick={toggleDrawer} />
        </div>
      )}

      {windowWidth && windowWidth <= 768 && (
        <Drawer
          placement="right"
          onClose={toggleDrawer}
          open={showDrawer}
          width="auto"
           style={{ backgroundColor:"#F4F4F4" }}
          // title={<MobileMenuIcon />}
        >
          <Menu
            mode="inline"
            onClick={handleTopMenuClick}
            className="custom-menu"
            defaultSelectedKeys={["home"]}
            style={{
              backgroundColor: "#F4F4F4",
              boxShadow: "none",
              border: "none",
            }}
          >
            <Item
              key="home"
              onClick={handleHome}
              style={{
                marginLeft: "40px",
                display: "flex",
                alignItems: "center",
                height: "4rem",
                background: "transparent",
              }}
            >
              <HomeIcon />
            </Item>
            <Item
              key="saved"
              style={{
                marginLeft: "40px",
                display: "flex",
                alignItems: "center",
                height: "4rem",
                background: "transparent",
              }}
            >
              <SavedIcon />
            </Item>
            <Item
              key="notification"
              onClick={handleNotificationClick}
              style={{
                marginLeft: "25px",
                display: "flex",
                alignItems: "center",
                height: "4rem",
                background: "transparent",
              }}
            >
              <NotificationIcon />
            </Item>
            <Item
              key="logout"
              onClick={handleSignOut}
              style={{
                marginLeft: "40px",
                display: "flex",
                alignItems: "center",
                height: "4rem",
                background: "transparent",
              }}
            >
              <LogoutIcon />
            </Item>
          </Menu>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10rem",
              backgroundColor: "#F4F4F4",
            }}
          >
            <ElipseIcon />
          </div>
        </Drawer>
      )}

      <Modal
        title="Notifications"
        open={showNotificationModal}
        onCancel={handleNotificationModalClose}
        footer={null}
        className="notification-modal"
        // style={{
        //   width: "360px",
        //   height: "80vh",
        //   marginLeft: "7rem",
        //   padding: "1.25rem",
        //   overflowY: "auto",
        // }}
      >
        <ul
          style={{
            listStyleType: "none",
            padding: 0,
            maxHeight: "60vh",
            overflowY: "auto",
          }}
        >
          {notificationsData &&
            notificationsData.map((notification: any) => (
              <li key={notification.id} style={{ marginBottom: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "1rem",
                  }}
                >
                  <ElipseIcon />
                  <div style={{ marginLeft: "10px" }}>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: notification.detail?.description.replace(
                          /([^']+)'s/,
                          "<strong>$1</strong>'s"
                        ),
                      }}
                    />
                    <div>
                      {notification.detail?.updated_at && (
                        <>
                          {calculateHoursElapsed(
                            notification.detail.updated_at
                          )}{" "}
                          hours ago{" | "}
                          Ref Code: {notification.application?.reference_code}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </Modal>
    </Layout>
  );
};

export default CustomMobileMenu;
