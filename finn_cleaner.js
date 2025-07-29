function handleArticles() {
    console.log("Checking for articles...");
    let articles = document.querySelectorAll("article");

    if (articles.length === 0) {
        console.warn("No articles found at this moment.");
        return;
    }

    console.log(`Found ${articles.length} articles.`);
    iterateOverArticles(articles);
}

function iterateOverArticles(articles) {
    for (let article of articles) {
        if (article.dataset.processed) continue; // Prevent reprocessing
        article.dataset.processed = "true";

        let link = article.querySelector("a.sf-search-ad-link");
        if (!link) continue;

        console.log(link.href);

        fetch(link.href)
            .then(response => response.text())
            .then(bodyText => {
                if (bodyText.toLowerCase().includes("dame") || 
                bodyText.toLowerCase().includes("dameklær") || 
                bodyText.toLowerCase().includes("barn") || 
                bodyText.toLowerCase().includes("barneklær")) {
                    console.log(`Found "dame" or "barn" in: ${link.textContent}`);

                    article.remove()

                } else {
                    console.log(`"dame" or "barn" not found in: ${link.textContent}`);
                }
            })
            .catch(error => {
                console.error(`Error fetching ${link.href}:`, error);
                article.style.border = "5px solid red";
            });
    }
}

const observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
        for (let node of mutation.addedNodes) {
            if (node.nodeType === 1 && node.matches("article, article *")) {
                handleArticles(); // New article(s) added
                return;
            }
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });

handleArticles(); // Run initially
