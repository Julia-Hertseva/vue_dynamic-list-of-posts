# 📄 Vue Dynamic List of Posts

A responsive Vue 3 application for browsing posts, viewing post details, reading comments, and adding new ones.
The project interacts with a remote API and demonstrates state management, async request handling, CRUD operations for comments, and dynamic UI rendering with side navigation.

👉 **[Live Demo](https://julia-hertseva.github.io/vue_dynamic-list-of-posts/)**

---

## 🧩 Features
**📰 Posts & Users**

- Fetch & display list of posts
- Load post details dynamically
- Display post author information

**💬 Comments**

- View comments for selected post
- Add new comments
- Delete comments
- Loading & error handling UI

**🔥 UI/UX Functionality**

- Sidebar for post preview
- Smooth async updates with loaders
- Responsive layout
- Form validation

**🧠 State & Data Handling**

- Modular API service structure (posts.ts, users.ts, comments.ts)
- Async/await + error handling
- Separation of UI & business logic
- Reusable input components

---

## 🧩 Tech Stack

| Technology | Usage |
|-----------|-------|
| Vue 3 (Composition API) | App logic, reactivity, component architecture |
| TypeScript | Type safety & maintainable codebase |
| Vite | Fast build tool & development server |
| Axios | API requests handling |
| SCSS | Styles structuring & customization |
| Mate Academy API | Remote REST API used as backend for posts, comments & users |

---

## 🚀 Running the Project Locally

```bash
# Clone the repo
git clone https://github.com/Julia-Hertseva/vue_dynamic-list-of-posts.git

# Navigate into the folder
cd vue_dynamic-list-of-posts

# Install dependencies
npm install

# Start development server
npm run dev
