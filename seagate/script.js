const textInput = document.getElementById('text-input');
const copyBtn = document.getElementById('copy-btn');

textInput.addEventListener('input', () => {
    let text = textInput.value;
    text = text.toLowerCase();
    text = text.replace(/\s+/g, '-');
    text = text.replace(/_/g, '-');
    textInput.value = text;
});

copyBtn.addEventListener('click', () => {
    textInput.select();
    document.execCommand('copy');
});

const urlInput = document.getElementById('url-input');
const changeUrlBtn = document.getElementById('change-url-btn');
const newUrl = document.getElementById('new-url');
const copyUrlBtn = document.getElementById('copy-url-btn');

// Configure the domains to be replaced here
const liveDomain = 'example.com';
const productionDomain = 'example2.com';

changeUrlBtn.addEventListener('click', () => {
    const url = urlInput.value;
    if (url.includes(liveDomain)) {
        const newUrlValue = url.replace(liveDomain, productionDomain) + '.html';
        newUrl.textContent = newUrlValue;
    } else {
        newUrl.textContent = 'Domain not found in URL.';
    }
});

copyUrlBtn.addEventListener('click', () => {
    const urlToCopy = newUrl.textContent;
    if (urlToCopy && urlToToCopy !== 'Domain not found in URL.') {
        navigator.clipboard.writeText(urlToCopy).then(() => {
            alert('URL copied to clipboard!');
        }, () => {
            alert('Failed to copy URL.');
        });
    }
});

let allGeneratedUrls = {}; // Global variable to store generated URLs

const copyAllUrlsBtn = document.getElementById('copy-all-urls-btn');
const resultContainer = document.getElementById("resultContainer");

copyAllUrlsBtn.addEventListener('click', () => {
    const allUrls = Object.values(allGeneratedUrls).flat();
    copyUrlsToClipboard(allUrls);
    alert("All URLs copied to clipboard.");
});

function addLocalePaths() {
    var userInputUrl = document.getElementById("urlInput").value.trim();

    // Check if the input URL is empty
    if (userInputUrl === "") {
        alert("Please enter a valid URL.");
        return;
    }

    // Parse the provided URL to extract domain and path
    var urlParts = userInputUrl.match(/^https?:\/\/([^/]+)(\/.*)?$/);
    if (!urlParts) {
        alert("Invalid URL format. Please enter a valid URL.");
        return;
    }

    // Extract domain and path
    var domain = urlParts[1];
    var path = urlParts[2] || '';

    var regions = {
        "APAC": ["as/en", "au/en", "in/en", "id/id", "sg/en", "kr/ko", "jp/ja", "tw/zh", "cn/zh"],
        "EMEA": ["be/nl", "be/fr", "de/de", "es/es", "fr/fr", "it/it", "nl/nl", "pl/pl", "pt/pt", "gb/en", "tr/tr", "em/en", "la/es", "br/pt"],
        "US": ["ca/en", "ca/fr"]
    };

    allGeneratedUrls = {}; // Clear previous results

    // Construct the modified URL for each locale
    Object.keys(regions).forEach(function(region) {
        var urls = [];
        regions[region].forEach(function(locale) {
            var urlWithLocale = "https://" + domain + "/" + locale + path;
            urls.push(urlWithLocale);
        });
        // Add original URL for the US region
        if (region === "US") {
            urls.push("https://" + domain + path);
        }
        allGeneratedUrls[region] = urls;
    });

    resultContainer.innerHTML = ''; // Clear previous results

    // Display each URL within the container
    Object.keys(allGeneratedUrls).forEach(function(region) {
        var regionContainer = document.createElement("div");
        regionContainer.classList.add("region-container");

        var regionHeader = document.createElement("h3");
        regionHeader.textContent = region;
        regionContainer.appendChild(regionHeader);

        allGeneratedUrls[region].forEach(function(url) {
            var urlText = document.createElement("div");
            urlText.textContent = url;
            urlText.classList.add("url-text");
            regionContainer.appendChild(urlText);
        });

        resultContainer.appendChild(regionContainer);

        // Create copy button for each region
        var copyButton = document.createElement("button");
        copyButton.textContent = "Copy " + region + " URLs";
        copyButton.classList.add("button");
        copyButton.onclick = function() {
            copyUrlsToClipboard(allGeneratedUrls[region]);
            alert("URLs copied to clipboard.");
        };
        regionContainer.appendChild(copyButton);
    });

    // Show the result container and copy all button
    resultContainer.style.display = 'block';
    copyAllUrlsBtn.style.display = 'block';
}

function copyUrlsToClipboard(urls) {
    var urlsText = urls.join('\n');
    var tempInput = document.createElement("textarea");
    tempInput.value = urlsText;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
}

let processedImages = []; // Global array to store processed image data

function sanitizeFileName(name) {
    return name
        .toLowerCase()
        .replace(/[_ ]+/g, '-'); // Replace spaces and underscores with hyphens
}

const downloadAllBtn = document.getElementById('download-all-btn');

document.getElementById('fileInput').addEventListener('change', async function (event) {
    const files = event.target.files;
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '';
    processedImages = []; // Clear previous images

    if (files.length === 0) {
        outputDiv.innerHTML = '<p>No files selected.</p>';
        downloadAllBtn.style.display = 'none';
        return;
    }

    for (const file of files) {
        const ext = file.name.substring(file.name.lastIndexOf('.'));
        const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
        const newName = sanitizeFileName(baseName) + ext.toLowerCase();

        const arrayBuffer = await file.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: file.type });
        const url = URL.createObjectURL(blob);

        processedImages.push({ url, newName }); // Store image data

        const container = document.createElement('div');
        container.className = 'file-item';
        container.innerHTML = `
          <span>${file.name} → <strong>${newName}</strong></span>
          <button onclick="downloadFile('${url}', '${newName}')">Download</button>
        `;

        outputDiv.appendChild(container);
    }
    downloadAllBtn.style.display = 'block'; // Show download all button
});

downloadAllBtn.addEventListener('click', () => {
    processedImages.forEach(image => {
        downloadFile(image.url, image.newName);
    });
});

function downloadFile(url, name) {
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
}
