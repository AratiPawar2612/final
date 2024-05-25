

const baseUrl = "https://hterp.tejgyan.org/django-app/";
// const baseUrl = "http://192.168.1.247:8000/";
const eventUrl = `${baseUrl}event/`;


export const fetchUserData = async (accessToken: any) => {
  const userApiUrl = `${baseUrl}iam/users/me/`;
  const userResponse = await fetch(userApiUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  const userDataResponse = await userResponse.json();
  return userDataResponse;
};

export const fetchApplicationData = async (accessToken: any) => {
  const applicationApiUrl = `${baseUrl}event/applications/?ordering=-created_at`;

  const applicationResponse = await fetch(applicationApiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!applicationResponse.ok) {
    throw new Error("Failed to fetch application data");
  }

  const applicationData = await applicationResponse.json();
  return applicationData.results ?? [];
};

export const fetchPurposeData = async (accessToken: string) => {
  const purposeApiUrl = `${baseUrl}event/purposes/`;
  const purposeResponse = await fetch(purposeApiUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  const purposeDataResponse = await purposeResponse.json();
  const options = purposeDataResponse.results.map((purpose: any) => ({
    key: purpose.id,
    value: purpose.id,
    label: purpose.title,
  }));
  return options;
};

export const fetchParticipantData = async (accessToken: string) => {
  const getRequestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const getResponse = await fetch(
    `${baseUrl}event/participants/?ordering=-created_at`,
    getRequestOptions
  );

  if (!getResponse.ok) {
    throw new Error("Network response was not ok");
  }

  const responseData = await getResponse.json();
  return responseData;
};

export const searchUser = async (token:any, criteria:any) => {
  try {
    let url = "";
    if (!criteria) {
      throw new Error("Please provide search criteria.");
    } else if (criteria.startsWith("khoji_id=")) {
      url = `${baseUrl}iam/users/?${criteria}`;
    } else if (criteria.startsWith("first_name=") && criteria.includes("&last_name=")) {
      url = `${baseUrl}iam/users/?${criteria}`;
    } else if (criteria.startsWith("contact_no=")) {
      url = `${baseUrl}iam/users/?${criteria}`;
    } else if (criteria.startsWith("email=")) {
      url = `${baseUrl}iam/users/?${criteria}`;
    } else {
      throw new Error("Invalid search criteria.");
    }
    
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const responseData = await response.json();
    return responseData.results ?? [];
  } catch (error) {
    console.error("Error searching user:", error);
    throw error;
  }
};



export const createParticipant = async (requestData:any, token:any) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestData),
  };

  const response = await fetch(`${eventUrl}participants/`, requestOptions);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  else{
    const data = await response.json();
    return data;
  }

  
};

export const submitApplication = async (
  requestBody: Record<string, any>,
  token: string
) => {
  // Create FormData object
  const formData = new FormData();

  // Convert request body to FormData
  Object.entries(requestBody).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      formData.append(key, "");
    } else if (typeof value === "boolean") {
      formData.append(key, value.toString());
    } else if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });

  // Construct request options
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  };

  try {
    // Send POST request
    const response = await fetch(
      `${baseUrl}event/applications/`,
      requestOptions
    );

    // Check if response is OK
    if (!response.ok) {
      // Get the status text from the response
      const statusText = await response.text();
      // Check for specific error messages
      if (statusText.includes("User already has an active application")) {
        alert("User already has an active application");
      } else if (statusText.includes("Participants must be provided for application")) {
        alert("Participants must be provided for application");
      } else if (statusText.includes("Participants cannot be accepted for application")) {
        alert("Participants cannot be accepted for application");
      } else if (statusText.includes("Applicant cannot be a participant in their own application")) {
        alert("Applicant cannot be a participant in their own application");
      } else if (statusText.includes("User cannot create other users application")) {
        alert("User cannot create other users application");
      } else {
        throw new Error(`Network response was not ok: ${statusText}`);
      }
      return false;
    } else {
      // Application submitted successfully
      return true;
    }
  } catch (error) {
    // Handle fetch error
    console.error("There was a problem with your fetch operation:", error);
    return false;
  }
};



export const fetchPurposeOptions = async (userid: any, accessToken: any) => {
  try {
    const purposeApiUrl = `${baseUrl}event/applications/?user=${userid}`;
    const purposeResponse = await fetch(purposeApiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    const purposeDataResponse = await purposeResponse.json();
    console.log("purposeDataResponse", purposeDataResponse);

    if (purposeDataResponse.results.length > 0) {
      const purpose = purposeDataResponse.results[0];
      console.log("purpose", purpose);
      const options = [
        {
          key: purpose.id,
          value: purpose.id,
          label: purpose.purposes[0].description,
        },
      ];
      console.log("options", options);

      return options;
    } else {
      console.error("No data available in purposeDataResponse.results");
      return [];
    }
  } catch (error) {
    console.error("Error fetching purpose options:", error);
    return [];
  }
};

export const updateApplicationStatus = async (applicationId:any, newStatus:any, token:any) => {
  try {
    const apiUrl = `${eventUrl}applications/${applicationId}/`;
    const response = await fetch(apiUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      throw new Error("Failed to update application status");
    } else {
      const responseData = await response.json();
      console.log("Updated application:", responseData);
      return responseData;
    }
  } catch (error) {
    console.error("Error updating application status:", error);
    throw error;
  }
};

export const submitRescheduleForm = async (applicationId:any, startDate:any, endDate:any, token:any) => {
  try {
    const apiUrl = `${eventUrl}applications/${applicationId}/reschedule/`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        preferred_start_date: startDate,
        preferred_end_date: endDate,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update application status");
    } else {
      const responseData = await response.json();
      console.log("Updated application:", responseData);
      return responseData;
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    throw error;
  }
};





