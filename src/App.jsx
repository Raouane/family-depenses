import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { GroupProvider } from './context/GroupContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Expenses from './pages/Expenses'
import Groups from './pages/Groups'
import Profile from './pages/Profile'
import AddExpense from './pages/AddExpense'

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <GroupProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/add-expense" element={<AddExpense />} />
          </Routes>
        </Layout>
      </GroupProvider>
    </Router>
  )
}

export default App
