# Mini Social Post Application

A full-stack Mini Social Post Application built as part of the Full Stack Internship Assignment.

The application allows users to create accounts, log in, create social posts with text and/or images, view a public feed, like posts, and comment on posts.

The project has been developed according to the assignment requirements using React.js, Node.js, Express.js, and MongoDB.

---

## 🚀 Live Demo

### Frontend
[Add your Vercel/Netlify URL here]

### Backend API
[Add your Render backend URL here]

---

## 📌 Features

### Authentication

- User signup with username, email, and password
- User login with email and password
- Passwords are securely hashed before storing
- JWT-based authentication
- Protected actions for authenticated users
- Logout functionality
- Automatic navigation based on authentication state

### Posts

- Create a post with:
  - Text only
  - Image only
  - Text + image
- At least one of text or image is required
- Public feed displays posts from all users
- Displays username and post content
- Displays uploaded images
- Displays like count
- Displays comment count

### Likes

- Authenticated users can like other users' posts
- Users can unlike a post
- Like count updates immediately in the UI
- Username and user ID of the liker are stored with the post
- Users cannot like their own posts

### Comments

- Authenticated users can comment on posts
- Comment username and content are stored
- Comment count updates immediately
- Comments are displayed below the post
- Responsive comment layout

### Feed

- Clean social-media-inspired interface
- Responsive design
- Public feed
- Pagination / Load More functionality
- Optimistic UI updates for likes
- Loading and error states
- Empty-feed state

### UI/UX

- Dark modern interface
- Responsive layout for desktop, tablet, and mobile
- Consistent color system
- Accessible interactive elements
- Simple and user-friendly interface

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- React Router
- Axios
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer
- Helmet
- CORS

### Database

MongoDB Atlas

The application uses exactly two MongoDB collections:

- `users`
- `posts`

---

## 📂 Project Structure

```text
mini-social-post/
│
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── post.controller.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── upload.middleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Post.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── post.routes.js
│   │   │
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   └── post.service.js
│   │   │
│   │   ├── utils/
│   │   │   ├── jwt.js
│   │   │   └── validation.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── uploads/
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── common/
│   │   │   └── posts/
│   │   │
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── vite.config.js
│
└── README.md

##🔐 Authentication Flow
User
 │
 ├── Signup
 │     │
 │     └── Account created
 │
 ├── Login
 │     │
 │     └── JWT token generated
 │
 └── Feed
       │
       ├── Create Post
       ├── Like Post
       ├── Comment
       └── Logout
