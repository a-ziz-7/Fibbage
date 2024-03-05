var selectedFlag = null;

function selectFlag(flag) {
    var button = document.getElementById('my-button');

    if (selectedFlag == flag) {
        document.querySelector("." + flag + " img").classList.remove("selected");
        selectedFlag = null;
        button.style.backgroundColor = 'rgb(185, 135, 43)';
    } else {
        // Check if there is a previously selected flag and remove the 'selected' class
        if (selectedFlag) {
            document.querySelector("." + selectedFlag + " img").classList.remove("selected");
        }
        selectedFlag = flag;
        button.style.backgroundColor = (flag === 'spanish') ? 'red' : 'blue';
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
