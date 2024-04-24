
import React, { useState, useEffect } from "react";
import { Menu, Layout, Avatar } from "antd";
import { HomeOutlined, MenuOutlined } from '@ant-design/icons';
import { HomeIcon, LogoIcon, LogoutIcon, NotificationIcon, SavedIcon } from '@/icons/icon';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';



const { Sider } = Layout;
const { Item } = Menu;

const CustomMenu = () => {
  const router = useRouter();
 

     const handleTopMenuClick = (e:any) =>
        console.log('Top Menu Clicked:', e.key);
      
    
      const handleHome = () => {
        router.push('/onboarding/homepage');
      };
    
      const handleSignOut = async () => {
        await signOut();
      };
  return (
    <Layout>
      <Sider
        theme="light"
        className="left-panel" // Add the class name here
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: "#F4F4F4",
          }}
        >
          <div
            style={{
              marginLeft: "40px",
               marginBottom: "1rem",
               display: "flex",
              alignItems: "center",
              height: "4rem",
              backgroundColor: "#F4F4F4",
              background: "transparent", // or set to the same background color as your menu
            }}
          >
            <LogoIcon className="logologin" />
          </div>
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
                background: "transparent", // or set to the same background color as your menu
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
                background: "transparent", // or set to the same background color as your menu
              }}
            >
              <SavedIcon />
            </Item>
            <Item
              key="notification"
            
              style={{
                marginLeft: "25px",
                display: "flex",
                alignItems: "center",
                height: "4rem",
                background: "transparent", // or set to the same background color as your menu
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
                background: "transparent", // or set to the same background color as your menu
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
              marginTop: "80vh",
              backgroundColor: "#F4F4F4",
            }}
          >
          <Avatar/>
          </div>
        </div>
      </Sider>
    </Layout>
  );
};

export default CustomMenu;
