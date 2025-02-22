# Users API Backend & React Frontend

### Backend:
- **Node.js**
- **Express.js**
- **In-Memory Storage** (for temporary user data)
- **JSON Web Tokens (JWT)** for authentication
- **Cookie Parser & CORS** for secure cross-origin requests
 
### Frontend:
- **React**
- **Tailwind CSS**

## Features

- **Register Page (Sign Up):**  
  Create a new user account. The user data is stored in memory, and a JWT token is generated and sent as an HTTP-only cookie.

- **Login Page:**  
  Authenticate user credentials. Upon successful login, a JWT is generated and stored in a secure cookie. The user is then redirected to the Home page.

- **Profile Page:**  
  A protected page accessible only to authenticated users. The profile page retrieves the user's details by sending a request to a protected backend endpoint, which verifies the JWT.

- **Logout:**  
  Clear the JWT cookie to log the user out.

> **Note:**  
> Ensure that your CORS settings in the backend allow requests from the frontend's origin (e.g., `http://localhost:5173` or `http://localhost:5175`).

## Installation

### Clone the Repository

Clone the repository and navigate to the project directory:

```bash
git clone https://github.com/07asn/Front-Back-NodeJS.git
cd your-repo
npm install express cors cookie-parser jsonwebtoken
nodemon app.js

## 🖼️ Project Preview  
Below are some screenshots from the project:


### 📸 Preview 1  
![Preview 1](https://drive.google.com/uc?export=view&id=1Rci514lm8SDtuMzKGok5AThr-tfrM4R_)

### 📸 Preview 2  
![Preview 2](https://drive.google.com/uc?export=view&id=1iuOQZ6n4xYb7M-rFi7va2YcxRqMJcRJ7)

### 📸 Preview 3  
![Preview 3](https://drive.google.com/uc?export=view&id=1LAJAGvtETIlGLzVBdYo9nQTdouHBG3Y5)

