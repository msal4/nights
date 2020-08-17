import client from './client';

/**
 *
 * @param {string} username
 * @param {string} password
 */
export const loginUser = (username, password) =>
  client.post('/auth/token/login/', {username, password});

/**
 * @param {string} email
 * @param {string} username
 * @param {string} password
 */
export const registerUser = (email, username, password) =>
  client.post('/auth/users/', {email, username, password});
