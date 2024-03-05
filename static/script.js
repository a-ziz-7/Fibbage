var selectedFlag = null;

function selectFlag(flag) {
    if (selectedFlag == flag) {
        document.querySelector("." + flag + " img").classList.remove("selected");
        selectedFlag = null;
    } else {
        // Check if there is a previously selected flag and remove the 'selected' class
        if (selectedFlag) {
            document.querySelector("." + selectedFlag + " img").classList.remove("selected");
        }

        // Set the newly selected flag and add the 'selected' class to its image
        selectedFlag = flag;
        document.querySelector("." + flag + " img").classList.add("selected");
    }
}

function sendRequest() {
    if (selectedFlag) {
        alert("Request sent for " + selectedFlag);
    } else {
        alert("Please select a flag first.");
    }
}
