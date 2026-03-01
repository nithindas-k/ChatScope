import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    UploadCloud, FileText, CheckCircle2, AlertCircle,
    Radar, Sparkles, ArrowRight, Zap, Shield, BarChart3,
    Check
} from "lucide-react";
import { chatApiService } from "../services/chatApi";
import { useChatStore } from "../stores/chatStore";
import { Card, CardContent } from "../components/ui/card";

const features = [
    { icon: Zap, label: "Instant Analysis", desc: "Get results in seconds" },
    { icon: Shield, label: "Private & Secure", desc: "Nothing stored online" },
    { icon: BarChart3, label: "Deep Insights", desc: "AI-powered breakdown" },
];

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { setSession, setLoading, isLoading } = useChatStore();
    const navigate = useNavigate();

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setError(null);
        if (acceptedFiles.length > 0) {
            const selected = acceptedFiles[0];
            if (!selected.name.endsWith(".txt")) {
                setError("Only .txt WhatsApp export files are allowed.");
                setFile(null);
            } else {
                setFile(selected);
            }
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "text/plain": [".txt"] },
        maxFiles: 1,
        multiple: false,
    });

    const handleUpload = async () => {
        if (!file) return;
        try {
            setLoading(true);
            setError(null);
            const response = await chatApiService.uploadChat(file);
            if (response.success && response.data) {
                const { sessionId, fileName, totalMessages, participants } = response.data;
                setSession(sessionId, fileName, totalMessages, participants);
                navigate("/dashboard");
            } else {
                setError(response.message || "Failed to parse the chat file.");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred. Ensure the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-area" style={{
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "min(5vh, 40px) 20px",
            minHeight: "calc(100vh - 72px)", // Navbar is 72px
        }}>
            {/* Background Aesthetic Glows */}
            <div style={{
                position: "absolute", top: "5%", right: "-10%",
                width: "min(600px, 80vw)", height: "min(600px, 80vw)", borderRadius: "50%",
                background: "radial-gradient(circle, rgba(0,168,132,0.08) 0%, transparent 70%)",
                zIndex: 0, pointerEvents: "none"
            }} />
            <div style={{
                position: "absolute", bottom: "-5%", left: "-10%",
                width: "min(500px, 70vw)", height: "min(500px, 70vw)", borderRadius: "50%",
                background: "radial-gradient(circle, rgba(37,211,102,0.05) 0%, transparent 70%)",
                zIndex: 0, pointerEvents: "none"
            }} />

            <div style={{
                width: "100%",
                maxWidth: 950,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
                gap: "clamp(1.5rem, 3vw, 2.5rem)",
                alignItems: "center",
                margin: "0 auto",
                position: "relative",
                zIndex: 1,
            }}>

                {/* Left: Hero Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{
                        padding: "0 10px",
                    }}
                >
                    {/* Badge */}
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: 10,
                        padding: "6px 14px", borderRadius: 99,
                        background: "rgba(0,168,132,0.08)", border: "1px solid rgba(0,168,132,0.2)",
                        color: "#00a884", fontSize: "min(12px, 3vw)", fontWeight: 700,
                        textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "clamp(16px, 4vh, 28px)",
                    }}>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles size={14} />
                        </motion.div>
                        AI Analysis
                    </div>

                    <h1 style={{
                        fontSize: "clamp(28px, 5vw, 42px)",
                        fontWeight: 900,
                        color: "#e9edef",
                        lineHeight: 1.1,
                        letterSpacing: "-0.03em",
                        marginBottom: "clamp(12px, 2vh, 16px)",
                    }}>
                        Unlock Hidden <br />
                        <span style={{
                            background: "linear-gradient(90deg, #00a884, #25d366)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent"
                        }}>Chat Intelligence</span>
                    </h1>

                    <p style={{
                        color: "#8696a0", fontSize: "clamp(13px, 1.8vw, 15px)", lineHeight: 1.6,
                        marginBottom: "clamp(20px, 4vh, 32px)", maxWidth: 440,
                    }}>
                        Deep-dive into your conversations. Discover sentiment shifts,
                        and AI-generated personality insights in seconds.
                    </p>

                    {/* Feature Cards */}
                    <div style={{ display: "grid", gap: 12 }}>
                        {features.map((f, i) => (
                            <motion.div
                                key={f.label}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                style={{
                                    display: "flex", alignItems: "center", gap: 12,
                                    background: "linear-gradient(135deg, rgba(24,38,48,0.6) 0%, rgba(24,38,48,0.3) 100%)",
                                    border: "1px solid rgba(42,57,66,0.3)",
                                    borderRadius: 14, padding: "8px 12px",
                                    backdropFilter: "blur(10px)",
                                }}
                            >
                                <div style={{
                                    width: 32, height: 32, borderRadius: 10,
                                    background: "rgba(0,168,132,0.1)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    border: "1px solid rgba(0,168,132,0.15)",
                                    flexShrink: 0,
                                }}>
                                    <f.icon size={16} color="#00a884" />
                                </div>
                                <div style={{ minWidth: 0 }}>
                                    <h4 style={{ color: "#e9edef", fontSize: 13, fontWeight: 700, margin: 0 }}>{f.label}</h4>
                                    <p style={{ color: "#8696a0", fontSize: 11, marginTop: 1, margin: 0 }}>{f.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Right: Upload Interface */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    style={{ position: "relative", width: "100%", maxWidth: 420, justifySelf: "center" }}
                >
                    <Card style={{
                        background: "#111b21",
                        border: "1px solid #202c33",
                        borderRadius: "clamp(20px, 4vw, 32px)",
                        boxShadow: "0 24px 64px -12px rgba(0,0,0,0.5)",
                        overflow: "hidden"
                    }}>
                        <CardContent style={{ padding: 0 }}>
                            <AnimatePresence mode="wait">
                                {isLoading ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "64px 32px", gap: 32 }}
                                    >
                                        <div style={{ position: "relative", width: 140, height: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {[1, 2, 3].map((i) => (
                                                <motion.div
                                                    key={i}
                                                    style={{
                                                        position: "absolute", width: "100%", height: "100%",
                                                        borderRadius: "50%", border: "2px solid #00a884"
                                                    }}
                                                    initial={{ opacity: 0.4, scale: 0.5 }}
                                                    animate={{ opacity: 0, scale: 1.4 }}
                                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}
                                                />
                                            ))}
                                            <div style={{
                                                width: 80, height: 80, borderRadius: "50%",
                                                background: "rgba(0,168,132,0.1)", border: "1px solid rgba(0,168,132,0.3)",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                boxShadow: "0 0 40px rgba(0,168,132,0.2)",
                                            }}>
                                                <Radar size={36} color="#00a884" className="animate-spin" style={{ animationDuration: "3s" }} />
                                            </div>
                                        </div>
                                        <div style={{ textAlign: "center" }}>
                                            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#e9edef", margin: 0 }}>Decrypting Patterns</h3>
                                            <p style={{ color: "#8696a0", fontSize: 14, marginTop: 8 }}>AI is scanning your conversation history...</p>
                                        </div>
                                        <div style={{ width: "100%", height: 6, background: "#1c272e", borderRadius: 99, overflow: "hidden" }}>
                                            <motion.div
                                                style={{ height: "100%", background: "linear-gradient(90deg, #00a884, #25d366)" }}
                                                initial={{ width: "0%" }}
                                                animate={{ width: "90%" }}
                                                transition={{ duration: 8, ease: "linear" }}
                                            />
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="upload"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        style={{ padding: "clamp(20px, 4vw, 32px)", display: "flex", flexDirection: "column", gap: "clamp(20px, 3vh, 28px)" }}
                                    >
                                        {/* Premium Dropzone */}
                                        <div
                                            {...getRootProps()}
                                            style={{
                                                position: "relative",
                                                borderRadius: 24,
                                                border: "2px dashed",
                                                borderColor: isDragActive ? "#00a884" : error ? "#f15c6d" : file ? "#00a884" : "#2a3942",
                                                backgroundColor: isDragActive ? "rgba(0,168,132,0.1)" : error ? "rgba(241,92,109,0.05)" : file ? "rgba(0,168,132,0.05)" : "rgba(24,38,48,0.4)",
                                                cursor: "pointer",
                                                transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                                padding: "clamp(24px, 6vh, 48px) 16px", textAlign: "center", minHeight: "clamp(180px, 25vh, 230px)",
                                            }}
                                            className="group"
                                        >
                                            <input {...getInputProps()} />

                                            <AnimatePresence mode="wait">
                                                {file ? (
                                                    <motion.div
                                                        key="file-active"
                                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}
                                                    >
                                                        <div style={{
                                                            width: 80, height: 80, borderRadius: 24,
                                                            background: "linear-gradient(135deg, rgba(0,168,132,0.15) 0%, rgba(0,168,132,0.05) 100%)",
                                                            border: "1px solid rgba(0,168,132,0.4)",
                                                            display: "flex", alignItems: "center", justifyContent: "center",
                                                            boxShadow: "0 12px 24px rgba(0,0,0,0.3)",
                                                        }}>
                                                            <FileText size={40} color="#00a884" />
                                                        </div>
                                                        <div>
                                                            <p style={{ color: "#e9edef", fontWeight: 800, fontSize: 18, margin: 0 }}>{file.name}</p>
                                                            <p style={{ color: "#8696a0", fontSize: 14, marginTop: 6 }}>{(file.size / 1024).toFixed(1)} KB • Chat Archive</p>
                                                        </div>
                                                        <div style={{
                                                            display: "flex", alignItems: "center", gap: 10,
                                                            padding: "8px 20px", borderRadius: 99,
                                                            backgroundColor: "rgba(0,168,132,0.1)",
                                                            border: "1px solid rgba(0,168,132,0.25)",
                                                        }}>
                                                            <CheckCircle2 size={16} color="#00a884" />
                                                            <span style={{ fontSize: 12, fontWeight: 700, color: "#00a884", textTransform: "uppercase", letterSpacing: "0.05em" }}>Authenticated</span>
                                                        </div>
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key="idle"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}
                                                    >
                                                        <div
                                                            style={{
                                                                width: 80, height: 80, borderRadius: 24,
                                                                backgroundColor: "#1c272e", border: "1px solid #2a3942",
                                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                                transition: "all 0.4s",
                                                            }}
                                                            className="group-hover:border-[#00a884]/60 group-hover:scale-110 group-hover:bg-[#202c33]"
                                                        >
                                                            <UploadCloud
                                                                size={40}
                                                                style={{
                                                                    color: isDragActive ? "#00a884" : "#8696a0",
                                                                    transition: "all 0.3s"
                                                                }}
                                                                className="group-hover:text-[#00a884]"
                                                            />
                                                        </div>
                                                        <div>
                                                            <p style={{
                                                                color: "#e9edef", fontWeight: 750, fontSize: 18, margin: 0,
                                                            }}>
                                                                {isDragActive ? "Release to Analyze" : "Upload your chat file"}
                                                            </p>
                                                            <p style={{ color: "#8696a0", fontSize: 15, marginTop: 8 }}>
                                                                Drop its archive here or <span style={{ color: "#00a884", fontWeight: 700 }}>browse</span>
                                                            </p>
                                                            <div style={{
                                                                marginTop: 20, padding: "4px 12px", borderRadius: 8,
                                                                background: "#1c272e", display: "inline-block",
                                                                fontSize: 11, fontWeight: 700, color: "#4a6070",
                                                                textTransform: "uppercase", letterSpacing: "0.05em"
                                                            }}>
                                                                .TXT Format Only
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Error Container */}
                                        <AnimatePresence>
                                            {error && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10, height: 0 }}
                                                    animate={{ opacity: 1, y: 0, height: "auto" }}
                                                    exit={{ opacity: 0, y: -10, height: 0 }}
                                                >
                                                    <div style={{
                                                        display: "flex", alignItems: "center", gap: 14,
                                                        padding: "16px 20px", borderRadius: 16,
                                                        backgroundColor: "rgba(241,92,109,0.1)",
                                                        border: "1px solid rgba(241,92,109,0.25)",
                                                    }}>
                                                        <AlertCircle size={18} color="#f15c6d" />
                                                        <p style={{ color: "#f15c6d", fontSize: 13, fontWeight: 600, margin: 0 }}>{error}</p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Primary Action */}
                                        <button
                                            onClick={handleUpload}
                                            disabled={!file}
                                            style={{
                                                width: "100%", height: "clamp(52px, 8vh, 58px)", borderRadius: 16,
                                                fontSize: 15, fontWeight: 900,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                gap: 12, cursor: file ? "pointer" : "not-allowed",
                                                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                                                border: "none",
                                                background: file
                                                    ? "linear-gradient(135deg, #00a884 0%, #25d366 100%)"
                                                    : "#1c272e",
                                                color: file ? "#0b141a" : "#4a6070",
                                                boxShadow: file ? "0 16px 40px rgba(0,168,132,0.3)" : "none",
                                                position: "relative",
                                                overflow: "hidden"
                                            }}
                                            className={file ? "hover:scale-[1.02] hover:translate-y-[-2px] active:scale-[0.98]" : ""}
                                        >
                                            {file && <div style={{
                                                position: "absolute", top: 0, left: "-100%",
                                                width: "100%", height: "100%",
                                                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                                                animation: "shimmer 3s infinite",
                                            }} />}
                                            <style>{`
                                                @keyframes shimmer {
                                                    0% { left: -100%; }
                                                    100% { left: 100%; }
                                                }
                                            `}</style>
                                            Begin Neural Analysis
                                            <ArrowRight size={20} style={{ transform: file ? "translateX(0)" : "translateX(-8px)", transition: "all 0.3s" }} />
                                        </button>

                                        {/* Interaction Logic Stepper */}
                                        <div style={{
                                            display: "flex", alignItems: "center", justifyContent: "space-between",
                                            padding: "10px 10px", borderRadius: 16, background: "rgba(24,38,48,0.5)",
                                            border: "1px solid rgba(42,57,66,0.3)"
                                        }}>
                                            {[
                                                { id: 1, label: "Export" },
                                                { id: 2, label: "Unmedia" },
                                                { id: 3, label: "Analyze" }
                                            ].map((step, i) => (
                                                <div key={step.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                    <div style={{
                                                        width: 22, height: 22, borderRadius: "50%",
                                                        backgroundColor: i === 2 && file ? "#00a884" : "#1c272e",
                                                        border: "1px solid",
                                                        borderColor: i === 2 && file ? "#00a884" : "#2a3942",
                                                        color: i === 2 && file ? "#0b141a" : "#8696a0",
                                                        fontSize: 11, fontWeight: 900,
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                        transition: "all 0.4s"
                                                    }}>
                                                        {i === 2 && file ? <Check size={12} strokeWidth={4} /> : step.id}
                                                    </div>
                                                    <span style={{
                                                        fontSize: 12, fontWeight: 700,
                                                        color: (i === 2 && file) || (i === 1) || (i === 0) ? "#e9edef" : "#4a6070",
                                                        transition: "all 0.4s",
                                                        textTransform: "uppercase", letterSpacing: "0.02em"
                                                    }}>
                                                        {step.label}
                                                    </span>
                                                    {i < 2 && <div style={{ width: 12, height: 1, backgroundColor: "#2a3942", marginLeft: 4 }} />}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
