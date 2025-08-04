import { useCallback, useEffect, useRef, useState } from "react";

function App() {
    const [length, setLength] = useState(7);
    const [includeNum, setIncludeNum] = useState(false);
    const [includeSpecialChars, setIncludeSpecialChars] = useState(false);
    const [password, setPassword] = useState("");
    const passwordInputRef = useRef(null);

    // function to generator random password
    const passwordGenerator = useCallback(() => {
        let pass = "";
        let tempPass = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        if (includeNum) tempPass += "0123456789";
        if (includeSpecialChars) tempPass += "!@#$%^&*_+-=|<>?`~";
        for (let i = 1; i <= length; i++) {
            const index = Math.floor(Math.random() * tempPass.length + 1);
            pass += tempPass.charAt(index);
        }
        setPassword(pass);
    }, [length, includeSpecialChars, includeNum]);

    const copyPasswordToClipboard = useCallback(() => {
        passwordInputRef.current?.select();
        window.navigator.clipboard.writeText(password);
    }, [password]);

    // calling passworGenerator function using callback hook to prevent infinte renders
    useEffect(() => {
        passwordGenerator();
    }, [length, includeSpecialChars, includeNum, passwordGenerator]);

    return (
        <>
            <div className="max-w-md mx-auto shadow-md rounded-2xl bg-gray-900 px-6 py-8 my-16 text-white">
                <h1 className="text-center text-4xl mb-6 text-blue-200">
                    Password Generator
                </h1>
                <div className="flex shadow text-3xl rounded-full overflow-hidden mb-6">
                    <input
                        className="outline-none w-full py-3 px-5 text-green-700 bg-white text-xl rounded-l-full"
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
                        <label className="text-lg text-blue-300 font-medium">
                            Length <span className="font-bold">{length}</span>
                        </label>
                    </div>
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
                <footer className="max-w-md mx-auto mt-8 px-6 py-4 rounded-xl bg-gray-800 text-gray-300 text-center shadow-md">
                    <a
                        href="https://princebansal.tech"
                        className="text-blue-400 hover:underline"
                        target="_blank"
                    >
                        princebansal.tech
                    </a>{" "}
                    © {new Date().getFullYear()}
                </footer>
            </div>
        </>
    );
}

export default App;
