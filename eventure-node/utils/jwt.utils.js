import jwt from 'jsonwebtoken';

const secretKey = 'kGHXeoT0hkwbGNOr/hfhKlOdNnBrChaKvmpgg2SpZnk=';

export const generateTokens = (user) => {
  const payload = {
    sub: user.id,
    name: user.name,
  };

  const accessToken = generateAccessToken(payload);

  const refreshToken = jwt.sign(payload, secretKey, {
    expiresIn: '7d'
  })

  return {
    accessToken,
    refreshToken
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

const generateAccessToken = (payload) => {
  const accessToken = jwt.sign(payload, secretKey, {
    expiresIn: '10m'
  });

  return accessToken;
}

export const refreshAccessToken = (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, secretKey);
    const accessToken = generateAccessToken({
      sub: decoded.sub,
      name: decoded.name,
    })

    return {
      accessToken,
      userId: decoded.sub,
    }
  } catch (err) {
    return null;
  }
}
