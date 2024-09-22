import React, { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import axios from 'axios';

const CodeConverter = () => {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [inputLang, setInputLang] = useState('python');
  const [outputLang, setOutputLang] = useState('javascript');

  const handleConvert = async () => {
    try {
      const requestData = {
        contents: [
          {
            parts: [
              {
                text: `Convert this ${inputLang} [${inputCode}] to ${outputLang}`
              }
            ]
          }
        ]
      };

      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_API_KEY}`,
        method: "post",
        headers: {
          'Content-Type': 'application/json'
        },
        data: requestData
      });

      const output = response.data.candidates[0].content.parts[0].text;
      const cleanedOutput = output.replace(/```[a-z]*\n?|\n```/g, '').trim();
    
      setOutputCode(cleanedOutput);
    } catch (error) {
      console.error('Error converting code:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className='flex w-[80%] space-x-4'> {/* Add space between input and output */}
        
        <div className="flex w-[50%] flex-col p-4 shadow-md rounded-lg bg-white"> {/* Ensure select inputs are visible */}
          <label className="font-semibold mb-2">Input Language</label>
          <select 
            className="bg-gray-200 p-2 mb-4 rounded-md" /* Add padding and background */
            value={inputLang}
            onChange={(e) => setInputLang(e.target.value)}>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
          </select>

          <Editor
            height="400px"
            defaultLanguage={inputLang}
            language={inputLang}
            theme="vs-dark"
            value={inputCode}
            onChange={(value) => setInputCode(value)}
          />
        </div>

        <div className="flex w-[50%] flex-col p-4 shadow-md rounded-lg bg-white"> {/* Same styles for output editor */}
          <label className="font-semibold mb-2">Output Language</label>
          <select 
            className="bg-gray-200 p-2 mb-4 rounded-md" /* Add padding and background */
            value={outputLang}
            onChange={(e) => setOutputLang(e.target.value)}>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
          </select>

          <Editor
            height="400px"
            defaultLanguage={outputLang}
            language={outputLang}
            theme="vs-dark"
            value={outputCode}
            options={{
              readOnly: true
            }}
          />
        </div>
      </div>

      <button 
        className="mt-6 px-6 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 transition duration-200"
        onClick={handleConvert}>
        Convert Code
      </button>
    </div>
  );
};

export default CodeConverter;