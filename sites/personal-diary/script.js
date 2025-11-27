let posts = JSON.parse(localStorage.getItem('diaryPosts')) || [];
let currentTheme = localStorage.getItem('theme') || 'light';

function initTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeButton();
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeButton();
}

function updateThemeButton() {
    const button = document.getElementById('themeToggle');
    button.textContent = currentTheme === 'light' ? '🌙' : '☀️';
}

function savePost() {
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();
    
    if (!title || !content) {
        alert('Пожалуйста, заполните заголовок и содержание записи');
        return;
    }
    
    const newPost = {
        id: Date.now(),
        title: title,
        content: content,
        date: new Date().toLocaleString('ru-RU'),
        timestamp: Date.now()
    };
    
    posts.unshift(newPost);
    localStorage.setItem('diaryPosts', JSON.stringify(posts));
    renderPosts();
    clearEditor();
    
    const saveBtn = document.querySelector('.btn-save');
    saveBtn.textContent = '✓ Сохранено!';
    setTimeout(() => {
        saveBtn.textContent = 'Сохранить';
    }, 2000);
}

function clearEditor() {
    document.getElementById('postTitle').value = '';
    document.getElementById('postContent').value = '';
}

function renderPosts(filteredPosts = null) {
    const postsList = document.getElementById('postsList');
    const postsToRender = filteredPosts || posts;
    
    if (postsToRender.length === 0) {
        postsList.innerHTML = `
            <div class="empty-state">
                <h3>Пока записей нет</h3>
                <p>Начните вести свой дневник - добавьте первую запись!</p>
            </div>
        `;
        return;
    }
    
    postsList.innerHTML = postsToRender.map(post => `
        <div class="post-card" data-id="${post.id}">
            <div class="post-header">
                <h3 class="post-title">${escapeHtml(post.title)}</h3>
                <span class="post-date">${post.date}</span>
            </div>
            <div class="post-content">${escapeHtml(post.content)}</div>
            <div class="post-actions">
                <button class="btn-edit" onclick="editPost(${post.id})">Редактировать</button>
                <button class="btn-delete" onclick="deletePost(${post.id})">Удалить</button>
            </div>
        </div>
    `).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function editPost(id) {
    const post = posts.find(p => p.id === id);
    if (!post) return;
    
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postContent').value = post.content;
    
    document.querySelector('.editor-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
    
    deletePost(id, false);
}

function deletePost(id, confirmDelete = true) {
    if (confirmDelete && !confirm('Вы уверены, что хотите удалить эту запись?')) {
        return;
    }
    
    posts = posts.filter(post => post.id !== id);
    localStorage.setItem('diaryPosts', JSON.stringify(posts));
    renderPosts();
}

function searchPosts() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (!query) {
        renderPosts();
        return;
    }
    
    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.content.toLowerCase().includes(query)
    );
    
    renderPosts(filteredPosts);
}

document.getElementById('searchInput').addEventListener('input', searchPosts);

document.getElementById('postContent').addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'Enter') {
        savePost();
    }
});

document.getElementById('themeToggle').addEventListener('click', toggleTheme);
initTheme();
renderPosts();
