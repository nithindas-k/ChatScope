import { motion } from "framer-motion";
import { ShieldCheck, ServerOff, EyeOff } from "lucide-react";

export default function PrivacyPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-4xl mx-auto space-y-8 p-4 md:p-8"
        >
            <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Privacy Policy</h1>
                <p className="text-[#8696a0] text-lg">Last updated: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-[#182630]/50 border border-[#202c33] rounded-2xl p-6 flex flex-col items-center text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-[#00a884]/20 flex items-center justify-center">
                        <ServerOff size={24} className="text-[#00a884]" />
                    </div>
                    <h3 className="text-white font-bold text-lg">No Storage</h3>
                    <p className="text-[#8696a0] text-sm">Your chats are processed in memory and immediately discarded. Nothing is saved to our databases.</p>
                </div>
                <div className="bg-[#182630]/50 border border-[#202c33] rounded-2xl p-6 flex flex-col items-center text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-[#00a884]/20 flex items-center justify-center">
                        <ShieldCheck size={24} className="text-[#00a884]" />
                    </div>
                    <h3 className="text-white font-bold text-lg">100% Secure</h3>
                    <p className="text-[#8696a0] text-sm">All processing is done securely. Once the session ends, your data is completely wiped.</p>
                </div>
                <div className="bg-[#182630]/50 border border-[#202c33] rounded-2xl p-6 flex flex-col items-center text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-[#00a884]/20 flex items-center justify-center">
                        <EyeOff size={24} className="text-[#00a884]" />
                    </div>
                    <h3 className="text-white font-bold text-lg">Zero Tracking</h3>
                    <p className="text-[#8696a0] text-sm">We do not track the contents of your messages, nor do we use them for training AI models.</p>
                </div>
            </div>

            <div className="space-y-6 text-[#e9edef] bg-[#111b21] p-8 rounded-2xl border border-[#202c33]">
                <section className="space-y-3">
                    <h2 className="text-xl font-bold text-[#00a884]">1. Information Processing</h2>
                    <p className="text-[#8696a0] leading-relaxed">
                        ChatScope is designed with privacy as the core principle. When you upload a WhatsApp chat export, the file is parsed and analyzed entirely within the current session. We do not extract, store, or transmit personally identifiable information outside of the immediate analysis scope required to generate your dashboard.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-bold text-[#00a884]">2. Data Retention</h2>
                    <p className="text-[#8696a0] leading-relaxed">
                        We practice a strict zero-retention policy for chat contents. Uploaded files are kept temporarily in memory or secure temporary storage strictly for the duration of processing, and are permanently wiped immediately after your session ends or you clear your data.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-bold text-[#00a884]">3. AI Analysis</h2>
                    <p className="text-[#8696a0] leading-relaxed">
                        If you utilize the AI Insights features, aggregate, anonymized snippets of metadata might be sent to our AI providers (like Groq) to generate summaries. However, none of this data is retained by us or used by our partners to train their language models.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-bold text-[#00a884]">4. Cookies & Analytics</h2>
                    <p className="text-[#8696a0] leading-relaxed">
                        We use minimal local storage purely to maintain your active session state (e.g., whether you have a file uploaded). We do not use tracking cookies or aggressive third-party analytics that profile your behavior.
                    </p>
                </section>
            </div>
        </motion.div>
    );
}
