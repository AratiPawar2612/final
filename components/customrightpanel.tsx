import { Avatar, Layout } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { ChatIcon } from '@/icons/icon';

const { Footer } = Layout;

const Customrightpannel = () => {
  return (
    <Footer style={{ display:"flex",flexDirection:"row",justifyContent:"space-between",width:"3rem"}}>
      <ChatIcon style={{ fontSize: '24px', color: '#1890ff' }} />
    </Footer>
  );
};

export default Customrightpannel;
