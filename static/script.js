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
        // Prepare the data to be sent in the POST request
        var data = { flag: selectedFlag };

        // Send a POST request to the server
        fetch('/your-endpoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response from the server if needed
            console.log('Success:', data);
            alert("Request sent for " + selectedFlag);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    } else {
        alert("Please select a flag first.");
    }
}
