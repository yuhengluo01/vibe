import sys, os, subprocess, asyncio
from playwright.async_api import async_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
FPS = 30; BAR = 2.1258
CUT_BARS = [1, 4, 6, 9, 15, 19, 23, 31, 37, 45, 53]
CUTS = [(b - 1) * BAR for b in CUT_BARS]
KEYS = [3.0, 9.0, 15.0, 18.0, 22.0, 29.0, 37.0, 45.0, 52.0, 58.5, 63.0, 72.0, 75.0, 80.0, 86.0, 90.0, 95.5, 102.0, 107.0]

async def main(mode, only=None):
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--font-render-hinting=none"])
        pg = await b.new_page(viewport={"width": 1920, "height": 1080})
        await pg.goto("file://" + os.path.join(HERE, "index.html"))
        await pg.evaluate("window.ready")
        cv = pg.locator("canvas")
        if mode == "keys":
            d = os.path.join(HERE, "keys"); os.makedirs(d, exist_ok=True)
            for t in KEYS:
                await pg.evaluate(f"window.draw({t})")
                await cv.screenshot(path=os.path.join(d, f"k_{t:05.1f}.jpg"), type="jpeg", quality=92)
        else:
            d = os.path.join(HERE, "parts"); os.makedirs(d, exist_ok=True)
            for i in range(len(CUTS) - 1):
                if only is not None and i not in only:
                    continue
                out, tmp = os.path.join(d, f"s{i}.mp4"), os.path.join(d, f"s{i}.tmp.mp4")
                ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", str(FPS),
                                       "-c:v", "mjpeg", "-i", "-", "-c:v", "libx264", "-preset", "veryfast", "-crf", "18",
                                       "-pix_fmt", "yuv420p", "-r", str(FPS), tmp], stdin=subprocess.PIPE)
                for f in range(round(CUTS[i] * FPS), round(CUTS[i + 1] * FPS)):
                    await pg.evaluate(f"window.draw({f / FPS})")
                    ff.stdin.write(await cv.screenshot(type="jpeg", quality=92))
                ff.stdin.close()
                if ff.wait() != 0:
                    sys.exit(f"ffmpeg failed on scene {i}")
                os.replace(tmp, out); print("scene", i, "ok", flush=True)
        await b.close()

only = set(int(x) for x in sys.argv[2].split(",")) if len(sys.argv) > 2 else None
asyncio.run(main(sys.argv[1] if len(sys.argv) > 1 else "keys", only))
