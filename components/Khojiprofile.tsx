import React from 'react';
import { Avatar, QRCode } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

interface User {
  id: string;
  avtar: string;
  user?: {
    first_name: string;
    last_name: string;
    id?: string; // Make id optional to handle undefined case
  };
  relation_with?: {
    khoji_id: string;
    current_tejsthan?: {
      name: string;
    };
    shivir_name: string;
    dob: string;
  };
}

interface Props {
  user: User;
  index: number;
  isSelected: boolean;
  handleCardClick: () => void;
}

function KhojiProfile({ user, index, isSelected, handleCardClick }: Props) {
  return user ? (
    <div
      className={`${
        index === 1 ? "userProfileRightCard" : "userProfileLeftCards"
      }`}
      key={user.id}
      onClick={handleCardClick}
      style={{
        width: "100%",
        marginBottom: "16px",
        marginTop: "2rem",
        textAlign: "center",
        cursor: "pointer", // Add cursor pointer to indicate clickable
      }}
    >
      <div className="userProfileTopSection" />
      <div className="displayFlex flexDirectionRow alignItemsCenter jusitfyContentSpaceBetween">
        <Avatar className="userProfileImage" src={user.avtar} />
        <div className="userProfileVerifiedBadge">
          <label className="userProfileVerifiedBadgeLabel">Verified</label>
          <CheckCircleOutlined style={{ color: "black", marginTop: "1rem", marginLeft: "15rem" }} />
        </div>
      </div>
      <div
        className="displayFlex flexDirectionColumn"
        style={{ textAlign: "center" }}
      >
        <label className="userNameLabel" style={{ marginRight: "12rem" }}>
          {user?.user?.first_name} {user?.user?.last_name}
        </label>
        <div className="displayFlex flexDirectionRow alignItemsCenter marginTop16">
          <div
            className="displayFlex flexDirectionColumn flex1"
            style={{ marginTop: "1rem" }}
          >
            <label className="userProfileInfoTitle">Khoji Id</label>
            <label className="userProfileInfoValue">{user.relation_with?.khoji_id}</label>
          </div>
          <div
            className="displayFlex flexDirectionColumn flex1"
            style={{ marginTop: "1rem" }}
          >
            <label className="userProfileInfoTitle"></label>
            <label className="userProfileInfoValue"></label>
          </div>
          <div
            className="displayFlex flexDirectionColumn flex1"
            style={{ marginTop: "1rem", marginLeft: "1rem" }}
          >
            <QRCode value={user?.user?.id ?? ''} size={100} /> {/* Use nullish coalescing operator to handle undefined case */}
          </div>
        </div>
        <div className="displayFlex flexDirectionRow alignItemsCenter marginTop16">
          <div
            className="displayFlex flexDirectionColumn flex1"
            style={{ marginTop: "1rem" }}
          >
            <label className="userProfileInfoTitle">Tejsthan</label>
            <label className="userProfileInfoValue">
              {user?.relation_with?.current_tejsthan?.name}
            </label>
          </div>
          <div
            className="displayFlex flexDirectionColumn flex1"
            style={{ marginTop: "1rem" }}
          >
            <label className="userProfileInfoTitle">Shivir level</label>
            <label className="userProfileInfoValue">{user.relation_with?.shivir_name}</label>
          </div>
          <div
            className="displayFlex flexDirectionColumn flex1"
            style={{ marginTop: "1rem" }}
          >
            <label className="userProfileInfoTitle">DOB</label>
            <label className="userProfileInfoValue">{user.relation_with?.dob}</label>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="userProfilePlaceholderCard" />
  );
}

export default KhojiProfile;
