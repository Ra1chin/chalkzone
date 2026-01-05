// header-footer.js - Updated to use clean links from blog.json (no .html)

document.addEventListener('DOMContentLoaded', () => {
    const blogPostsContainer = document.getElementById('blog-posts');
    const paginationContainer = document.getElementById('pagination');
    const categoryLinks = document.querySelectorAll('.sidebar a');
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav-menu');
    let allBlogs = [];
    let filteredBlogs = [];
    let currentPage = 1;
    const blogsPerPage = 8;

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        nav.classList.toggle('active');
    });

    // Fetch blog data
    fetch('blog.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('blog.json not found');
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
            blogPostsContainer.innerHTML = `<p style="color:red;text-align:center;">Error loading posts: ${error.message}</p>`;
            console.error('Error loading blogs:', error);
        });

    function renderBlogs() {
        blogPostsContainer.innerHTML = '';
        const start = (currentPage - 1) * blogsPerPage;
        const end = start + blogsPerPage;
        const blogsToShow = filteredBlogs.slice(start, end);

        if (blogsToShow.length === 0) {
            blogPostsContainer.innerHTML = '<p style="text-align:center;font-size:1.5em;color:#bbb;">No posts found in this category.</p>';
            return;
        }

        blogsToShow.forEach(blog => {
            const postElement = document.createElement('div');
            postElement.classList.add('blog-post');
            postElement.innerHTML = `
                <img src="${blog.image}" alt="${blog.title}" class="blog-image">
                <h3>${blog.title}</h3>
                <p>${blog.content.substring(0, 150)}...</p>
                <a href="${blog.link}" class="read-more">Read More</a>
                <span class="category">Category: ${blog.category}</span>
                <p><small>${blog.date}</small></p>
            `;
            blogPostsContainer.appendChild(postElement);
        });
    }

    function setupPagination() {
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

        if (totalPages <= 1) return; // Hide pagination if only one page

        // Prev button
        const prevButton = createButton('Prev', () => {
            if (currentPage > 1) {
                currentPage--;
                renderBlogs();
                setupPagination();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, currentPage === 1);

        // Next button
        const nextButton = createButton('Next', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderBlogs();
                setupPagination();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, currentPage === totalPages);

        paginationContainer.appendChild(prevButton);

        // Page number buttons
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = createButton(i, () => {
                currentPage = i;
                renderBlogs();
                setupPagination();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, false);
            if (i === currentPage) {
                pageButton.style.backgroundColor = '#00bfff';
                pageButton.style.color = '#121212';
            }
            paginationContainer.appendChild(pageButton);
        }

        paginationContainer.appendChild(nextButton);
    }

    function createButton(text, onClick, disabled) {
        const button = document.createElement('button');
        button.textContent = text;
        button.disabled = disabled;
        button.addEventListener('click', onClick);
        return button;
    }

    function setupCategoryFilters() {
        categoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = link.dataset.category;
                filteredBlogs = category === 'all' 
                    ? allBlogs 
                    : allBlogs.filter(blog => blog.category.toLowerCase() === category);
                currentPage = 1;
                renderBlogs();
                setupPagination();
            });
        });
    }
});