import { useState } from "react";
import "./App.css";
import Editor from "@monaco-editor/react";
import Navbar from "./components/navbar/Navbar.js";
import axios from "axios";
import spinner from "./logo.svg";
import { Buffer } from "buffer";

function App() {
  // State variable to set users source code
  const [userCode, setUserCode] = useState(``);

  // State variable to set editors default language
  const [userLang, setUserLang] = useState("cpp");

  // State variable to set editors default theme
  const [userTheme, setUserTheme] = useState("vs-light");

  // State variable to set editors default font size
  const [fontSize, setFontSize] = useState(14);

  // State variable to set users input
  const [userInput, setUserInput] = useState("1");

  // State variable to set users output
  const [userOutput, setUserOutput] = useState("");

  const [compileErr, setcompileErr] = useState("");

  // Loading state variable to show spinner
  // while fetching data
  const [loading, setLoading] = useState(false);

  const options = {
    fontSize: fontSize,
  };

  const showOutput = async (token) => {

    const options = {
      method: "GET",
      url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        "X-RapidAPI-Key": "2dd2200443mshae9635ed8a831d8p107429jsne9738f555198",
      },
    };

    await axios
      .request(options)
      .then(function (response) {
		  console.log(response);

        let output = response.data.stdout?Buffer.from(String(response.data.stdout), 'base64').toString('ascii'):response.data.stdout;
		let error = response.data.compile_output?Buffer.from(String(response.data.compile_output), 'base64').toString('ascii'):response.data.compile_output;
		let status = Buffer.from(String(response.data.status.description)).toString('ascii');
		setLoading(false);
        setUserOutput(output);
		setcompileErr(error+status);
		
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const compile = async () => {
    let code = Buffer.from(userCode).toString("base64");
	let input = Buffer.from(userInput).toString("base64");
	console.log(input);

    const postconfig = {
      method: "POST",
      url: "https://judge0-ce.p.rapidapi.com/submissions",
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        "X-RapidAPI-Key": "2dd2200443mshae9635ed8a831d8p107429jsne9738f555198",
      },
      data: { language_id: 52, source_code: `${code}`, stdin: `${input}` },
    };

    console.log(postconfig.data);

    if (userCode === ``) {
      return;
    } else {
      await axios
        .request(postconfig)
        .then(function (res) {
          setLoading(true);
     
          let token = res.data.token;
          console.log(token);
          showOutput(token);
          
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  };

  function clearOutput() {
    setUserOutput("");
	setcompileErr("");
  }

  return (
    <div className="App">
      <Navbar
        userLang={userLang}
        setUserLang={setUserLang}
        userTheme={userTheme}
        setUserTheme={setUserTheme}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />
      <div className="main">
        <div className="left-container">
          <Editor
            options={options}
            height="calc(100vh - 50px)"
            width="100%"
            theme={userTheme}
            language={userLang}
            defaultLanguage="CPP"
            defaultValue="// Created By Hitesh Chawla"
            onChange={(value) => {
              setUserCode(value);
            }}
          />
          <button className="run-btn" onClick={() => compile()}>
            Run
          </button>
        </div>
        <div className="right-container">
          <h4>Input:</h4>
          <div className="input-box">
            <textarea
              id="code-inp"
              onChange={(e) => setUserInput(e.target.value)}
            ></textarea>
          </div>
          <h4>Output:</h4>
          {loading ? (
            <div className="spinner-box">
              loading...
            </div>
          ) : (
            <div className="output-box">
				
				 <pre>{userOutput}</pre> <br></br>
         Error:
         <pre>{compileErr}</pre> <br></br>
              <button
                onClick={() => {
                  clearOutput();
                }}
                className="clear-btn"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
