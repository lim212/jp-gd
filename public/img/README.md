# Beach background image for banner slider

Place your beach background image here as `beach.webp` (required) with file size ≤ 200 KB.

This image is referenced by CSS at `/img/beach.webp` to replace the old black background behind the banner slider.

Path on your machine (Windows):
```
C:\Users\FELIX\WebstormProjects\jasapembayaran-new\public\img\beach.webp
```
At runtime it will be served at:
```
/img/beach.webp
```

Recommended properties:
- Format: WebP (lossy) for best compression
- Dimensions: at least 1920×1080 (or 1600×900) to look sharp on large screens
- File size: ≤ 200 KB (hard requirement for this project request)
- Subject: A calm beach scene that works well as a subtle background

Compression tips:
- Online: https://squoosh.app — open your image, choose WebP, set Quality around 60–75, check size, and download.
- CLI with libwebp:
  ```powershell
  # Install on Windows via winget or download from Google libwebp releases
  cwebp input.jpg -q 70 -m 6 -mt -o beach.webp
  ```
  Try different `-q` values to keep it ≤ 200 KB.

Notes:
- Do not change the filename or CSS reference; the code expects exactly `/img/beach.webp`.
- The component adds a subtle dark overlay to keep texts/elements readable over the background.
- You can swap the image anytime; just overwrite `beach.webp` here and redeploy.
