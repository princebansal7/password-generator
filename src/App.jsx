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
        const specials = "!@#$%^&*_+-=|<>?`~";
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

    // calling passworGenerator function using callback hook to prevent infinte renders
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
                <div className="flex shadow text-3xl rounded-full overflow-hidden mb-6">
                    <input
                        className="outline-none w-full py-3 px-5 text-green-600 bg-white text-2xl rounded-l-full"
                        type="text"
                        value={password}
                        placeholder="xg@3k!l"
                        readOnly
                        ref={passwordInputRef}
                    />
                    <button
                        onClick={copyPasswordToClipboard}
                        className="bg-blue-600 hover:bg-blue-800 text-white px-6 py-3 rounded-r-full transition-colors duration-200 text-lg font-semibold"
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
                    <div className="flex justify-between mb-0 text-sm text-blue-300 px-1">
                        <span>Min: 7</span>
                        <span>Max: 69</span>
                    </div>
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
                            Numbers
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
                            Special Characters
                        </label>
                    </div>
                </div>
                <footer className="max-w-md mx-auto mt-8 px-6 py-4 rounded-xl bg-gray-800 text-blue-400 text-center shadow-2xl">
                    © {new Date().getFullYear()} ·{" "}
                    <a
                        href="https://princebansal.in"
                        className="text-blue-400 hover:underline"
                        target="_blank"
                    >
                        princebansal.in
                    </a>{" "}
                </footer>
            </div>
        </>
    );
}

export default App;
