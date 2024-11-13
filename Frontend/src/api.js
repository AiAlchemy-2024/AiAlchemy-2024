const HOST = "http://192.168.81.96:8003";

export const getGuidelines = async (data, setGuidelines, setError) => {
  // console.log("first");
  // return new Promise((resolve) => {
  //   resolve(
  //     setTimeout(() => {
  //       setGuidelines([
  //         {
  //           guideline: "Guideline",
  //           compliance: 'False',
  //           explaination: "explaination",
  //         },
  //       ]);
  //     }, 1000)
  //   );
  // });

  try {
    const headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
    };
    const bodyContent = JSON.stringify({
      user_input: data,
    });
    const respo = await fetch(`${HOST}/guidelines`, {
      method: "POST",
      body: bodyContent,
      headers: headersList,
    });

    if (respo.ok) {
      const respojson = await respo.json();
      setGuidelines(respojson);
    } else setError("GUIDELINES ERROR");
  } catch (error) {
    setError("GUIDELINES ERROR");
  }
};

export const getWrapTopic = async (data, setWrapTopic, setError) => {
  try {
    const headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
    };
    const bodyContent = JSON.stringify({
      user_input: data,
    });
    const respo = await fetch(`${HOST}/wrap_topic`, {
      method: "POST",
      body: bodyContent,
      headers: headersList,
    });

    if (respo.ok) {
      const respojson = await respo.json();
      setWrapTopic(respojson.wrap_topic);
    } else setError("WRAPTOPIC ERROR");
  } catch (error) {
    setError("WRAPTOPIC ERROR");
  }
};

export const getSentimentAnalysis = async (data, setSentimentAnalysis, setError) => {
  try {
    const headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
    };
    const bodyContent = JSON.stringify({
      user_input: data,
    });
    const respo = await fetch(`${HOST}/sentiment_analysis`, {
      method: "POST",
      body: bodyContent,
      headers: headersList,
    });

    if (respo.ok) {
      const respojson = await respo.json();
      setSentimentAnalysis(respojson);
    } else setError("WRAPTOPIC ERROR");
  } catch (error) {
    setError("WRAPTOPIC ERROR");
  }
};

export const getCaseDetails = async (data, setCaseDetails, setError) => {
  try {
    const headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
    };
    const bodyContent = JSON.stringify({
      user_input: data,
    });
    const respo = await fetch(`${HOST}/caseid`, {
      method: "POST",
      body: bodyContent,
      headers: headersList,
    });

    if (respo.ok) {
      const respojson = await respo.json();
      setCaseDetails(respojson.caseid);
    } else setError("CASE DETAILS ERROR");
  } catch (error) {
    setError("CASE DETAILS ERROR");
  }
};

export const getNextBestActions = async (
  data,
  setNextBestActions,
  setError
) => {
  try {
    const headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
    };
    const bodyContent = JSON.stringify({
      user_input: data,
    });
    const respo = await fetch(`${HOST}/recommendation`, {
      method: "POST",
      body: bodyContent,
      headers: headersList,
    });

    if (respo.ok) {
      const respojson = await respo.json();
      setNextBestActions(respojson);
    } else setError("NEXT BEST ACTIONS ERROR");
  } catch (error) {
    setError("NEXT BEST ACTIONS ERROR");
  }
};

export const getActionItems = async (data, setActionItems, setError) => {
  try {
    const headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
    };
    const bodyContent = JSON.stringify({
      user_input: data,
    });
    const respo = await fetch(`${HOST}/follow_up`, {
      method: "POST",
      body: bodyContent,
      headers: headersList,
    });

    if (respo.ok) {
      const respojson = await respo.json();
      setActionItems(respojson);
    } else setError("Action items ERROR");
  } catch (error) {
    setError("Action items ERROR");
  }
};

export const getSummary = async (
  formData,
  customisations,
  setSummaryText,
  setError
) => {
  try {
    const headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
    };

    const summaryresponse = await fetch(`${HOST}/generate_summary`, {
      method: "POST",
      body: JSON.stringify({ user_input: formData, customisations }),
      headers: headersList,
    });

    if (summaryresponse.ok) {
      console.log("File uploaded successfully");
      const reader = summaryresponse.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setSummaryText((prev) => prev + chunk);
      }
    } else {
      setError("SUMMARY ERROR");
    }
  } catch (error) {
    setError("SUMMARY ERROR");
  }
};
