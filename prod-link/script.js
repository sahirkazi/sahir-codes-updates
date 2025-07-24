document.getElementById('changeDomainButton').addEventListener('click', function() {
    const inputUrl = document.getElementById('urlInput').value.trim();
    const newDomain = 'https://aemedit.seagate.com/editor.html/content/seagate/language-masters/en';

    try {
        const url = new URL(inputUrl);
        const path = url.pathname.endsWith('.html') ? url.pathname : `${url.pathname}.html`;
        const newUrl = `${newDomain}${path}${url.search}${url.hash}`;

        const resultElement = document.getElementById('result');
        const copyButton = document.getElementById('copyButton');
        const openButton = document.getElementById('openButton');

        resultElement.innerText = `New URL: ${newUrl}`;
        
        copyButton.style.display = 'inline-block';
        copyButton.setAttribute('data-url', newUrl);

        openButton.style.display = 'inline-block';
        openButton.setAttribute('data-url', newUrl);
    } catch (e) {
        document.getElementById('result').innerText = 'Invalid URL';
        document.getElementById('copyButton').style.display = 'none';
        document.getElementById('openButton').style.display = 'none';
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
    }
});

document.getElementById('openButton').addEventListener('click', function() {
    const urlToOpen = this.getAttribute('data-url');
    if (urlToOpen) {
        window.open(urlToOpen, '_blank');
    }
});
