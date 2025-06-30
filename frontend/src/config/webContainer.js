let webContainerInstance = null;
let cleanupTimeout;

export const getWebContainer = async () => {
    if (typeof window === "undefined") {
        // Not in a browser environment
        throw new Error("WebContainer can only be initialized in the browser.");
    }

    if (webContainerInstance === null) {
        // Dynamically import only in browser
        const { WebContainer } = await import('@webcontainer/api');
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