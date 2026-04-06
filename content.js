console.log("AI Shopping Assistant Content Script Loaded!");

chrome.runtime.onMessage.addListener((filters, sender, sendResponse) => {
    console.log("Received Filter Parameters:", filters);

    // Default base URL for Flipkart
    let baseURL = "https://www.flipkart.com/search?q=";
    
    // Fallback to "products" broadly if no direct category mapped
    let category = filters.filters?.category || "products";
    let finalURL = baseURL + encodeURIComponent(category);

    // Apply Brand Filter
    if (filters.filters?.brand) {
        finalURL += "&brand=" + encodeURIComponent(filters.filters.brand);
    }

    // Apply Max Price Filter manually translated to Flipkart's format
    if (filters.filters?.price_max) {
        // Ex: &p[]=facets.price_range.to%3D3000
        finalURL += "&p[]=facets.price_range.from%3D0";
        finalURL += "&p[]=facets.price_range.to%3D" + encodeURIComponent(filters.filters.price_max);
    }
    
    // Apply Output Redirect
    console.log("Redirecting to formatted url:", finalURL);
    window.location.href = finalURL;
});
