import React, { useState } from "react";
import { Menu, Layout, Avatar, Modal, message } from "antd";
import { HomeOutlined } from '@ant-design/icons';
import { ElipseIcon, HomeIcon, LogoIcon, LogoutIcon, NotificationIcon, SavedIcon } from '@/icons/icon';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';

const { Sider } = Layout;
const { Item } = Menu;

const CustomMenu = () => {
  const router = useRouter();
  const [notificationsData, setNotificationsData] = useState<any>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleTopMenuClick = (e: any) => {
    console.log('Top Menu Clicked:', e.key);
  };

  const handleHome = () => {
    router.push('/onboarding/homepage');
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const calculateHoursElapsed = (timestamp: any): number | null => {
    if (timestamp) {
      const now: Date = new Date(); // Current time
      const updatedTime: Date = new Date(timestamp); // Convert timestamp to Date object
      const timeDifference: number = now.getTime() - updatedTime.getTime(); // Difference in milliseconds
      const hours: number = Math.floor(timeDifference / (1000 * 60 * 60)); // Convert milliseconds to hours
      return hours;
    }
    return null;
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
        throw new Error('Failed to fetch notifications');
      }

      const notificationData = await response.json();
      const notifications = notificationData.results ?? [];
      setNotificationsData(notifications);
      console.log("notifications",notifications);
      setShowNotificationModal(true);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      message.error('Failed to fetch notifications. Please try again.');
    }
  };

  const handleNotificationModalClose = () => {
    setNotificationsData(null);
    setShowNotificationModal(false);
  };
 

  return (
    <Layout>
      <Sider theme="light" className="left-panel" collapsible collapsed={collapsed} onCollapse={toggleCollapsed}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", backgroundColor: "#F4F4F4" }}>
          <div style={{ marginLeft: "40px", display: "flex", alignItems: "center", height: "1.5rem", backgroundColor: "#F4F4F4", background: "transparent" }}>
            <LogoIcon className="logologin" />
          </div>
          <Menu mode="inline" onClick={handleTopMenuClick} className="custom-menu" defaultSelectedKeys={["home"]} style={{ backgroundColor: "#F4F4F4", boxShadow: "none", border: "none" }}>
            <Item key="home" onClick={handleHome} style={{ marginLeft: "40px", display: "flex", alignItems: "center", height: "4rem", background: "transparent" }}>
              <HomeIcon />
            </Item>
            <Item key="saved" style={{ marginLeft: "40px", display: "flex", alignItems: "center", height: "4rem", background: "transparent" }}>
              <SavedIcon />
            </Item>
            <Item key="notification" onClick={handleNotificationClick} style={{ marginLeft: "25px", display: "flex", alignItems: "center", height: "4rem", background: "transparent" }}>
              <NotificationIcon />
            </Item>
            <Item key="logout" onClick={handleSignOut} style={{ marginLeft: "40px", display: "flex", alignItems: "center", height: "4rem", background: "transparent" }}>
              <LogoutIcon />
            </Item>
          </Menu>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "80vh", backgroundColor: "#F4F4F4" }}>
            <ElipseIcon />
          </div>
        </div>
      </Sider>
      <Modal
      title="Notifications"
      open={showNotificationModal}
      onCancel={handleNotificationModalClose}
      footer={null}
      className="notification-modal"
      style={{ width: '360px', height: '1023px', marginLeft: '7rem', padding: '1.25rem', overflowY: 'auto',overflowX: 'auto' }}
    >
      <ul style={{ listStyleType: 'none', padding: 0, maxHeight: '800px', overflowY: 'auto' }}>

        {notificationsData &&
          notificationsData.map((notification:any) => (
            <li key={notification.id} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
                <ElipseIcon />
                
                <div style={{ marginLeft: '10px' }}>
                  {/* Render the description with HTML formatting */}
                  <span
                    dangerouslySetInnerHTML={{
                      __html: notification.detail?.description.replace(
                        /([^']+)'s/,
                        '<strong>$1</strong>\'s'
                      ),
                    }}
                  />
                  {/* Display the updated_at timestamp and reference_code */}
                  <div>
                    {notification.detail?.updated_at && (
                      <>
                        {calculateHoursElapsed(notification.detail.updated_at)} hours ago{'|'}
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

export default CustomMenu;
