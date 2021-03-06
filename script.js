// Default image
let imgURL = "https://source.unsplash.com/random/400x200";

// Filter format:
const cssFilters = [];

// Global variable used for consistent URLs
var img = new Image();
img.crossOrigin = ""; 
img.src = imgURL;

// Global variable
const appliedFilters = [];

const createFilterSliderNode = (filter) => {
    // Filter node (parent)
    const filterNode = document.createElement("div");
    filterNode.className = "filter";

    // Title node
    const nodeTitle = document.createElement("h2");
    nodeTitle.setAttribute("id", `${filter.name}-title`)
    const titleText = document.createTextNode(`${filter.name}: ${filter.default} ${filter.measurement}`);
    nodeTitle.appendChild(titleText);
    filterNode.appendChild(nodeTitle);

    // Slider node
    const sliderNode = document.createElement("input");
    sliderNode.className = "slider";
    sliderNode.setAttribute("type", "range");
    sliderNode.setAttribute("min", filter.min);
    sliderNode.setAttribute("max", filter.max);
    sliderNode.setAttribute("value", filter.default);
    sliderNode.setAttribute("name", filter.name);
    sliderNode.setAttribute("onchange", `applyFilter(this, '${filter.measurement}')`);
    filterNode.appendChild(sliderNode);


    const buttonsParentNode = document.createElement("div");
    buttonsParentNode.className = "filter-buttons";
    filterNode.appendChild(buttonsParentNode);

    // Reset button node
    const resetNode = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    resetNode.setAttribute("class", "reset-button");
    // SVG Paths
    const pathOne = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathOne.setAttribute("stroke", "none");
    pathOne.setAttribute("d", "M0 0h24v24H0z");
    resetNode.appendChild(pathOne);

    const pathTwo = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathTwo.setAttribute("d", "M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -5v5h5");
    resetNode.appendChild(pathTwo);

    const pathThree = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathThree.setAttribute("d", "M4 13a8.1 8.1 0 0 0 15.5 2m.5 5v-5h-5");
    resetNode.appendChild(pathThree);

    resetNode.setAttribute("onclick", `resetFilter('${filter.name}')`);
    resetNode.className = "reset-btn";
    buttonsParentNode.appendChild(resetNode);


    // Decrement button node
    const decrementNode = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    decrementNode.setAttribute("class", "decrement-button");
    decrementNode.setAttribute("onclick", `decrementFilter('${filter.name}')`)
    // SVG Paths
    const decrementPathOne = document.createElementNS("http://www.w3.org/2000/svg", "path");
    decrementPathOne.setAttribute("stroke", "none");
    decrementPathOne.setAttribute("d", "M0 0h24v24H0z");
    decrementNode.appendChild(decrementPathOne);

    const decrementLineOne = document.createElementNS("http://www.w3.org/2000/svg", "line");
    decrementLineOne.setAttribute("x1", "12");
    decrementLineOne.setAttribute("y1", "5");
    decrementLineOne.setAttribute("x2", "12");
    decrementLineOne.setAttribute("y2", "19");
    decrementNode.appendChild(decrementLineOne);

    const decrementLineTwo = document.createElementNS("http://www.w3.org/2000/svg", "line");
    decrementLineTwo.setAttribute("x1", "18");
    decrementLineTwo.setAttribute("y1", "13");
    decrementLineTwo.setAttribute("x2", "12");
    decrementLineTwo.setAttribute("y2", "19");
    decrementNode.appendChild(decrementLineTwo);

    const decrementLineThree = document.createElementNS("http://www.w3.org/2000/svg", "line");
    decrementLineThree.setAttribute("x1", "6" );
    decrementLineThree.setAttribute("y1", "13");
    decrementLineThree.setAttribute("x2", "12");
    decrementLineThree.setAttribute("y2", "19");
    decrementNode.appendChild(decrementLineThree);
    buttonsParentNode.appendChild(decrementNode);


    // Increment button node
    const incrementNode = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    incrementNode.setAttribute("class", "increment-button");
    incrementNode.setAttribute("onclick", `incrementFilter('${filter.name}')`)
    // SVG Paths
    const incrementPathOne = document.createElementNS("http://www.w3.org/2000/svg", "path");
    incrementPathOne.setAttribute("stroke", "none");
    incrementPathOne.setAttribute("d", "M0 0h24v24H0z");
    incrementNode.appendChild(incrementPathOne);

    const incrementLineOne = document.createElementNS("http://www.w3.org/2000/svg", "line");
    incrementLineOne.setAttribute("x1", "12");
    incrementLineOne.setAttribute("y1", "5");
    incrementLineOne.setAttribute("x2", "12");
    incrementLineOne.setAttribute("y2", "19");
    incrementNode.appendChild(incrementLineOne);

    const incrementLineTwo = document.createElementNS("http://www.w3.org/2000/svg", "line");
    incrementLineTwo.setAttribute("x1", "18");
    incrementLineTwo.setAttribute("y1", "11");
    incrementLineTwo.setAttribute("x2", "12");
    incrementLineTwo.setAttribute("y2", "5");
    incrementNode.appendChild(incrementLineTwo);

    const incrementLineThree = document.createElementNS("http://www.w3.org/2000/svg", "line");
    incrementLineThree.setAttribute("x1", "6" );
    incrementLineThree.setAttribute("y1", "11");
    incrementLineThree.setAttribute("x2", "12");
    incrementLineThree.setAttribute("y2", "5");
    incrementNode.appendChild(incrementLineThree);
    buttonsParentNode.appendChild(incrementNode);


    document.querySelector("#filters").append(filterNode);
}

const applyFilter = (filterNode, filterMeasurement) => {
    const canvas = document.querySelector("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");

    // update applied filters
    if (typeof ctx.filter !== "undefined") {
        const filterIndex = appliedFilters.findIndex(filter => filter.name === filterNode.name);
        if(filterIndex === -1) {
            appliedFilters.push({name: filterNode.name, value: filterNode.value, measurementSymbol: filterMeasurement});
        } else {
            appliedFilters[filterIndex].value = filterNode.value;
        }
    }

    // apply filter
    ctx.filter = "none";
    appliedFilters.forEach(filter => {
        if(ctx.filter == 'none') {
            ctx.filter = (`${filter.name}(${filter.value}${filter.measurementSymbol})`);
        } else {
            ctx.filter += (` ${filter.name}(${filter.value}${filter.measurementSymbol})`);
        }
    });
    
    // TODO: Bug, increment % decrement buttons cannot be used after slider has been used manually
    // Update slider value
    // filterNode.setAttribute("value", filter);

    // Update slider title text
    document.getElementById(`${filterNode.name}-title`).innerText = `${filterNode.name}: ${filterNode.value} ${filterMeasurement}`;

    ctx.drawImage(img, 0, 0);

    document.querySelector("#filteredImage").src = canvas.toDataURL();
}

const populateCSSFilters = () => {
    cssFilters.push({
        name: 'blur',
        default: 0,
        min: 0,
        max: 10,
        measurement: 'px'
    });
    cssFilters.push({
        name: 'brightness',
        default: 100,
        min: 0,
        max: 200,
        measurement: '%'
    });
    cssFilters.push({
        name: 'contrast',
        default: 100,
        min: 0,
        max: 200,
        measurement: '%'
    });
    cssFilters.push({
        name: 'grayscale',
        default: 0,
        min: 0,
        max: 150,
        measurement: '%'
    });
    cssFilters.push({
        name: 'hue-rotate',
        default: 0,
        min: 0,
        max: 360,
        measurement: 'deg'
    });
    cssFilters.push({
        name: 'invert',
        default: 0,
        min: 0,
        max: 100,
        measurement: '%'
    });
    cssFilters.push({
        name: 'opacity',
        default: 100,
        min: 0,
        max: 100,
        measurement: '%'
    });
    cssFilters.push({
        name: 'saturate',
        default: 100,
        min: 0,
        max: 500,
        measurement: '%'
    });
    cssFilters.push({
        name: 'sepia',
        default: 0,
        min: 0,
        max: 100,
        measurement: '%'
    });
}

const incrementFilter = (filterName) => {
    const node = document.getElementsByName(filterName)[0];
    const filter = cssFilters.find(filter => filter.name === filterName);

    if(node.value < filter.max) {
        node.setAttribute("value", parseInt(node.value) + 1);
        applyFilter(node, filter.measurement);
    }
}

const decrementFilter = (filterName) => {
    const node = document.getElementsByName(filterName)[0];
    const filter = cssFilters.find(filter => filter.name === filterName);

    if(node.value > filter.min) {
        node.setAttribute("value", parseInt(node.value) - 1);
        applyFilter(node, filter.measurement);
    }
}

const resetFilter = (filterName) => {
    const filter = cssFilters.find(filter => filter.name === filterName);
    const node = Array.from(document.querySelectorAll('.slider')).find(node => node.name === filterName);
    node.value = filter.default;

    applyFilter(node, filter.measurement);
}

const resetAllFilters = () => {
    cssFilters.forEach(filter => {
        resetFilter(filter.name);
    });
}

const setImgURL = (url = imgURL) => {
    resetAllFilters();

    imgURL = url;
    img.src = imgURL;

    document.querySelector("#originalImage").src = img.src;
    document.querySelector("#filteredImage").src = img.src;
}

window.onload = function() {
    document.querySelector("#originalImage").src = img.src;
    document.querySelector("#filteredImage").src = img.src;

    populateCSSFilters();

    cssFilters.forEach(filter => {
        createFilterSliderNode(filter);
    });
}
