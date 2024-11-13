export const getGuidelines = async (data, setGuidelines, setError) => {
//   console.log("first");
//   return new Promise((resolve) => {
//     resolve(
//       setTimeout(() => {
//         setGuidelines([
//           {
//             guideline: "guideline",
//             complaince: false,
//             explaination: "explaination",
//           },
//         ]);
//       }, 1000)
//     );
//   });

  try {
    const headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
    };
    const bodyContent = JSON.stringify({
      user_input: data,
    });
    const respo = await fetch(`http://192.168.81.96:8003/guidelines`, {
      method: "POST",
      body: bodyContent,
      headers:headersList
    });

    if (respo.ok) {
      const respojson = await respo.json();
      setGuidelines(respojson);
    } else setError("GUIDELINES ERROR");
  } catch (error) {
    setError("GUIDELINES ERROR");
  }
};

export const getSummary = async (formData, setSummaryText, setError) => {
  try {
    const summaryresponse = await fetch("YOUR_API_ENDPOINT", {
      method: "POST",
      body: formData,
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
