import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import Login from '@/pages/Login'
import Home from '@/pages/Home'
import Inbox from '@/pages/Inbox'
import Marketing from '@/pages/Marketing'
import Crm from '@/pages/Crm'
import DealDetail from '@/pages/DealDetail'
import Patients from '@/pages/Patients'
import Patient360 from '@/pages/Patient360'
import Agenda from '@/pages/Agenda'
import Consultation from '@/pages/Consultation'
import QuoteEditor from '@/pages/QuoteEditor'
import Contracts from '@/pages/Contracts'
import PostOp from '@/pages/PostOp'
import Teleconsult from '@/pages/Teleconsult'
import Portal from '@/pages/Portal'
import DoctorApp from '@/pages/DoctorApp'
import Dashboards from '@/pages/Dashboards'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<AppShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/marketing" element={<Marketing />} />
          <Route path="/crm" element={<Crm />} />
          <Route path="/crm/:dealId" element={<DealDetail />} />
          <Route path="/pacientes" element={<Patients />} />
          <Route path="/pacientes/:id" element={<Patient360 />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/consulta/:encounterId" element={<Consultation />} />
          <Route path="/orcamentos/:quoteId" element={<QuoteEditor />} />
          <Route path="/contratos" element={<Contracts />} />
          <Route path="/pos-atendimento" element={<PostOp />} />
          <Route path="/teleconsulta" element={<Teleconsult />} />
          <Route path="/portal" element={<Portal />} />
          <Route path="/app-medico" element={<DoctorApp />} />
          <Route path="/dashboards" element={<Dashboards />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
