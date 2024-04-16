import React, { useState, useEffect } from 'react';
import { Menu, Layout, Drawer } from 'antd';
import { HomeOutlined, MenuOutlined } from '@ant-design/icons';
import { LogoIcon, LogoutIcon, NotificationIcon, SavedIcon } from '@/icons/icon';
import { useRouter } from 'next/router';
import { signOut } from "next-auth/react";

// Define the type for the menu item
type MenuItemType = {
  key: string;
  icon: JSX.Element;
  label: string;
  onClick?: () => void;
  href?: string;
};

const CustomMenu = () => {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const { Item } = Menu;
  const { Sider } = Layout;

  useEffect(() => {
    const handleResize = () =>
      window.innerWidth < 768 ? setCollapsed(true) : setCollapsed(false);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleHome = () => {
    router.push('/onboarding/homepage');
  };

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
          className="custom-menu"
          defaultSelectedKeys={['home']}
          style={{ color: '#52565D' }}>
          {menuItems.map(item => (
            <Item
              key={item.key}
              onClick={item.onClick}>
              {item.icon}
              <span>{item.label}</span>
            </Item>
          ))}
        </Menu>
      </Drawer>
    );
  };

  const LogoutOption = ({ signOut }: { signOut: () => Promise<void> }) => {
    const handleLogout = async () => {
      await signOut();
    };

    return (
      <Item key="logout" onClick={handleLogout}>
        <LogoutIcon />
        <span>Logout</span>
      </Item>
    );
  };

  // Define the menu items with explicit type
  const menuItems: MenuItemType[] = [
    { key: 'home', icon: <HomeOutlined />, label: 'Home', onClick: handleHome },
    { key: 'saved', icon: <SavedIcon />, label: 'Saved' },
    {
      key: 'notification',
      icon: <NotificationIcon />,
      label: 'Notification',
      href: '/',
    },
    { key: 'logout', icon: <LogoutIcon />, label: 'Logout' }, // No onClick needed for LogoutOption
  ];

  return (
    <Layout>
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
        style={{
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
          <LogoIcon className="logologin" />
          {/* Display menu items */}
          <Menu
            mode="inline"
            className="custom-menu"
            defaultSelectedKeys={['home']}
            style={{ color: '#52565D' }}>
            {menuItems.map(item => (
              <Item key={item.key} onClick={item.onClick}>
                {item.icon}
                <span>{item.label}</span>
              </Item>
            ))}
          </Menu>
        </div>
      </Sider>
      <MenuOutlined
        className="menu-toggle-icon"
        onClick={handleMenuToggle}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          fontSize: '24px',
          color: '#fff',
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: '10px',
          borderRadius: '50%',
          display: collapsed ? 'block' : 'none', // Show only when collapsed
        }}
      />
      {renderMobileMenu()}
    </Layout>
  );
};

export default CustomMenu;
