// characters.js - Dedicated Characters page with clean links and full pagination

document.addEventListener('DOMContentLoaded', () => {
    const blogPostsContainer = document.getElementById('blog-posts');
    const paginationContainer = document.getElementById('pagination');
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav-menu');

    let charactersBlogs = [];
    let currentPage = 1;
    const blogsPerPage = 8;  // Matches homepage

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        nav.classList.toggle('active');
    });

    // Fetch blog.json and filter only Characters category
    fetch('/blog.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('blog.json not found or unreachable');
            }
            return response.json();
        })
        .then(data => {
            charactersBlogs = data.filter(blog => 
                blog.category.toLowerCase() === 'characters'
            );
            renderBlogs();
            setupPagination();
        })
        .catch(error => {
            blogPostsContainer.innerHTML = 
                `<p style="color:red;text-align:center;font-size:1.4em;">
                    Error loading characters: ${error.message}
                </p>`;
            console.error('Characters page error:', error);
        });

    function renderBlogs() {
        blogPostsContainer.innerHTML = '';
        const start = (currentPage - 1) * blogsPerPage;
        const end = start + blogsPerPage;
        const blogsToShow = charactersBlogs.slice(start, end);

        if (blogsToShow.length === 0) {
            blogPostsContainer.innerHTML = 
                '<p style="text-align:center;font-size:1.6em;color:#bbb;">No characters found yet!</p>';
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
        const totalPages = Math.ceil(charactersBlogs.length / blogsPerPage);

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

    function createButton(text, onClick, disabled = false) {
        const button = document.createElement('button');
        button.textContent = text;
        button.disabled = disabled;
        button.addEventListener('click', onClick);
        return button;
    }
});