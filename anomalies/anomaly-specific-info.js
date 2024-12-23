// Initialize the global anomaly infos object
window.anomalyInfos = {};

// Function to register a new anomaly's info
function registerAnomalySpecificInfo(type, info) {
    window.anomalyInfos[type] = info;
} 