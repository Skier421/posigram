const localNews = [
  {
    title: "Community gardens bring neighbors together in São Paulo",
    source: "Global Green",
    country: "Brazil",
    summary: "Volunteers transformed vacant lots into small gardens, sharing food and weekly potlucks to strengthen local ties.",
  },
  {
    title: "Students write letters to isolated elders in Tokyo",
    source: "Kindness Weekly",
    country: "Japan",
    summary: "A school program bridges generations through hand-written notes and regular visits, reducing loneliness.",
  },
  {
    title: "Clean-water project restores a river community in Kenya",
    source: "Bright Future News",
    country: "Kenya",
    summary: "A small solar-powered pump now provides clean water for hundreds of families and creates time for learning.",
  },
  {
    title: "Local musicians donate concert proceeds to refugee support",
    source: "Harmony Times",
    country: "Poland",
    summary: "An evening of performance raised funds for resettlement services while building community solidarity.",
  },
  {
    title: "Youth-run mentorship program reduces school dropouts",
    source: "Bright Steps",
    country: "Canada",
    summary: "High-school mentors help middle-school students with homework and confidence-building activities.",
  },
];

// GET /api/positive-news
async function getPositiveNews(req, res, next) {
  try {
    // If a proxy URL is specified in env, try fetching from it. This keeps API keys off the frontend.
    const proxyUrl = process.env.POSITIVE_NEWS_URL || process.env.NEWS_API_URL || null;

    // If an official NewsAPI key is provided, attempt to fetch curated positive stories
    const newsApiKey = process.env.NEWSAPI_KEY || process.env.NEWS_API_KEY || null;
    if (newsApiKey) {
      try {
        const q = encodeURIComponent('good news OR uplifting OR "positive story"');
        const url = `https://newsapi.org/v2/everything?q=${q}&language=en&pageSize=20&apiKey=${newsApiKey}`;
        const resp = await fetch(url, { method: 'GET' });
        if (resp.ok) {
          const json = await resp.json();
          if (json && Array.isArray(json.articles)) {
            const mapped = json.articles.map((a) => ({
              title: a.title || '',
              summary: a.description || a.content || '',
              source: a.source && a.source.name ? a.source.name : 'news',
              country: a.source && a.source.name ? '' : '',
              url: a.url || '',
            }));
            return res.json(mapped);
          }
        }
      } catch (err) {
        console.warn('NewsAPI fetch failed, falling back to proxy/local', err.message || err);
      }
    }

    if (proxyUrl) {
      try {
        const resp = await fetch(proxyUrl, { method: 'GET' });
        if (resp.ok) {
          const json = await resp.json();
          // Expecting an array of news-like objects; otherwise fall back
          if (Array.isArray(json) && json.length > 0) {
            return res.json(json);
          }
        }
      } catch (err) {
        console.warn('positive-news proxy fetch failed, falling back to local list', err.message || err);
      }
    }

    // Default: serve curated local list
    return res.json(localNews);
  } catch (err) {
    next(err);
  }
}

module.exports = { getPositiveNews };
