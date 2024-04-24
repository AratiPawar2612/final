import { useSession } from "next-auth/react";
import { Layout, Spin } from 'antd';

import { useRouter } from 'next/navigation';

const { Content, Sider } = Layout;
import { useEffect, useState } from "react";
import useSafeReplace from "./useSafeReplace";

export default function MainLayout(props: any) {
  const { siderChildren, siderClassName, children, rightPanelChildren } = props;

  const { data: session, status } = useSession();
  const [isSessionLoading, setIsSessionLoading] = useState(false);
  const { safeReplace } = useSafeReplace();
  const [collapsed, setCollapsed] = useState(false);

  const toggleMenu = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    setIsSessionLoading(status === "loading");
    if (status === "unauthenticated" && safeReplace) {
      safeReplace("/");
    }
  }, [status, session, safeReplace]);

  return isSessionLoading ? <div>Loading...</div> : (
    <Layout>
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
