import React, { useState, useEffect } from 'react';
import { Menu, Layout, Avatar, Drawer } from 'antd';
import { LogoIcon, LogoutIcon, NotificationIcon, SavedIcon } from '@/icons/icon';
import { HomeOutlined, MenuOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import axios from 'axios'; 

const CustomMenu = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const router = useRouter();
  const { Item, SubMenu } = Menu;
  const { Sider } = Layout;

  useEffect(() => {
    const handleResize = () =>
      window.innerWidth < 768 ? setCollapsed(true) : setCollapsed(false);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  async function logout() {
    try {
      const response = await fetch('/api/logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        console.log('Logout successful');
        // Perform any additional actions after successful logout
      } else {
        console.error('Logout failed:', response.statusText);
        // Handle logout failure
      }
    } catch (error) {
      console.error('Error logging out:');
      // Handle error
    }
  }

  const handleTopMenuClick = (e: any) =>
    console.log('Top Menu Clicked:', e.key);
  const handleLogout = () => {
    logout();
  }

  const handleHome = () => {
    router.push('/onboarding/homepage');
   
  };
  

  const menuItems = [
    { key: 'home', icon: <HomeOutlined />, label: 'Home', onClick: handleHome },
    { key: 'saved', icon: <SavedIcon />, label: 'Saved' },
    {
      key: 'notification',
      icon: <NotificationIcon />,
      label: 'Notification',
      href: '/',
    },
    {
      key: 'logout',
      icon: <LogoutIcon />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  const handleMenuToggle = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  const renderMobileMenu = () => {
    return (
      <Drawer
        placement="left"
        closable={false}
        onClose={() => setMobileMenuVisible(false)}
        visible={mobileMenuVisible}>
        <Menu
          onClick={handleTopMenuClick}
          className="custom-menu"
          defaultSelectedKeys={['home']}
          style={{ color: '#52565D' }}>
          {menuItems.map(item => (
            <Item
              key={item.key}
              onClick={item.onClick}
              >
              {item.icon}
              <span>{item.label}</span>
            </Item>
          ))}
        </Menu>
      </Drawer>
    );
  };

  return (
    <Layout>
      <Sider
        theme="light"
        collapsible
        // collapsed={collapsed}
        // onCollapse={setCollapsed}
        style={{
          height: '100vh',
          position: 'fixed',
          left: '27px',
          width: '200px',
        }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
          <LogoIcon className="logologin" />
          <Menu
  mode="inline"
  onClick={handleTopMenuClick}
  className="custom-menu"
  defaultSelectedKeys={['home']}
  style={{ color: '#52565D' }}>
  {menuItems.map(item => (
    <Item
      key={item.key}
      onClick={item.onClick}
      style={{ display: 'flex', alignItems: 'center',flexDirection:"column" }}>
      {item.icon}
      <span style={{ marginLeft: '8px' }}>{item.label}</span>
    </Item>
  ))}
</Menu>


          {/* <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '15rem',
            }}>
            <Avatar size={64} src="/your-avatar-url.jpg" />{' '}
            {/* Replace src with your actual avatar URL */}
          {/* </div>  */}
        </div>
      </Sider>
      {/* {collapsed && (
        <MenuOutlined
          className="menu-toggle-icon"
          onClick={handleMenuToggle}
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '10px',
            fontSize: '24px',
            color: '#fff',
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: '10px',
            borderRadius: '50%',
          }}
        />
      )} */}
      {renderMobileMenu()}
    </Layout>
  );
};

export default CustomMenu;
