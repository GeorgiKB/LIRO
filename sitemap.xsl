<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
<xsl:template match="/">
<html lang="bg">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Sitemap — LIRO</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0D0D14;
      color: #FAFAF8;
      min-height: 100vh;
      padding: 0 24px 80px;
    }

    header {
      max-width: 860px;
      margin: 0 auto;
      padding: 64px 0 48px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      margin-bottom: 48px;
    }

    .logo {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #FAFAF8;
      text-decoration: none;
      display: inline-block;
      margin-bottom: 32px;
    }

    header h1 {
      font-size: clamp(28px, 4vw, 42px);
      font-weight: 300;
      letter-spacing: -0.03em;
      line-height: 1.1;
      margin-bottom: 12px;
    }

    header p {
      font-size: 15px;
      color: rgba(250,250,248,0.5);
      line-height: 1.6;
    }

    header p strong {
      color: #C9A84C;
      font-weight: 500;
    }

    main {
      max-width: 860px;
      margin: 0 auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead tr {
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }

    thead th {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: rgba(250,250,248,0.35);
      padding: 0 0 14px;
      text-align: left;
    }

    thead th:not(:first-child) {
      text-align: right;
      width: 130px;
    }

    tbody tr {
      border-bottom: 1px solid rgba(255,255,255,0.05);
      transition: background 0.15s ease;
    }

    tbody tr:hover {
      background: rgba(255,255,255,0.03);
    }

    tbody tr:last-child { border-bottom: none; }

    td {
      padding: 18px 0;
      vertical-align: middle;
    }

    td:not(:first-child) {
      text-align: right;
    }

    .url-cell {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .url-icon {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      background: rgba(255,255,255,0.05);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 14px;
    }

    .url-link {
      color: #FAFAF8;
      text-decoration: none;
      font-size: 14px;
      font-weight: 400;
      line-height: 1.4;
      transition: color 0.15s ease;
    }

    .url-link:hover { color: #C9A84C; }

    .url-path {
      font-size: 12px;
      color: rgba(250,250,248,0.35);
      margin-top: 2px;
      font-family: 'SF Mono', 'Fira Code', monospace;
    }

    .priority-bar {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      justify-content: flex-end;
    }

    .priority-dots {
      display: flex;
      gap: 3px;
    }

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(255,255,255,0.12);
    }

    .dot.on { background: #C9A84C; }

    .priority-val {
      font-size: 12px;
      color: rgba(250,250,248,0.4);
      font-family: 'SF Mono', 'Fira Code', monospace;
      min-width: 28px;
    }

    .freq-badge {
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.04em;
      padding: 4px 10px;
      border-radius: 100px;
      background: rgba(255,255,255,0.06);
      color: rgba(250,250,248,0.5);
      display: inline-block;
    }

    .count {
      font-size: 13px;
      color: rgba(250,250,248,0.3);
      margin-top: 6px;
    }

    footer {
      max-width: 860px;
      margin: 48px auto 0;
      padding-top: 24px;
      border-top: 1px solid rgba(255,255,255,0.06);
      font-size: 12px;
      color: rgba(250,250,248,0.2);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  </style>
</head>
<body>

  <header>
    <a class="logo" href="/">LIRO</a>
    <h1>XML Sitemap</h1>
    <p>
      <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong> pages indexed for search engines.
    </p>
  </header>

  <main>
    <table>
      <thead>
        <tr>
          <th>Page</th>
          <th>Frequency</th>
          <th>Priority</th>
        </tr>
      </thead>
      <tbody>
        <xsl:for-each select="sitemap:urlset/sitemap:url">
          <xsl:sort select="sitemap:priority" order="descending" data-type="number"/>
          <tr>
            <td>
              <div class="url-cell">
                <div class="url-icon">
                  <xsl:choose>
                    <xsl:when test="contains(sitemap:loc, 'neo')">🌿</xsl:when>
                    <xsl:when test="contains(sitemap:loc, 'aura')">✨</xsl:when>
                    <xsl:when test="contains(sitemap:loc, 'pro')">⚡</xsl:when>
                    <xsl:when test="contains(sitemap:loc, 'about')">🏢</xsl:when>
                    <xsl:when test="contains(sitemap:loc, 'faq')">💬</xsl:when>
                    <xsl:when test="contains(sitemap:loc, 'delivery')">🚚</xsl:when>
                    <xsl:when test="contains(sitemap:loc, 'returns')">↩️</xsl:when>
                    <xsl:when test="contains(sitemap:loc, 'cart')">🛍️</xsl:when>
                    <xsl:otherwise>🏠</xsl:otherwise>
                  </xsl:choose>
                </div>
                <div>
                  <a class="url-link" href="{sitemap:loc}">
                    <xsl:choose>
                      <xsl:when test="contains(sitemap:loc, 'neo')">LIRO Neo</xsl:when>
                      <xsl:when test="contains(sitemap:loc, 'aura')">LIRO Aura</xsl:when>
                      <xsl:when test="contains(sitemap:loc, 'pro')">LIRO Pro</xsl:when>
                      <xsl:when test="contains(sitemap:loc, 'about')">За нас</xsl:when>
                      <xsl:when test="contains(sitemap:loc, 'faq')">Често задавани въпроси</xsl:when>
                      <xsl:when test="contains(sitemap:loc, 'delivery')">Доставка и Плащане</xsl:when>
                      <xsl:when test="contains(sitemap:loc, 'returns')">Връщане и Рекламации</xsl:when>
                      <xsl:when test="contains(sitemap:loc, 'cart')">Количка</xsl:when>
                      <xsl:otherwise>Начало</xsl:otherwise>
                    </xsl:choose>
                  </a>
                  <div class="url-path"><xsl:value-of select="sitemap:loc"/></div>
                </div>
              </div>
            </td>
            <td>
              <span class="freq-badge"><xsl:value-of select="sitemap:changefreq"/></span>
            </td>
            <td>
              <div class="priority-bar">
                <div class="priority-dots">
                  <div class="dot"><xsl:if test="sitemap:priority &gt;= 0.1"><xsl:attribute name="class">dot on</xsl:attribute></xsl:if></div>
                  <div class="dot"><xsl:if test="sitemap:priority &gt;= 0.2"><xsl:attribute name="class">dot on</xsl:attribute></xsl:if></div>
                  <div class="dot"><xsl:if test="sitemap:priority &gt;= 0.3"><xsl:attribute name="class">dot on</xsl:attribute></xsl:if></div>
                  <div class="dot"><xsl:if test="sitemap:priority &gt;= 0.4"><xsl:attribute name="class">dot on</xsl:attribute></xsl:if></div>
                  <div class="dot"><xsl:if test="sitemap:priority &gt;= 0.5"><xsl:attribute name="class">dot on</xsl:attribute></xsl:if></div>
                  <div class="dot"><xsl:if test="sitemap:priority &gt;= 0.6"><xsl:attribute name="class">dot on</xsl:attribute></xsl:if></div>
                  <div class="dot"><xsl:if test="sitemap:priority &gt;= 0.7"><xsl:attribute name="class">dot on</xsl:attribute></xsl:if></div>
                  <div class="dot"><xsl:if test="sitemap:priority &gt;= 0.8"><xsl:attribute name="class">dot on</xsl:attribute></xsl:if></div>
                  <div class="dot"><xsl:if test="sitemap:priority &gt;= 0.9"><xsl:attribute name="class">dot on</xsl:attribute></xsl:if></div>
                  <div class="dot"><xsl:if test="sitemap:priority = 1.0"><xsl:attribute name="class">dot on</xsl:attribute></xsl:if></div>
                </div>
                <span class="priority-val"><xsl:value-of select="sitemap:priority"/></span>
              </div>
            </td>
          </tr>
        </xsl:for-each>
      </tbody>
    </table>
  </main>

  <footer>
    <span>liro-bg.com — XML Sitemap</span>
    <span>Generated for search engine indexing</span>
  </footer>

</body>
</html>
</xsl:template>
</xsl:stylesheet>
