// content.js - Dynamic single post loader for clean URLs

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
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

    // If not on a post page, exit early
    if (!titleElement || !contentElement) {
        return;
    }

    // Get clean path: e.g., "/post/rudys-adventures-in-chalkzone"
    const currentPath = window.location.pathname.toLowerCase();

    // Fetch blog data
    fetch('/blog.json')
        .then(response => {
            if (!response.ok) throw new Error('blog.json not found or failed to load');
            return response.json();
        })
        .then(posts => {
            // Find matching post (case-insensitive just in case)
            const currentPost = posts.find(post => 
                post.link.toLowerCase() === currentPath
            );

            if (!currentPost) {
                // 404 Stylish Not Found
                document.body.innerHTML = `
                    <div style="text-align:center; padding:100px 20px; font-family:'Bangers', cursive; background:#121212; min-height:100vh;">
                        <h1 style="font-size:5em; color:#00bfff; margin:0;">404</h1>
                        <h2 style="font-size:2.8em; color:#fff; margin:20px 0;">Post Not Found</h2>
                        <p style="font-size:1.6em; color:#bbb;">The chalk drawing must have been erased... 🖍️💨</p>
                        <a href="/" style="display:inline-block; margin-top:40px; padding:15px 40px; background:#00bfff; color:#121212; border-radius:50px; text-decoration:none; font-size:1.5em; font-weight:bold;">
                            ← Back to Home
                        </a>
                    </div>
                `;
                return;
            }

            // Populate post data
            document.title = `${currentPost.title} | ChalkZone Blog`;

            titleElement.textContent = currentPost.title;
            dateElement.textContent = currentPost.date;
            categoryElement.textContent = currentPost.category;

            if (imageElement && currentPost.image) {
                imageElement.src = currentPost.image;
                imageElement.alt = currentPost.title;
                imageElement.style.display = 'block';
            }

            // Full content placeholder (palitan mo 'to pag may full article na)
            contentElement.innerHTML = `
                <article style="font-size:1.1em; line-height:1.8;">
                    <p><strong>Coming Soon:</strong> Full detailed article about <em>${currentPost.title}</em>! 🖍️✨</p>
                    <p><strong>Teaser:</strong> ${currentPost.content}</p>
                    <p>Stay tuned for more magical ChalkZone adventures!</p>
                </article>
            `;
        })
        .catch(error => {
            contentElement.innerHTML = `
                <p style="color:#ff4444; text-align:center; padding:40px; background:#330000; border-radius:12px;">
                    ⚠️ Error loading post: ${error.message}
                </p>
            `;
            console.error('Post loading error:', error);
        });
});