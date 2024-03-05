var selectedFlag = null;

function selectFlag(flag) {
    // Reset previously selected flag
    if (selectedFlag) {
        document.querySelector("." + selectedFlag).classList.remove("selected");
    }

    // Set the newly selected flag
    selectedFlag = flag;
    document.querySelector("." + flag).classList.add("selected");
}

function sendRequest() {
    if (selectedFlag) {
        // Perform the action or send the request here
        alert("Request sent for " + selectedFlag);
    } else {
        alert("Please select a flag first.");
    }
}
