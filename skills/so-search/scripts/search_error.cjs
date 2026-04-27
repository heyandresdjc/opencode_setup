#!/usr/bin/env node

const https = require('https');
const zlib = require('zlib');

/**
 * search_error.cjs
 * 
 * Takes an error message and searches Stack Overflow via the Stack Exchange API.
 * 
 * Usage: node search_error.cjs "TypeError: Cannot read property 'foo' of undefined"
 */

async function searchStackOverflow(query) {
  return new Promise((resolve, reject) => {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://api.stackexchange.com/2.3/search/advanced?q=${encodedQuery}&site=stackoverflow&sort=relevance&pagesize=5`;

    const options = {
      headers: {
        'Accept-Encoding': 'gzip',
        'User-Agent': 'Gemini-CLI-Skill (https://github.com/google/gemini-cli)'
      }
    };

    https.get(url, options, (res) => {
      let stream = res;
      if (res.headers['content-encoding'] === 'gzip') {
        const gunzip = zlib.createGunzip();
        res.pipe(gunzip);
        stream = gunzip;
      }

      let body = '';
      stream.on('data', (chunk) => {
        body += chunk;
      });

      stream.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            return reject(new Error(`API returned status ${res.statusCode}: ${body}`));
          }
          const data = JSON.parse(body);
          resolve(data);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (e) => {
      reject(e);
    });
  });
}

async function main() {
  const query = process.argv.slice(2).join(' ');
  if (!query) {
    process.stdout.write("Usage: node search_error.cjs <error_message>\n");
    process.exit(1);
  }

  try {
    const data = await searchStackOverflow(query);
    if (!data.items || data.items.length === 0) {
      process.stdout.write(`No results found on Stack Overflow for: "${query}"\n`);
      return;
    }

    process.stdout.write(`Top results for "${query}":\n\n`);
    data.items.forEach((item, index) => {
      const title = item.title.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
      process.stdout.write(`${index + 1}. ${title}\n`);
      process.stdout.write(`   Score: ${item.score} | Accepted: ${item.is_answered ? 'Yes' : 'No'}\n`);
      process.stdout.write(`   URL: ${item.link}\n\n`);
    });

    if (data.quota_remaining !== undefined) {
      process.stdout.write(`(API Quota remaining: ${data.quota_remaining})\n`);
    }
  } catch (err) {
    process.stderr.write(`Failure: ${err.message}\n`);
    process.exit(1);
  }
}

main();
