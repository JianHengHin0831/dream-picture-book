# Dream Picture Book

*Turn your world into a storybook.*

Dream Picture Book is an AI-powered interactive storytelling platform that transforms photos of your everyday objects into unique, illustrated fairy tales. This project was created for the LuminHacks hackathon.

**[Live Demo](https://dream-picture-book.vercel.app/)**

## Table of Contents

- [About The Project](#about-the-project)
- [Key Features](#key-features)
- [How It Works](#how-it-works)
- [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Environment Variables](#environment-variables)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## About The Project

In a world filled with digital noise, Dream Picture Book was created to rediscover the magic hidden in our everyday lives. It leverages the power of generative AI to transform the mundane into the magical, allowing anyone—regardless of their creative or technical skills—to craft a personal, healing story.

By simply uploading a photo of a common object, users can bring a new character to life, engage in a warm and positive conversation, and watch as their unique tale unfolds with dynamically generated illustrations. The final result is a complete, shareable storybook summary, turning a simple interaction into a cherished memory.

## Key Features

- **AI Story & Image Generation:** Uses GPT-4o to analyze an uploaded image and DALL-E 3 to create a beautiful, storybook-style illustration and a unique story prompt.
- **Interactive Chat:** A real-time, streaming conversation with the AI character, guided by a system prompt designed to ensure a consistently warm, positive, and healing tone.
- **Dynamic Illustration Generation:** The AI can generate new illustrations on-the-fly based on the conversation's context, visually building the story chapter by chapter.
- **Automated Story Summary:** At the end of the chat, the entire interaction is summarized into a short narrative, presented alongside a slideshow of all generated images and a farewell message from the character.
- **Fully Responsive Design:** A clean, accessible, and seamless user experience on both desktop and mobile devices.

## How It Works

1.  **Upload a Photo:** Start by uploading a picture of any object.
2.  **AI Creates the World:** The application analyzes the image and generates an initial story concept and the first illustration.
3.  **Name Your Character:** Give your new character a name to begin the adventure.
4.  **Start the Conversation:** Engage in a live chat with your character. As the dialogue progresses, new story elements and images may be generated.
5.  **View Your Story:** Once finished, click "End Chat" to see a complete summary of your unique tale.

## Built With

This project was built using a modern, full-stack approach with Nuxt.js.

- **Framework:** [Nuxt.js 3](https://nuxt.com/)
- **Frontend:** [Vue.js 3](https://vuejs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Backend Server:** [Nitro](https://nitro.unjs.io/) (Nuxt's server engine)
- **AI Services:** [OpenAI API](https://openai.com/api/) (GPT-4o & DALL-E 3)
- **Deployment:** [Vercel](https://vercel.com/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have Node.js (version 18.x or newer) and a package manager like npm installed on your machine.

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/JianHengHin0831/dream-picture-book.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd dream-picture-book
    ```
3.  **Install NPM packages:**
    ```sh
    npm install
    ```
4.  **Set up your environment variables:**
    Create a file named `.env` in the root of the project and add your OpenAI API key. See the [Environment Variables](#environment-variables) section below for details.

5.  **Run the development server:**
    ```sh
    npm run dev
    ```
6.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

To run this project, you will need to add the following environment variable to your `.env` file.

`NUXT_OPENAI_API_KEY` - Your API key from OpenAI.

**Example .env file:**

```
NUXT_OPENAI_API_KEY='sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
```

## License

Distributed under the MIT License. See `LICENSE` file for more information.

## Acknowledgments

- This project was built for the **LuminHacks** hackathon.
- Thanks to the creators of Nuxt.js, OpenAI, and Tailwind CSS for their incredible tools.
