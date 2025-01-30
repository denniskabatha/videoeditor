document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("videoForm");
    const progressBarContainer = document.getElementById("progress-container");
    const progressBar = document.getElementById("progress-bar");
    const status = document.getElementById("status");
    const previewSection = document.getElementById("preview-section");
    const videoPreview = document.getElementById("videoPreview");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const platform = document.getElementById("platform").value;
        const url = document.getElementById("videoUrl").value.trim();
        if (!url) return;

        // Reset the UI
        status.innerHTML = "";
        previewSection.style.display = "none";
        videoPreview.src = "";
        progressBarContainer.style.display = "block";
        progressBar.style.width = "0%";

        // Start download process
        const response = await fetch("/download", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url, platform }),
        });

        const result = await response.json();

        // Update progress bar
        progressBar.style.width = "100%";

        // Handle response
        if (result.error) {
            status.innerHTML = `<p class="error">Error: ${result.error}</p>`;
        } else {
            status.innerHTML = `
                <p class="success">👍 Download Complete!</p>
                <p>Downloaded File: ${result.downloaded || "N/A"}</p>
                <p>Compressed File: ${result.compressed || "No compression needed"}</p>
            `;

            // Show video preview if platform is Instagram or Pinterest
            if (platform === "instagram" || platform === "pinterest") {
                const videoPath = result.video_path;
                previewSection.style.display = "block";
                videoPreview.src = `/videos/${videoPath}`;
            }
        }
    });
});
