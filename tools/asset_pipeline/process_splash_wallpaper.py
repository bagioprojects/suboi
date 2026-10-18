import os
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw
import numpy as np

ART_DIR = r"C:\Users\CASPER\.gemini\antigravity-ide\brain\71773aa2-9828-4bd7-88be-12ae8f122523"
SRC_WALLPAPER = os.path.join(ART_DIR, "hubio_vertical_splash_wallpaper_1792288122374.jpg")
ASSETS_SPLASH_DIR = r"c:\Hubio\assets\splash"

def process_splash_wallpaper():
    print(f"Loading generated 3D splash wallpaper from: {SRC_WALLPAPER}...")
    img = Image.open(SRC_WALLPAPER).convert("RGB")
    w, h = img.size
    print(f"Original Wallpaper Size: {w}x{h}")

    # Resize to standard ultra-crisp mobile vertical resolution: 1080 x 1920
    target_w, target_h = 1080, 1920
    resized = img.resize((target_w, target_h), Image.Resampling.LANCZOS)

    # Enhance crispness for retina screens
    sharpener = ImageEnhance.Sharpness(resized)
    sharpened = sharpener.enhance(1.2)

    contrast = ImageEnhance.Contrast(sharpened)
    enhanced = contrast.enhance(1.05)

    # Seamless Edge Feathering to exact Obsidian (#050811)
    # Target obsidian color: (5, 8, 17)
    base_color = (5, 8, 17)
    arr = np.array(enhanced, dtype=np.float32)

    # Create smooth vignette mask towards the edges
    # Top and bottom fade
    fade_top = 180
    fade_bottom = 220
    fade_sides = 60

    for y in range(target_h):
        alpha_y = 1.0
        if y < fade_top:
            alpha_y = float(y) / fade_top
        elif y > (target_h - fade_bottom):
            alpha_y = float(target_h - y) / fade_bottom

        # Smooth Hermite interpolation
        alpha_y = alpha_y * alpha_y * (3 - 2 * alpha_y)

        for x in range(target_w):
            alpha_x = 1.0
            if x < fade_sides:
                alpha_x = float(x) / fade_sides
            elif x > (target_w - fade_sides):
                alpha_x = float(target_w - x) / fade_sides

            alpha_x = alpha_x * alpha_x * (3 - 2 * alpha_x)

            alpha = min(alpha_y, alpha_x)

            # Blend pixel with base_color
            arr[y, x] = arr[y, x] * alpha + np.array(base_color, dtype=np.float32) * (1.0 - alpha)

    final_arr = np.clip(arr, 0, 255).astype(np.uint8)
    final_img = Image.fromarray(final_arr, 'RGB')

    output_path = os.path.join(ASSETS_SPLASH_DIR, "hubio_3d_splash_wallpaper.png")
    final_img.save(output_path, "PNG", optimize=True)
    print(f"Successfully generated seamless 3D wallpaper: {output_path}")

    # Also save an optimized version for fast initial render
    preview_img = final_img.resize((540, 960), Image.Resampling.LANCZOS)
    preview_path = os.path.join(ASSETS_SPLASH_DIR, "hubio_3d_splash_wallpaper_preview.png")
    preview_img.save(preview_path, "PNG", optimize=True)
    print(f"Saved optimized wallpaper: {preview_path}")

if __name__ == "__main__":
    process_splash_wallpaper()
