# YouTube Downloader API
Express.js API to download YouTube videos or audio using yt-dlp.

## Requirements

- **Node.js**
- **Python (3.9 or higher**
- **FFmpeg**
- **Cookies File**: Add your YouTube cookies in `cookies.txt` (Netscape format).

1. Clone the repository:

    ```bash
    git clone https://github.com/brian404/yt-dlp.git
   cd yt-dlp/api
    ```

2. Install dependencies:

    ```bash
    npm i
    ```

3. start the server:

    ```bash
    npm start
    ```
    ## Usage
Endpoint: /api/yt

Method: GET

Query Parameters:

url (required): YouTube video URL.

format (optional): mp3 or mp4. Defaults to mp4.

## examples
Download Video:

http://localhost:3000/api/yt?url=https://www.youtube.com/watch?v=example

Download Audio:

http://localhost:3000/api/yt?url=https://www.youtube.com/watch?v=example&format=mp3

## Disclaimer
Respect YouTube's Terms of Service when using this tool. Misuse of authentication tokens can lead to account suspension.

Be cautious when using your cookies.txt file. Exposing your cookies can lead to unauthorized access to your YouTube account and compromise your privacy
