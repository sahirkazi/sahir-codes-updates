// script.js
document.getElementById('changeDomainButton').addEventListener('click', function() {
    const inputUrl = document.getElementById('urlInput').value;
    const newDomain = 'https://sgspzwwwl01a.seagate.com:8443/editor.html/content/seagate/language-masters/en'; // The new domain

    try {
        const url = new URL(inputUrl);
        const newUrl = `${newDomain}${url.pathname}${url.search}${url.hash}.html`;
        const resultElement = document.getElementById('result');
        const copyButton = document.getElementById('copyButton');

        resultElement.innerText = `New URL: ${newUrl}`;
        copyButton.style.display = 'inline-block';
        copyButton.setAttribute('data-url', newUrl);
    } catch (e) {
        document.getElementById('result').innerText = 'Invalid URL';
        document.getElementById('copyButton').style.display = 'none';
    }
});

document.getElementById('copyButton').addEventListener('click', function() {
    const urlToCopy = this.getAttribute('data-url');
    
    if (urlToCopy) {
        navigator.clipboard.writeText(urlToCopy).then(() => {
            alert('URL copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy URL: ', err);
        });
    } else {
        console.error('No URL to copy.');
    }
});
