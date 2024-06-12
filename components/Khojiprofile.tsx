import React from "react";


interface User {
  avatarUrl: string;
  name: string;
  email: string;
  age: number;
  // Add more properties if needed
}

interface ProfileCardProps {
  user: User;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  return (
    <div className="profile-card">
      <div className="avatar">
        {/* <img src={user.avatarUrl} alt="Avatar" /> */}
      </div>
      <div className="info">
        <h2>{user.name}</h2>
        <p>Email: {user.email}</p>
        <p>Age: {user.age}</p>
        {/* Add more profile information here */}
      </div>
    </div>
  );
};

export default ProfileCard;
