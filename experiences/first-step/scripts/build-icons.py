"""Resize the approved transparent mascot into website icons (Pillow only)."""
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'icons'
OUT.mkdir(exist_ok=True)
source = Image.open(ROOT / 'images/mascot/wave.png').convert('RGBA')
art = source.crop(source.getbbox())

def icon(size, opaque=False):
    canvas = Image.new('RGBA', (size, size), '#f6f4ec' if opaque else (0, 0, 0, 0))
    fitted = ImageOps.contain(art, (round(size * .90), round(size * .90)), Image.Resampling.LANCZOS)
    canvas.alpha_composite(fitted, ((size-fitted.width)//2, (size-fitted.height)//2))
    return canvas

for size in (16, 32, 48, 192, 512):
    icon(size).save(OUT / f'icon-{size}.png')
icon(180, True).convert('RGB').save(OUT / 'apple-touch-icon.png')
icon(64).save(OUT / 'favicon.ico', sizes=[(16,16),(32,32),(48,48),(64,64)])

# Actual pixel sizes beside enlarged samples, on light and dark backgrounds.
sheet = Image.new('RGB', (900, 390), '#f6f4ec')
draw = ImageDraw.Draw(sheet)
draw.rectangle((0, 195, 900, 390), fill='#2f4034')
for row in range(2):
    for i, size in enumerate((16,32,48,192,512)):
        x, y = 20+i*178, row*195+12
        sample = icon(size)
        display = sample.resize((128,128), Image.Resampling.NEAREST if size<=48 else Image.Resampling.LANCZOS)
        sheet.paste(display, (x,y), display)
        draw.text((x,y+134), f'{size}px', fill='#55452e' if row==0 else '#ffffff')
        if size<=48:
            sheet.paste(sample, (x+76,y+134), sample)
sheet.save(OUT / 'preview.png')
print('Website icons created from the approved transparent wave illustration.')
