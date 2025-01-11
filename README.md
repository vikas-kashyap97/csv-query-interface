# CSV Query App

## Overview
The **CSV Query App** is a web application that allows users to upload CSV files and query them using natural language. It streamlines data analysis by providing a user-friendly interface to extract insights without the need for complex SQL queries or programming knowledge. The app is built using **Next.js** and styled with **Tailwind CSS**, with authentication and backend services powered by **Supabase**.

## Live Demo
Experience the app live: [CSV Query App](https://csv-query.netlify.app/login)


## Project Features
- **CSV Upload & Query** – Upload CSV files and interact with the data by asking questions in plain language.
- **Authentication** – Secure user login and registration flows, handled by Supabase.
- **Responsive Design** – The app is fully responsive and adapts to different screen sizes.
- **Dark Mode Support** – Seamless light and dark theme switching based on user preference.
- **Interactive UI** – Built using **Radix UI** for accessible and customizable components.
- **Scalable Architecture** – Modular design to ensure scalability and maintainability.

## Tech Stack
- **Frontend**: Next.js 14, React 18
- **Styling**: Tailwind CSS 3.4.17, Radix UI
- **Backend**: Supabase (Auth & Database)
- **Data Visualization**: Recharts
- **Validation**: Zod
- **State Management**: React Hook Form

## Installation and Setup
### Prerequisites
Ensure Node.js and npm are installed.

### Step-by-step Guide
1. **Clone the repository**:
    ```bash
    git clone https://github.com/vikas-kashyap97/CSV-Query.git
    ```

2. **Navigate to the project directory**:
    ```bash
    cd CSV-Query
    ```

3. **Install dependencies**:
    ```bash
    npm install
    ```

4. **Run the development server**:
    ```bash
    npm run dev
    ```
    Visit `http://localhost:3000` in your browser to view the app.

5. **Build the project for production**:
    ```bash
    npm run build
    ```

6. **Preview the production build**:
    ```bash
    npm run start
    ```

## Project Structure
- **`/src`** – Contains core components, pages, and utility functions.
- **`/public`** – Static assets and images.
- **`/components`** – Reusable React components (UI, forms, modals, etc.).
- **`/pages`** – Next.js pages for routing and views.
- **`package.json`** – Scripts, dependencies, and project metadata.
- **`tailwind.config.js`** – Tailwind CSS configuration.

## Key Components
- **RootLayout** – Manages global styling, theme provider, and Supabase integration.
- **UserHeader** – Dynamic header for authenticated users.
- **Toaster** – Notification component for feedback messages.
- **ThemeProvider** – Manages light/dark mode based on user preferences.

## Code Highlights
- **CSV Parsing & Querying** – Efficient CSV parsing with Papaparse, enabling seamless data querying.
- **Dark Mode Implementation** – Using `next-themes` for theme persistence.
- **Responsive Layout** – Built with flexbox utilities from Tailwind CSS.

### Sample Code:
```jsx
<ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
  <SupabaseProvider>
    <div className="flex flex-col min-h-screen">
      <UserHeader />
      <main className="flex-grow">
        {children}
      </main>
    </div>
    <Toaster />
  </SupabaseProvider>
</ThemeProvider>
```

## Contribution
Contributions are welcome! If you have suggestions or improvements, feel free to open a pull request or create an issue.

## GitHub Repository
👉 [CSV Query App GitHub Repo](https://github.com/vikas-kashyap97/CSV-Query.git)  

⭐ **If you like this project, give it a star! Your support means a lot!**

