const cheerio = require('cheerio');
const axios = require('axios');

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET' && req.query.fburl) {
    const fbUrl = req.query.fburl;

    try {
      const response = await axios.get(fbUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      });

      const $ = cheerio.load(response.data);
      const image = $('meta[property="og:image"]').attr('content');
      const title = $('meta[property="og:title"]').attr('content') || 'Profile';

      if (image) {
        res.status(200).json({
          image,
          title,
          credit: 'Tofazzal Hossain'
        });
      } else {
        res.status(404).json({
          error: 'Profile picture not found. It might be private or blocked by Facebook.',
          credit: 'Tofazzal Hossain'
        });
      }
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch Facebook profile. Please ensure the link is correct.',
        credit: 'Tofazzal Hossain'
      });
    }
  } else {
    res.status(400).json({
      error: 'Invalid request. Please provide fburl as GET parameter.',
      credit: 'Tofazzal Hossain'
    });
  }
};
