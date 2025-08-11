import { useCallback, useEffect, useRef, useState } from "react";

function App() {
    const [length, setLength] = useState(7);
    const [includeNum, setIncludeNum] = useState(true);
    const [includeSpecialChars, setIncludeSpecialChars] = useState(true);
    const [password, setPassword] = useState("");
    const [lengthInput, setLengthInput] = useState(String(length));
    const passwordInputRef = useRef(null);

    // function to generator random password
    const passwordGenerator = useCallback(() => {
        const upperLower =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        const numbers = "0123456789";
        const specials = "!@#$%^&*_+-=[]{}()<>?`~";
        let allChars = upperLower;
        let requiredChars = "";
        if (includeNum) {
            allChars += numbers;
            requiredChars +=
                numbers[Math.floor(Math.random() * numbers.length)];
        }
        if (includeSpecialChars) {
            allChars += specials;
            requiredChars +=
                specials[Math.floor(Math.random() * specials.length)];
        }
        // Ensure at least 1 letter character too
        requiredChars +=
            upperLower[Math.floor(Math.random() * upperLower.length)];
        // Fill the rest of the password length
        let remainingLength = length - requiredChars.length;
        let remainingChars = "";
        for (let i = 0; i < remainingLength; i++) {
            remainingChars +=
                allChars[Math.floor(Math.random() * allChars.length)];
        }
        // Combine and shuffle the required and remaining characters
        let finalPassword = (requiredChars + remainingChars)
            .split("")
            .sort(() => Math.random() - 0.5)
            .join("");

        setPassword(finalPassword);
    }, [length, includeSpecialChars, includeNum]);

    const copyPasswordToClipboard = useCallback(() => {
        passwordInputRef.current?.select();
        window.navigator.clipboard.writeText(password);
    }, [password]);

    // Reload handler for the reload button
    const handleReloadPassword = useCallback(() => {
        passwordGenerator();
    }, [passwordGenerator]);

    // calling passwordGenerator function using callback hook to prevent infinite renders
    useEffect(() => {
        passwordGenerator();
    }, [length, includeSpecialChars, includeNum, passwordGenerator]);

    // when user updates length
    useEffect(() => {
        setLengthInput(String(length));
    }, [length]);

    return (
        <>
            <div className="max-w-md mx-auto shadow-md rounded-2xl bg-gray-900 px-6 py-8 my-16 text-white">
                <h1 className="text-center text-3xl mb-6 text-blue-300">
                    Password Generator
                </h1>
                <div className="flex shadow text-3xl rounded-full overflow-hidden mb-6 relative">
                    <input
                        className="outline-none w-full py-3 px-5 text-green-600 bg-white text-2xl rounded-l-full border-none focus:border-none focus:outline-none"
                        type="text"
                        value={password}
                        placeholder="xg@3k!l"
                        readOnly
                        ref={passwordInputRef}
                    />
                    {/* Reload Button */}
                    <button
                        onClick={handleReloadPassword}
                        aria-label="Reload password"
                        className="flex items-center justify-center bg-white text-blue-600 px-0 py-0 transition-colors duration-200 text-2xl font-bold border-none focus:outline-none"
                        style={{
                            width: "3rem",
                            minWidth: "3rem",
                            height: "auto",
                            borderRadius: 0,
                            border: "none",
                            boxShadow: "none",
                            outline: "none",
                        }}
                        tabIndex={0}
                        type="button"
                    >
                        <svg
                            viewBox="-10.32 -10.32 44.64 44.64"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g
                                id="SVGRepo_tracerCarrier"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M13.7071 1.29289C14.0976 1.68342 14.0976 2.31658 13.7071 2.70711L12.4053 4.00896C17.1877 4.22089 21 8.16524 21 13C21 17.9706 16.9706 22 12 22C7.02944 22 3 17.9706 3 13C3 12.4477 3.44772 12 4 12C4.55228 12 5 12.4477 5 13C5 16.866 8.13401 20 12 20C15.866 20 19 16.866 19 13C19 9.2774 16.0942 6.23349 12.427 6.01281L13.7071 7.29289C14.0976 7.68342 14.0976 8.31658 13.7071 8.70711C13.3166 9.09763 12.6834 9.09763 12.2929 8.70711L9.29289 5.70711C9.10536 5.51957 9 5.26522 9 5C9 4.73478 9.10536 4.48043 9.29289 4.29289L12.2929 1.29289C12.6834 0.902369 13.3166 0.902369 13.7071 1.29289Z"
                                    fill="#0F1729"
                                />
                            </g>
                        </svg>
                    </button>
                    <button
                        onClick={copyPasswordToClipboard}
                        className="bg-blue-600 hover:bg-blue-800 text-white px-6 py-3 rounded-r-full transition-colors duration-200 text-lg font-semibold"
                        type="button"
                    >
                        Copy
                    </button>
                </div>
                <div className="space-y-5">
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min={7}
                            max={69}
                            value={length}
                            className="w-full accent-blue-500"
                            onChange={e => {
                                setLength(Number(e.target.value));
                            }}
                        />
                    </div>
                    {/* Length input and controls */}
                    <div className="flex items-center justify-center gap-4 my-4">
                        <button
                            type="button"
                            aria-label="Decrease length"
                            disabled={length <= 7}
                            onClick={() =>
                                setLength(length > 7 ? length - 1 : 7)
                            }
                            className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-colors duration-200 text-2xl font-bold
                                ${
                                    length <= 7
                                        ? "bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 border-blue-500 text-white hover:bg-blue-700 hover:border-blue-700 cursor-pointer"
                                }`}
                            style={{
                                minWidth: "2.5rem",
                                minHeight: "2.5rem",
                                borderRadius: "9999px",
                            }}
                        >
                            –
                        </button>
                        <input
                            type="text"
                            value={lengthInput}
                            className="w-20 px-3 py-1 my-0 text-center text-blue-900 bg-white rounded-md border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={e => {
                                const val = e.target.value;
                                setLengthInput(val);
                                const num = Number(val);
                                if (!isNaN(num) && num >= 7 && num <= 69) {
                                    setLength(num);
                                }
                            }}
                            onBlur={() => {
                                const num = Number(lengthInput);
                                if (isNaN(num) || num < 7) {
                                    setLength(7);
                                } else if (num > 69) {
                                    setLength(69);
                                }
                            }}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="Length"
                        />
                        <button
                            type="button"
                            aria-label="Increase length"
                            disabled={length >= 69}
                            onClick={() =>
                                setLength(length < 69 ? length + 1 : 69)
                            }
                            className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-colors duration-200 text-2xl font-bold
                                ${
                                    length >= 69
                                        ? "bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 border-blue-500 text-white hover:bg-blue-700 hover:border-blue-700 cursor-pointer"
                                }`}
                            style={{
                                minWidth: "2.5rem",
                                minHeight: "2.5rem",
                                borderRadius: "9999px",
                            }}
                        >
                            +
                        </button>
                    </div>
                    {/* Numbers and Special Characters checkboxes */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={includeNum}
                            id="numberCheckbox"
                            className="w-5 h-5 accent-blue-600"
                            onChange={() => {
                                setIncludeNum(prev => !prev);
                            }}
                        />
                        <label
                            htmlFor="numberCheckbox"
                            className="text-lg text-blue-300"
                        >
                            123
                        </label>
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={includeSpecialChars}
                            id="specialCharCheckbox"
                            className="w-5 h-5 accent-blue-600"
                            onChange={() => {
                                setIncludeSpecialChars(prev => !prev);
                            }}
                        />
                        <label
                            htmlFor="specialCharCheckbox"
                            className="text-lg text-blue-300"
                        >
                            @#&
                        </label>
                    </div>
                </div>
                <footer className="max-w-md mx-auto mt-8 px-6 py-4 rounded-xl bg-gray-800 text-blue-400 text-center shadow-2xl">
                    © {new Date().getFullYear()} ·{" "}
                    <a
                        href="https://princebansal.in"
                        className="text-blue-400 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        princebansal.in
                    </a>{" "}
                </footer>
            </div>
        </>
    );
}

export default App;
