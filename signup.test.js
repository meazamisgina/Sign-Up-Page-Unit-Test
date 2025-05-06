import { signup } from '../src/signup';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('Signup Function', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    document.body.innerHTML = `
      <input type="email" id="email" value="newuser@example.com">
      <input type="password" id="password" value="newPass123">
    `;
  });

  test('Should prevent default form submission', () => {
    const event = { preventDefault: jest.fn() };
    signup(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  test('Should send correct signup request', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ ok: true }));

    const event = { preventDefault: jest.fn() };
    await signup(event);

    expect(fetchMock).toHaveBeenCalledWith('/api/signup', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'newuser@example.com', password: 'newPass123' })
    }));
  });

  test('Should handle failed signup', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ ok: false, message: 'Email already exists' }));

    global.alert = jest.fn();

    const event = { preventDefault: jest.fn() };
    await signup(event);

    expect(global.alert).toHaveBeenCalledWith('Email already exists');
  });
});
