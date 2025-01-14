from flask import Flask, jsonify, request, send_from_directory
from yt_dlp import YoutubeDL
import os
from pathlib import Path
import subprocess

app = Flask(__name__)

# Define video storage directory
VIDEO_DIR = Path('./static/videos')
VIDEO_DIR.mkdir(parents=True, exist_ok=True)


def compress_video(file_path):
    """
    Compress the video using FFmpeg while maintaining quality.
    """
    compressed_path = file_path.with_name(f"compressed_{file_path.stem}_compressed.mp4")
    try:
        subprocess.run(
            [
                'ffmpeg', '-i', str(file_path), '-vcodec', 'libx264', '-crf', '23',
                '-preset', 'medium', '-acodec', 'aac', '-b:a', '128k', str(compressed_path)
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True
        )
        return compressed_path
    except Exception as e:
        print(f"Error during compression: {e}")
        return None


@app.route('/')
def home():
    """
    Home route to display a welcome message or basic info.
    """
    return jsonify({'message': 'Welcome to the YouTube Video Downloader API!'})


@app.route('/download', methods=['POST'])
def download_video():
    """
    Handle video download and optional compression.
    """
    data = request.json
    url = data.get('url')
    platform = data.get('platform', 'general')
    compress = data.get('compress', False)

    if not url:
        return jsonify({'error': 'No URL provided.'}), 400

    # Prepare output path
    output_path = VIDEO_DIR / platform
    output_path.mkdir(parents=True, exist_ok=True)
    options = {
        'format': 'bestvideo+bestaudio/best',
        'outtmpl': str(output_path / '%(title)s.%(ext)s'),
        'merge_output_format': 'mp4',
    }

    try:
        # Download the video
        with YoutubeDL(options) as ydl:
            info = ydl.extract_info(url, download=True)
            downloaded_file = Path(ydl.prepare_filename(info)).with_suffix('.mp4')

        # Optionally compress the video
        compressed_file = None
        if compress:
            compressed_file = compress_video(downloaded_file)
            if compressed_file:
                return jsonify({
                    'video_path': os.path.relpath(compressed_file, './static'),
                    'original_size': os.path.getsize(downloaded_file) / (1024 * 1024),
                    'compressed_size': os.path.getsize(compressed_file) / (1024 * 1024),
                })
            else:
                return jsonify({'error': 'Compression failed.'}), 500

        # Return the original video path if no compression
        return jsonify({'video_path': os.path.relpath(downloaded_file, './static')})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/videos/<path:filename>')
def serve_video(filename):
    """
    Serve the downloaded or compressed video file.
    """
    file_path = VIDEO_DIR / filename
    if not file_path.exists():
        return jsonify({'error': 'File not found.'}), 404
    return send_from_directory(file_path.parent, file_path.name)


if __name__ == "__main__":
    app.run(debug=True)
