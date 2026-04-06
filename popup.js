document.getElementById("searchBtn").onclick = async () => {
    const queryInput = document.getElementById("query");
    const query = queryInput.value.trim();
    
    if (!query) return;

    const btn = document.getElementById("searchBtn");
    const loading = document.getElementById("loading");
    const resultContainer = document.getElementById("resultContainer");
    const resultDisplay = document.getElementById("result");

    // UI State update
    btn.disabled = true;
    btn.style.opacity = "0.7";
    loading.classList.remove("hidden");
    resultContainer.classList.add("hidden");

    try {
        const response = await fetch("http://127.0.0.1:8000/extract_filters", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ query })
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        const filters = await response.json();

        // Show result purely for visual feedback in popup
        resultDisplay.textContent = JSON.stringify(filters, null, 2);
        loading.classList.add("hidden");
        resultContainer.classList.remove("hidden");

        // Send to active tab content script
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (tabs[0] && tabs[0].url.includes("flipkart.com")) {
                chrome.tabs.sendMessage(tabs[0].id, filters);
            } else {
                // Not on flipkart - could prompt user to navigate first, or auto open new tab
                chrome.tabs.create({ url: "https://www.flipkart.com/" }, (newTab) => {
                    // Wait for new tab to load then send message
                    chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                        if (info.status === 'complete' && tabId === newTab.id) {
                            chrome.tabs.onUpdated.removeListener(listener);
                            chrome.tabs.sendMessage(tabId, filters);
                        }
                    });
                });
            }
        });
    } catch (err) {
        console.error(err);
        resultDisplay.textContent = "Error executing filter: Make sure the FastAPI server is running.";
        loading.classList.add("hidden");
        resultContainer.classList.remove("hidden");
    } finally {
        btn.disabled = false;
        btn.style.opacity = "1";
    }
};
