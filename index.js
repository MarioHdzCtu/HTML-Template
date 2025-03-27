const routes = {
    "/":"views/home.html",
    "#/dashboard":"views/dashboard.html",
    "#/admin":"views/admin.html",
    "#/upload-document":"views/upload-document.html",
    "#/home":"views/home.html"
}

// Preload Home view when the page is loaded
let preloadedHomeContent = null;

// Fetch the Home content once on load
const preloadHome = async () => {
    try {
        const response = await fetch("views/home.html");
        if (response.ok) {
            preloadedHomeContent = await response.text();  // Store the home content
        }
    } catch (error) {
        console.error("Error preloading Home view:", error);
    }
};

// Function to load an HTML file dynamically
async function loadHTML(url) {
    try {
        const response = await fetch(`/${url}`);
        if (!response.ok) throw new Error("Page not found");
        return await response.text();
    } catch (error) {
        return `<h1>404 - Page Not Found</h1>`;
    }
}

// Handle navigation
function navigateTo(url) {
    window.location.hash = url; // Change hash instead of using pushState
}

// Router function
async function router() {
    const path = window.location.hash || ""; // Get hash or default to home
    let content;

    // Check if we have preloaded content for the Home view
    if (path === "" && preloadedHomeContent) {
        
        content = preloadedHomeContent; // Use preloaded content for home
        
    } else {
        
        content = await loadHTML(routes[path] || routes[""]); // Load content for other views
    }

    document.getElementById("app").innerHTML = content;
}

// Attach event listeners to links
document.addEventListener("DOMContentLoaded", () => {
    // Preload the Home content when the page is loaded
    preloadHome().then(() => {
        // After preloading Home, set up routing and click events
        document.body.addEventListener("click", (e) => {
            const link = e.target.closest("[data-link]");
            if (link) {
                e.preventDefault();
                navigateTo(link.getAttribute("href"));
            }
        });

        window.addEventListener("hashchange", router);  // Handle hash changes
        router();  // Load the initial route after preloading
    });
});

// Handle back/forward navigation
window.addEventListener("popstate", router);