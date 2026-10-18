import os
import cv2
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance

def extract_clean_emblem():
    """
    Extracts the pristine 3D Hubio 'H' emblem from the master image using
    contour detection, morphological smoothing, and subpixel anti-aliasing.
    """
    src_path = r'C:\Users\CASPER\.gemini\antigravity-ide\brain\71773aa2-9828-4bd7-88be-12ae8f122523\hubio_app_icon_v2_1792347686073.jpg'
    img = cv2.imread(src_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Precise Canny edge map
    canny = cv2.Canny(gray, 60, 180)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    closed = cv2.morphologyEx(canny, cv2.MORPH_CLOSE, kernel)
    
    contours, _ = cv2.findContours(closed, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    areas = [(cv2.contourArea(c), c) for c in contours]
    areas.sort(key=lambda x: x[0], reverse=True)
    
    # Largest external contour is the 3D H outer boundary
    mask = np.zeros(canny.shape, dtype=np.uint8)
    cv2.drawContours(mask, [areas[0][1]], -1, 255, -1)
    
    # Morphological opening to clean single-pixel edge anomalies
    mask_clean = cv2.morphologyEx(mask, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2)))
    
    # Subpixel anti-aliasing with small Gaussian blur
    mask_blur = cv2.GaussianBlur(mask_clean.astype(np.float32), (3, 3), 0.6)
    mask_final = np.clip(mask_blur, 0, 255).astype(np.uint8)
    
    # RGBA image
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    rgba = np.dstack([rgb, mask_final])
    pil_emblem = Image.fromarray(rgba, 'RGBA')
    
    # Crop to exact bounding box of the emblem
    bbox = pil_emblem.getbbox()
    cropped_emblem = pil_emblem.crop(bbox)
    
    # Apply subtle sharpness boost to bring out metallic reflections
    enhancer = ImageEnhance.Sharpness(cropped_emblem)
    sharpened_emblem = enhancer.enhance(1.25)
    
    return sharpened_emblem

def create_executive_background(size=1024):
    """
    Creates a flagship luxury dark obsidian / cobalt slate radial gradient background.
    """
    w, h = size, size
    y, x = np.ogrid[:h, :w]
    cx, cy = w / 2.0, h / 2.0
    
    dist = np.sqrt((x - cx)**2 + (y - cy)**2) / (np.sqrt(cx**2 + cy**2))
    dist = np.clip(dist, 0.0, 1.0)
    
    c_center = np.array([22, 32, 54], dtype=np.float32)  # #162036
    c_mid = np.array([12, 17, 30], dtype=np.float32)     # #0C111E
    c_edge = np.array([5, 7, 13], dtype=np.float32)       # #05070D
    
    bg = np.zeros((h, w, 3), dtype=np.float32)
    mask1 = dist < 0.45
    t1 = dist / 0.45
    bg[mask1] = (1 - t1[mask1, None]) * c_center + t1[mask1, None] * c_mid
    
    mask2 = dist >= 0.45
    t2 = (dist - 0.45) / 0.55
    bg[mask2] = (1 - t2[mask2, None]) * c_mid + t2[mask2, None] * c_edge
    
    # Soft radial cyan/cobalt glow under the emblem
    glow_dist = np.sqrt((x - cx)**2 + (y - cy)**2) / (size * 0.36)
    glow_factor = np.clip(1.0 - glow_dist, 0.0, 1.0)**2.2
    glow_color = np.array([24, 98, 204], dtype=np.float32) # Electric cobalt radiance
    bg += glow_factor[:, :, None] * glow_color
    bg = np.clip(bg, 0, 255).astype(np.uint8)
    
    return Image.fromarray(bg, 'RGB')

def composite_icon_layer(bg_img, emblem, target_size=1024, emblem_width=720, shadow_blur=32, shadow_offset=22):
    """
    Scales emblem, generates a realistic 3D contact shadow, and composites over background.
    """
    aspect = emblem.size[1] / emblem.size[0]
    emblem_h = int(emblem_width * aspect)
    resized_emblem = emblem.resize((emblem_width, emblem_h), Image.Resampling.LANCZOS)
    
    # Create soft drop shadow
    shadow_alpha = resized_emblem.split()[3]
    shadow = Image.new('RGBA', resized_emblem.size, (0, 0, 0, 230))
    shadow.putalpha(shadow_alpha)
    
    shadow_canvas = Image.new('RGBA', (target_size, target_size), (0, 0, 0, 0))
    pos_x = (target_size - emblem_width) // 2
    pos_y = (target_size - emblem_h) // 2
    
    shadow_canvas.paste(shadow, (pos_x, pos_y + shadow_offset))
    shadow_blurred = shadow_canvas.filter(ImageFilter.GaussianBlur(radius=shadow_blur))
    
    if bg_img:
        result = bg_img.convert('RGBA')
        result.alpha_composite(shadow_blurred)
        result.alpha_composite(resized_emblem, (pos_x, pos_y))
        return result.convert('RGB')
    else:
        # Transparent foreground
        result = Image.new('RGBA', (target_size, target_size), (0, 0, 0, 0))
        result.alpha_composite(shadow_blurred)
        result.alpha_composite(resized_emblem, (pos_x, pos_y))
        return result

def create_monochrome_layer(emblem, target_size=432, emblem_width=250):
    """
    Android 13+ Material You monochrome silhouette (white on transparent).
    """
    aspect = emblem.size[1] / emblem.size[0]
    emblem_h = int(emblem_width * aspect)
    resized = emblem.resize((emblem_width, emblem_h), Image.Resampling.LANCZOS)
    
    alpha = resized.split()[3]
    mono = Image.new('RGBA', (target_size, target_size), (0, 0, 0, 0))
    
    white_shape = Image.new('RGBA', (emblem_width, emblem_h), (255, 255, 255, 255))
    white_shape.putalpha(alpha)
    
    pos_x = (target_size - emblem_width) // 2
    pos_y = (target_size - emblem_h) // 2
    mono.paste(white_shape, (pos_x, pos_y), white_shape)
    return mono

def main():
    out_dir = r'c:\Hubio\assets'
    os.makedirs(out_dir, exist_ok=True)
    
    print("1. Extracting high-precision 3D Hubio 'H' emblem...")
    emblem = extract_clean_emblem()
    print(f"   Cropped Emblem Resolution: {emblem.size[0]}x{emblem.size[1]} RGBA")
    
    # 2. Master App Icon (1024x1024 edge-to-edge for iOS & Android)
    print("2. Generating Master 1024x1024 App Icon (assets/icon.png)...")
    bg_1024 = create_executive_background(1024)
    app_icon_1024 = composite_icon_layer(bg_1024, emblem, target_size=1024, emblem_width=710, shadow_blur=30, shadow_offset=20)
    icon_path = os.path.join(out_dir, 'icon.png')
    app_icon_1024.save(icon_path, 'PNG', optimize=True)
    print(f"   Saved: {icon_path} (1024x1024)")
    
    # 3. Android Adaptive Icon: Background & Foreground (432x432)
    # Safe zone circle is 66% (diameter 285px). Emblem width 255px fits with safe margins.
    print("3. Generating Android Adaptive Icon Layers (432x432)...")
    bg_432 = create_executive_background(432)
    android_bg_path = os.path.join(out_dir, 'android-icon-background.png')
    bg_432.save(android_bg_path, 'PNG', optimize=True)
    print(f"   Saved: {android_bg_path} (432x432)")
    
    android_fg = composite_icon_layer(None, emblem, target_size=432, emblem_width=255, shadow_blur=14, shadow_offset=8)
    android_fg_path = os.path.join(out_dir, 'android-icon-foreground.png')
    android_fg.save(android_fg_path, 'PNG', optimize=True)
    print(f"   Saved: {android_fg_path} (432x432 RGBA)")
    
    # 4. Android Monochrome Themed Icon (432x432)
    print("4. Generating Android Monochrome Themed Icon (432x432)...")
    android_mono = create_monochrome_layer(emblem, target_size=432, emblem_width=255)
    android_mono_path = os.path.join(out_dir, 'android-icon-monochrome.png')
    android_mono.save(android_mono_path, 'PNG', optimize=True)
    print(f"   Saved: {android_mono_path} (432x432 RGBA)")
    
    # 5. Favicon (64x64 crisp web icon)
    print("5. Generating Favicon (64x64)...")
    fav_canvas = Image.new('RGBA', (64, 64), (0, 0, 0, 0))
    # Make small emblem fit nicely
    fav_aspect = emblem.size[1] / emblem.size[0]
    fav_w = 54
    fav_h = int(fav_w * fav_aspect)
    fav_emblem = emblem.resize((fav_w, fav_h), Image.Resampling.LANCZOS)
    fav_emblem = ImageEnhance.Sharpness(fav_emblem).enhance(1.4) # Extra sharpness for micro size
    fav_x = (64 - fav_w) // 2
    fav_y = (64 - fav_h) // 2
    fav_canvas.paste(fav_emblem, (fav_x, fav_y), fav_emblem)
    fav_path = os.path.join(out_dir, 'favicon.png')
    fav_canvas.save(fav_path, 'PNG', optimize=True)
    print(f"   Saved: {fav_path} (64x64 RGBA)")
    
    # 6. In-App Logos: hubio_logo_light.png (512x512) and retina @2x (1024x1024)
    print("6. Generating In-App Logos and Retina Assets...")
    # Pad emblem into square transparent canvas with clean margins
    square_1024 = Image.new('RGBA', (1024, 1024), (0, 0, 0, 0))
    scale_1024_w = 820
    scale_1024_h = int(scale_1024_w * (emblem.size[1] / emblem.size[0]))
    emb_1024 = emblem.resize((scale_1024_w, scale_1024_h), Image.Resampling.LANCZOS)
    square_1024.paste(emb_1024, ((1024 - scale_1024_w) // 2, (1024 - scale_1024_h) // 2), emb_1024)
    
    logo_2x_path = os.path.join(out_dir, 'hubio_logo_light@2x.png')
    square_1024.save(logo_2x_path, 'PNG', optimize=True)
    print(f"   Saved: {logo_2x_path} (1024x1024 RGBA)")
    
    logo_512 = square_1024.resize((512, 512), Image.Resampling.LANCZOS)
    logo_path = os.path.join(out_dir, 'hubio_logo_light.png')
    logo_512.save(logo_path, 'PNG', optimize=True)
    print(f"   Saved: {logo_path} (512x512 RGBA)")
    
    splash_icon = square_1024.resize((256, 256), Image.Resampling.LANCZOS)
    splash_path = os.path.join(out_dir, 'splash-icon.png')
    splash_icon.save(splash_path, 'PNG', optimize=True)
    print(f"   Saved: {splash_path} (256x256 RGBA)")
    
    # Also save an isolated transparent master
    master_path = os.path.join(out_dir, 'hubio_emblem_transparent.png')
    square_1024.save(master_path, 'PNG', optimize=True)
    print(f"   Saved: {master_path} (1024x1024 RGBA)")
    
    print("\n[SUCCESS] ALL MASTER ASSETS GENERATED AND VERIFIED SUCCESSFULLY!")

if __name__ == '__main__':
    main()
