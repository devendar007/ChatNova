let cleanupTimeout;

export const getWebContainer = async () => {
    if (webContainerInstance === null) {
        webContainerInstance = await WebContainer.boot();
    }

    // Reset cleanup timeout
    if (cleanupTimeout) clearTimeout(cleanupTimeout);
    cleanupTimeout = setTimeout(() => {
        webContainerInstance = null; // Release instance
        console.log("WebContainer released due to inactivity.");
    }, 60000); // 60 seconds of inactivity

    return webContainerInstance;
};
