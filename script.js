document.addEventListener('DOMContentLoaded', function() {
    // Select the container div
    var container = document.getElementById('all');

    // Loop to create and append 2 divs
    for (var i = 0; i < 2; i++) {
        // Create the parent div
        var flagDiv = document.createElement('div');
        flagDiv.classList.add('flag');

        // Create div for SVG image
        var svgDiv = document.createElement('div');
        svgDiv.classList.add('svg-container');

        // Create an SVG element with the XML namespace for SVG
        var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgElement.setAttribute("width", "50"); // Adjust the width of the SVG container as needed
        svgElement.setAttribute("height", "50"); // Adjust the height of the SVG container as needed

        // Create an example SVG path element (replace this with your own SVG content)
        var pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathElement.setAttribute("d", "M10 10 L30 30 L10 30 Z"); // Example path data
        pathElement.setAttribute("fill", "blue"); // Example fill color

        // Append the path element to the SVG element
        svgElement.appendChild(pathElement);

        // Append the SVG element to the SVG container
        svgDiv.appendChild(svgElement);

        // Create div for text
        var textDiv = document.createElement('div');
        textDiv.classList.add('text-container');
        textDiv.textContent = 'Flag ' + (i + 1);

        // Append child divs to the parent div
        flagDiv.appendChild(svgDiv);
        flagDiv.appendChild(textDiv);

        // Append the parent div to the container
        container.appendChild(flagDiv);
    }
});
