import React from "react";
import { useState, useCallback, useEffect, useRef } from "react";


function App() {
  // State variables for password length, number inclusion, symbol inclusion, and generated password
  const [length, setLength] = useState(8);
  const [number, setNumber] = useState(true);
  const [chars, setChar] = useState(false);
  const [password, setPw] = useState("");
  const [copied, setCopied] = useState(false);
  const [strengthColor, setStrengthColor] = useState("bg-yellow-500");
  const [strengthText, setStrengthText] = useState("Medium");

  // useRef Hook to reference the password input field for copying
  const passwordRef = useRef(null);

  // Function to generate a random password based on selected options
  const passwordGen = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"; // Default: uppercase and lowercase letters

    if (number) str += "0123456789"; // Add numbers if checkbox is checked
    if (chars) str += "!@#$%^&*()_+[]{}|;:',.<>?/`~"; // Add special characters if checkbox is checked

    // Generate password of selected length
    for (let i = 1; i <= length; i++) {
      const char = Math.floor(Math.random() * str.length); // Random index from string
      pass += str.charAt(char);
    }
    setPw(pass);
  }, [length, number, chars, setPw]);

  // Function to copy the generated password to clipboard
  const copyPassword = useCallback(() => {
    passwordRef.current?.select(); // Select the text inside the input field
    window.navigator.clipboard.writeText(password); // Copy to clipboard
    setCopied(true);
    
    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [password]);

  // Calculate password strength
  useEffect(() => {
    // Simple strength calculation
    let strength = 0;
    if (length >= 8) strength += 1;
    if (length >= 12) strength += 1;
    if (number) strength += 1;
    if (chars) strength += 1;

    // Set strength color and text
    if (strength <= 1) {
      setStrengthColor("bg-red-500");
      setStrengthText("Weak");
    } else if (strength === 2) {
      setStrengthColor("bg-yellow-500");
      setStrengthText("Medium");
    } else if (strength === 3) {
      setStrengthColor("bg-green-500");
      setStrengthText("Strong");
    } else {
      setStrengthColor("bg-emerald-500");
      setStrengthText("Very Strong");
    }
  }, [length, number, chars]);

  // Call password generator when length, number, or symbol options change
  useEffect(() => {
    passwordGen();
  }, [length, number, chars, passwordGen]);

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center p-4">
      <div className="bg-slate-800 w-screen max-w-md rounded-xl shadow-xl overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5">
          <h1 className="text-2xl font-bold text-white text-center">Secure Pass</h1>
          <p className="text-blue-100 text-sm text-center mt-1">Secure Password Generation</p>
        </div>

        {/* Password Display */}
        <div className="p-5">
          <div className="relative bg-slate-900 rounded-lg overflow-hidden mb-6 group">
            <input
              type="text"
              className="w-full bg-transparent p-4 pr-24 text-gray-100 font-mono text-lg outline-none"
              readOnly
              value={password}
              ref={passwordRef}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
              <button
                onClick={passwordGen}
                className="p-2 rounded-md bg-slate-700 hover:bg-slate-600 text-gray-300 transition-colors"
                aria-label="Generate new password"
              >
                <span className="font-bold">↻</span>
              </button>
              <button
                onClick={copyPassword}
                className="p-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                aria-label="Copy password"
              >
                {copied ? "✓" : "📋"}
              </button>
            </div>
          </div>

          {/* Password Strength Indicator */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-400">Password Strength</span>
              <span className="text-sm font-medium text-white">{strengthText}</span>
            </div>
            <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
              <div className={`h-full ${strengthColor} transition-all duration-300`} style={{ width: `${(length / 20) * 100}%` }}></div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="space-y-4">
            {/* Password Length Control */}
            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="length" className="text-sm font-medium text-gray-300">
                  Length
                </label>
                <span className="text-sm text-blue-400 font-mono">{length}</span>
              </div>
              <input
                type="range"
                id="length"
                min={6}
                max={20}
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">6</span>
                <span className="text-xs text-gray-500">20</span>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    id="number"
                    checked={number}
                    onChange={() => setNumber(prev => !prev)}
                    className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
                  />
                  <div className={`absolute w-8 h-4 ${number ? "bg-blue-500" : "bg-slate-600"} rounded-full transition-colors duration-200 left-0 -z-10`}></div>
                </div>
                <label htmlFor="number" className="ml-4 text-sm font-medium text-gray-300">
                  Include Numbers (0-9)
                </label>
              </div>
              <div className="flex items-center">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    id="char"
                    checked={chars}
                    onChange={() => setChar(prev => !prev)}
                    className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
                  />
                  <div className={`absolute w-8 h-4 ${chars ? "bg-blue-500" : "bg-slate-600"} rounded-full transition-colors duration-200 left-0 -z-10`}></div>
                </div>
                <label htmlFor="char" className="ml-4 text-sm font-medium text-gray-300">
                  Include Symbols (!@#$%)
                </label>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={passwordGen}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <span className="mr-2">↻</span>
              Generate New Password
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-900 p-3 text-center">
          <p className="text-gray-500 text-xs">
            Your passwords are generated locally and never stored
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;