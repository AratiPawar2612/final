
import { Layout, Spin } from 'antd';

import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';

const { Content, Sider } = Layout;

export default function MainLayout(props: any) {
  const { siderChildren, siderClassName, children, rightPanelChildren } = props;
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const toggleMenu = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout className="leftpanel">
      {siderChildren && siderClassName && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          className={siderClassName}>
          {siderChildren}
        </Sider>
      )}
      <Content className="fullWidth mainDiv">{children}</Content>

      {rightPanelChildren && (
        <Sider className="rightPanel" trigger={null} collapsed={false}>
          {rightPanelChildren}
        </Sider>
      )}
    </Layout>
  );
}
