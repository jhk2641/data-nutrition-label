import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CreateLabel from './pages/CreateLabel';
import EditLabel from './pages/EditLabel';
import ViewLabel from './pages/ViewLabel';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<CreateLabel />} />
        <Route path="/labels/:id" element={<ViewLabel />} />
        <Route path="/labels/:id/edit" element={<EditLabel />} />
      </Route>
    </Routes>
  );
}
