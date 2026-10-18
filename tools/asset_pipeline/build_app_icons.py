import os
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw
import numpy as np

ART_DIR = r"C:\Users\CASPER\.gemini\antigravity-ide\brain\71773aa2-9828-4bd7-88be-12ae8f122523"
SRC_IMG = os.path.join(ART_DIR, "hubio_app_icon_1792276355320.jpg")
ASSETS_DIR = r"c:\Hubio\assets"

def process_app_icons():
    print(f"Loading source artwork from {SRC_IMG}...")
    orig = Image.open(SRC_IMG).convert("RGBA")
    w, h = orig.size
    print(f"Original size: {w}x{h}")

    # 1. Precise Crop of the inner squircle / glowing monogram
    # In the 1024x1024 generated image, the inner squircle is centered roughly between 180 and 844
    # The glowing H monogram itself is centered precisely around (w//2, h//2)
    # Let's crop the squircle:
    crop_margin = int(w * 0.17)
    squircle_cropped = orig.crop((crop_margin, crop_margin, w - crop_margin, h - crop_margin))
    
    # 2. Build 1024x1024 Master icon.png (Full Bleed for iOS & Expo)
    # We want a rich obsidian gradient background from edge to edge,
    # with the glowing squircle and monogram centered seamlessly.
    icon_1024 = Image.new("RGBA", (1024, 1024), (9, 13, 22, 255))
    
    # Create subtle ambient radial glow in center
    glow_overlay = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_overlay)
    for r in range(400, 50, -25):
        alpha = int(28 * (1.0 - (r / 400.0)))
        glow_draw.ellipse(
            [512 - r, 512 - r, 512 + r, 512 + r],
            fill=(37, 99, 235, alpha)
        )
    glow_overlay = glow_overlay.filter(ImageFilter.GaussianBlur(radius=30))
    icon_1024 = Image.alpha_composite(icon_1024, glow_overlay)
    
    # Resize cropped squircle to fit beautifully within 1024x1024 (e.g. 960x960 centered, or full bleed)
    # An iOS app icon should be full bleed, so resizing the squircle interior to 1024x1024 with subtle border
    squircle_1024 = squircle_cropped.resize((1024, 1024), Image.Resampling.LANCZOS)
    
    # Let's enhance sharpness and contrast for ultra-crisp display on retina screens
    enhancer = ImageEnhance.Sharpness(squircle_1024)
    squircle_1024 = enhancer.enhance(1.25)
    
    contrast = ImageEnhance.Contrast(squircle_1024)
    squircle_1024 = contrast.enhance(1.08)

    icon_path = os.path.join(ASSETS_DIR, "icon.png")
    squircle_1024.convert("RGB").save(icon_path, "PNG", optimize=True)
    print(f"Saved master icon: {icon_path} (1024x1024)")

    # 3. Android Adaptive Icon: Foreground (432x432)
    # The safe zone for Android Adaptive icons is the central 66% (288x288) inside a 432x432 canvas.
    # We extract the glowing H and center it inside 288x288 on a transparent 432x432 canvas.
    h_margin = int(w * 0.30)
    monogram_cropped = orig.crop((h_margin, h_margin, w - h_margin, h - h_margin))
    monogram_resized = monogram_cropped.resize((260, 260), Image.Resampling.LANCZOS)
    
    # Extract foreground with soft alpha mask or rounded transparent framing
    fg_canvas = Image.new("RGBA", (432, 432), (0, 0, 0, 0))
    # Paste centered at (432-260)//2 = 86
    fg_canvas.paste(monogram_resized, (86, 86))
    
    fg_path = os.path.join(ASSETS_DIR, "android-icon-foreground.png")
    fg_canvas.save(fg_path, "PNG", optimize=True)
    print(f"Saved Android foreground: {fg_path} (432x432)")

    # 4. Android Adaptive Icon: Background (432x432)
    bg_canvas = Image.new("RGBA", (432, 432), (9, 13, 22, 255))
    bg_draw = ImageDraw.Draw(bg_canvas)
    for r in range(200, 30, -15):
        alpha = int(45 * (1.0 - (r / 200.0)))
        bg_draw.ellipse(
            [216 - r, 216 - r, 216 + r, 216 + r],
            fill=(37, 99, 235, alpha)
        )
    bg_canvas = bg_canvas.filter(ImageFilter.GaussianBlur(radius=15))
    bg_path = os.path.join(ASSETS_DIR, "android-icon-background.png")
    bg_canvas.convert("RGB").save(bg_path, "PNG", optimize=True)
    print(f"Saved Android background: {bg_path} (432x432)")

    # 5. Android Monochrome Icon (432x432) for Android 13+ Themed Icons
    mono_canvas = Image.new("RGBA", (432, 432), (0, 0, 0, 0))
    # Grayscale monogram with pure white transparency
    gray_monogram = monogram_resized.convert("L")
    # Threshold/brighten for clean silhouette
    mono_alpha = gray_monogram.point(lambda p: min(255, int(p * 1.5)))
    white_fill = Image.new("RGBA", (260, 260), (255, 255, 255, 255))
    mono_canvas.paste(white_fill, (86, 86), mask=mono_alpha)
    
    mono_path = os.path.join(ASSETS_DIR, "android-icon-monochrome.png")
    mono_canvas.save(mono_path, "PNG", optimize=True)
    print(f"Saved Android monochrome: {mono_path} (432x432)")

    # 6. Web Favicon (48x48 and 192x192)
    favicon_path = os.path.join(ASSETS_DIR, "favicon.png")
    favicon = squircle_1024.resize((64, 64), Image.Resampling.LANCZOS)
    favicon_enhancer = ImageEnhance.Sharpness(favicon)
    favicon = favicon_enhancer.enhance(1.4)
    favicon.save(favicon_path, "PNG", optimize=True)
    print(f"Saved Web favicon: {favicon_path} (64x64)")

    # 7. Splash Icon (256x256)
    splash_icon_path = os.path.join(ASSETS_DIR, "splash-icon.png")
    splash_icon = squircle_1024.resize((256, 256), Image.Resampling.LANCZOS)
    splash_icon.save(splash_icon_path, "PNG", optimize=True)
    print(f"Saved splash icon: {splash_icon_path} (256x256)")

    print("\nAll icon assets successfully created and verified!")

if __name__ == "__main__":
    process_app_icons()
