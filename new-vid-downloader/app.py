from flask import Flask, render_template, request, jsonify, send_from_directory
import os
from yt_dlp import YoutubeDL
from pathlib import Path
import subprocess

app = Flask(__name__)


def list_formats(url):
    try:
        with YoutubeDL({'listformats': True}) as ydl:
            info_dict = ydl.extract_info(url, download=False)
            formats = info_dict.get('formats', [])
            format_list = []
            for f in formats:
                format_list.append({
                    'id': f.get('format_id', 'N/A'),
                    'ext': f.get('ext', 'N/A'),
                    'resolution': f.get('resolution', 'N/A'),
                    'fps': f.get('fps', 'N/A'),
                    'filesize': f.get('filesize', 'Unknown size'),
                    'protocol': f.get('protocol', 'N/A'),
                    'vcodec': f.get('vcodec', 'N/A'),
                    'acodec': f.get('acodec', 'N/A')
                })
            return format_list
    except Exception as e:
        return {'error': str(e)}


def get_file_size(file_path):
    """Get the file size in MB."""
    return os.path.getsize(file_path) / (1024 * 1024)  # Convert bytes to MB


def compress_video(file_path, output_path):
    compressed_file_path = str(Path(output_path) / f"compressed_{Path(file_path).name}")
    try:
        print(f"Compressing video: {file_path}")
        subprocess.run(
            [
                'ffmpeg', '-i', file_path, '-vcodec', 'libx264', '-crf', '23',
                '-preset', 'medium', '-acodec', 'aac', '-b:a', '128k', compressed_file_path
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True
        )
        return compressed_file_path
    except Exception:
        return None


def download_video(url, platform):
    try:
        # Set up the folder for the specific platform
        output_dir = Path(platform.lower())
        output_dir.mkdir(parents=True, exist_ok=True)
        output_template = str(output_dir / '%(title)s.%(ext)s')

        # High-quality download options
        options = {
            'format': 'bestvideo+bestaudio/best',
            'merge_output_format': 'mp4',
            'outtmpl': output_template,
            'quiet': False,
        }

        with YoutubeDL(options) as ydl:
            info_dict = ydl.extract_info(url, download=True)
            downloaded_file = ydl.prepare_filename(info_dict).replace('.webm', '.mp4')
            print(f"Downloaded file: {downloaded_file}")

        # Return the downloaded file path
        return {"downloaded": downloaded_file, "compressed": None}

    except Exception as e:
        return {'error': str(e)}


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/formats', methods=['POST'])
def formats():
    url = request.json.get('url')
    if not url:
        return jsonify({'error': 'No URL provided.'})
    formats = list_formats(url)
    return jsonify(formats)


@app.route('/download', methods=['POST'])
def download():
    data = request.json
    url = data.get('url')
    platform = data.get('platform', 'general').lower()
    if not url:
        return jsonify({'error': 'No URL provided.'})
    if platform not in ['youtube', 'instagram', 'pinterest']:
        return jsonify({'error': f"Invalid platform '{platform}'. Choose from YouTube, Instagram, or Pinterest."})

    # Download the video
    result = download_video(url, platform)
    if "error" not in result:
        video_file = result.get("downloaded")
        relative_path = os.path.relpath(video_file, os.getcwd())
        return jsonify({"video_path": relative_path, "platform": platform})
    return jsonify(result)


@app.route('/videos/<path:filename>')
def serve_video(filename):
    """Serve the downloaded video file for preview."""
    directory = os.path.dirname(filename)
    file = os.path.basename(filename)
    return send_from_directory(directory, file)

# Updated Flask routes
@app.route('/history')
def get_history():
    # You might want to implement server-side history storage
    return jsonify([])  # Currently using client-side storage

# Keep other routes the same
if __name__ == "__main__":
    app.run(debug=True, port=5001)
