const cheerio = require('cheerio');
const axios = require('axios');

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const { fburl } = req.query;

  if (req.method === 'GET' && fburl) {
    try {
      const response = await axios.get(fburl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      });

      const $ = cheerio.load(response.data);
      const image = $('meta[property="og:image"]').attr('content');
      const title = $('meta[property="og:title"]').attr('content') || 'Profile';

      if (image) {
        return res.status(200).json({
          image,
          title,
          credit: 'Tofazzal Hossain'
        });
      } else {
        return res.status(404).json({
          error: 'Profile picture not found. It might be private or blocked by Facebook.',
          credit: 'Tofazzal Hossain'
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to fetch Facebook profile. Make sure the link is public and valid.',
        credit: 'Tofazzal Hossain'
      });
    }
  } else {
    return res.status(400).json({
      error: 'Invalid request. Please provide fburl as GET parameter.',
      credit: 'Tofazzal Hossain'
    });
  }
};
