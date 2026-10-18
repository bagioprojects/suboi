import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

def create_radial_gradient(width: int, height: int, center_color, edge_color):
    """Generates an ultra-smooth radial gradient glow."""
    x = np.linspace(-1, 1, width)
    y = np.linspace(-1, 1, height)
    xx, yy = np.meshgrid(x, y)
    dist = np.sqrt(xx**2 + yy**2)
    dist = np.clip(dist, 0, 1)

    r = (center_color[0] * (1 - dist) + edge_color[0] * dist).astype(np.uint8)
    g = (center_color[1] * (1 - dist) + edge_color[1] * dist).astype(np.uint8)
    b = (center_color[2] * (1 - dist) + edge_color[2] * dist).astype(np.uint8)
    a = (center_color[3] * (1 - dist) + edge_color[3] * dist).astype(np.uint8)

    arr = np.dstack((r, g, b, a))
    return Image.fromarray(arr, 'RGBA')

def generate_hubio_emblem(size: int = 512) -> Image.Image:
    """
    Generates a 3D glassmorphic Hubio luxury brand mark:
    Obsidian squircle with royal indigo/cobalt neon edge and metallic titanium 'H' monogram.
    """
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    margin = int(size * 0.1)
    card_rect = [margin, margin, size - margin, size - margin]
    corner_radius = int(size * 0.22)

    # 1. Subtle Outer Glow
    glow = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.rounded_rectangle(card_rect, radius=corner_radius, fill=(37, 99, 235, 90))
    glow = glow.filter(ImageFilter.GaussianBlur(radius=int(size * 0.06)))
    img = Image.alpha_composite(img, glow)

    # 2. Main Squircle Body (Dark Obsidian with Deep Blue Hue)
    body = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    body_draw = ImageDraw.Draw(body)
    body_draw.rounded_rectangle(card_rect, radius=corner_radius, fill=(15, 23, 42, 245), outline=(79, 70, 229, 220), width=int(size * 0.015))
    img = Image.alpha_composite(img, body)

    # 3. Inner Specular Highlight / Glass Sheen
    sheen = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    sheen_draw = ImageDraw.Draw(sheen)
    top_rect = [margin + 4, margin + 4, size - margin - 4, int(size * 0.45)]
    sheen_draw.rounded_rectangle(top_rect, radius=int(corner_radius * 0.8), fill=(255, 255, 255, 30))
    sheen = sheen.filter(ImageFilter.GaussianBlur(radius=6))
    img = Image.alpha_composite(img, sheen)

    # 4. Sculpted Monogram "H" & Digital Cube
    # Left Pillar
    p_width = int(size * 0.08)
    p_height = int(size * 0.44)
    p_top = int(size * 0.28)
    left_x = int(size * 0.32)
    right_x = int(size * 0.60)

    # Draw Pillar Glow
    mono_glow = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    mono_draw = ImageDraw.Draw(mono_glow)
    mono_draw.rounded_rectangle([left_x, p_top, left_x + p_width, p_top + p_height], radius=int(p_width * 0.4), fill=(96, 165, 250, 180))
    mono_draw.rounded_rectangle([right_x, p_top, right_x + p_width, p_top + p_height], radius=int(p_width * 0.4), fill=(96, 165, 250, 180))
    # Crossbar
    bar_y = int(size * 0.46)
    bar_h = int(size * 0.08)
    mono_draw.rounded_rectangle([left_x, bar_y, right_x + p_width, bar_y + bar_h], radius=int(bar_h * 0.3), fill=(129, 140, 248, 220))
    # Diamond Core Accent
    cx, cy = size // 2, bar_y + bar_h // 2
    d_size = int(size * 0.06)
    mono_draw.polygon([(cx, cy - d_size), (cx + d_size, cy), (cx, cy + d_size), (cx - d_size, cy)], fill=(255, 255, 255, 240))

    mono_glow = mono_glow.filter(ImageFilter.GaussianBlur(radius=3))
    img = Image.alpha_composite(img, mono_glow)

    # Draw Crisp Pillars
    crisp = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    crisp_draw = ImageDraw.Draw(crisp)
    crisp_draw.rounded_rectangle([left_x, p_top, left_x + p_width, p_top + p_height], radius=int(p_width * 0.4), fill=(248, 250, 252, 250))
    crisp_draw.rounded_rectangle([right_x, p_top, right_x + p_width, p_top + p_height], radius=int(p_width * 0.4), fill=(248, 250, 252, 250))
    crisp_draw.rounded_rectangle([left_x, bar_y, right_x + p_width, bar_y + bar_h], radius=int(bar_h * 0.3), fill=(224, 231, 255, 250))
    crisp_draw.polygon([(cx, cy - d_size), (cx + d_size, cy), (cx, cy + d_size), (cx - d_size, cy)], fill=(99, 102, 241, 255))
    img = Image.alpha_composite(img, crisp)

    # 5. Contrast and Unsharp Mask
    enhancer = ImageEnhance.Sharpness(img.convert('RGB'))
    sharp_rgb = enhancer.enhance(1.2)
    r, g, b = sharp_rgb.split()
    _, _, _, a = img.split()
    return Image.merge('RGBA', (r, g, b, a))

def main():
    output_dir = os.path.join(os.getcwd(), 'assets', 'splash')
    os.makedirs(output_dir, exist_ok=True)

    base_emblem = generate_hubio_emblem(512)

    # Export @3x (384x384), @2x (256x256), @1x (128x128)
    sizes = {
        '': (128, 128),
        '@2x': (256, 256),
        '@3x': (384, 384)
    }

    for suffix, (w, h) in sizes.items():
        resized = base_emblem.resize((w, h), Image.Resampling.LANCZOS)
        out_png = os.path.join(output_dir, f'hubio_splash_emblem{suffix}.png')
        resized.save(out_png, 'PNG', optimize=True)
        print(f"[OK] Generated: {out_png} ({w}x{h})")

    # Generate Ambient Glow Backdrop
    glow_bg = create_radial_gradient(
        width=600,
        height=600,
        center_color=(79, 70, 229, 140),  # Indigo Glow
        edge_color=(9, 13, 22, 0)         # Fade to obsidian
    )
    glow_bg_path = os.path.join(output_dir, 'ambient_radial_glow.png')
    glow_bg.save(glow_bg_path, 'PNG', optimize=True)
    print(f"[OK] Generated: {glow_bg_path}")

if __name__ == '__main__':
    main()
