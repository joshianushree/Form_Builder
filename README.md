# 📝 Dynamic Form Builder

A **React + TypeScript** application for building, previewing, and managing dynamic forms.  
This project is part of the **upliance.ai Associate Software Developer assignment** and implements form creation with validations, derived fields, and persistent storage using **localStorage**.

---

## 📌 Features

- ✅ Create dynamic forms with customizable fields
- ✅ Field types: Text, Number, Textarea, Select, Radio, Checkbox, Date
- ✅ Configure labels, default values, required toggle, and validation rules
- ✅ Derived fields that auto-compute values from parent fields
- ✅ Preview forms as an end-user with live validations
- ✅ View and manage all saved forms
- ✅ Store form schemas in **localStorage** (no backend required)
- ✅ Reorder and delete fields

---

## 🔧 Technologies Used

### 💻 Frontend

- React.js (with TypeScript)
- Redux Toolkit
- Material UI (MUI)
- CSS
- localStorage API

---

## 🗂️ Project Structure
```
form-builder/
src/
├── components/         # Reusable UI components (Field editors, Navbar, etc.)
├── pages/              # Page-level components (/create, /myforms, /preview)
├── router/             # Route configuration
├── store/              # Redux slices and store setup
├── styles/             # Global styles
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── App.tsx             # App entry point
└── index.tsx           # React DOM render
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/joshianushree/Form_Builder
cd form-builder
```
###2️⃣ Install Dependencies
```
npm install
```
###3️⃣ Run the App
```
npm start
```
✅ App will run at: http://localhost:3000

###📦 Build for Production
```
npm run build
```
###🌐 Deployment
Deployed on Netlify:
Live Demo: https://form-builder-101.netlify.app

##🏗️ Architecture Overview
```
+-------------------+
|   React (MUI)     |
+---------+---------+
          |
          | Redux State + localStorage
          |
+---------v---------+
| Form Schema Store |
+-------------------+
```
##🔄 Data Flow
User builds a form in /create page

Schema is saved to localStorage

/preview renders the form with configured validations

Derived fields auto-update based on parent fields

/myforms lists all stored forms with name & creation date

##📡 Routes
/create — Build a new form

/preview — Preview current form as an end user

/myforms — View all saved forms

##🙋‍♂️ Contact
Feel free to open issues or submit pull requests on the GitHub repository.
