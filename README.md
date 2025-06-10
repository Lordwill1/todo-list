# Just List It.

## A Simple To-Do List Web App

![Just List It. Landing Page](images/landing-page.png)

### *About*:
Just List It is a straightforward web-based to-do list application developed with JavaScript. This project forks an open-source repository [Lordwill1/todo-list](https://github.com/Lordwill1/todo-list).

Its primary goal is to help users to record, manage, and complete their daily tasks. A key feature is that tasks are stored securely within each user's individual account, ensuring personalized and persistent access to their to-do lists.

To ensure rapid and reliable deployments, we implemented CI/CD for the project. It automatically builds the application, runs the unit tests, and deploys the app to the server.

### *Features*:
* User Registration & Login
* Personalized to-do list manager
* Themes: Users can choose from several theme options
* Cloud-based storage

### *Tools Used*:
* JavaScript
* Node.js
* Firebase (Authentication & Firestore)
* Github Actions
* Docker
* Jest
* Terraform

## **Getting Started**
To get a copy of "Just List It", follow these simple steps.
### *Prerequisites*:
Before you begin, ensure that you have installed the following in your system:
* Node.js
    * Make sure you have Node.js and npm (Node Package Manager) installed.
    * You can download it from [nodejs.org](nodejs.org).
* Git
    * For cloning the repository
    * You can download it from [git-scm.com](git-scm.com).
* Firebase Project
    * This "Just List It" project uses Firebase Authentication and Firestore.
    * === (*This readme part has not been completed yet.) ===

### *Installation*:
1. **Clone the Repository:**
```sh
git clone https://github.com/luthfan-ap/todo-list-devops-project.git
cd todo-list
```
2. **Install Dependencies (with NPM):**
```sh
npm install
```

### *Configuration:*
1. Set up the Firebase Environment Variables:

=== (*This readme part has not been completed yet.) ===


## **CI/CD Pipeline Overview**
This project implemented a Continuous Integration / Continuous Delivery (CI/CD) Pipeline to automate the software delivery process, ensuring a rapid and reliable deployments.

### *Pipeline Workflow*

![CI/CD Diagram Workflow](images/ci-cd-diagram.png)

Our CI/CD pipeline is automatically triggered by several specific events in the git repository:

* **Trigger:** Any *push* to the master branch or a *pull request* from the master branch will trigger the CI/CD Pipeline.
* **Build:**
    * Pulled the repository source codes.
    * Dependencies are installed.
    * The application is built into a production-ready container.
* **Test:**
    * Tests are done using Jest unit tests, which will be executed to the application that has just been built.
    * If any of the test failed, the pipeline will stop immediately and returns an error.
* **AWS Authentication:**
    * Authenticates to your AWS account
* **Push Image to AWS ECR:**
    * The built docker image will be pushed into AWS
    * Uses AWS ECR for storing the Docker images
* **Containerization & Deployment:**
    * The built application are dockerized and deployed to the server environment
    * In this project, we use EC2 (Elastic Compute Cloud) as our server infrastructure.

<!-- 
## *WEBSITE DEMO*

![Screenshot (771)](https://user-images.githubusercontent.com/61280281/99399713-0844b900-290c-11eb-8d7c-1199319b4a9e.png)

![Screenshot (772)](https://user-images.githubusercontent.com/61280281/99399731-0da20380-290c-11eb-8a59-e0a2e5f9b19f.png)

![Screenshot (773)](https://user-images.githubusercontent.com/61280281/99399728-0d096d00-290c-11eb-9ee5-59cc8358676c.png)

![Screenshot (774)](https://user-images.githubusercontent.com/61280281/99399723-0b3fa980-290c-11eb-8728-03d974be548d.png)
-->
