#!/usr/bin/env python3
"""依 diagram-design 規範（orthogonal 圓角轉折、標籤遮罩＋6px 間距、4px 網格、accent ≤2、
無障礙 title/desc）產生三張講義機制圖。色彩與字體取自 mono-color CIS：
Charcoal #30343A ＋ Signal Red #C83232，紙面 Neutral White #FAFAF7。

輸出：
  diagrams/<slug>.html   單檔可獨立開啟／匯出的圖
  diagrams/<slug>.svg.txt 給講義網頁內嵌用的 <svg> 片段
"""
from pathlib import Path

OUT = Path(__file__).resolve().parent

PAPER = "#FAFAF7"
PAPER2 = "#EDEDEA"
INK = "#30343A"
MUTED = "#5B5F65"
ACCENT = "#C83232"
ACCENT_TINT = "#F6E4E1"
SANS = "'IBM Plex Sans', 'Noto Sans CJK TC', 'Noto Sans TC', sans-serif"
SERIF = "'Noto Serif CJK TC', 'Noto Serif TC', serif"
MONO = "'IBM Plex Mono', 'Noto Sans CJK TC', 'Noto Sans TC', monospace"


def text_width(s, size):
    """diagram-design 寬度預算：全形字 1em，其餘 0.6em。"""
    w = 0.0
    for ch in s:
        w += size if ord(ch) > 0x2E80 else size * 0.6
    return w


def up4(v):
    return int(-(-v // 4) * 4)


def orth(points, r=8):
    """正交折線，轉角為 r=8 的四分之一圓弧（二次貝茲近似）。"""
    d = f"M{points[0][0]},{points[0][1]}"
    for i in range(1, len(points) - 1):
        (x0, y0), (x1, y1), (x2, y2) = points[i - 1], points[i], points[i + 1]
        dx0 = (x1 > x0) - (x1 < x0); dy0 = (y1 > y0) - (y1 < y0)
        dx1 = (x2 > x1) - (x2 < x1); dy1 = (y2 > y1) - (y2 < y1)
        d += f" L{x1 - dx0 * r},{y1 - dy0 * r} Q{x1},{y1} {x1 + dx1 * r},{y1 + dy1 * r}"
    d += f" L{points[-1][0]},{points[-1][1]}"
    return d


def arrow(points, accent=False, dashed=False):
    c = ACCENT if accent else MUTED
    m = "arrow-accent" if accent else "arrow"
    sw = "1.6" if accent else "1.2"
    da = ' stroke-dasharray="5,4"' if dashed else ""
    return f'<path d="{orth(points)}" fill="none" stroke="{c}" stroke-width="{sw}"{da} marker-end="url(#{m})"/>'


def label(cx, y_line, s, accent=False, side="above", anchor_x=None):
    """CJK 標籤：12px sans 500、遮罩 16px 高，與線保持 6px 間距。"""
    w = up4(text_width(s, 12) + 8)
    c = ACCENT if accent else MUTED
    if side == "above":
        ry = y_line - 6 - 16
        rx = cx - w // 2
        tx, anchor = cx, "middle"
    elif side == "below":
        ry = y_line + 6
        rx = cx - w // 2
        tx, anchor = cx, "middle"
    elif side == "right":  # 垂直線右側；cx 為線的 x，y_line 為標籤中心 y
        rx = cx + 8
        ry = y_line - 8
        tx, anchor = rx + 4, "start"
    else:  # left
        rx = cx - 8 - w
        ry = y_line - 8
        tx, anchor = cx - 12, "end"
    ty = ry + 12
    return (f'<rect x="{rx}" y="{ry}" width="{w}" height="16" rx="2" fill="{PAPER}"/>'
            f'<text x="{tx}" y="{ty}" text-anchor="{anchor}" font-family="{SANS}" font-size="12" '
            f'font-weight="500" fill="{c}">{s}</text>')


def node(x, y, w, h, name, kind="step", sub=None):
    fill, stroke, dash, rx = PAPER, INK, "", 6
    tc = INK
    if kind == "focal":
        fill, stroke = ACCENT_TINT, ACCENT
    elif kind == "store":
        fill, stroke = PAPER2, MUTED
    elif kind == "optional":
        fill, stroke, dash = PAPER, MUTED, ' stroke-dasharray="4,3"'
    elif kind == "start":
        rx = 20
    elif kind == "solid-accent":
        fill, stroke, tc = ACCENT, ACCENT, PAPER
    cx = x + w / 2
    cy = y + h / 2
    out = (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{PAPER}"/>'
           f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="1.2"{dash}/>')
    if sub:
        out += (f'<text x="{cx:g}" y="{cy - 2:g}" text-anchor="middle" font-family="{SANS}" font-size="16" font-weight="600" fill="{tc}">{name}</text>'
                f'<text x="{cx:g}" y="{cy + 18:g}" text-anchor="middle" font-family="{SANS}" font-size="12" fill="{tc if kind == "solid-accent" else MUTED}">{sub}</text>')
    else:
        out += f'<text x="{cx:g}" y="{cy + 6:g}" text-anchor="middle" font-family="{SANS}" font-size="16" font-weight="600" fill="{tc}">{name}</text>'
    return out


DEFS = (f'<defs>'
        f'<marker id="arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="{MUTED}"/></marker>'
        f'<marker id="arrow-accent" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="{ACCENT}"/></marker>'
        f'</defs>')


def svg(slug, vb, title, desc, body):
    x, y, w, h = vb.split()
    defs = DEFS.replace('id="arrow', f'id="{slug}-arrow')
    body = body.replace('url(#arrow', f'url(#{slug}-arrow')
    return (f'<svg viewBox="{vb}" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="{slug}-title {slug}-desc">'
            f'<title id="{slug}-title">{title}</title><desc id="{slug}-desc">{desc}</desc>{defs}'
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{PAPER}"/>{body}</svg>')


# ---------- 1. 線性漏斗 vs 決策旅程 ----------
def journey():
    a, n = [], []
    # 漏斗（左）
    a.append(arrow([(180, 160), (180, 220)]))
    a.append(label(180, 190, "篩掉品牌", side="right"))
    a.append(arrow([(180, 288), (180, 348)]))
    a.append(label(180, 318, "篩掉品牌", side="right"))
    n.append(node(60, 96, 240, 64, "認知", "store"))
    n.append(node(84, 224, 192, 64, "考慮", "store"))
    n.append(node(108, 352, 144, 64, "購買"))
    n.append(f'<text x="180" y="452" text-anchor="middle" font-family="{SANS}" font-size="12" fill="{MUTED}">（到此結束，沒有回頭的路）</text>')
    # 分隔與欄名
    n.append(f'<line x1="392" y1="40" x2="392" y2="512" stroke="{INK}" stroke-opacity="0.14" stroke-dasharray="4,4"/>')
    n.append(f'<text x="180" y="60" text-anchor="middle" font-family="{SANS}" font-size="16" font-weight="600" fill="{INK}">線性漏斗</text>')
    n.append(f'<text x="680" y="60" text-anchor="middle" font-family="{SANS}" font-size="16" font-weight="600" fill="{INK}">消費者決策旅程</text>')
    # 旅程（右）：先畫箭頭
    a.append(arrow([(640, 128), (716, 128)]))
    a.append(label(678, 128, "增刪品牌"))
    a.append(arrow([(820, 160), (820, 348)]))
    a.append(label(820, 256, "選定", side="right"))
    a.append(arrow([(720, 384), (644, 384)]))
    a.append(label(682, 384, "開始使用"))
    a.append(arrow([(540, 352), (540, 164)], accent=True))
    a.append(label(540, 256, "影響下一次考慮", accent=True, side="left"))
    a.append(arrow([(600, 416), (600, 472), (780, 472), (780, 420)], accent=True, dashed=True))
    a.append(label(690, 472, "忠誠迴圈：跳過評估直接回購", accent=True, side="below"))
    n.append(node(440, 96, 200, 64, "① 初始考慮"))
    n.append(node(720, 96, 200, 64, "② 主動評估"))
    n.append(node(720, 352, 200, 64, "③ 購買"))
    n.append(node(440, 352, 200, 64, "④ 購後體驗"))
    body = "".join(a) + "".join(n)
    return svg("journey-loop", "0 0 960 540", "線性漏斗與消費者決策旅程",
               "左側漏斗從認知、考慮到購買即結束；右側決策旅程多了兩條紅色回饋路徑：購後體驗影響下一次的初始考慮，以及忠誠顧客跳過評估直接回購。", body)


# ---------- 2. 門檻判定流程 ----------
def threshold():
    a, n = [], []
    cx = 400
    for y0, y1 in [(88, 124), (184, 220), (280, 316), (376, 404)]:
        a.append(arrow([(cx, y0), (cx, y1)]))
    # Keep：左側回到「策略＋原型」
    a.append(arrow([(312, 456), (220, 456), (220, 252), (296, 252)]))
    a.append(label(220, 356, "Keep：達門檻", side="left"))
    a.append(label(220, 380, "進入下一輪原型", side="left"))
    # Revise：右側回到「假設」
    a.append(arrow([(488, 456), (580, 456), (580, 156), (504, 156)]))
    a.append(label(580, 300, "Revise：部分成立", side="right"))
    a.append(label(580, 324, "修正假設的一欄", side="right"))
    # Pivot：下方繞回「證據」（accent）
    a.append(arrow([(400, 504), (400, 544), (720, 544), (720, 60), (504, 60)], accent=True))
    a.append(label(720, 300, "Pivot：最危險的假設被推翻", accent=True, side="right"))
    a.append(label(720, 324, "回到研究", accent=True, side="right"))
    n.append(node(300, 32, 200, 56, "證據", "start"))
    n.append(node(300, 128, 200, 56, "假設"))
    n.append(node(300, 224, 200, 56, "策略＋原型"))
    n.append(node(300, 320, 200, 56, "指標"))
    n.append(f'<polygon points="400,408 488,456 400,504 312,456" fill="{PAPER}" stroke="{ACCENT}" stroke-width="1.6"/>'
             f'<text x="400" y="462" text-anchor="middle" font-family="{SANS}" font-size="16" font-weight="600" fill="{ACCENT}">達到門檻？</text>')
    body = "".join(a) + "".join(n)
    return svg("threshold-fork", "0 0 960 580", "門檻判定後的三種回退",
               "證據、假設、策略與原型、指標之後進入門檻判定：達到門檻回到下一輪原型，部分成立回頭修正假設，最危險的假設被推翻則回到證據重新研究。", body)


# ---------- 3. AI 預測 vs 真人校準 ----------
def calibration():
    a, n = [], []
    a.append(arrow([(200, 260), (256, 260), (256, 160), (308, 160)]))
    a.append(arrow([(200, 284), (272, 284), (272, 416), (308, 416)]))
    a.append(arrow([(512, 160), (568, 160), (568, 260), (620, 260)], dashed=True))
    a.append(label(540, 160, "預測"))
    a.append(arrow([(512, 416), (584, 416), (584, 284), (620, 284)]))
    a.append(label(548, 416, "實際", side="below"))
    a.append(arrow([(704, 304), (704, 476)], accent=True))
    a.append(label(704, 390, "找出落差", accent=True, side="right"))
    n.append(node(40, 240, 160, 64, "同樣 3 個問題"))
    n.append(node(312, 128, 200, 64, "AI 扮演 Persona", "optional", "模擬，不是證據"))
    n.append(node(312, 384, 200, 64, "真人 3 位訪談", "store", "真實資料"))
    n.append(node(624, 240, 160, 64, "逐題比對"))
    n.append(node(612, 480, 184, 64, "落差最大處", "focal", "＝設計洞察，回填假設卡"))
    body = "".join(a) + "".join(n)
    return svg("ai-calibration", "0 96 960 480", "AI 預測與真人訪談的校準流程",
               "同樣三個問題分別交給 AI 扮演的 Persona（模擬）與三位真人（真實資料），逐題比對後，落差最大處就是設計洞察，回填到假設卡。", body)


PAGE = """<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&family=Noto+Sans+TC:wght@400;500;600&family=Noto+Serif+TC:wght@600;900&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{{box-sizing:border-box;margin:0;padding:0}}
body{{font-family:{sans};background:{paper};color:{ink};min-height:100vh;display:flex;align-items:center;justify-content:center;padding:3rem 2rem}}
.frame{{max-width:1200px;width:100%}}
.eyebrow{{font-family:{mono};font-size:.72rem;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:{muted};margin-bottom:.5rem}}
h1{{font-family:{serif};font-size:clamp(1.5rem,2.4vw + .75rem,2rem);font-weight:900;line-height:1.25;margin-bottom:1.5rem}}
.wrap{{overflow-x:auto}}
svg{{width:100%;min-width:720px;display:block}}
.note{{margin-top:1rem;font-size:.85rem;color:{muted};border-top:1px solid #CDCECC;padding-top:.75rem}}
</style>
</head>
<body>
<div class="frame">
<p class="eyebrow">{eyebrow} · Diagram Design × mono-color</p>
<h1>{title}</h1>
<div class="wrap">{svg}</div>
<p class="note">{note}</p>
</div>
</body>
</html>
"""

ITEMS = [
    ("journey-loop", journey, "Flowchart ＋ Funnel", "線性漏斗與消費者決策旅程",
     "資料來源：Court, D., Elzinga, D., Mulder, S., &amp; Vetvik, O. J. (2009). The consumer decision journey. McKinsey Quarterly.（產業觀察；依原文文字重繪之示意，非原圖）"),
    ("threshold-fork", threshold, "Flowchart", "門檻判定後的三種回退",
     "教師推論：Keep／Revise／Pivot 為本課教學用語；推翻得越深，回退得越遠。"),
    ("ai-calibration", calibration, "Data flow", "AI 預測與真人訪談的校準流程",
     "Teaching Example：虛線框為模擬，灰底框為真人資料。方法背景：Hämäläinen, Tavast, &amp; Kunnari (2023), CHI ’23."),
]

if __name__ == "__main__":
    for slug, fn, eyebrow, title, note in ITEMS:
        s = fn()
        (OUT / f"{slug}.svg.txt").write_text(s, encoding="utf-8")
        (OUT / f"{slug}.html").write_text(PAGE.format(title=title, eyebrow=eyebrow, svg=s, note=note, sans=SANS, serif=SERIF,
                                                      mono=MONO, paper=PAPER, ink=INK, muted=MUTED), encoding="utf-8")
        print("wrote", slug)
