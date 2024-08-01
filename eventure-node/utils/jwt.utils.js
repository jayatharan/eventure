import jwt from 'jsonwebtoken';

const secretKey = 'kGHXeoT0hkwbGNOr/hfhKlOdNnBrChaKvmpgg2SpZnk=';

export const generateTokens = (user) => {
  const payload = {
    sub: user.id,
    name: user.name,
  };

  const accessToken = jwt.sign(payload, secretKey, {
    expiresIn: '1h'
  });

  return {
    accessToken
  };
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (err) {
    return null;
  }
};
