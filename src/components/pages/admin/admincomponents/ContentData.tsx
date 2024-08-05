import React from "react";
import ContentDataAssessment from "./contentdata/ContentDataAssessment";
import IframeQuiz from "../../iframes/IframeQuiz";
import ContentDataReading from "./contentdata/ContentDataReading";
import ContentDataFlashcard from "./contentdata/ContentDataFlashcard";
import ContentDataSchedule from "./contentdata/ContentDataSchedule";

const ContentData = ({ currentData }) => {
  return (
    <>
      <div className="w-full">
        {currentData.type == "assessment" && (
          <div>
            <ContentDataAssessment
              id={currentData.id}
              type={currentData.type}
            />
          </div>
        )}
        {currentData.type == "quiz" && (
          <div>
            <IframeQuiz id={currentData.id} />
          </div>
        )}
        {currentData.type == "reading_material" && (
          <div>
            <ContentDataReading id={currentData.id} />
          </div>
        )}
        {currentData.type == "flashcard" && (
          <div>
            <ContentDataFlashcard id={currentData.id} />
          </div>
        )}
        {currentData.type == "schedule" && (
          <div>
            <ContentDataSchedule id={currentData.id} />
          </div>
        )}
      </div>
    </>
  );
};

export default ContentData;
