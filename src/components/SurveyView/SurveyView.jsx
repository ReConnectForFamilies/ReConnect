import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "./SurveyView.css";

function SurveyView() {
  const dispatch = useDispatch();
  const history = useHistory();
  const question = useSelector(store => store.question);
  const [survey, setSurvey] = useState([]);

  useEffect(() => {
    dispatch({ type: "FETCH_QUESTION" });
  }, []);

  const handleChange = (index, value, type, id) => {
    setSurvey(prev => {
      const newSurvey = [...prev];
      if (type === "multi" && newSurvey[index]) {
        newSurvey[index] = {
          id: id,
          response: newSurvey[index].response.includes(value)
            ? newSurvey[index].response.replace(`|${value}`, "")
            : `${newSurvey[index].response}|${value}`,
        };
      } else {
        newSurvey[index] = { id: id, response: value };
      }
      return newSurvey;
    });
  };

  const handleSubmit = event => {
    event.preventDefault();
    dispatch({ type: "POST_SURVEY", payload: survey });
    history.push("/");
  };

  return (
    <div className="survey-background">
      <form onSubmit={handleSubmit}>
        {question.map((q, index) => (
          <div key={index}>
            <h2>{q.detail}</h2>
            {q.type === "short" && (
              <input
                type="text"
                onChange={e =>
                  handleChange(index, e.target.value, q.type, q.id)
                }
              />
            )}
            {q.type === "single" &&
              q.options.map((option, i) => (
                <div key={i}>
                  <input
                    type="radio"
                    id={`option${index}-${i}`}
                    name={`question${index}`}
                    value={option.detail}
                    onChange={e =>
                      handleChange(index, e.target.value, q.type, q.id)
                    }
                  />
                  <label htmlFor={`option${index}-${i}`}>{option.detail}</label>
                </div>
              ))}
            {q.type === "multi" &&
              q.options.map((option, i) => (
                <div key={i}>
                  <input
                    type="checkbox"
                    id={`option${index}-${i}`}
                    name={`question${index}`}
                    value={option.detail}
                    onChange={e =>
                      handleChange(
                        index,
                        e.target.checked ? option.detail : null,
                        q.type,
                        q.id
                      )
                    }
                  />
                  <label htmlFor={`option${index}-${i}`}>{option.detail}</label>
                </div>
              ))}
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default SurveyView;
