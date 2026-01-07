// header-footer.js - Final version: Mobile menu + Blog functionality (clean URLs)

document.addEventListener('DOMContentLoaded', () => {
    // === Mobile Menu Toggle (runs on ALL pages) ===
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Optional: prevent body scroll when menu open on mobile
            document.body.classList.toggle('no-scroll', navMenu.classList.contains('active'));
        });
    }

    // === Blog Functionality (only runs on pages with blog section) ===
    const blogPostsContainer = document.getElementById('blog-posts');
    const paginationContainer = document.getElementById('pagination');
    const categoryLinks = document.querySelectorAll('.sidebar a');

    // If these elements don't exist (e.g., on 404 or single post page), skip blog logic
    if (!blogPostsContainer || !paginationContainer) {
        return;
    }

    let allBlogs = [];
    let filteredBlogs = [];
    let currentPage = 1;
    const blogsPerPage = 8;

    // Fetch blog.json
    fetch('blog.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('blog.json not found or failed to load');
            }
            return response.json();
        })
        .then(data => {
            allBlogs = data;
            filteredBlogs = allBlogs;
            renderBlogs();
            setupPagination();
            setupCategoryFilters();
        })
        .catch(error => {
            blogPostsContainer.innerHTML = 
                `<p style="color:#ff4444; text-align:center; font-size:1.4em; padding:40px;">
                    Error loading posts: ${error.message}
                </p>`;
            console.error('Blog loading error:', error);
        });

    function renderBlogs() {
        blogPostsContainer.innerHTML = '';
        const start = (currentPage - 1) * blogsPerPage;
        const end = start + blogsPerPage;
        const blogsToShow = filteredBlogs.slice(start, end);

        if (blogsToShow.length === 0) {
            blogPostsContainer.innerHTML = 
                '<p style="text-align:center; font-size:1.6em; color:#bbb; padding:40px;">No posts found in this category.</p>';
            return;
        }

        blogsToShow.forEach(blog => {
            const postElement = document.createElement('div');
            postElement.classList.add('blog-post');
            postElement.innerHTML = `
                <img src="${blog.image}" alt="${blog.title}" class="blog-image">
                <h3>${blog.title}</h3>
                <p>${blog.content.substring(0, 150)}...</p>
                <a href="${blog.link}" class="read-more">Read full Content</a>
                <span class="category">Category: ${blog.category}</span>
                <p><small>${blog.date}</small></p>
            `;
            blogPostsContainer.appendChild(postElement);
        });
    }

    function setupPagination() {
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

        if (totalPages <= 1) return; // Hide if only one page

        // Prev button
        const prevButton = createButton('Prev', () => {
            if (currentPage > 1) {
                currentPage--;
                renderBlogs();
                setupPagination();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, currentPage === 1);

        paginationContainer.appendChild(prevButton);

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = createButton(i, () => {
                currentPage = i;
                renderBlogs();
                setupPagination();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            if (i === currentPage) {
                pageButton.style.backgroundColor = '#00bfff';
                pageButton.style.color = '#121212';
                pageButton.style.fontWeight = 'bold';
            }
            paginationContainer.appendChild(pageButton);
        }

        // Next button
        const nextButton = createButton('Next', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderBlogs();
                setupPagination();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, currentPage === totalPages);

        paginationContainer.appendChild(nextButton);
    }

    function createButton(text, onClick, disabled = false) {
        const button = document.createElement('button');
        button.textContent = text;
        button.disabled = disabled;
        button.addEventListener('click', onClick);
        return button;
    }

    function setupCategoryFilters() {
        if (categoryLinks.length === 0) return;

        categoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = link.dataset.category;

                if (category === 'all') {
                    filteredBlogs = allBlogs;
                } else {
                    filteredBlogs = allBlogs.filter(blog => 
                        blog.category.toLowerCase() === category.toLowerCase()
                    );
                }

                currentPage = 1;
                renderBlogs();
                setupPagination();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }
});