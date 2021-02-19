import React, { useContext, useState } from 'react';
import { AuthContext } from './providers/AuthProvider';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const LoginForm = () => {
  const [, setAccessToken] = useLocalStorage('auth', '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [, setAuth] = useContext(AuthContext);

  const login = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (res.status !== 200) {
      setAuth('');
    } else {
      const json = await res.json();
      setAccessToken(json.accessToken);
      setAuth(json.accessToken);
    }
  };

  return (
    <form id={'login'} onSubmit={login}>
      <h2>Sign in</h2>
      <label htmlFor="email">Correo electrónico</label>
      <input type="text" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <label htmlFor="password">Contraseña</label>
      <input
        type="password"
        name="email"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button />
      <p>
        ¿No tienes cuenta?<a href="http://localhost:3000/#registerSections">Regístrate.</a>
      </p>
    </form>
  );
};
