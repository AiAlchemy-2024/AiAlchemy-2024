import React, { useState, useRef, useCallback, useEffect } from "react";
import "./App.css"; // Import the CSS file
import Markdown from "markdown-to-jsx";
import PopupNav from "./PopupNav";
import Button from "./Button";
import RadioButton from "./RadioButton";
import { getGuidelines, getSummary } from "./api";
import Loading from "./Loading";

const App = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summarytext, setSummaryText] = useState(
    "# Heck Yes\n\nThis is great!"
  );
  const [wraptopic, setWraptopic] = useState("");
  const [nextBestActions, setNextBestActions] = useState("");
  const [actionItems, setActionItems] = useState("");
  const [caseDetails, setCaseDetails] = useState("");
  const [guidelines, setGuidelines] = useState("");

  console.log(guidelines);

  const [customisations, setCustomisations] = useState({
    summaryLength: "long",
    profile: "loans",
  });

  const fileInputRef = useRef(null);
  const popupRef = useRef(null);

  const gearClickHandler = useCallback(() => {
    popupRef.current.showPopup();
  });

  const handleDrop = useCallback((event) => {
    event.preventDefault();

    if (!["text/plain"].includes(event.dataTransfer.files[0].type)) {
      alert("Only Audio and text files are allowed");
      return;
    }

    const droppedFile = event.dataTransfer.files[0];
    setFile(droppedFile);
  });

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  });

  const handleFileChange = useCallback((event) => {
    setFile(event.target.files[0]);
  });

  const handleClick = useCallback(() => {
    fileInputRef.current.click();
  });

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("audio", file);

    await getGuidelines("sample", setGuidelines, setError);
    // await getSummary(formData, setSummaryText, setError);
  });

  return (
    <div className="main">
      <div className="header">
        <h2>GenAI Hackathon</h2>
        <p>AI Alchemists</p>
      </div>
      <form onSubmit={handleSubmit}>
        <RadioButton />

        <div
          className="drop-zone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleClick}
        >
          {file ? (
            <p>{file.name}</p>
          ) : (
            <p>Click to add files or Drop files here</p>
          )}
          <input
            type="file"
            accept="audio/*, .txt"
            onChange={handleFileChange}
            ref={fileInputRef}
            hidden
          />
        </div>

        <div className="buttons">
          <svg
            onClick={gearClickHandler}
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#5f6368"
          >
            <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
          </svg>

          <PopupNav ref={popupRef} setCustomisations={setCustomisations} />

          <Button type={"submit"} label={"Generate"} />
        </div>
      </form>
      <div className="content-wrapper">
        <div className="content-section">
          <Summary data={summarytext} />
          <WrapTopic data={wraptopic} />
          <CaseDetails data={caseDetails} />
          <Guidelines data={guidelines} />
          <NextBestActions data={nextBestActions} />
          <ActionItems data={actionItems} />
        </div>
      </div>
    </div>
  );
};

const TopicCard = ({ children, heading }) => {
  return (
    <div className="topic-card">
      <div className="topic-heading">{heading}</div>
      {children}
    </div>
  );
};

const Summary = ({ data }) => {
  if (!data) return;
  return (
    <TopicCard heading={"Summary"}>
      {data ? <Markdown>{data}</Markdown> : <Loading />}
    </TopicCard>
  );
};

const WrapTopic = ({ data }) => {
  return (
    <TopicCard heading={"Wrap topic"}>
      {data ? <p>{data}</p> : <Loading />}
    </TopicCard>
  );
};

const NextBestActions = ({ data }) => {
  return (
    <TopicCard heading={"Next Best Actions"}>
      {data ? <p>{data}</p> : <Loading />}
    </TopicCard>
  );
};

const ActionItems = ({ data }) => {
  return (
    <TopicCard heading={"Action Items"}>
      {data ? <p>{data}</p> : <Loading />}
    </TopicCard>
  );
};

const Guidelines = ({ data }) => {
  console.log(data);
  return (
    <TopicCard heading={"Guidelines"}>
      {data ? (
        <>
          {data.map((item) => (
            <p key={item.length} className={`guideline ${!item.compliance && "bad"}  `}>
              {item.guideline}
            </p>
          ))}
        </>
      ) : (
        <Loading />
      )}
    </TopicCard>
  );
};

const CaseDetails = ({ data }) => {
  return (
    <TopicCard heading={"Case Details"}>
      {data ? <p>{data}</p> : <Loading />}
    </TopicCard>
  );
};
export default App;
