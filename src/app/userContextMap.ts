export const userContextMap = (token) => {
  let userUuid = null;
  let ut = null;
  let isValidToken = false;

  if (token) {
    userUuid = token.sub;
    ut = token.ut;
    isValidToken = true;
  }

  return {
    user: { uuid: userUuid },
    userType: ut,
    hasValidToken: isValidToken
  }
};
