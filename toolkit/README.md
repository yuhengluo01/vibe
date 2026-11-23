# Vibe知识大赏 制作工具包

每期视频：横屏 1920×1080、30fps、约 110 秒（END = bar(53)），HTML Canvas 逐帧绘制 → Playwright 截图 → ffmpeg 编码，配乐用 `bgm/vibe_bgm.mp3`（用户指定，必须用），合成音效叠在上面。

## 文件
- `head_dark.html`：默认暗金风模板（含 rng/seg/eOut/text/rich/pop/background/drawDust/finish/topBar 等）。把 `TITLE_HERE` 换成本期标题、`const R=rng(1111);` 换个种子，后面接本期 `scenes.js`（scenes.js 末尾要有 `window.draw`、`window.ready` 和 `</script></body></html>`，见 examples/pareto）。
- `head_scroll.html`：东方卷轴风模板（人物志·八观系列）。用到书法字体：先 `mkdir -p /home/claude/fonts && cd /home/claude/fonts && npm i @fontsource/ma-shan-zheng`；用 examples/guan7/build.py 拼 index.html（它会收集书法字形）。
- `render.py`：`python3 render.py keys` 截关键帧到 keys/；`python3 render.py full` 分段渲染到 parts/s0..s9.mp4。把 render.py 复制进工程目录再用。
- `sfx_template.py`：复制成工程里的 sfx.py，在标记处写本期音效提示（`ch(at,f,g)` 钟声、`whoosh()`、`blip()`、`hit()`、`tone()`），运行生成 sfx.npy。切点重击和爆点呼啸已内置。
- `mix.py`：`python3 /home/claude/vibe/toolkit/mix.py <时长>`，在当前目录读 sfx.npy、写 audio.wav（BGM×0.8 + 音效×0.42，结尾 1.8 秒淡出）。
- `examples/`：两期完整工程（幂律与二八法则、八观·第七观）可照抄结构。

## BGM 结构（BAR = 2.1258s，bar(b)=(b-1)*BAR）
切点 CUT_BARS=[1,4,6,9,15,19,23,31,37,45,53]，九段：
s1 钩子(1–3) / s2 铺垫+悬念(4–8，安静) / **s3 第一次爆发 bar 9=17.0s** + 演示(9–14) / s4(15–18，bar 18 打点) / s5(19–22，bar 22 打点) / s6 延伸(23–30) / s7 现实例子(31–36，bar 35 打点) / s8 breakdown「但是……」(37–44，安静) / **s9 第二次爆发 bar 45=93.5s** + 结尾金句 + 评论区问题(45–52)。
知识高潮必须压在音乐高潮上。

## 流程
1. 选题：反直觉、能现场演示/模拟的知识点；查看根目录 videos.json 和下方「已做选题」避免重复。
2. 核实：所有数字用代码算或查可靠来源，估算写「约」；金融/医疗加免责说明。
3. 写 scenes.js（版式：左上 x=80 顶栏；大标题 y≈200–300；主视觉 y 330–880；底部金句 y 900–1000；y>1020 留空）。不要每帧用 ctx.filter blur（太慢），单帧 <60ms。
4. `python3 render.py keys` → 拼图检查 → 修重叠 → `python3 render.py full`（约 9 分钟，后台跑）。
5. concat：`for i in $(seq 0 9); do echo "file 'parts/s$i.mp4'"; done > list.txt && ffmpeg -y -f concat -safe 0 -i list.txt -c copy video.mp4`
6. sfx.py → mix.py → `ffmpeg -i video.mp4 -i audio.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest out.mp4`，抽帧检查。
7. 发布：mp4 放 `videos/YYYY-MM-DD-short-english-name.mp4`（<100MB），在根目录 `videos.json` 的 `videos` 数组追加 {id, file, title, caption, tags(3 个，不带 #), date}，标题以「Vibe知识大赏」开头，commit 并 push 到 main。

## 已做选题（不要重复）
生日悖论、冒泡排序、三门问题、37% 法则、万圣节 OCT31=DEC25、锚定效应、双十一折扣数学、蝴蝶效应、沉没成本、复利与 72 法则、9.9 定价、本福特定律、假阳性、折纸到月球、光速、幸存者偏差、二分查找、随机游走、六度分隔、指数基金（纳斯达克/标普500）、通货膨胀、赌徒谬误、幂律与二八法则、人物志·八观第七观（观其所短）、辛普森悖论、布雷斯悖论、友谊悖论。
