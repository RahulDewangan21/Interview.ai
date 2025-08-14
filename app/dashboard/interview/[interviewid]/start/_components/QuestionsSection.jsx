import { Lightbulb, Volume2 } from "lucide-react";
import React from "react";

function QuestionsSection({ mockInterviewQues = [], activeQuestionIndex }) {

  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      if (!text) {
        alert("No question available to read.");
        return;
      }
      window.speechSynthesis.cancel(); 
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = "en-IN"; 
      speech.rate = 1; 
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, your browser does not support text-to-speech.");
    }
  };

  const questionsArray = Array.isArray(mockInterviewQues[0]) ? mockInterviewQues[0] : [];

  console.log("Processed Questions Array:", questionsArray);

  console.log("Active Index:", activeQuestionIndex, "Questions:", questionsArray);


  return (
    <div className="p-5 border rounded-lg my-10">
      {questionsArray.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {questionsArray.map((item, index) => (
            <h2
              key={index}
              className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer ${
                activeQuestionIndex === index ? "bg-black text-white" : ""
              }`}
            >
              Question #{index + 1}
            </h2>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}

      
      <h2 className="my-5 text-md md:text-lg">
        {questionsArray[activeQuestionIndex]?.question || "No question selected"}
      </h2>

      
      <Volume2
        className="cursor-pointer"
        onClick={() => textToSpeech(questionsArray[activeQuestionIndex]?.question)}
      />

      <div className="border rounded-lg p-5 bg-yellow-100 mt-20">
        <h2 className="flex gap-2 items-center text-yellow-800">
          <Lightbulb />
          <strong>Instruction:</strong>
        </h2>
        <h2 className="text-sm text-yellow-800 my-2">
          Click on Record Answer to record your answer.To listen question click on volume button. After the interview, we will give you feedback along with the correct answer so that you can compare them.
          
        </h2>
      </div>
    </div>
  );
}

export default QuestionsSection;










