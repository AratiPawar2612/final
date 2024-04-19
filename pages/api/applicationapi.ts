export const fetchUserData = async (accessToken:any) => {
    const userApiUrl = "https://hterp.tejgyan.org/django-app/iam/users/me/";
    const userResponse = await fetch(userApiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    const userDataResponse = await userResponse.json();
    return userDataResponse;
  };
  export const fetchApplicationData = async (accessToken:any) => {
    const applicationApiUrl = "https://hterp.tejgyan.org/django-app/event/applications/";
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
  // fetchPurposeData.ts

export const fetchPurposeData = async (accessToken: string) => {
  const purposeApiUrl = 'https://hterp.tejgyan.org/django-app/event/purposes/';
  const purposeResponse = await fetch(purposeApiUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  const purposeDataResponse = await purposeResponse.json();
  const options = purposeDataResponse.results.map((purpose: any) => ({
    key: purpose.id,
    value: purpose.id,
    label: purpose.title, // Change this to purpose.title
  }));
  return options;
};



export const fetchParticipantData = async (accessToken: string) => {
  const getRequestOptions = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const getResponse = await fetch('https://hterp.tejgyan.org/django-app/event/participants/', getRequestOptions);

  if (!getResponse.ok) {
    throw new Error('Network response was not ok');
  }

  const responseData = await getResponse.json();
  return responseData;
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
      formData.append(key, '');
    } else if (typeof value === 'boolean') {
      formData.append(key, value.toString());
    } else if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });

  // Construct request options
  const requestOptions = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  };

  try {
    // Send POST request
    const response = await fetch(
      'https://hterp.tejgyan.org/django-app/event/applications/',
      requestOptions
    );

    // Check if response is OK
    if (!response.ok) {
      throw new Error('Network response was not ok');
    } else {
      // Application submitted successfully
      alert('Application Submitted successfully');
      return true;
    }

    
  } catch (error) {
    // Handle fetch error
    console.error('There was a problem with your fetch operation:', error);
    return false;
  }
};

export default submitApplication;


export const fetchPurposeOptions = async (userid :any, accessToken:any) => {
  try {
    const purposeApiUrl = `https://hterp.tejgyan.org/django-app/event/applications/?user=${userid}`;
    const purposeResponse = await fetch(purposeApiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    const purposeDataResponse = await purposeResponse.json();
    console.log("purposeDataResponse",purposeDataResponse)

    if (purposeDataResponse.results.length > 0) {
      const purpose = purposeDataResponse.results[0];
      console.log("purpose",purpose)
      const options = [
        {
          key: purpose.id,
          value: purpose.id,
          label: purpose.purposes[0].description, // Change 'title' to 'label'
        },
      ];
      console.log("options",options)

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






