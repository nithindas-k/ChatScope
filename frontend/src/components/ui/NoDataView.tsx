import { motion } from "framer-motion";
import { Upload, FileText, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./button";

export default function NoDataView() {
    return (
        <div className="flex items-center justify-center p-6 min-h-[60vh] w-full">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="max-w-sm w-full bg-card/30 backdrop-blur-md border border-white/5 rounded-3xl p-8 text-center shadow-xl"
            >
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-6">
                    <FileText size={28} className="text-primary opacity-80" />
                </div>

                <h2 className="text-xl font-bold text-white mb-2">No Chat Dataset</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                    Please upload your WhatsApp chat export to view this page's analysis.
                </p>

                <div className="space-y-3">
                    <Link to="/" className="block">
                        <Button className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-secondary font-bold gap-2">
                            <Upload size={16} />
                            Upload Chat
                        </Button>
                    </Link>

                    <div className="flex items-center justify-center gap-2 pt-2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                        <Info size={12} />
                        Awaiting data input
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
