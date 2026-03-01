

import app from "./app";
import { connectDB } from "./config/db.config";
import { ENV } from "./config/env.config";

const startServer = async (): Promise<void> => {
    await connectDB();

    app.listen(ENV.PORT, () => {
        console.log(` ChatScope API running on http://localhost:${ENV.PORT}`);
        console.log(`Environment: ${ENV.NODE_ENV}`);
        console.log(` Health: http://localhost:${ENV.PORT}/health`);
    });
};

startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});
