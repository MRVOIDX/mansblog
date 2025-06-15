from flask import Flask, render_template, request, redirect, url_for, flash, send_from_directory, jsonify
import os
import json
from datetime import datetime
from werkzeug.utils import secure_filename
import uuid
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key-change-in-production")

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# In-memory storage for posts
posts_storage = []

# Sample initial posts to demonstrate functionality
initial_posts = [
    {
        'id': str(uuid.uuid4()),
        'title': 'MANS University Launches New Digital Learning Initiative',
        'content': '''<p>Warsaw Management University announces a groundbreaking digital transformation program that will revolutionize the learning experience for all students. This comprehensive initiative includes state-of-the-art virtual classrooms, AI-powered learning assistants, and enhanced online collaboration tools.</p>
        <p>The new digital learning platform integrates cutting-edge technology with our proven pedagogical methods, ensuring that students receive the best possible education while adapting to the evolving demands of the modern workplace.</p>
        <p>Key features of the initiative include:</p>
        <ul>
        <li>Interactive virtual reality classrooms</li>
        <li>AI-powered personalized learning paths</li>
        <li>Real-time collaboration tools</li>
        <li>Advanced analytics for performance tracking</li>
        </ul>''',
        'category': 'Announcements',
        'date': '2024-12-15',
        'author': 'MANS Administration',
        'featured': True,
        'image': None
    },
    {
        'id': str(uuid.uuid4()),
        'title': 'Breakthrough Research in Sustainable Business Practices',
        'content': '''<p>Our Business Innovation Lab has published groundbreaking research on sustainable management practices that are being adopted by Fortune 500 companies worldwide. The study demonstrates how environmental consciousness can drive profitability and innovation.</p>
        <p>The research, conducted over 18 months, analyzed the implementation of sustainable practices across various industries and their impact on long-term business performance.</p>''',
        'category': 'Research',
        'date': '2024-12-12',
        'author': 'Dr. Research Team',
        'featured': False,
        'image': None
    },
    {
        'id': str(uuid.uuid4()),
        'title': 'International Student Exchange Program Success Stories',
        'content': '''<p>Meet our students who have transformed their academic journey through our partnership programs with universities across Europe, Asia, and the Americas. Discover how global exposure shapes future business leaders.</p>
        <p>This year, over 200 students participated in our exchange programs, gaining invaluable international experience and cultural perspectives that enhance their academic and professional development.</p>''',
        'category': 'Student Life',
        'date': '2024-12-10',
        'author': 'International Office',
        'featured': False,
        'image': None
    }
]

# Initialize posts storage with sample data on first run
if not posts_storage:
    posts_storage.extend(initial_posts)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_post_by_id(post_id):
    return next((post for post in posts_storage if post['id'] == post_id), None)

@app.route('/')
def index():
    # Sort posts by date (newest first)
    sorted_posts = sorted(posts_storage, key=lambda x: x['date'], reverse=True)
    return render_template('index.html', posts=sorted_posts)

@app.route('/about-us')
def about_us():
    return render_template('about-us.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        subject = request.form.get('subject')
        message = request.form.get('message')
        
        # In a real application, you would send an email or save to database
        flash('Thank you for your message! We will get back to you soon.', 'success')
        return redirect(url_for('contact'))
    
    return render_template('contact.html')

@app.route('/create-post', methods=['GET', 'POST'])
def create_post():
    if request.method == 'POST':
        title = request.form.get('title')
        content = request.form.get('content')
        category = request.form.get('category')
        author = request.form.get('author')
        featured = request.form.get('featured') == 'on'
        
        if not title or not content or not category or not author:
            flash('Please fill in all required fields.', 'error')
            return render_template('create-post.html')
        
        # Handle image upload
        image_filename = None
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename != '' and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                # Add timestamp to avoid conflicts
                filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{filename}"
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                image_filename = filename
        
        # Create new post
        new_post = {
            'id': str(uuid.uuid4()),
            'title': title,
            'content': content,
            'category': category,
            'date': datetime.now().strftime('%Y-%m-%d'),
            'author': author,
            'featured': featured,
            'image': image_filename
        }
        
        posts_storage.append(new_post)
        flash('Post created successfully!', 'success')
        return redirect(url_for('index'))
    
    return render_template('create-post.html')

@app.route('/edit-post/<post_id>', methods=['GET', 'POST'])
def edit_post(post_id):
    post = get_post_by_id(post_id)
    if not post:
        flash('Post not found.', 'error')
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        post['title'] = request.form.get('title')
        post['content'] = request.form.get('content')
        post['category'] = request.form.get('category')
        post['author'] = request.form.get('author')
        post['featured'] = request.form.get('featured') == 'on'
        
        # Handle image upload
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename != '' and allowed_file(file.filename):
                # Delete old image if exists
                if post['image']:
                    old_image_path = os.path.join(app.config['UPLOAD_FOLDER'], post['image'])
                    if os.path.exists(old_image_path):
                        os.remove(old_image_path)
                
                filename = secure_filename(file.filename)
                filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{filename}"
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                post['image'] = filename
        
        flash('Post updated successfully!', 'success')
        return redirect(url_for('post_detail', post_id=post_id))
    
    return render_template('edit-post.html', post=post)

@app.route('/post/<post_id>')
def post_detail(post_id):
    post = get_post_by_id(post_id)
    if not post:
        flash('Post not found.', 'error')
        return redirect(url_for('index'))
    
    return render_template('post-detail.html', post=post)

@app.route('/delete-post/<post_id>', methods=['POST'])
def delete_post(post_id):
    post = get_post_by_id(post_id)
    if not post:
        flash('Post not found.', 'error')
        return redirect(url_for('index'))
    
    # Delete associated image if exists
    if post['image']:
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], post['image'])
        if os.path.exists(image_path):
            os.remove(image_path)
    
    # Remove post from storage
    posts_storage.remove(post)
    flash('Post deleted successfully.', 'success')
    return redirect(url_for('index'))

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
