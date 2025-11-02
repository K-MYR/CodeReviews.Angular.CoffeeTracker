# ☕ CodeReviews.Angular.CoffeeTracker

**Full-Stack Coffee Tracker App**  
2nd Angular project developed as part of the [C# Academy](https://www.thecsharpacademy.com/) curriculum. \
**Goal:** Build a fullstack application with Angular and ASP .NET Core, where users can track their coffee consumption

## :bookmark_tabs: Project Description
CodeReviews.Angular.CoffeeTracker is a **full-stack application** that allows users to track their coffee consumption.  
It combines an **Angular (v19)** frontend with an **ASP.NET Core Web API** backend and demonstrates essential production concepts such as authentication, database management, and deployment using Docker and Aspire.

## :clipboard: Requirements

:heavy_check_mark: This is an application where you should record their coffee consumption. \
:heavy_check_mark: You should create two projects: A.NET WebApi and an Angular app. \
:heavy_check_mark: You should have a filter functionality, so users can select records per date. \

---

## :gear: Technologies & Architecture

### Backend
- **ASP.NET Core Web API**
- **Entity Framework Core** with **PostgreSQL**
- **ASP.NET Identity** for authentication and authorization
- **Email sending** with **PapercutSMTP** and **RazorViewEngine** for email templates
- **Automatic database migrations** during development
- **Docker** and **Aspire** for hosting and containerization

### Frontend
- **Angular v19** with **Server-Side Rendering (SSR)**
- **Reactive Forms** for user input
- **Route Guards** for secure navigation
- **HttpClient Services** for API communication
- **Custom validation messages** for user-friendly error handling
- **Responsive UI** (improvements ongoing)

---

## ✅ Features

- Record and visualize daily coffee (or other) consumption  
- Filter records by date range  
- Secure login and registration with Identity  
- Email confirmation workflow (PapercutSMTP in dev mode)  
- Persistent storage using PostgreSQL  
- Works in **Docker** or **Aspire** environments  
- Clean and modular architecture (C# backend + Angular frontend)

## 🚀 Getting Started

You can run the project in two ways: **standard Visual Studio** or **Aspire/Docker containerized deployment**.

### 1. Standard Visual Studio (Development)
1. Open the solution in **Visual Studio**.  
2. Set `CoffeeTracker.K-MYR.AppHost` as the **startup project**.  
3. Ensure Docker is running.  
4. Run the application. Migrations and seed data are applied automatically via hosted services.

### 2. Docker & Aspire (Containerized Deployment)
This method uses **Aspire publish** to generate a Docker Compose setup.

1. Ensure Docker is installed and running.  
2. From the `CoffeeTracker.K-MYR.AppHost` folder run `aspire publish -o <output-directory>`.
3. Copy the provided `.env.example` to the output directory and rename it to .env.
4. Copy the provided `docker-compose.override.example.yaml` to the output directory and rename it to `docker-compose.override.yaml`. 
5. Navigate to the output directory and start the application with: `docker compose up`.

Note: For demo purposes, all users are pre-seeded with email addresses in the format "user{0-20}@test.com" and the password "String!1".

## 🛠️ Planned Features

These are improvements and new features I plan to implement in future iterations of the application:

- **Recipe Section:** Add a dedicated space where users can discover and try out exciting new coffee recipes.
- **Enhanced Responsive Design:** Improve layout and usability for smaller screens and mobile devices.

## ⚠️ Disclaimer

This project is part of my **learning journey toward mastering C# and ASP.NET Core**.  
It demonstrates foundational full-stack skills including **MVC architecture**, **Entity Framework**, **SQL Server integration**, and **front-end interactivity**.

