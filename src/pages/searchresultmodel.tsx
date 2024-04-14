import React from 'react';
import { Modal, Table } from 'antd'; // Assuming you're using Ant Design

interface SearchResultModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  searchData: any[]; // Adjust the type of searchData as needed
}

const SearchResultModal: React.FC<SearchResultModalProps> = ({ isModalVisible, setIsModalVisible, searchData }) => {
  return (
    <Modal
      title="Search Results"
      visible={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
    >
      <Table dataSource={searchData} columns={[]} /> {/* Adjust columns as needed */}
    </Modal>
  );
};

export default SearchResultModal;
