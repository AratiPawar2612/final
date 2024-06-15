import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Divider,
  Steps,
  Typography,
  Card,
  Form,
  Row,
  Col,
  Input,
  Avatar,
  Modal,
  DatePicker,
  Select,
  Radio,
  Tag,
} from "antd";
import MainLayout from "@/components/mainlayout";
import CustomMenu from "@/components/custommenu";
import StepComponent from "@/components/customstep";
import axios from "axios";
import {
  VerifiedIcon,
  ArrowLeftIcon,
  ScannerIcon,
  LogoIcon,
} from "@/icons/icon";
import {
  PlusOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  fetchParticipantData,
  fetchPurposeData,
  fetchUserData,
  submitApplication,
  searchUser,
  createParticipant,
} from "../api/applicationapi";
import CustomMobileMenu from "@/components/custommobilemenu";
import { ViewStatusFirstSvg } from "@/icons/svgs";
import type { RadioChangeEvent } from "antd";
import moment, { Moment } from "moment";
import dayjs, { Dayjs } from "dayjs"; // Import Dayjs instead of Moment
import { message } from "antd";
import { QRCode, Space } from "antd";

const { Option } = Select;
const { Text } = Typography;
const { TextArea } = Input;
interface Option {
  value: string;
  label: string;
}

export default function AddPersonalDeatilsPage() {
  const { Step } = Steps;
  const router = useRouter();
  const [data, setData] = useState<any>([]);
  const [inputType, setInputType] = useState("khojiID"); // State to track the selected input type
  const [khojiID, setKhojiID] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [khojifirstName, setkhojifirstName] = useState("");
  const [khojilastName, setkhojilastName] = useState("");
  const [khojiemail, setkhojiemail] = useState("");
  const [khojimobile, setkhojimobile] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [options, setOptions] = useState<Option[]>([]); // Specify Option[] as the type
  const [userid, setUserid] = useState("");
  const [token, setToken] = useState("");
  const [startdate, setStartdate] = useState("");
  const [enddate, setEnddate] = useState("");
  const [addnote, setAddNote] = useState("");
  const [guestrel, setguestrel] = useState("");
  const [purposeOptions, setPurposeOptions] = useState<any[]>([]); // Define purposeOptions state
  const [selectedPurpose, setSelectedPurpose] = useState<any[]>([]); // Define state for selected purpose
  const [participantuserid, setParticipantUserid] = useState<any[]>([]); // Define state for selected purpose
  const [showNextButton, setNextButton] = useState(true);
  const { isFamilyKrupaDarshan } = router.query;
  const [errorMessage, setErrorMessage] = useState("");
  const [searchdata, setsearchdata] = useState([]);
  const [form] = Form.useForm();
  const [khojidobValue, setkhojiDobValue] = useState<Date | null>(null);
  const [khojiuserid, setkhojiuserid] = useState("");
  const [userdata, setUserData] = useState<any>([]);
  console.log("isFamilyKrupaDarshan", isFamilyKrupaDarshan);
  const [isMobileView, setIsMobileView] = useState(false);
  const dayjs = require("dayjs");
  const [value, setValue] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const loadMoreData = async () => {
      try {
        const sessionresponse = await fetch("/api/getsession");
        const sessionData = await sessionresponse.json();
        setToken(sessionData?.session?.access_token);

        const purposeOptionsResponse = await fetchPurposeData(
          sessionData?.session?.access_token
        );
        setPurposeOptions(purposeOptionsResponse);

        const userDataResponse = await fetchUserData(
          sessionData?.session?.access_token
        );
        setData(userDataResponse);

        setFirstName(userDataResponse?.user?.first_name);
        setLastName(userDataResponse?.user?.last_name);
        setMobile(userDataResponse?.contact_no);
        setEmail(userDataResponse?.user?.email);
        setUserid(userDataResponse?.user?.id);

        const participantUserResponseData = await fetchParticipantData(
          sessionData?.session?.access_token
        );
        if (
          participantUserResponseData &&
          Array.isArray(participantUserResponseData.results)
        ) {
          // Map over the results array and append userProfileId to each participant object
          const updatedParticipantData =
            participantUserResponseData.results.map(
              (participant: any) => participant.id
            );

          setParticipantUserid(updatedParticipantData);
          setUserData(participantUserResponseData);
          console.log(
            "participantUserResponseData",
            participantUserResponseData
          );
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadMoreData();
  }, []);

  const [selectedRelationship, setSelectedRelationship] = useState("");
  const dropdownAlign = {
    points: ["bl", "tl"], // Align the bottom-left corner of the dropdown with the top-left corner of the trigger
    offset: [0, 4], // Offset the dropdown by 4 pixels vertically
  };

  const disabledDate = (current: any, startDate: any, endDate: any) => {
    // Disable dates before today
    if (current && current < dayjs().startOf("day")) {
      return true;
    }

    // Disable dates before the selected start date or after the selected end date
    if (startDate && current && current < dayjs(startDate).startOf("day")) {
      return true;
    }

    if (endDate && current && current > dayjs(endDate).endOf("day")) {
      return true;
    }

    // Check if both startDate and endDate are specified
    if (startDate && endDate) {
      const start = dayjs(startDate).startOf("day");
      const end = dayjs(endDate).endOf("day");

      // Calculate the difference in days between start date and end date
      const differenceDays = end.diff(start, "day");

      // Disable the current date if the difference is not exactly 5 days
      if (differenceDays !== 5) {
        return true;
      }
    }

    // Enable the current date by default if no disabling conditions are met
    return false;
  };

  const handleSelectChange = (event: any) => {
    setSelectedRelationship(event.target.value);
  };
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
    setInputType("khoji");
    setIsPopupVisible(true);
  };
  const relationshipOptions = [
    { label: "Mother", value: "MOTHER" },
    { label: "Father", value: "FATHER" },
    { label: "Sister", value: "SISTER" },
    { label: "Brother", value: "BROTHER" },
    { label: "Grandmother", value: "GRANDMOTHER" },
    { label: "Grandfather", value: "GRANDFATHER" },
    { label: "Aunt", value: "AUNT" },
    { label: "Uncle", value: "UNCLE" },
    { label: "Cousin", value: "COUSIN" },
    { label: "Nephew", value: "NEPHEW" },
    { label: "Niece", value: "NIECE" },
    { label: "Friend", value: "FRIEND" },
    { label: "Colleague", value: "COLLEAGUE" },
    { label: "Wife", value: "WIFE" },
    { label: "Husband", value: "HUSBAND" },
    { label: "Acquaintance", value: "ACQUAINTANCE" },
    { label: "Mother-in-law", value: "MOTHER_IN_LAW" },
    { label: "Father-in-law", value: "FATHER_IN_LAW" },
    { label: "Sister-in-law", value: "SISTER_IN_LAW" },
    { label: "Brother-in-law", value: "BROTHER_IN_LAW" },
    { label: "Son-in-law", value: "SON_IN_LAW" },
    { label: "Daughter-in-law", value: "DAUGHTER_IN_LAW" },
    { label: "Other", value: "OTHER" },
  ];

  const onChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };
  const onFinish = () => {
    form
      .validateFields()
      .then((values) => {
        onclickNextBtn();
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
      });
  };

  const handleAddClick = async () => {
    try {
      if (!selectedRelationship) {
        message.warning("Please fill in all required fields.");
        return;
      }

      const requestBody = {
        status: "PUB",
        sort: 1,
        user: userid,
        relation_with: khojiuserid,
        relation: selectedRelationship,
      };

      const participantData = await createParticipant(requestBody, token);

      if (participantData) {
        console.log("Response from server:", participantData);
        message.success("Participant Added successfully");
        form.resetFields();
        window.location.reload();
        setErrorMessage("");
      } else {
        form.resetFields();
      }
    } catch (error) {
      console.error("Error adding participant:", error);
    }
  };

  const handleSearchClick = async () => {
    try {
      let criteria = "";

      if (khojiID) {
        criteria = `khoji_id=${khojiID}`;
      } else if (khojifirstName && khojilastName) {
        criteria = `first_name=${khojifirstName}&last_name=${khojilastName}`;
      } else if (khojifirstName && !khojilastName) {
        message.warning("Please enter both first name and last name");
        return;
      } else if (!khojifirstName && khojilastName) {
        message.warning("Please enter both first name and last name");
        return;
      } else if (khojimobile) {
        if (khojimobile.length !== 10 || isNaN(Number(khojimobile))) {
          message.warning("Mobile number must be 10 digits long and contain only numbers");
          return;
        }
        criteria = `contact_no=${khojimobile}`;
      } else if (khojiemail) {
        criteria = `email=${khojiemail}`;
      } else {
        message.warning("Please enter search criteria");
        return;
      }

      const searchResults = await searchUser(token, criteria); // Replace with your actual API call
      console.log("searchResults", searchResults);

      if (searchResults.length > 0) {
        const firstUser = searchResults[0];
        setkhojiuserid(firstUser.user.id);
        setsearchdata(firstUser);
        console.log("search user", firstUser);
        form.setFieldsValue(firstUser); // Set form values with Ant Design form instance
      } else {
        // form.resetFields(); 
        message.warning("No data found");
      }
    } catch (error) {
      console.error("Error handling search click:", error);
      message.error("Failed to search user");
    }
  };

  const onclickNextBtn = async () => {
    if (!selectedPurpose || !startdate || !enddate) {
      console.log("startdate", startdate);
      message.warning("Please Enter All required fields" + startdate);
    } else {
      const requestBody: Record<string, any> = {
        user: userid,
        status: "SUBMITTED",
        have_participants: isFamilyKrupaDarshan,
        participants: isFamilyKrupaDarshan ? selectedUserIds : null,
        purposes: selectedPurpose,
        preferred_start_date: startdate,
        preferred_end_date: enddate,
      };

      // Conditionally add khoji_note
      if (!addnote == null) {
        requestBody.khoji_note = addnote;
      }

      try {
        const applicationSubmitted = await submitApplication(
          requestBody,
          token
        );
        console.log("applicationSubmitted", applicationSubmitted);
        if (applicationSubmitted) {
          message.success(
            "Congratulations! Your application has been saved successfully"
          );
          router.push("/krupadarshan/completeandapply");
        }
      } catch (error: any) {
        // Specify the type of error explicitly
        console.error("Error submitting application:", error);
        // Print the response if available
        if (error.response) {
          alert(error.response);
        }
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleVerification = async () => {
    try {
      let apiUrl = "";
      let payload = {};

      if (inputType === "khojiID") {
        apiUrl = "https://example.com/api/verify-khoji";
        payload = { khoji_id: khojiID };
      } else {
        apiUrl = "https://example.com/api/verify-email-mobile";
        payload = { email, mobile };
      }

      const response = await axios.post(apiUrl, payload);

      console.log(response.data);
    } catch (error) {
      console.error("Error verifying data:", error);
    }
  };

  const handleInputTypeChange = (type: string) => {
    if (type === "View all") {
      setInputType(type);
      setIsModalVisible(true);
    } else {
      setInputType(type);
    }
  };

  const [open, setOpen] = useState(false);

  const handleInputChange = (e: any) => {
    const { dataset, value } = e.target;
    const name = dataset.name;
    console.log("Name:", name);
    let criteria = "";

    // Update state based on the input field
    if (name === "khojiID") {
      if (value.length !== 8) {
        console.log("Khoji ID must be 8 digits long");
        // Optionally, you can display a message to the user here
        return;
      }
      setKhojiID(value); // Update Khoji ID state
      criteria += `khoji_id=${value}`;
    } else if (name === "first_name") {
      setkhojifirstName(value);
      // Check if last name is also entered
      if (khojilastName) {
        criteria += `last_name=${khojilastName}&`;
      }
      criteria += `first_name=${value}`;
    } else if (name === "last_name") {
      setkhojilastName(value);
      // Check if first name is also entered
      if (khojifirstName) {
        criteria += `first_name=${khojifirstName}&`;
      }
      criteria += `last_name=${value}`;
    } else if (name === "contact_no") {
      if (value.length !== 10 || isNaN(value)) {
        console.log(
          "Mobile number must be 10 digits long and contain only numbers"
        );
        // Optionally, you can display a message to the user here
        return;
      }
      setkhojimobile(value);
      criteria += `contact_no=${value}`;
    } else if (name === "email") {
      setkhojiemail(value);
      criteria += `email=${value}`;
    }

    // Check if the input value is not empty
    const hasValue = value.trim() !== "";
    if (hasValue) {
      console.log("criteria", criteria);
      // handleSearchClick(criteria);
    } else {
      console.log("Input value is empty");
      // Optionally, you can display a message to the user here
    }
  };

  const renderInputComponent = () => {
    if (inputType === "khoji") {
      return (
        <Form form={form}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Have Khoji ID?"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                name="rdyesno"
                initialValue={1}
                rules={[{ required: true, message: "Please select an option" }]}
              >
                <Radio.Group onChange={onChange} value={value}>
                  <Radio value={1} style={{ fontSize: "0.9rem" }}>
                    Yes
                  </Radio>
                  <Radio
                    value={2}
                    style={{ fontSize: "0.9rem", marginLeft: "5rem" }}
                  >
                    No
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Enter Khoji ID"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                name="khoji_id"
                rules={[{ required: true, message: "Please enter Khoji ID" }]}
              >
               <Input
                placeholder="Enter Khoji ID"
                value={khojiID}
                onChange={(e) => setKhojiID(e.target.value)}
                className="inputStyle"
                disabled={value === 2}
                data-name="khoji_id"
                onPressEnter={handleSearchClick} 
                 onBlur={handleSearchClick}
              />
              </Form.Item>
            </Col>
          </Row>
          <Divider>Or enter</Divider>

          <Row gutter={16}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                label="First Name"
                name={["user", "first_name"]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                rules={[{ required: true, message: "Please enter First Name" }]}
              >
                <Input
                  style={{
                    borderRadius: "2rem",
                    height: "2rem",
                    width: "100%",
                  }}
                  value={khojifirstName}
                  onChange={(e) => setkhojifirstName(e.target.value)}
                  data-name="first_name"
                  disabled={value === 1}
                  onPressEnter={handleSearchClick} 
                  onBlur={handleSearchClick}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                label="Last Name"
                name={["user", "last_name"]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                rules={[{ required: true, message: "Please enter Last Name" }]}
              >
                <Input
                  className="inputStyle"
                  value={khojilastName}
                  onChange={(e) => setkhojilastName(e.target.value)}
                  data-name="last_name"
                  disabled={value === 1} // Disable input if value is 1 (Yes)
                  onPressEnter={handleSearchClick} 
                  onBlur={handleSearchClick}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Email ID"
                name={["user", "email"]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                rules={[
                  {
                    type: "email",
                    message: "Please enter a valid email address",
                  },
                  { required: true, message: "Please enter Email ID" },
                ]}
              >
                <Input
                  className="inputStyle"
                  onChange={(e) => setkhojiemail(e.target.value)}
                  disabled={value === 1} // Disable input if value is 1 (Yes)
                  data-name="email"
                  onPressEnter={handleSearchClick} 
                  onBlur={handleSearchClick}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Mobile Number"
                name="contact_no"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                rules={[
                  { required: true, message: "Please enter Mobile Number" },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "Please enter a valid 10-digit mobile number",
                  },
                ]}
              >
                <Input
                  className="inputStyle"
                  onChange={(e) => setkhojimobile(e.target.value)}
                  disabled={value === 1} // Disable input if value is 1 (Yes)
                  data-name="contact_no"
                  onPressEnter={handleSearchClick} 
                  onBlur={handleSearchClick}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Relation With Khoji"
                name="relation"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                rules={[
                  { required: true, message: "Please select Relationship" },
                ]}
              >
                <select
                  className="inputStyle"
                  value={selectedRelationship}
                  onChange={handleSelectChange}
                >
                  <option value="">--Select Relationship--</option>

                  {relationshipOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Form.Item>
            </Col>
          </Row>

          <div>
            <Button
              type="primary"
              style={{
                marginTop: "1rem",
                backgroundColor: "black",
                width: "100%",
                marginBottom: "1rem",
              }}
              onClick={handleAddClick}
            >
              Add
            </Button>
          </div>
        </Form>
      );
    } else if (inputType === "guest") {
      return (
        <Form>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                label="First Name"
                // name={['user', 'first_name']}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input
                  className="inputStyle"
                  // value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                label="Last Name"
                // name={['user', 'last_name']}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input
                  className="inputStyle"
                  // value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Date of birth"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <DatePicker className="inputStyle" value={dateOfBirth} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Email ID"
                name="email"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input
                  className="inputStyle"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Mobile Number"
                name="mobile"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input
                  className="inputStyle"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Relation With Khoji"
                name="relation"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input
                  className="inputStyle"
                  value={guestrel}
                  onChange={(e) => setguestrel(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Button type="primary" className="addButton">
            Add
          </Button>
        </Form>
      );
    } else if (inputType === "View all") {
      if (userdata && userdata.results && Array.isArray(userdata.results)) {
        const users = userdata.results;
        return (
          <Row gutter={[16, 16]} style={{ justifyContent: "space-between" }}>
            {users.map((user: any, index: any) => (
              <Col
                key={index}
                xs={12}
                sm={24}
                md={12}
                lg={12}
                xl={12}
                style={{ marginBottom: "16px", marginLeft: "1rem" }}
              >
                {buildUserdataCard(
                  user,
                  index,
                  selectedUserIds,
                  setSelectedUserIds
                )}
              </Col>
            ))}
          </Row>
        );
      } else {
        return <div>No user data available</div>;
      }
    }

    return null;
  };

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  function buildUserdataCard(
    user: any,
    index: any,
    selectedUserIds: any,
    setSelectedUserIds: any
  ) {
    const handleCardClick = () => {
      const isSelected = selectedUserIds.includes(user.id);

      // If selected, remove from the list; otherwise, add to the list
      if (isSelected) {
        setSelectedUserIds((prevIds: any) =>
          prevIds.filter((id: any) => id !== user.id)
        );
      } else {
        setSelectedUserIds((prevIds: any) => [...prevIds, user.id]);
      }
    };

    if (!user) {
      return <div className="userProfilePlaceholderCard" />;
    }

    const isSelected = selectedUserIds.includes(user.id);

    return (
      <div className="userProfileContainer" key={user.id}>
        <div
          className={`${index === 1 ? "userProfile" : "userProfile"} ${
            isSelected ? "selectedCard" : ""
          }`}
          onClick={handleCardClick}
        >
          <div className="userProfileTopSection">
            {isSelected && (
              <CheckCircleOutlined
                style={{
                  color: "black",
                  marginTop: "1rem",
                  marginLeft: "12rem",
                }}
              />
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Avatar className="userProfileImage" src={user.avtar} />

            <div className="userProfileVerifiedBadge">
              <label className="userProfileVerifiedBadgeLabel">Verified</label>
              <VerifiedIcon />
            </div>
          </div>
          <div
            className="displayFlex flexDirectionColumn"
            style={{ textAlign: "center" }}
          >
            <label
              className="userProfileInfoTitle marginTop1rem"
              style={{ marginRight: "9rem" }}
            >
              {user?.relation_with?.user?.first_name &&
                user?.relation_with?.user?.last_name &&
                [
                  user?.relation_with?.user?.first_name,
                  user?.relation_with?.user?.last_name,
                ]
                  .reduce(
                    (acc, name) =>
                      acc +
                      " " +
                      name
                        .split(" ")
                        .map(
                          (w: string) => w.charAt(0).toUpperCase() + w.slice(1)
                        )
                        .join(" "),
                    ""
                  )
                  .trim()}
            </label>
            <div className="displayFlex flexDirectionRow alignItemsCenter marginTop16">
              <div
                className="displayFlex flexDirectionColumn flex1"
                style={{
                  marginTop: "1rem",
                  marginLeft: "1.5rem",
                  alignItems: "baseline",
                }}
              >
                <label className="userProfileInfoTitle">Khoji Id</label>
                <label className="userProfileInfoValue">
                  {user?.relation_with?.khoji_id}
                </label>
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
                style={{ marginTop: "1rem", marginLeft: "6rem" }}
              >
                <QRCode value={user?.user?.id} size={100} />
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
                <label className="userProfileInfoValue">
                  {user?.relation_with?.shivir_name}
                </label>
              </div>
              <div
                className="displayFlex flexDirectionColumn flex1"
                style={{ marginTop: "1rem" }}
              >
                <label className="userProfileInfoTitle">DOB</label>
                <label className="userProfileInfoValue">
                  {user.relation_with?.dob}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // function buildUserCard(user: any, index: any) {
  //   return user ? (
  //     <div
  //       className={`${
  //         index === 1 ? "userProfileLeftCards" : "userProfileLeftCards"
  //       }`}
  //       key={user.id}
  //     >
  //       <div className="userProfileTopSection" />
  //       <div className="displayFlex flexDirectionRow alignItemsCenter jusitfyContentSpaceBetween">
  //         <Avatar className="userProfileImage" src={user.avtar} />
  //         <div className="userProfileVerifiedBadge">
  //           <label className="userProfileVerifiedBadgeLabel">Verified</label>
  //           <VerifiedIcon />
  //         </div>
  //       </div>
  //       <div
  //         className="displayFlex flexDirectionColumn"
  //         style={{ textAlign: "center" }}
  //       >
  //         <label
  //           className="userProfileInfoTitle"
  //           style={{ marginRight: "10rem", textWrap: "nowrap" }}
  //         >
  //           {user?.user?.first_name} {user?.user?.last_name}
  //         </label>
  //         <div className="displayFlex flexDirectionRow alignItemsCenter marginTop16">
  //           <div
  //             className="displayFlex flexDirectionColumn flex1"
  //             style={{ marginTop: "1rem" }}
  //           >
  //             <label className="userProfileInfoTitle">
  //               {/* Khoji Id */}
  //               </label>
  //             <label className="userProfileInfoValue">
  //               {/* {user.khoji_id} */}
  //               </label>
  //               <label className="userProfileInfoTitle">
  //               {/* Khoji Id */}
  //               </label>
  //             <label className="userProfileInfoValue">
  //               {/* {user.khoji_id} */}
  //               </label>
  //               <label className="userProfileInfoTitle">
  //               {/* Khoji Id */}
  //               </label>
  //             <label className="userProfileInfoValue">
  //               {/* {user.khoji_id} */}
  //               </label>
  //               <label className="userProfileInfoTitle">
  //               {/* Khoji Id */}
  //               </label>
  //             <label className="userProfileInfoValue">
  //               {/* {user.khoji_id} */}
  //               </label>
  //           </div>
  //           {/* <div
  //             className="displayFlex flexDirectionColumn flex1"
  //             style={{ marginTop: "1rem" }}
  //           >
  //             <label className="userProfileInfoTitle"></label>
  //             <label className="userProfileInfoValue"></label>
  //           </div> */}
  //           {/* <div
  //             className="displayFlex flexDirectionColumn flex1"
  //             style={{ marginLeft: "1rem" }}
  //           >
              
  //             <QRCode value={user?.user?.id} size={80} />
  //           </div> */}
  //         </div>
         
  //         <div className="displayFlex flexDirectionRow alignItemsCenter marginTop16">
  //           <div className="displayFlex flexDirectionColumn flex1">
  //             <label className="userProfileInfoTitle">Tejsthan</label>
  //             <label className="userProfileInfoValue">
  //               {user?.current_tejsthan?.name}
  //             </label>
  //           </div>
  //           <div className="displayFlex flexDirectionColumn flex1 marginTop16">
  //             <label className="userProfileInfoTitle">Shivir level</label>
  //             <label className="userProfileInfoValue">{user.shivir_name}</label>
  //           </div>
  //           <div className="displayFlex flexDirectionColumn flex1">
  //             <label className="userProfileInfoTitle">DOB</label>
  //             <label className="userProfileInfoValue">{user.dob}</label>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   ) : (
  //     <div className="userProfilePlaceholderCard" />
  //   );
  // }

  function buildUserCard(user: any, index: any) {
    return user ? (
      <div
        className={`${index === 1 ? "userProfileCard" : "userProfileCard"}`}
        key={user.id}
      >
        <div className="userProfileTopSection" />
        <div className="displayFlex flexDirectionRow alignItemsCenter jusitfyContentSpaceBetween">
          <Avatar className="userProfileImage" src={user.avtar} />

          <div className="userProfileVerifiedBadge">
            <label className="userProfileVerifiedBadgeLabel">Verified</label>
            <VerifiedIcon />
          </div>
        </div>
        <div
          className="displayFlex flexDirectionColumn"
          style={{ textAlign: "center" }}
        >
          <label
            className="userProfileInfoTitle"
            style={{ marginRight: "10rem", marginTop: "10px",textWrap:"nowrap", }}
          >
            {user?.user?.first_name} {user?.user?.last_name}
          </label>
          <div className="displayFlex flexDirectionRow alignItemsCenter marginTop16">
            <div
              className="displayFlex flexDirectionColumn flex1"
              style={{ marginTop: "1rem" }}
            >
              <label className="userProfileInfoTitle">Khoji Id</label>
              <label className="userProfileInfoValue">{user.khoji_id}</label>
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
              // style={{ marginTop: "1rem", marginLeft: "1rem" }}
            >
              {/* <ScannerIcon /> */}
              <QRCode value={user?.user?.id} size={80} />
            </div>
          </div>
          <div className="displayFlex flexDirectionRow alignItemsCenter marginTop16">
            <div
              className="displayFlex flexDirectionColumn flex1"
              style={{ marginTop: "1rem" }}
            >
              <label className="userProfileInfoTitle">Tejsthan</label>
              <label className="userProfileInfoValue">
                {user?.current_tejsthan?.name}
              </label>
            </div>
            <div
              className="displayFlex flexDirectionColumn flex1"
              style={{ marginTop: "1rem" }}
            >
              <label className="userProfileInfoTitle">Shivir level</label>
              <label className="userProfileInfoValue">{user.shivir_name}</label>
            </div>
            <div
              className="displayFlex flexDirectionColumn flex1"
              style={{ marginTop: "1rem" }}
            >
              <label className="userProfileInfoTitle">DOB</label>
              <label className="userProfileInfoValue">{user.dob}</label>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="userProfilePlaceholderCard" />
    );
  }

  function buildProfiles() {
    if (true) {
      return (
        <div className="displayFlex flexDirectionColumn">
          <div className="displayFlex flexDirectionRow marginRight16 alignSelfCenter">
            {buildUserCard(data, 0)}
          </div>
        </div>
      );
    }
  }

  return (
    <MainLayout
      siderClassName={isMobileView ? "" : "leftMenuPanel"}
      siderChildren={!isMobileView && <CustomMenu />}
    >
      {isMobileView && (
        <div className="flexContainer">
          <>
            <LogoIcon className="logomenu" />
            <div>
              {" "}
              <CustomMobileMenu />
            </div>
          </>
        </div>
      )}
      <div style={{ padding: "0 20px" }}>
        <div
          style={isMobileView ? { marginLeft: "1rem" } : { marginLeft: "3rem" }}
        >
          <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
            {/* <ArrowLeftIcon onClick={() => router.back()} /> */}
            Apply for Gyan Darshan
          </div>
          <div>
            <label className="Descriptionlabel">Add Application details</label>
          </div>
          <Row justify="center">
            <Col xs={24} xl={24}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "1rem",
                }}
              >
                <StepComponent currentStep={-1} />
              </div>
            </Col>
          </Row>
        </div>
        <Divider className="divider" />

        <div
          style={
            isMobileView
              ? { fontWeight: "bold", fontSize: "0.8rem", marginLeft: "1rem" }
              : { fontWeight: "bold", fontSize: "0.8rem", marginLeft: "3rem" }
          }
        >
          Add Personal details
        </div>
        <div
          style={isMobileView ? { marginLeft: "1rem" } : { marginLeft: "3rem" }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form
                style={{ width: "100%", maxWidth: "500px" }}
                onFinish={onFinish}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="First Name"
                      name={firstName}
                      labelCol={{ span: 24 }}
                      wrapperCol={{ span: 24 }}
                      initialValue={firstName}
                    >
                      <Input
                        style={{
                          borderRadius: "2rem",
                          height: "2rem",
                          width: "100%",
                        }}
                        disabled
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Last Name"
                      name={lastName}
                      labelCol={{ span: 24 }}
                      wrapperCol={{ span: 24 }}
                      initialValue={lastName}
                    >
                      <Input
                        style={{
                          borderRadius: "2rem",
                          height: "2rem",
                          width: "100%",
                        }}
                        disabled
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      label="Email ID"
                      name={email}
                      labelCol={{ span: 24 }}
                      wrapperCol={{ span: 24 }}
                      initialValue={email}
                    >
                      <Input
                        style={{
                          borderRadius: "2rem",
                          height: "2rem",
                          width: "100%",
                        }}
                        disabled
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      label="Mobile Number"
                      name={mobile}
                      labelCol={{ span: 24 }}
                      wrapperCol={{ span: 24 }}
                      initialValue={mobile}
                    >
                      <Input
                        style={{
                          borderRadius: "2rem",
                          height: "2rem",
                          width: "100%",
                        }}
                        disabled
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      label="Choose the purpose of the Darshan"
                      name="purpose"
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: "Please select your puppose!",
                        },
                      ]}
                    >
                      <Select
                        mode="multiple"
                        style={{ width: "100%" }}
                        placeholder="Select Purpose"
                        value={selectedPurpose}
                        onChange={(value) => setSelectedPurpose(value)}
                        showSearch={false}
                      >
                        {purposeOptions.map((option) => (
                          <Option key={option.key} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    {/* <Form.Item
                      label="Select preferred date range"
                      name={["startdate"]}
                      labelCol={{ span: 24 }}
                      wrapperCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: "Please select preferred start date!",
                        },
                      ]}
                    > */}
                    {/* <DatePicker
                        style={{
                          borderRadius: "2rem",
                          height: "2rem",
                          width: "100%",
                        }}
                        disabledDate={(current) =>
                          disabledDate(current, null, enddate)
                        }
                        onChange={(date, dateString) => {
                          if (typeof dateString === "string") {
                            setStartdate(dateString);
                          }
                        }}
                      /> */}
                    {/* <DatePicker
  style={{
    borderRadius: "2rem",
    height: "2rem",
    width: "100%",
  }}
  picker="month"
  format="MMMM YYYY" // Set the format to display the selected month and year
  disabledDate={(current) =>
    disabledDate(current, null, enddate)
  }
  onChange={(date, dateString) => {
    if (typeof dateString === "string") {
      setStartdate(dateString);
    }
  }}
/> */}
                    {/* </Form.Item> */}
                  </Col>
                  <Col span={12}>
                    {/* <Form.Item
                      label="    "
                      name={["enddate"]}
                      labelCol={{ span: 24 }}
                      wrapperCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: "Please select preferred end date!",
                        },
                      ]}
                    >
                      <DatePicker
                        style={{
                          borderRadius: "2rem",
                          height: "2rem",
                          width: "100%",
                        }}
                        disabledDate={(current) =>
                          disabledDate(current, startdate, null)
                        }
                        onChange={(date, dateString) => {
                          if (typeof dateString === "string") {
                            setEnddate(dateString);
                          }
                        }}
                      /> */}
                    {/* <DatePicker
    style={{
      borderRadius: "2rem",
      height: "2rem",
      width: "100%",
    }}
    picker="week" // Set picker prop to "week" to enable week selection
    disabledDate={(current) =>
      disabledDate(current, startdate, null)
    }
    onChange={(date, dateString) => {
      if (typeof dateString === "string") {
        setEnddate(dateString);
      }
    }}
  /> */}
                    {/* </Form.Item> */}
                  </Col>
                </Row>

                <Col span={24}>
                  <Form.Item
                    label="Select preferred Week"
                    name={["week"]}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: "Please select a preferred week!",
                      },
                    ]}
                  >
                    {/* <DatePicker
                      style={{
                        borderRadius: "2rem",
                        height: "2rem",
                        width: "100%",
                      }}
                      picker="week"
                      format="YYYY-wo"
                      onChange={(date, dateString) => {
                        console.log("Received dateString:", dateString); // Add logging to check the format of dateString

                        // Check if dateString is defined and has the expected format
                        if (typeof dateString === "string") {
                          // Extract year and week number using regular expression
                          const match = dateString.match(
                            /^(\d{4})-(\d{1,2})(?:st|nd|rd|th)?$/
                          );
                          if (match) {
                            const year = match[1];
                            const weekNumber = parseInt(match[2], 10); // Extract numeric part of the week string
                            const startDateOfWeek = moment()
                              .isoWeekYear(Number(year))
                              .isoWeek(weekNumber)
                              .startOf("week")
                              .format("YYYY-MM-DD");
                            const endDateOfWeek = moment()
                              .isoWeekYear(Number(year))
                              .isoWeek(weekNumber)
                              .endOf("week")
                              .format("YYYY-MM-DD");

                            // Update both start and end dates
                            setStartdate(startDateOfWeek);
                            setEnddate(endDateOfWeek);
                          } else {
                            console.error(
                              "Invalid dateString format:",
                              dateString
                            );
                          }
                        }
                      }}
                    /> */}

                    <div>
                      <DatePicker
                        style={{
                          borderRadius: "2rem",
                          height: "2rem",
                          width: "100%",
                        }}
                        format="YYYY-MM-DD"
                        placeholder="select week"
                        disabledDate={(current: Dayjs) => {
                          const today = dayjs();
                          const startOfCurrentMonth = dayjs().startOf("month");
                          const endOfFirstWeek = startOfCurrentMonth.add(
                            7,
                            "day"
                          );

                          // Disable the current week (first 7 days of the month)
                          if (
                            current.isBefore(today, "day") ||
                            current.isBefore(endOfFirstWeek, "day")
                          ) {
                            return true;
                          }
                          return false;
                        }}
                        suffixIcon={
                          startdate &&
                          enddate && (
                            <div
                              style={{
                                fontSize: "0.625rem",
                                fontWeight: "bolder",
                              }}
                            >
                              Start Date: {startdate} To End Date: {enddate}
                            </div>
                          )
                        }
                        onChange={(date, dateString) => {
                          console.log("Received dateString:", dateString);

                          // Check if dateString is defined and has the expected format
                          if (typeof dateString === "string") {
                            const match = dateString.match(
                              /^(\d{4})-(\d{1,2})-(\d{1,2})$/
                            );
                            if (match) {
                              const year = parseInt(match[1], 10);
                              const month = parseInt(match[2], 10);
                              const day = parseInt(match[3], 10);
                              let startDateOfWeek, endDateOfWeek;

                              // Determine the start and end dates of the week based on the selected day
                              if (day <= 7) {
                                startDateOfWeek = dayjs()
                                  .year(year)
                                  .month(month - 1)
                                  .date(1)
                                  .format("YYYY-MM-DD");
                                endDateOfWeek = dayjs()
                                  .year(year)
                                  .month(month - 1)
                                  .date(7)
                                  .format("YYYY-MM-DD");
                              } else if (day <= 14) {
                                startDateOfWeek = dayjs()
                                  .year(year)
                                  .month(month - 1)
                                  .date(8)
                                  .format("YYYY-MM-DD");
                                endDateOfWeek = dayjs()
                                  .year(year)
                                  .month(month - 1)
                                  .date(14)
                                  .format("YYYY-MM-DD");
                              } else if (day <= 21) {
                                startDateOfWeek = dayjs()
                                  .year(year)
                                  .month(month - 1)
                                  .date(15)
                                  .format("YYYY-MM-DD");
                                endDateOfWeek = dayjs()
                                  .year(year)
                                  .month(month - 1)
                                  .date(21)
                                  .format("YYYY-MM-DD");
                              } else {
                                startDateOfWeek = dayjs()
                                  .year(year)
                                  .month(month - 1)
                                  .date(22)
                                  .format("YYYY-MM-DD");
                                endDateOfWeek = dayjs()
                                  .year(year)
                                  .month(month - 1)
                                  .endOf("month")
                                  .format("YYYY-MM-DD");
                              }

                              // Update state with start and end dates
                              setStartdate(startDateOfWeek);
                              setEnddate(endDateOfWeek);
                            } else {
                              console.error(
                                "Invalid dateString format:",
                                dateString
                              );
                            }
                          }
                        }}
                      />
                    </div>
                  </Form.Item>
                </Col>

                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      label="Add Note"
                      name="addnote"
                      labelCol={{ span: 24 }}
                      wrapperCol={{ span: 24 }}
                    >
                      <TextArea
                        style={{
                          width: "30.75rem",
                          height: "4rem",
                          borderRadius: "1rem",
                        }}
                        value={addnote}
                        onChange={(e) => setAddNote(e.target.value)}
                        autoSize={{ minRows: 3, maxRows: 5 }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={24}>
                    {showNextButton && isFamilyKrupaDarshan && (
                      <Button
                        type="primary"
                        style={{
                          borderRadius: "2rem",
                          marginLeft: "4rem",
                          width: "12rem",
                          height: "2rem",
                          backgroundColor: "black",
                          marginBottom: "1rem",
                          alignItems:"center"
                        }}
                        onClick={onclickNextBtn}
                      >
                        Next
                      </Button>
                    )}
                  </Col>
                </Row>
              </Form>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Row gutter={[16, 16]} style={{ justifyContent: "space-between" }}>
              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                xl={12}
                style={{ marginBottom: "16px" }}
              >
                   
      {buildProfiles()}
   
  </Col>

  {/* Add Family Member Card Section */}
  <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                xl={10}
                style={{ marginBottom: "16px" }}
              >
    {isFamilyKrupaDarshan === "true" && (
      <div style={{ textAlign: "center" }}>
        <Card onClick={showModal} >
        <div style={{ color: "gray", fontSize: "3.3rem" }}>
              <PlusOutlined />
              <br />
              <Text style={{ color: "gray", fontSize: "1rem", whiteSpace: "nowrap" }}>Add Family</Text>
              <br />
              <Text style={{ color: "gray", fontSize: "1rem", whiteSpace: "nowrap" }}>Members Here</Text>
            </div>
        </Card>
      </div>
    )}
  </Col>
</Row>

  {isFamilyKrupaDarshan === "true" && (
    <Row justify={"center"}>
      <Col
      
       style={{ marginBottom: "16px",marginLeft: "12rem", }}>
        <div>
          <Button
            className={isMobileView ? "mobileViewStyle" : "nonMobileViewStyle"}
            onClick={() => handleInputTypeChange("View all")}
          >
            View all
          </Button>
        </div>
      </Col>
      <Modal
        title={
          inputType === "View all"
            ? "Added Family Members"
            : "Family Member 1"
        }
        open={isModalVisible}
        footer={null}
        style={{ top: 20 }}
        onCancel={handleCancel}
      >
        <div
          style={{
            maxHeight: "60vh",
            overflowY: "auto",
            padding: "0 24px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ marginBottom: 16 }}>
              {inputType !== "View all" && (
                <>
                  <Button
                    type="link"
                    style={{
                      marginRight: 10,
                      fontSize: "0.8225rem",
                      color: inputType === "khoji" ? "blue" : "black",
                    }}
                    onClick={() => handleInputTypeChange("khoji")}
                  >
                    Khoji
                  </Button>
                  <Button
                    type="link"
                    style={{
                      fontSize: "0.8225rem",
                      color: inputType === "guest" ? "blue" : "black",
                    }}
                    onClick={() => handleInputTypeChange("guest")}
                  >
                    Guest Khoji
                  </Button>
                </>
              )}
            </div>

            {renderInputComponent()}
          </div>
        </div>
      </Modal>
    </Row>
  )}
</Col>


          </Row>
        </div>
      </div>
    </MainLayout>
  );
}
