import os
import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
from rembg import remove

def remove_white_fringe(pil_img: Image.Image, erode_px: int = 2) -> Image.Image:
    """
    Şeffaf (RGBA) görsellerin etrafında kalan beyaz kırpıkları (halo/fringe)
    alfa kanalı erozyonu ve renk dekontaminasyonu ile temizler.
    """
    img_np = np.array(pil_img.convert("RGBA"))
    r, g, b, a = cv2.split(img_np)

    # 1. Alfa kanalını hafifçe daraltarak (Erosion) dış beyaz pikselleri kes
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    a_eroded = cv2.erode(a, kernel, iterations=erode_px)

    # 2. Kenar geçişlerini yumuşat (Anti-aliasing)
    a_smooth = cv2.GaussianBlur(a_eroded, (3, 3), 0)

    # 3. Renk Dekontaminasyonu: Yarı şeffaf kenarlardaki beyaz parlaklığı bastır
    alpha_factor = a_smooth.astype(np.float32) / 255.0
    r = (r.astype(np.float32) * alpha_factor).astype(np.uint8)
    g = (g.astype(np.float32) * alpha_factor).astype(np.uint8)
    b = (b.astype(np.float32) * alpha_factor).astype(np.uint8)

    cleaned_np = cv2.merge([r, g, b, a_smooth])
    return Image.fromarray(cleaned_np, "RGBA")

def sharpen_and_enhance(pil_img: Image.Image, sharpness_factor: float = 1.4) -> Image.Image:
    """
    Görseli Unsharp Mask ve mikro kontrast ile netleştirir.
    """
    r, g, b, a = pil_img.split()
    rgb_img = Image.merge("RGB", (r, g, b))

    # Unsharp Mask ile detayları keskinleştir
    rgb_img = rgb_img.filter(ImageFilter.UnsharpMask(radius=1.5, percent=120, threshold=3))
    enhancer = ImageEnhance.Sharpness(rgb_img)
    rgb_img = enhancer.enhance(sharpness_factor)

    # Hafif kontrast iyileştirmesi
    contrast = ImageEnhance.Contrast(rgb_img)
    rgb_img = contrast.enhance(1.06)

    r2, g2, b2 = rgb_img.split()
    return Image.merge("RGBA", (r2, g2, b2, a))

def process_image_for_expo(
    input_path: str,
    output_dir: str,
    base_name: str,
    target_width_1x: int = 300,
    strip_bg: bool = True
):
    """
    Görseli işler, arka planı ve beyaz kırpıkları temizler, netleştirir
    ve Expo/iOS standartlarında @1x, @2x, @3x boyutlarında kaydeder.
    """
    os.makedirs(output_dir, exist_ok=True)
    img = Image.open(input_path).convert("RGBA")

    if strip_bg:
        # AI Alpha Matting ile hassas arka plan silme
        img = remove(
            img,
            alpha_matting=True,
            alpha_matting_foreground_threshold=240,
            alpha_matting_background_threshold=10,
            alpha_matting_erode_size=10
        )
        # Beyaz kenar kırpıklarını temizle
        img = remove_white_fringe(img, erode_px=1)

    # Netleştirme uygula
    img = sharpen_and_enhance(img)

    # Boş şeffaf kenarları otomatik kırp (Auto-Trim)
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)

    # iOS & Expo @1x, @2x, @3x ölçeklerinde dışa aktar
    aspect_ratio = img.height / img.width
    scales = {"": 1, "@2x": 2, "@3x": 3}

    for suffix, scale in scales.items():
        w = int(target_width_1x * scale)
        h = int(w * aspect_ratio)
        resized = img.resize((w, h), Image.Resampling.LANCZOS)

        out_webp = os.path.join(output_dir, f"{base_name}{suffix}.webp")
        resized.save(out_webp, "WEBP", quality=92, lossless=False)
        print(f"[OK] Üretildi: {out_webp} ({w}x{h})")

if __name__ == "__main__":
    print("Hubio Asset Pipeline: Rembg + OpenCV + Pillow Ready.")
