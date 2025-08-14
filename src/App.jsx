import { useCallback, useEffect, useRef, useState } from "react";

function App() {
    const [length, setLength] = useState(12);
    const [includeNum, setIncludeNum] = useState(true);
    const [includeSpecialChars, setIncludeSpecialChars] = useState(true);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [password, setPassword] = useState("");
    const [lengthInput, setLengthInput] = useState(String(length));
    const [copied, setCopied] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const passwordInputRef = useRef(null);

    // function to generate random password
    const passwordGenerator = useCallback(() => {
        setIsGenerating(true);

        setTimeout(() => {
            const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const lowercase = "abcdefghijklmnopqrstuvwxyz";
            const numbers = "0123456789";
            const specials = "!@#$%^&*_+-=[]{}()<>?`~";

            let allChars = "";
            let requiredChars = "";

            if (includeUppercase) {
                allChars += uppercase;
                requiredChars +=
                    uppercase[Math.floor(Math.random() * uppercase.length)];
            }
            if (includeLowercase) {
                allChars += lowercase;
                requiredChars +=
                    lowercase[Math.floor(Math.random() * lowercase.length)];
            }
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

            // If no character types are selected, return empty password
            if (allChars === "") {
                setPassword("");
                setIsGenerating(false);
                return;
            }

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
            setIsGenerating(false);
        }, 300);
    }, [
        length,
        includeSpecialChars,
        includeNum,
        includeUppercase,
        includeLowercase,
    ]);

    const copyPasswordToClipboard = useCallback(async () => {
        if (password) {
            try {
                await navigator.clipboard.writeText(password);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch {
                passwordInputRef.current?.select();
                document.execCommand("copy");
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        }
    }, [password]);

    // Reload handler for the reload button
    const handleReloadPassword = useCallback(() => {
        passwordGenerator();
    }, [passwordGenerator]);

    // calling passwordGenerator function using callback hook to prevent infinite renders
    useEffect(() => {
        passwordGenerator();
    }, [
        length,
        includeSpecialChars,
        includeNum,
        includeUppercase,
        includeLowercase,
        passwordGenerator,
    ]);

    // when user updates length
    useEffect(() => {
        setLengthInput(String(length));
    }, [length]);

    // Ensure at least one checkbox is always selected
    const handleCheckboxChange = (type, value) => {
        const newValue = !value;

        // If trying to uncheck and it's the only one selected, prevent it
        if (!newValue) {
            const activeCount = [
                includeUppercase,
                includeLowercase,
                includeNum,
                includeSpecialChars,
            ].filter(Boolean).length;

            if (activeCount <= 1) {
                return; // Don't allow unchecking if it's the last one
            }
        }

        switch (type) {
            case "uppercase":
                setIncludeUppercase(newValue);
                break;
            case "lowercase":
                setIncludeLowercase(newValue);
                break;
            case "numbers":
                setIncludeNum(newValue);
                break;
            case "special":
                setIncludeSpecialChars(newValue);
                break;
        }
    };

    const getPasswordStrength = () => {
        let score = 0;
        if (includeUppercase) score++;
        if (includeLowercase) score++;
        if (includeNum) score++;
        if (includeSpecialChars) score++;
        if (length >= 12) score++;
        if (length >= 16) score++;

        if (score <= 2)
            return { level: "Weak", color: "text-red-400", bg: "bg-red-500" };
        if (score <= 4)
            return {
                level: "Medium",
                color: "text-yellow-400",
                bg: "bg-yellow-500",
            };
        return { level: "Strong", color: "text-green-400", bg: "bg-green-500" };
    };

    const strength = getPasswordStrength();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 flex items-center justify-center p-4">
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-slate-300 rounded-full opacity-20 animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${2 + Math.random() * 3}s`,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Main Container */}
                <div
                    className="bg-slate-700/80 backdrop-blur-sm rounded-3xl p-8 shadow-separated border border-slate-600/50 animate-fadeInUp card-hover"
                    style={{ animation: "fadeInUp 0.8s ease-out" }}
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-500 to-slate-600 rounded-full mb-4 float">
                            <svg
                                className="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-100 to-slate-200 bg-clip-text text-transparent mb-2">
                            Password Generator
                        </h1>
                        <p className="text-slate-200 text-sm">
                            Create secure passwords instantly
                        </p>
                    </div>

                    {/* Password Display */}
                    <div className="mb-8">
                        <div className="relative group">
                            <div className="flex items-center bg-slate-800/60 backdrop-blur-sm rounded-2xl p-1 border border-slate-500/50 transition-all duration-300 hover:border-slate-400/70 hover:shadow-lg">
                                <input
                                    ref={passwordInputRef}
                                    className="flex-1 bg-transparent text-white text-lg font-mono px-4 py-3 outline-none placeholder-slate-300 placeholder:text-sm"
                                    type="text"
                                    value={password}
                                    placeholder="Password will appear here..."
                                    readOnly
                                />
                                <div className="flex items-center gap-2 pr-2">
                                    {/* Reload Button */}
                                    <button
                                        onClick={handleReloadPassword}
                                        disabled={isGenerating}
                                        className={`p-2 rounded-xl transition-all duration-300 hover:bg-slate-600/50 group/btn ${
                                            isGenerating
                                                ? "opacity-50 cursor-not-allowed"
                                                : "hover:scale-110"
                                        }`}
                                        aria-label="Generate new password"
                                    >
                                        <svg
                                            className={`w-5 h-5 text-white transition-transform duration-300 ${
                                                isGenerating
                                                    ? "loading"
                                                    : "group-hover/btn:rotate-180"
                                            }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                            />
                                        </svg>
                                    </button>

                                    {/* Copy Button */}
                                    <button
                                        onClick={copyPasswordToClipboard}
                                        disabled={!password}
                                        className={`p-2 rounded-xl transition-all duration-300 hover:bg-slate-600/50 group/btn ${
                                            !password
                                                ? "opacity-50 cursor-not-allowed"
                                                : "hover:scale-110"
                                        } ${copied ? "success-animation" : ""}`}
                                        aria-label="Copy password"
                                    >
                                        {copied ? (
                                            <svg
                                                className="w-5 h-5 text-green-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                className="w-5 h-5 text-white group-hover/btn:text-slate-200"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Copy feedback */}
                            {copied && (
                                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-lg text-sm animate-bounce">
                                    Copied!
                                </div>
                            )}
                        </div>

                        {/* Password Strength Indicator */}
                        {password && (
                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-sm text-slate-200">
                                    Strength:
                                </span>
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1">
                                        {[1, 2, 3].map(level => (
                                            <div
                                                key={level}
                                                className={`w-3 h-2 rounded-full transition-all duration-300 ${
                                                    level <=
                                                    (strength.level === "Weak"
                                                        ? 1
                                                        : strength.level ===
                                                          "Medium"
                                                        ? 2
                                                        : 3)
                                                        ? strength.bg
                                                        : "bg-slate-500"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span
                                        className={`text-sm font-medium ${strength.color}`}
                                    >
                                        {strength.level}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Length Control */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-white font-medium">
                                Password Length
                            </label>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() =>
                                        setLength(Math.max(7, length - 1))
                                    }
                                    disabled={length <= 7}
                                    className="w-8 h-8 rounded-full bg-slate-500 hover:bg-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center text-white font-bold"
                                >
                                    -
                                </button>
                                <input
                                    type="text"
                                    value={lengthInput}
                                    onChange={e => {
                                        const val = e.target.value;
                                        setLengthInput(val);
                                        const num = Number(val);
                                        if (
                                            !isNaN(num) &&
                                            num >= 7 &&
                                            num <= 69
                                        ) {
                                            setLength(num);
                                        }
                                    }}
                                    onBlur={() => {
                                        const num = Number(lengthInput);
                                        if (isNaN(num) || num < 7) {
                                            setLength(7);
                                            setLengthInput("7");
                                        } else if (num > 69) {
                                            setLength(69);
                                            setLengthInput("69");
                                        }
                                    }}
                                    className="w-16 text-center bg-slate-600 border border-slate-500 rounded-lg px-2 py-1 text-white font-mono focus:outline-none focus:border-slate-400 transition-colors"
                                    inputMode="numeric"
                                />
                                <button
                                    onClick={() =>
                                        setLength(Math.min(69, length + 1))
                                    }
                                    disabled={length >= 69}
                                    className="w-8 h-8 rounded-full bg-slate-500 hover:bg-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center text-white font-bold"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <input
                            type="range"
                            min="7"
                            max="69"
                            value={length}
                            onChange={e => setLength(Number(e.target.value))}
                            className="w-full"
                            style={{
                                "--value": length,
                                "--min": 7,
                                "--max": 69,
                            }}
                        />
                        <div className="flex justify-between text-xs text-slate-300 mt-1">
                            <span>7</span>
                            <span>69</span>
                        </div>
                    </div>

                    {/* Character Options */}
                    <div className="space-y-4 mb-6">
                        <h3 className="text-white font-medium mb-3">
                            Include Characters
                        </h3>

                        <div className="grid grid-cols-2 gap-3">
                            <div
                                className="flex items-center gap-3 p-3 bg-slate-600/50 rounded-xl hover:bg-slate-500/50 transition-all duration-200 cursor-pointer group"
                                onClick={() =>
                                    handleCheckboxChange(
                                        "uppercase",
                                        includeUppercase
                                    )
                                }
                            >
                                <div
                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                                        includeUppercase
                                            ? "bg-gradient-to-r from-slate-500 to-slate-600 border-transparent"
                                            : "border-slate-400 group-hover:border-slate-300"
                                    }`}
                                >
                                    {includeUppercase && (
                                        <svg
                                            className="w-3 h-3 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    )}
                                </div>
                                <span className="text-white font-medium">
                                    ABC
                                </span>
                            </div>

                            <div
                                className="flex items-center gap-3 p-3 bg-slate-600/50 rounded-xl hover:bg-slate-500/50 transition-all duration-200 cursor-pointer group"
                                onClick={() =>
                                    handleCheckboxChange(
                                        "lowercase",
                                        includeLowercase
                                    )
                                }
                            >
                                <div
                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                                        includeLowercase
                                            ? "bg-gradient-to-r from-slate-500 to-slate-600 border-transparent"
                                            : "border-slate-400 group-hover:border-slate-300"
                                    }`}
                                >
                                    {includeLowercase && (
                                        <svg
                                            className="w-3 h-3 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    )}
                                </div>
                                <span className="text-white font-medium">
                                    abc
                                </span>
                            </div>

                            <div
                                className="flex items-center gap-3 p-3 bg-slate-600/50 rounded-xl hover:bg-slate-500/50 transition-all duration-200 cursor-pointer group"
                                onClick={() =>
                                    handleCheckboxChange("numbers", includeNum)
                                }
                            >
                                <div
                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                                        includeNum
                                            ? "bg-gradient-to-r from-slate-500 to-slate-600 border-transparent"
                                            : "border-slate-400 group-hover:border-slate-300"
                                    }`}
                                >
                                    {includeNum && (
                                        <svg
                                            className="w-3 h-3 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    )}
                                </div>
                                <span className="text-white font-medium">
                                    123
                                </span>
                            </div>

                            <div
                                className="flex items-center gap-3 p-3 bg-slate-600/50 rounded-xl hover:bg-slate-500/50 transition-all duration-200 cursor-pointer group"
                                onClick={() =>
                                    handleCheckboxChange(
                                        "special",
                                        includeSpecialChars
                                    )
                                }
                            >
                                <div
                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                                        includeSpecialChars
                                            ? "bg-gradient-to-r from-slate-500 to-slate-600 border-transparent"
                                            : "border-slate-400 group-hover:border-slate-300"
                                    }`}
                                >
                                    {includeSpecialChars && (
                                        <svg
                                            className="w-3 h-3 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    )}
                                </div>
                                <span className="text-white font-medium">
                                    @#&
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={handleReloadPassword}
                        disabled={isGenerating}
                        className="w-full bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isGenerating ? (
                            <div className="flex items-center justify-center gap-2">
                                <svg
                                    className="w-5 h-5 loading"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                                Generating...
                            </div>
                        ) : (
                            "Generate Password"
                        )}
                    </button>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <div className="bg-slate-700/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-600/30 shadow-separated card-hover">
                        <p className="text-slate-200 text-sm font-medium">
                            © {new Date().getFullYear()} ·{" "}
                            <a
                                href="https://princebansal.in"
                                className="text-slate-300 hover:text-slate-200 transition-colors duration-200 font-semibold underline decoration-slate-400/50 hover:decoration-slate-300"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                princebansal.in
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
