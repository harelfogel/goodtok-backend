export const USER_ROUTES = {
  ROOT: 'users',
  GET_ALL: '',
  CREATE: '',
  PREFERENCES: ':id/preferences',
  SUBSCRIBE: ':id/subscribe',
};

export const USER_PARAM_KEYS = {
  ID: 'id',
};

export const USER_BODY_KEYS = {
  EMAIL: 'email',
  TOPIC: 'topic',
  SUBSCRIPTION: {
    ENDPOINT: 'endpoint',
    KEYS: {
      P256DH: 'p256dh',
      AUTH: 'auth',
    },
  },
};
