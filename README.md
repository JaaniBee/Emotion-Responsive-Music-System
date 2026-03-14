# Emotion-Responsive Music System

## Overview
The Emotion-Responsive Music System is a web application that aims to detect a user's emotional state and recommend/play music accordingly to match or improve their mood.

## Project Structure
- `app.py`: The main Flask application backend.
- `templates/`: Contains HTML files used for the web interfaces.
- `static/`: Contains static assets like CSS stylesheets and JavaScript files.
- `requirements.txt`: Python package dependencies.

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/JaaniBee/Emotion-Responsive-Music-System.git
   cd Emotion-Responsive-Music-System
   ```
2. Set up a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the application:
   ```bash
   python app.py
   ```
5. Open your browser and navigate to `http://localhost:5000`

## Features
* **Emotion Detection**: (Will integrate facial/audio recognition)
* **Music Recommendation**: Analyzes mood to query relevant music.
* **Modern UI**: Clean and responsive visual interface.

## Tech Stack
* Python / Flask
* HTML, CSS, JavaScript

## License
This project is open-source.
