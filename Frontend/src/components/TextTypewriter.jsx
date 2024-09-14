import React, { useState, useEffect } from "react";
import { Typewriter } from "react-simple-typewriter";

const texts = [
  { text: "مدرسة جاد فى الفيزيا", tag: "h1" },
  { text: "أ/ عبده جاد", tag: "h1" },
  { text: "معلم أول فيزياء بمدرسة كفر صقر  ث. بنات", tag: "h4" },
  { text: "للتواصل: 01063572238", tag: "h2" },
];

const TextTypewriter = () => {
  const [displayedTexts, setDisplayedTexts] = useState([]); // Holds texts that are done typing
  const [currentTextIndex, setCurrentTextIndex] = useState(0); // Tracks current text being typed
  const [typingDone, setTypingDone] = useState(false); // Flag to manage typing completion

  useEffect(() => {
    if (currentTextIndex < texts.length) {
      if (typingDone) {
        // Add new text to be typed
        const newText = texts[currentTextIndex];

        setDisplayedTexts((prev) => [
          ...prev,
          { text: newText.text, tag: newText.tag },
        ]);

        // Move to the next text after a delay
        setCurrentTextIndex((prev) => prev + 1);
        setTypingDone(false); // Reset typing flag
      } else {
        // Set a timer for the typing duration
        const typingDuration = 3000; // Duration to complete typing each text (in ms)
        const typingTimer = setTimeout(() => {
          setTypingDone(true); // Mark typing as done
        }, typingDuration);

        return () => clearTimeout(typingTimer); // Clean up timer
      }
    } else {
      // If all texts are displayed, reset after a 10-second delay
      const resetTimer = setTimeout(() => {
        setDisplayedTexts([]);
        setCurrentTextIndex(0);
        setTypingDone(false); // Reset typing flag
      }, 15000); // 15 secs

      return () => clearTimeout(resetTimer);
    }
  }, [typingDone, currentTextIndex]);

  const handleTypeComplete = () => {
    setTypingDone(true); // Mark typing as done
  };

  const renderTextWithTag = (text, tag, index) => {
    switch (tag) {
      case "h1":
        return <h1 key={index}>{text}</h1>;
      case "h2":
        return <h2 key={index}>{text}</h2>;
      case "h3":
        return <h3 key={index}>{text}</h3>;
      case "h4":
        return <h4 key={index}>{text}</h4>;
      default:
        return <p key={index}>{text}</p>;
    }
  };

  return (
    <div>
      {displayedTexts.map((text, index) =>
        renderTextWithTag(text.text, text.tag, index)
      )}

      {/* Render current text being typed */}
      {currentTextIndex < texts.length && (
        <div>
          {renderTextWithTag(
            <Typewriter
              words={[texts[currentTextIndex].text]}
              loop={1}
              typeSpeed={50}
              deleteSpeed={0}
              delaySpeed={1000}
              onLoopDone={handleTypeComplete} // Callback when typing is done
            />,
            texts[currentTextIndex].tag,
            currentTextIndex
          )}
        </div>
      )}
    </div>
  );
};

export default TextTypewriter;
