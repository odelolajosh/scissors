import { Route, Routes } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Verify from './Verify';
import { NotFound } from '@/features/misc';


export const AuthRoute = () => (
  <Routes>
    <Route path="login" element={<Login />} />
    <Route path="register" element={<Register />} />
    <Route path="verify" element={<Verify />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
)
