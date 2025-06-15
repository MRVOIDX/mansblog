// Initialize Quill editor for post content
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Quill editor
    let quill = null;
    const editorContainer = document.getElementById('editor-container');
    const contentTextarea = document.getElementById('content');
    
    if (editorContainer && contentTextarea) {
        quill = new Quill('#editor-container', {
            theme: 'snow',
            placeholder: 'Write your post content here...',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'align': [] }],
                    ['link', 'blockquote'],
                    ['clean']
                ]
            }
        });

        // Set initial content if editing
        if (contentTextarea.value) {
            quill.root.innerHTML = contentTextarea.value;
        }

        // Update hidden textarea when content changes
        quill.on('text-change', function() {
            contentTextarea.value = quill.root.innerHTML;
        });
    }

    // Form validation
    const form = document.querySelector('.post-form');
    const titleInput = document.getElementById('title');
    const authorInput = document.getElementById('author');
    const categorySelect = document.getElementById('category');

    if (form) {
        form.addEventListener('submit', function(e) {
            // Get content from Quill
            const content = quill ? quill.root.innerHTML : contentTextarea.value;
            
            // Validate required fields
            let isValid = true;
            const errors = [];

            if (!titleInput.value.trim()) {
                errors.push('Title is required');
                isValid = false;
            }

            if (!authorInput.value.trim()) {
                errors.push('Author is required');
                isValid = false;
            }

            if (!categorySelect.value) {
                errors.push('Category is required');
                isValid = false;
            }

            if (!content.trim() || content === '<p><br></p>' || content === '<p></p>' || quill.getText().trim().length === 0) {
                errors.push('Content is required');
                isValid = false;
            }

            if (!isValid) {
                e.preventDefault();
                alert('Please fix the following errors:\n\n' + errors.join('\n'));
                return false;
            }

            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = 'Publishing...';
                submitBtn.disabled = true;
            }
        });
    }

    // Image upload preview
    const imageInput = document.getElementById('image');
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validate file type
                const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
                if (!allowedTypes.includes(file.type)) {
                    alert('Please select a valid image file (PNG, JPG, GIF, WebP)');
                    this.value = '';
                    return;
                }

                // Validate file size (16MB max)
                if (file.size > 16 * 1024 * 1024) {
                    alert('File size must be less than 16MB');
                    this.value = '';
                    return;
                }

                // Show preview
                const reader = new FileReader();
                reader.onload = function(e) {
                    // Remove existing preview
                    const existingPreview = document.querySelector('.image-preview');
                    if (existingPreview) {
                        existingPreview.remove();
                    }

                    // Create preview
                    const preview = document.createElement('div');
                    preview.className = 'image-preview';
                    preview.style.marginTop = '10px';
                    preview.innerHTML = `
                        <img src="${e.target.result}" alt="Preview" style="max-width: 200px; max-height: 150px; border-radius: 8px; border: 1px solid #dee2e6;">
                        <p style="font-size: 0.85rem; color: #6c757d; margin-top: 5px;">Preview: ${file.name}</p>
                    `;
                    
                    imageInput.parentNode.appendChild(preview);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Character counter for title
    if (titleInput) {
        const maxLength = titleInput.getAttribute('maxlength') || 200;
        const counter = document.createElement('small');
        counter.className = 'char-counter';
        counter.style.color = '#6c757d';
        counter.style.fontSize = '0.85rem';
        titleInput.parentNode.appendChild(counter);

        function updateCounter() {
            const remaining = maxLength - titleInput.value.length;
            counter.textContent = `${remaining} characters remaining`;
            counter.style.color = remaining < 20 ? '#e74c3c' : '#6c757d';
        }

        titleInput.addEventListener('input', updateCounter);
        updateCounter();
    }

    // Auto-save functionality (store in localStorage)
    let autoSaveTimer;
    const autoSaveDelay = 30000; // 30 seconds

    function autoSave() {
        if (titleInput && authorInput && categorySelect) {
            const formData = {
                title: titleInput.value,
                author: authorInput.value,
                category: categorySelect.value,
                content: quill ? quill.root.innerHTML : '',
                timestamp: new Date().toISOString()
            };

            localStorage.setItem('mans_blog_draft', JSON.stringify(formData));
            
            // Show auto-save indicator
            showAutoSaveIndicator();
        }
    }

    function showAutoSaveIndicator() {
        let indicator = document.querySelector('.auto-save-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'auto-save-indicator';
            indicator.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #27ae60;
                color: white;
                padding: 8px 15px;
                border-radius: 4px;
                font-size: 0.85rem;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(indicator);
        }

        indicator.textContent = 'Draft saved';
        indicator.style.opacity = '1';

        setTimeout(() => {
            indicator.style.opacity = '0';
        }, 2000);
    }

    // Set up auto-save listeners
    if (form && !form.dataset.isEdit) { // Only auto-save for new posts
        [titleInput, authorInput, categorySelect].forEach(element => {
            if (element) {
                element.addEventListener('input', () => {
                    clearTimeout(autoSaveTimer);
                    autoSaveTimer = setTimeout(autoSave, autoSaveDelay);
                });
            }
        });

        // Load draft on page load
        const savedDraft = localStorage.getItem('mans_blog_draft');
        if (savedDraft) {
            try {
                const draftData = JSON.parse(savedDraft);
                const draftAge = new Date() - new Date(draftData.timestamp);
                
                // Only restore draft if it's less than 24 hours old
                if (draftAge < 24 * 60 * 60 * 1000) {
                    if (confirm('A draft was found. Would you like to restore it?')) {
                        if (titleInput) titleInput.value = draftData.title || '';
                        if (authorInput) authorInput.value = draftData.author || '';
                        if (categorySelect) categorySelect.value = draftData.category || '';
                        
                        // Set content after Quill is initialized
                        setTimeout(() => {
                            if (quill && draftData.content) {
                                quill.root.innerHTML = draftData.content;
                            }
                        }, 1000);
                    }
                }
            } catch (e) {
                console.error('Error loading draft:', e);
            }
        }

        // Clear draft on successful form submission
        form.addEventListener('submit', () => {
            localStorage.removeItem('mans_blog_draft');
        });
    }
});

// Utility function to show notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    switch (type) {
        case 'success':
            notification.style.background = '#27ae60';
            break;
        case 'error':
            notification.style.background = '#e74c3c';
            break;
        default:
            notification.style.background = '#3498db';
    }

    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
