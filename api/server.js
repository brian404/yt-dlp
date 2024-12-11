const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const app = express();
const PORT = 3000;

const cookiesPath = path.resolve(__dirname, 'cookies.txt');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/yt', (req, res) => {
    const url = req.query.url;
    const format = req.query.format || 'mp4';
    const ytDlpArgs = [
        '--verbose',
        '--quiet',
        '--no-warnings',
        '--no-progress',
        '--no-check-certificates',
        '--prefer-ffmpeg',
        '--no-cache-dir',
        '--no-call-home',
        '--restrict-filenames',
        '--cookies', cookiesPath,
        '--output', '-'
    ];

    if (format === 'mp3') {
        ytDlpArgs.push(
            '-x',
            '--audio-format', 'mp3',
            '--audio-quality', '2',
            '-f', 'ba[filesize<50M]'
        );
    } else {
        ytDlpArgs.push(
            '-f', 'b[filesize<100M]',
            '--merge-output-format', 'mp4'
        );
    }

    ytDlpArgs.push(url);

    const downloadProcess = spawn('yt-dlp', ytDlpArgs, {
        stdio: ['ignore', 'pipe', 'pipe'],
        windowsHide: true
    });

    res.setHeader('Content-Type', format === 'mp3' ? 'audio/mpeg' : 'video/mp4');

    let dataReceived = false;
    const timeout = setTimeout(() => {
        if (!dataReceived) {
            downloadProcess.kill();
            if (!res.headersSent) {
                res.status(504).json({ error: 'Download timeout' });
            }
        }
    }, 20000);

    downloadProcess.stdout.on('data', (data) => {
        dataReceived = true;
    });

    downloadProcess.stderr.on('data', (data) => {
        console.error(`yt-dlp error: ${data}`);
    });

    downloadProcess.on('error', (error) => {
        clearTimeout(timeout);
        console.error(`Process error: ${error.message}`);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Download process failed' });
        }
    });

    downloadProcess.stdout.pipe(res);
    res.on('close', () => {
        clearTimeout(timeout);
        downloadProcess.kill();
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
