# 📝 MansBlog

<p align="center">
  <img src="./mans-logo.png" alt="MansBlog Logo" width="180"/>
</p>

<p align="center">
  <a href="https://www.python.org/"><img src="https://img.shields.io/badge/python-3.9%2B-blue" alt="Python"></a>
  <a href="#-license"><img src="https://img.shields.io/badge/license-MIT-green" alt="License"></a>
  <a href="https://github.com/mrvoidx/mansblog/commits/main"><img src="https://img.shields.io/github/last-commit/mrvoidx/mansblog" alt="Last Commit"></a>
  <img src="https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen" alt="Dependencies">
</p>

---

## 📌 About

**MansBlog** is a simple and elegant blogging platform built with **Python** and **HTML/CSS/JavaScript**.  
It lets users create, edit, and manage blog posts through a clean and responsive interface.  

This project was developed as part of a **university coursework project** and is designed to be minimal, well-structured, and easy to extend.

---

## ✨ Features

- 📰 Create, edit, and delete blog posts  
- 🎨 Clean, responsive design (works on desktop & mobile)  
- 📝 Rich-text editor for posts  
- 📂 Organized codebase (HTML, CSS, JS, Python)  
- ⚡ Lightweight and beginner-friendly setup  

---

## 🛠️ Tech Stack

- **Backend:** Python (Flask)  
- **Frontend:** HTML5, CSS3, JavaScript  
- **Database:** SQLite (or replace with your choice)  
- **Styling:** Custom CSS  

---

## 🚀 Installation & Usage

Follow these steps to run the project locally:

1. **Clone the repository**
   ```bash
   git clone https://github.com/mrvoidx/mansblog.git
   cd mansblog
   ```

2. **Create & activate a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate   # On Linux/Mac
   venv\Scripts\activate      # On Windows
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements_manual.txt
   ```

4. **Run the app**
   ```bash
   python run.py
   ```

5. **Open your browser**
   ```
   http://127.0.0.1:5000/
   ```

---

## 📂 Project Structure

```
mansblog/
│── index.html           # Homepage
│── about-us.html        # About page
│── contact.html         # Contact page
│── post-detail.html     # Blog post view
│── create-post.html     # Create new post
│── edit-post.html       # Edit post
│── main.py              # Core backend logic
│── run.py               # App entry point
│── style.css            # Custom styles
│── post-editor.js       # Post editor logic
│── requirements_manual.txt
│── mans-logo.png / .svg # Logo assets
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to fork this repo and submit a pull request.  

Steps:  
1. Fork the project  
2. Create your feature branch (`git checkout -b feature/my-feature`)  
3. Commit your changes (`git commit -m "Add new feature"`)  
4. Push to the branch (`git push origin feature/my-feature`)  
5. Open a Pull Request  

---

## 📜 License

MIT License © 2025 MrVoidx  

Permission is hereby granted, free of charge, to any person obtaining a copy  
of this software and associated documentation files (the “Software”), to deal  
in the Software without restriction, including without limitation the rights  
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell  
copies of the Software, and to permit persons to whom the Software is  
furnished to do so, subject to the following conditions:  

The above copyright notice and this permission notice shall be included in  
all copies or substantial portions of the Software.  

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR  
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,  
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE  
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER  
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING  
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS  
IN THE SOFTWARE.  
