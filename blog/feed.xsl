<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" encoding="UTF-8" doctype-system="about:legacy-compat"/>
<xsl:template match="/">
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title><xsl:value-of select="rss/channel/title"/> · RSS</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&amp;display=swap" rel="stylesheet"/>
  <style>
    :root{--bg:#0a0a0f;--card:#14141d;--border:#242433;--text:#f4f4f8;--dim:#9a9ab0;--accent:#e50914;--accent2:#ff5a5f;--grad:linear-gradient(135deg,#e50914,#ff5a5f)}
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:var(--bg);color:var(--text);font-family:'Inter',-apple-system,"Segoe UI",sans-serif;line-height:1.65}
    .wrap{max-width:760px;margin:0 auto;padding:0 22px 70px}
    header{text-align:center;padding:56px 22px 8px}
    .badge{display:inline-flex;align-items:center;gap:8px;background:var(--grad);color:#fff;font-weight:800;
      font-size:.72rem;letter-spacing:.14em;padding:6px 15px;border-radius:999px}
    header h1{font-size:clamp(2rem,5vw,2.8rem);font-weight:900;letter-spacing:-.03em;margin:16px 0 6px}
    header h1 .g{background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent}
    header p{color:var(--dim);max-width:540px;margin:0 auto}
    .howto{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:18px 20px;margin:24px auto;font-size:.9rem;color:var(--dim)}
    .howto b{color:var(--text)}
    .btns{display:flex;gap:12px;justify-content:center;margin-top:18px;flex-wrap:wrap}
    .btn{display:inline-flex;align-items:center;gap:8px;text-decoration:none;font-weight:700;padding:11px 22px;border-radius:10px;font-size:.9rem}
    .btn.primary{background:var(--grad);color:#fff;box-shadow:0 8px 26px rgba(229,9,20,.34)}
    .btn.ghost{border:1px solid var(--border);color:var(--text)}
    .item{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:22px 24px;margin:16px 0;
      transition:transform .15s,border-color .15s;text-decoration:none;display:block;color:var(--text)}
    .item:hover{transform:translateY(-3px);border-color:var(--accent)}
    .item .cat{color:var(--accent2);font-size:.7rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase}
    .item h2{font-size:1.22rem;letter-spacing:-.01em;margin:6px 0}
    .item p{color:var(--dim);font-size:.92rem}
    .item .date{color:var(--dim);font-size:.78rem;margin-top:10px}
    footer{text-align:center;color:var(--dim);font-size:.82rem;padding:26px}
    footer a{color:var(--accent)}
  </style>
</head>
<body>
<header>
  <span class="badge">📡 RSS FEED</span>
  <h1>⚡ Reddy <span class="g">Pulse</span></h1>
  <p><xsl:value-of select="rss/channel/description"/></p>
  <div class="btns">
    <a class="btn primary" href="https://www.dandaakhilreddy.com/blog/index.html">Read on the web →</a>
    <a class="btn ghost" href="https://www.linkedin.com/in/akhil-reddy-danda-1a74b214b/">Follow on LinkedIn</a>
  </div>
</header>
<div class="wrap">
  <div class="howto">📬 <b>This is a live RSS feed.</b> Copy this page's URL into any feed reader (Feedly, Inoreader, NetNewsWire…) to get every new post automatically — just like following a channel. Or click any story below to read it now.</div>
  <xsl:for-each select="rss/channel/item">
    <a class="item">
      <xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
      <div class="cat"><xsl:value-of select="category"/></div>
      <h2><xsl:value-of select="title"/></h2>
      <p><xsl:value-of select="description"/></p>
      <div class="date"><xsl:value-of select="pubDate"/></div>
    </a>
  </xsl:for-each>
</div>
<footer>© Akhil Reddy Danda · <a href="https://www.dandaakhilreddy.com/blog/index.html">Reddy Pulse</a></footer>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
