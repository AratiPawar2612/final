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
} from "antd";
import MainLayout from "@/components/mainlayout";
import CustomMenu from "@/components/custommenu";
import axios, { AxiosResponse, AxiosError } from "axios";
import { VerifiedIcon, ArrowLeftIcon, ScannerIcon } from "@/icons/icon";
import { PlusOutlined } from "@ant-design/icons";
import {
  fetchParticipantData,
  fetchPurposeData,
  fetchUserData,
  submitApplication,
} from "../api/applicationapi";
import dayjs from "dayjs";
import CustomMobileMenu from "@/components/custommobilemenu";

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
  const [note, setNote] = useState(""); // State to track the note text
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
  const [showSearchButton, setShowSearchButton] = useState(true);
  const [showAddButton, setShowAddButton] = useState(false);
  const { isFamilyKrupaDarshan } = router.query;
  const [errorMessage, setErrorMessage] = useState("");
  const [searchdata, setsearchdata] = useState([]); // State to store the fetched data
  const [form] = Form.useForm(); // Create a form instance
  const [khojidobValue, setkhojiDobValue] = useState<Date | null>(null);
  const [khojiuserid, setkhojiuserid] = useState("");
  const [userdata, setUserData] = useState<any>([]);
  console.log("isFamilyKrupaDarshan", isFamilyKrupaDarshan);
  const [isMobileView, setIsMobileView] = useState(false); // Define isMobileView state

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768); // Update isMobileView based on window width
    };

    handleResize(); // Call once on component mount
    window.addEventListener("resize", handleResize); // Listen for window resize events

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup on component unmount
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
        console.log("purposeDataResponse", purposeOptionsResponse);

        const userDataResponse = await fetchUserData(
          sessionData?.session?.access_token
        );
        setData(userDataResponse);
        console.log("userDataResults", userDataResponse);

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
          console.log("participantUserResponseData", updatedParticipantData);
          setParticipantUserid(updatedParticipantData);
          setUserData(participantUserResponseData);
          console.log(
            "participantUserResponseData",
            participantUserResponseData
          );
          console.log("userids", updatedParticipantData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadMoreData();
  }, []);

  const [selectedRelationship, setSelectedRelationship] = useState("");
  const disabledDate = (current: any, startDate: any, endDate: any) => {
    // Disable dates before today, and dates before the selected start date or after the selected end date
    return (
      current &&
      (current < dayjs().startOf("day") ||
        (startDate && current < dayjs(startDate).startOf("day")) ||
        (endDate && current > dayjs(endDate).endOf("day")))
    );
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
//   const handleRadioChange = (e: any) => {
//     console.log("Radio button clicked"); 
//     const value = e.target.value;
//     console.log("Radio button value:", value); 
//     if (value === "yes") {
     
//       form.setFieldsValue({
//         khojiID: "",
//         user: { first_name: "", last_name: "", email: "", contact_no: "" },
//         relation: ""
//       });
//     } else {
    
//       form.setFieldsValue({ khojiID: "" });
//     }
// };

  
  // Inside the Form.Item components, add a 'disabled' prop
 
  
  
  
  

  const onFinish = () => {
    form
      .validateFields() // Validate all fields
      .then((values) => {
        // Proceed with the desired action if validation passes
        // For example, navigate to the next step
       onclickNextBtn();
      })
      .catch((errorInfo) => {
        // Handle validation errors if any
        console.log("Validation failed:", errorInfo);
      });
  };

  const handleaddclick = async () => {
    try {
      if (!selectedRelationship) {
        alert("Please fill in all required fields.");
      } else {
        const requestBody = {
          status: "PUB",
          sort: 1,
          user: userid,
          relation_with: khojiuserid,
          relation: selectedRelationship,
        };

        const requestBodyJSON = JSON.stringify(requestBody);

        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: requestBodyJSON,
        };

        fetch(
          "https://hterp.tejgyan.org/django-app/event/participants/",
          requestOptions
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            console.log("Response from server:", data);
            alert("Participant Added successfully");
            form.resetFields();
            setShowSearchButton(true);
            setShowAddButton(false);
            // Reload the page
            window.location.reload();
          })
          .catch((error) => {
            console.error(
              "There was a problem with your fetch operation:",
              error
            );
          });
        setErrorMessage("");
        // Proceed with add logic
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };



  const handleseachclick = async () => {

    let url = "";
    try {

      // if (!khojiID || !khojifirstName || !khojilastName || !khojiemail || !khojimobile ) {
         if (!khojiID ) {
        alert('Please Enter Khoji id .');
      } else {

      const requestOption = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      if (khojiID) {
        url = `https://hterp.tejgyan.org/django-app/iam/users/?khoji_id=${khojiID}`;
      } else if (khojifirstName) {
        url = `https://hterp.tejgyan.org/django-app/iam/users/?first_name=${khojifirstName}`;
      }
      const response = await fetch(url, requestOption);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();
      setkhojiuserid(responseData.results[0].user.id);
      console.log("userid",responseData.results[0].user.id);
     
      const user = responseData.results[0];
  
          setsearchdata(responseData.results[0]); // Update searchdata with dob set to null if not available
          form.setFieldsValue(user);
      console.log("searchdata",searchdata);
      if (responseData.results && responseData.results.length > 0) {
        console.log("Data found");
        // Update form fields with responseData.results[0]
        form.setFieldsValue(responseData.results[0]);
        console.log("responseData[0]", responseData.results[0]);
        setShowSearchButton(false);
        setShowAddButton(true);
      } else {

        alert("No data found");
      }

    }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onclickNextBtn = async () => {
    if (!selectedPurpose || !startdate || !enddate || !addnote) {
      alert("Please Enter All required field");
    } else {
      const requestBody = {
        user: userid,
        status: "SUBMITTED",
        have_participants: isFamilyKrupaDarshan,
        participants: isFamilyKrupaDarshan ? participantuserid : null,
        purposes: selectedPurpose,
        preferred_start_date: startdate,
        preferred_end_date: enddate,
        khoji_note: addnote,
      };

      try {
        const applicationSubmitted = await submitApplication(
          requestBody,
          token
        );
       console.log("applicationSubmitted", applicationSubmitted);
       //const applicationStatus= await applicationSubmitted.json();
        if (applicationSubmitted) {
          alert("Application Submitted successfully");

          router.push("/krupadarshan/completeandapply");
        } else {
          // Handle submission error
          console.error("Application submission failed");
        }
      } catch (error) {
        // Handle error
        console.error("Error submitting application:", error);
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
  const renderInputComponent = () => {
    if (inputType === "khoji") {
     
      return (
        <Form form={form}>
          {/* <Row gutter={16}>
            <Col span={24}>
           <Form.Item
              label="Have Khoji ID?"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              name="rdyesno"
              initialValue="yes" // Set initial value to "yes"
              rules={[{ required: true, message: "Please select an option" }]}
            >
              <Radio.Group
                style={{ display: "flex", justifyContent: "space-evenly" }}
                onChange={handleRadioChange}
              >
                <Radio.Button value="yes" style={{ borderRadius: "50%" }}>
                  Yes
                </Radio.Button>
                <Radio.Button value="no" style={{ borderRadius: "50%" }}>
                  No
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
            </Col>
          </Row> */}
          <Row gutter={16}>
          <Col span={24}>
              <Form.Item
                label="Enter Khoji ID"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                name="khojiID"
                rules={[{ required: true, message: "Please enter Khoji ID" }]}
              >
                <Input
                  placeholder="Enter Khoji ID"
                  value={khojiID}
                  onChange={(e) => setKhojiID(e.target.value)}
                  style={{
                    borderRadius: "2rem",
                    height: "2rem",
                    width: "100%",
                  }}
                  
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
                  onChange={(e) => setkhojifirstName(e.target.value)}
                  
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
                  style={{
                    borderRadius: "2rem",
                    height: "2rem",
                    width: "100%",
                  }}
                  onChange={(e) => setkhojilastName(e.target.value)}
                 
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
                  style={{
                    borderRadius: "2rem",
                    height: "2rem",
                    width: "100%",
                  }}
                  onChange={(e) => setkhojiemail(e.target.value)}
                  
                />
              </Form.Item>
            </Col>
          </Row>
          {/* <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="DOB"
                name="dob"
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
                <DatePicker
                  style={{
                    borderRadius: "2rem",
                    height: "2rem",
                    width: "100%",
                  }}
                  picker="date"
                  onChange={(value) => setkhojiDobValue(value.toDate())} // Convert Dayjs value to Date
                  disabled={
                    form.getFieldValue("rdyesno") !== "yes"
                  }
                />
              </Form.Item>
            </Col>
          </Row> */}

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
                  style={{
                    borderRadius: "2rem",
                    height: "2rem",
                    width: "100%",
                  }}
                  onChange={(e) => setkhojimobile(e.target.value)}
                 
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
                  style={{
                    borderRadius: "2rem",
                    height: "2rem",
                    width: "100%",
                  }}
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
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {showSearchButton && (
              <Button
                type="primary"
                style={{
                  marginTop: "1rem",
                  backgroundColor: "black",
                  width: "100%",
                  marginBottom: "1rem",
                }}
                onClick={handleseachclick}
              >
                Search
              </Button>
            )}
            {showAddButton && (
              <Button
                type="primary"
                style={{
                  marginTop: "1rem",
                  backgroundColor: "black",
                  width: "100%",
                  marginBottom: "1rem",
                }}
                onClick={handleaddclick}
              >
                Add
              </Button>
            )}
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
                  style={{
                    borderRadius: "2rem",
                    height: "2rem",
                    width: "100%",
                  }}
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
                  style={{
                    borderRadius: "2rem",
                    height: "2rem",
                    width: "100%",
                  }}
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
                <DatePicker
                  style={{
                    borderRadius: "2rem",
                    height: "2rem",
                    width: "100%",
                  }}
                  value={dateOfBirth}
                />
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
                  style={{
                    borderRadius: "2rem",
                    height: "2rem",
                    width: "100%",
                  }}
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
                  style={{
                    borderRadius: "2rem",
                    height: "2rem",
                    width: "100%",
                  }}
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
                  style={{
                    borderRadius: "2rem",
                    height: "2rem",
                    width: "100%",
                  }}
                  value={guestrel}
                  onChange={(e) => setguestrel(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Button
            type="primary"
            style={{
              marginTop: "1rem",
              backgroundColor: "black",
              width: "100%",
              marginBottom: "1rem",
            }}
          >
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
                {buildUserdataCard(user, index)}
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
  // function buildUserdataCard(user: any, index: any) {
  //   return user ? (
  //     <div
  //       className={`${
  //         index === 1 ? "userProfileRightCard" : "userProfileLeftCard"
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
  //       <div className="displayFlex flexDirectionColumn marginLeft16">
  //         <label className="userNameLabel">{user.relation_with?.email}</label>
  //         <div className="displayFlex flexDirectionRow alignItemsCenter marginTop16">
  //           <div
  //             className="displayFlex flexDirectionColumn flex1"
  //             style={{ marginTop: "1rem" }}
  //           >
  //             <label className="userProfileInfoTitle">Name</label>
  //             <label className="userProfileInfoValue">
  //               {user.relation_with?.first_name} {user.relation_with?.last_name}{" "}
  //             </label>
  //           </div>
  //           <div
  //             className="displayFlex flexDirectionColumn flex1"
  //             style={{ marginTop: "1rem" }}
  //           >
  //             <label className="userProfileInfoTitle">Relation</label>
  //             <label className="userProfileInfoValue">{user.relation}</label>
  //           </div>
  //           <div
  //             className="displayFlex flexDirectionColumn flex1"
  //             style={{ marginTop: "1rem" }}
  //           >
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
  function buildUserdataCard(user: any, index: any) {
    return user ? (
      <div
        className={`${
          index === 1 ? "userProfileRightCard" : "userProfileLeftCard"
        }`}
        key={user.id}
        style={{
          width: "100%", // Set width to 100%
          marginBottom: "16px", // Add margin at the bottom of cards
          marginTop: "2rem", // Add margin at the top of cards
          textAlign: "center", // Center the card horizontally
        }}
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
          <label className="userNameLabel" style={{ marginRight: "12rem" }}>
            {user?.relation_with?.first_name} {user?.relation_with?.last_name}
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
              style={{ marginTop: "1rem", marginLeft: "1rem" }}
            >
              <ScannerIcon />
            </div>
          </div>
          <div className="displayFlex flexDirectionRow alignItemsCenter marginTop16">
            <div
              className="displayFlex flexDirectionColumn flex1"
              style={{ marginTop: "1rem" }}
            >
              <label className="userProfileInfoTitle">Tejsthan</label>
              <label className="userProfileInfoValue">{user.location}</label>
            </div>
            <div
              className="displayFlex flexDirectionColumn flex1"
              style={{ marginTop: "1rem" }}
            >
              <label className="userProfileInfoTitle">Shivir level</label>
              <label className="userProfileInfoValue">{user.location}</label>
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

  function buildUserCard(user: any, index: any) {
    return user ? (
      <div
        className={`${
          index === 1 ? "userProfileRightCard" : "userProfileLeftCards"
        }`}
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
        <div className="displayFlex flexDirectionColumn" style={{textAlign:"center"}}>
          <label className="userNameLabel" style={{marginRight:"12rem"}}>   
          {user?.user?.first_name} {user?.user?.last_name}</label>
          <div className="displayFlex flexDirectionRow alignItemsCenter marginTop16">
            <div
              className="displayFlex flexDirectionColumn flex1"
              style={{ marginTop: "1rem"}}
            >
              <label className="userProfileInfoTitle">Khoji Id</label>
              <label className="userProfileInfoValue">
                {user.khoji_id}
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
              style={{ marginTop: "1rem",marginLeft:"1rem" }}
            >
              <ScannerIcon/>
            </div>
          </div>
          <div className="displayFlex flexDirectionRow alignItemsCenter marginTop16">
            <div
              className="displayFlex flexDirectionColumn flex1"
              style={{ marginTop: "1rem"}}
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
    <MainLayout siderClassName={isMobileView ? "" : "leftMenuPanel"} siderChildren={!isMobileView && <CustomMenu />}>
    <div >
        {isMobileView && <CustomMobileMenu />}
        </div>
      <div style={{ marginLeft: "3rem" }}>
        <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
          <ArrowLeftIcon onClick={() => router.back()} />
          Apply for Krupa Darshan
        </div>
        <div style={{ marginLeft: '1.2rem' }}>
        <label className="Descriptionlabel">Add Application details</label>
        </div>
        <div className="center-steps" >
          <Steps
            current={0}
            style={{ width: "50%" }}
            className="my-custom-steps"
            labelPlacement="vertical"
          >
            <Step title="Add Application details" />
            <Step title="Complete & Apply" />
            <Step title="view status" />
          </Steps>
        </div>
      </div>
      <Divider style={{ marginTop: "3rem" }} />
      <div
        style={{ fontWeight: "bold", fontSize: "0.8rem", marginLeft: "3rem" }}
      >
        Add Personal details
      </div>
      <div style={{ marginLeft: "3rem" }}>
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
                      mode="tags"
                      style={{ width: "100%", height: "auto" }}
                      placeholder="Select Purpose"
                      value={selectedPurpose} 
                      onChange={(value) => setSelectedPurpose(value)}
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
                  <Form.Item
                    label="Select preferred date"
                    name={["startdate"]}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: "Please select preferred start date!",
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
                        disabledDate(current, null, enddate)
                      }
                      onChange={(date, dateString) => {
                        if (typeof dateString === "string") {
                          setStartdate(dateString);
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
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
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="Add Note"
                    name="addnote"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: "Please input your Add note!",
                      },
                    ]}
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
                  <Button
                    type="primary"
                    style={{
                      borderRadius: "2rem",
                      marginLeft: "1rem",
                      width: "12rem",
                      height: "2rem",
                      backgroundColor: "black",
                      marginBottom: "1rem",
                    }}
                    onClick={onclickNextBtn}
                  >
                    Next
                  </Button>
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

              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                xl={12}
                style={{ marginBottom: "16px" }}
              >
                {isFamilyKrupaDarshan === "true" && (
                  <div
                    style={{
                      width: "13rem",
                      height: "20rem",
                      overflow: "auto",
                      marginLeft: "2rem",
                    }}
                  >
                    <Card onClick={showModal} style={{width: "80%",
                      height: "15.375rem",justifyContent:"center"}}>
                      <div
                        style={{
                          textAlign: "center",
                          color: "gray",
                          fontSize: "2.8rem",
                          justifyContent:"center"
                        }}
                      >
                        <PlusOutlined />
                        <br />
                        <Text style={{ color: "gray" }}>
                          Add Family Member Here
                        </Text>
                      </div>
                    </Card>
                    <div
                      style={{
                        display: "flex",
                        marginTop: "8px",
                      }}
                    >
                      <Button
                        style={{
                          marginTop: "1rem",
                          marginRight: "16px",
                          borderRadius: "1rem",
                          backgroundColor: "#1E1E1E",
                          color: "white",
                        }}
                        onClick={() => handleInputTypeChange("View all")}
                      >
                        View all
                      </Button>
                    </div>
                    <Modal
                      title={
                        inputType === "View all"
                          ? "Added Family Members"
                          : "Family Member 1"
                      }
                      visible={isModalVisible}
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
                                    color:
                                      inputType === "khoji" ? "blue" : "black",
                                  }}
                                  onClick={() => handleInputTypeChange("khoji")}
                                >
                                  Khoji
                                </Button>
                                <Button
                                  type="link"
                                  style={{
                                    marginRight: 10,
                                    color:
                                      inputType === "guest" ? "blue" : "black",
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
                  </div>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
}
