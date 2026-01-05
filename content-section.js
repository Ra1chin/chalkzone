// content.js - Dynamic single post loader for clean URLs (no .html)

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle (shared with all pages)
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // === Single Post Loading Logic ===
    const titleElement = document.getElementById('post-title');
    const imageElement = document.getElementById('post-image');
    const contentElement = document.getElementById('post-content');
    const dateElement = document.getElementById('post-date');
    const categoryElement = document.getElementById('post-category');

    // Check if we're on a content page
    if (!titleElement || !contentElement) {
        return; // Not a post page
    }

    // Get current clean URL path
    const currentPath = window.location.pathname; // e.g., "/post/rudys-adventures-in-chalkzone"

    // Fetch blog data
    fetch('blog.json')
        .then(response => {
            if (!response.ok) throw new Error('blog.json not found');
            return response.json();
        })
        .then(posts => {
            // Find the post that matches the current URL
            const currentPost = posts.find(post => post.link === currentPath);

            if (!currentPost) {
                // Post not found
                document.body.innerHTML = `
                    <div style="text-align:center; padding:80px 20px; font-family:'Bangers', cursive;">
                        <h1 style="font-size:4em; color:#00bfff;">404</h1>
                        <h2 style="font-size:2.5em; color:#fff;">Post Not Found</h2>
                        <p style="font-size:1.4em; color:#bbb;">The chalk must have been erased...</p>
                        <a href="/" style="display:inline-block; margin-top:30px; padding:15px 30px; background:#00bfff; color:#121212; border-radius:50px; text-decoration:none; font-size:1.3em;">
                            ← Back to Home
                        </a>
                    </div>
                `;
                return;
            }

            // Populate the page with post data
            document.title = `${currentPost.title} | ChalkZone Blog`;

            titleElement.textContent = currentPost.title;
            dateElement.textContent = currentPost.date;
            categoryElement.textContent = currentPost.category;

            if (imageElement && currentPost.image) {
                imageElement.src = currentPost.image;
                imageElement.alt = currentPost.title;
            }

            // Use full content from a future "fullContent" field, or fallback to short
            // For now, we'll display a placeholder full article (you can expand later)
            contentElement.innerHTML = `
                <p><strong>Coming Soon:</strong> Full in-depth article about <em>${currentPost.title}</em>.</p>
                <p>Teaser: ${currentPost.content}</p>
                <p>Stay tuned as we draw more magic from ChalkZone! 🖍️✨</p>
            `;
        })
        .catch(error => {
            contentElement.innerHTML = `
                <p style="color:#ff4444; text-align:center;">
                    Error loading post: ${error.message}
                </p>
            `;
            console.error(error);
        });
});