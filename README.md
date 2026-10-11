### TakshaHub

<em>A school management platform for organizing school operations and connecting administrators, teachers, and students.</em>


<p align="left">
  <img src="https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white" alt="Next.js" />
  &nbsp;
  <img src="https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB" alt="React" />
  &nbsp;
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
  &nbsp;
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  &nbsp;
  <img src="https://img.shields.io/badge/Redux_Toolkit-764ABC?style=flat&logo=redux&logoColor=white" alt="Redux Toolkit" />
  &nbsp;
  <img src="https://img.shields.io/badge/TanStack_Query-FF4154?style=flat&logo=reactquery&logoColor=white" alt="TanStack Query" />
</p>

<hr />

### 🚀 About the project

**TakshaHub** is a Next.js frontend for school management. It includes a public landing page, registration and login screens, and role-based portals for administrators, teachers, and students. The portals use a separate backend API; the backend itself is not included in this repository.

### ✨ Features

<table>
  <tr>
    <td valign="top">

- ✅ Public school-focused landing page with pricing, features, testimonials, and FAQs
- ✅ Registration and login flows with role-based routing
- ✅ Admin tools for organization members, roles, and permissions
- ✅ Manage classes, subjects, student enrollments, and teacher assignments
- ✅ Attendance screens for students and teachers

</td>
    <td valign="top">

- ✅ Academic-year management and academic planning screens
- ✅ Teacher and student profile settings
- ✅ Permission-driven navigation and protected role portals
- ✅ Backend API integration through a same-origin proxy
- ✅ Responsive interface, form validation, and toast notifications

</td>
  </tr>
</table>


### 🛠️ Tech Stack

| Frontend | State & Data | UI & Utilities |
|:--------:|:------------:|:--------------:|
| Next.js 16, React 19, TypeScript, Tailwind CSS 4 | Redux Toolkit, TanStack Query, Axios | RSuite, Framer Motion, Lucide React, React Toastify, jose |

### 📷 Screenshots

Product screenshots are not currently included in the repository. The images in `public/` are landing-page artwork rather than screenshots of the management portals.

### 🚀 Getting Started

<table>
  <tr>
    <td valign="top" width="40%">

#### Prerequisites

- **Node.js** (v20.9 or newer)
- **npm**
- Access to the TakshaHub backend API for authentication and portal data

#### ⚙️ Environment Variables

Create a `.env.local` file in the project root and add:

```env
JWT_SECRET=replace_with_a_long_random_secret
API_BASE_URL=http://localhost:3030
NEXT_PUBLIC_API_BASE_URL=http://localhost:3030
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

`JWT_SECRET` is required by the route proxy. Set both API URL variables to the backend origin (without a trailing `/api`); replace `http://localhost:3030` with the deployed backend URL when using a hosted API. `NEXT_PUBLIC_APP_URL` is used for server-side requests to this app and defaults to `http://localhost:3000`.

> 💡 Never commit `.env.local` or expose a production JWT secret.

</td>
    <td valign="top" width="60%">

#### Installation

1. Clone the repository

```bash
   git clone https://github.com/NEELSAMEL19/Takshahub.git
   cd Takshahub
```

2. Install dependencies

```bash
   npm install
```

3. Start the frontend

```bash
   npm run dev
```

4. Open the app in your browser

```bash
   http://localhost:3000
```

</td>
  </tr>
</table>

### 🔗 API Endpoints (Base URL: `NEXT_PUBLIC_API_BASE_URL`)

| Area | Frontend endpoint prefix | Description | Auth Required |
|:----:|--------------------------|-------------|:-------------:|
| Authentication | `/api/backend/auth/*` | Register, log in/out, and fetch the current user | Register/login: No; otherwise: Yes |
| Navigation | `/api/backend/sidebar` | Load role- and permission-aware navigation | Yes |
| Organization | `/api/backend/organization/roles/*`, `/api/backend/organization/member/*` | Manage roles and organization members | Yes |
| Management | `/api/backend/management/class/*`, `/subject/*`, `/students/*`, `/class_teacher/*`, `/subject_teacher/*` | Manage classes, subjects, enrollments, and teacher assignments | Yes |
| Attendance | `/api/backend/attendance/students/*`, `/teachers/*` | Read and update student and teacher attendance | Yes |
| Academics | `/api/backend/academic/academic_years/*` | Manage and activate academic years | Yes |
| Permissions | `/api/backend/permissions/template` | Retrieve permission templates | Yes |
| Profile | `/api/backend/setting/profile/*` | Read and update the current profile | Yes |

The frontend calls these same-origin `/api/backend` routes. [proxy.ts](./proxy.ts) rewrites them to the backend’s `/api` routes using `API_BASE_URL`. The backend API is a separate service and must be available for these features to work.

### 📁 Project Structure

```text
Takshahub/
├── app/
│   ├── (auth)/           # Login and registration routes
│   ├── (dashboard)/      # Admin, teacher, and student portals
│   └── (main)/           # Public landing page
├── components/
│   ├── Base/             # Shared navigation, layout, and auth components
│   └── UI/               # Reusable interface components
├── features/
│   ├── academic/
│   ├── attendance/
│   ├── auth/
│   ├── management/
│   ├── organization/
│   ├── sidebar/
│   ├── Student_Setting/
│   └── Teacher_Setting/
├── hooks/                # Feature and API query/mutation hooks
├── service/              # API clients, endpoint definitions, and services
├── store/                # Redux store and typed hooks
├── types/                # Shared TypeScript data types
├── utils/                # Shared helpers, errors, and notifications
├── website/              # Public landing-page sections
├── public/               # Logos and static artwork
├── proxy.ts              # Backend rewrites and role-based route checks
├── package.json
├── package-lock.json
├── bun.lock
├── next.config.ts
├── tsconfig.json
└── README.md
```

<table>
  <tr>
    <td valign="top" width="50%">

#### 👥 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests for features, bug fixes, and UI improvements.

</td>
    <td valign="top" width="50%">

#### 📄 License

No license file is currently included in this repository.

</td>
  </tr>
</table>


Made with ❤️ by [Neel Samel](https://github.com/NEELSAMEL19)
