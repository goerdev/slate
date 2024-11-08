import dotenv from 'dotenv';

dotenv.config();

/**
 * 依據region，正確地將AWS token附加到process.env
 */
function applyToken(region) {
  if (region.toLowerCase() === 'cn') {
    process.env.AWS_ACCESS_KEY_ID = process.env.AWS_CN_KEY;
    process.env.AWS_SECRET_ACCESS_KEY = process.env.AWS_CN_SECRET;
  } else {
    process.env.AWS_ACCESS_KEY_ID = process.env.AWS_GLOBAL_KEY;
    process.env.AWS_SECRET_ACCESS_KEY = process.env.AWS_GLOBAL_SECRET;
  }
}

export default applyToken;
