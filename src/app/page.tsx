"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Plus, 
  Download, 
  Upload, 
  Users, 
  Settings,
  Eye,
  EyeOff,
  CreditCard,
  PiggyBank,
  Target,
  Calendar,
  Filter,
  FileText,
  BarChart3,
  LogIn,
  LogOut,
  UserPlus,
  Edit,
  Trash2
} from 'lucide-react'
import { toast } from 'sonner'

// Tipos de dados
interface Budget {
  id: string
  category: string
  estimated: number
  actual: number
  type: 'income' | 'expense'
  month: string
  limit: number
}

interface Transaction {
  id: string
  description: string
  amount: number
  category: string
  type: 'income' | 'expense'
  date: string
  source: 'manual' | 'imported' | 'api'
}

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  permissions: string[]
  password?: string
}

// Dados mockados
const mockBudgets: Budget[] = [
  { id: '1', category: 'Salário', estimated: 4200, actual: 4368, type: 'income', month: '2024-01', limit: 10 },
  { id: '2', category: 'Freelances', estimated: 1260, actual: 1008, type: 'income', month: '2024-01', limit: 15 },
  { id: '3', category: 'Alimentação', estimated: 672, actual: 798, type: 'expense', month: '2024-01', limit: 20 },
  { id: '4', category: 'Transporte', estimated: 252, actual: 235, type: 'expense', month: '2024-01', limit: 10 },
  { id: '5', category: 'Moradia', estimated: 1008, actual: 1008, type: 'expense', month: '2024-01', limit: 5 },
  { id: '6', category: 'Lazer', estimated: 336, actual: 437, type: 'expense', month: '2024-01', limit: 25 },
]

const mockTransactions: Transaction[] = [
  { id: '1', description: 'Salário Janeiro', amount: 4368, category: 'Salário', type: 'income', date: '2024-01-01', source: 'api' },
  { id: '2', description: 'Freelance Design', amount: 672, category: 'Freelances', type: 'income', date: '2024-01-05', source: 'manual' },
  { id: '3', description: 'Supermercado', amount: -126, category: 'Alimentação', type: 'expense', date: '2024-01-03', source: 'imported' },
  { id: '4', description: 'Uber', amount: -21, category: 'Transporte', type: 'expense', date: '2024-01-04', source: 'api' },
  { id: '5', description: 'Aluguel', amount: -1008, category: 'Moradia', type: 'expense', date: '2024-01-01', source: 'manual' },
  { id: '6', description: 'Cinema', amount: -25, category: 'Lazer', type: 'expense', date: '2024-01-06', source: 'manual' },
]

// Removido o usuário João Silva e mantido apenas Maria Santos
const mockUsers: User[] = [
  { id: '2', name: 'Maria Santos', email: 'maria@email.com', role: 'admin', permissions: ['all'] },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export default function FinancialControlApp() {
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets)
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState('2024-01')
  const [showValues, setShowValues] = useState(true)
  const [alertLimit, setAlertLimit] = useState(20)

  // Estados para login
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  })

  // Estados para criação de usuário
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user',
    permissions: ['read', 'write']
  })

  // Estados para edição de usuário
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editUserForm, setEditUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user',
    permissions: ['read', 'write']
  })
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Estados para formulários
  const [newBudget, setNewBudget] = useState({
    category: '',
    estimated: '',
    type: 'expense' as 'income' | 'expense',
    limit: '20'
  })

  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    category: '',
    type: 'expense' as 'income' | 'expense'
  })

  // Simular login automático para demonstração
  useEffect(() => {
    setCurrentUser(mockUsers[0])
    setIsLoggedIn(true)
  }, [])

  // Cálculos financeiros (convertidos para Euro)
  const totalIncome = budgets.filter(b => b.type === 'income').reduce((sum, b) => sum + b.actual, 0)
  const totalExpenses = budgets.filter(b => b.type === 'expense').reduce((sum, b) => sum + b.actual, 0)
  const currentBalance = totalIncome - totalExpenses
  const estimatedBalance = budgets.filter(b => b.type === 'income').reduce((sum, b) => sum + b.estimated, 0) - 
                          budgets.filter(b => b.type === 'expense').reduce((sum, b) => sum + b.estimated, 0)

  // Alertas de desvio
  const getVariationAlerts = () => {
    return budgets.filter(budget => {
      const variation = Math.abs((budget.actual - budget.estimated) / budget.estimated * 100)
      return variation > budget.limit
    })
  }

  const alerts = getVariationAlerts()

  // Dados para gráficos
  const budgetComparisonData = budgets.map(budget => ({
    category: budget.category,
    estimated: budget.estimated,
    actual: budget.actual,
    variation: ((budget.actual - budget.estimated) / budget.estimated * 100).toFixed(1)
  }))

  const expensesPieData = budgets
    .filter(b => b.type === 'expense')
    .map(budget => ({
      name: budget.category,
      value: budget.actual
    }))

  const monthlyEvolutionData = [
    { month: 'Nov', income: 5208, expenses: 2352, balance: 2856 },
    { month: 'Dez', income: 5460, expenses: 2688, balance: 2772 },
    { month: 'Jan', income: totalIncome, expenses: totalExpenses, balance: currentBalance },
  ]

  // Funções de autenticação
  const handleLogin = () => {
    if (!loginForm.email || !loginForm.password) {
      toast.error('Preencha todos os campos')
      return
    }

    const user = users.find(u => u.email === loginForm.email)
    if (user) {
      setCurrentUser(user)
      setIsLoggedIn(true)
      setLoginForm({ email: '', password: '' })
      toast.success(`Bem-vindo, ${user.name}!`)
    } else {
      toast.error('Credenciais inválidas')
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setIsLoggedIn(false)
    toast.success('Logout realizado com sucesso')
  }

  const createUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    if (users.find(u => u.email === newUser.email)) {
      toast.error('Email já cadastrado')
      return
    }

    const user: User = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      permissions: newUser.permissions,
      password: newUser.password
    }

    setUsers([...users, user])
    setNewUser({ name: '', email: '', password: '', role: 'user', permissions: ['read', 'write'] })
    toast.success('Usuário criado com sucesso!')
  }

  // Função para iniciar edição de usuário
  const startEditUser = (user: User) => {
    setEditingUser(user)
    setEditUserForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      permissions: user.permissions
    })
    setIsEditDialogOpen(true)
  }

  // Função para salvar edição de usuário
  const saveEditUser = () => {
    if (!editingUser) return

    if (!editUserForm.name || !editUserForm.email) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    // Verificar se o email já existe (exceto para o próprio usuário)
    const emailExists = users.find(u => u.email === editUserForm.email && u.id !== editingUser.id)
    if (emailExists) {
      toast.error('Email já cadastrado por outro usuário')
      return
    }

    const updatedUser: User = {
      ...editingUser,
      name: editUserForm.name,
      email: editUserForm.email,
      role: editUserForm.role,
      permissions: editUserForm.permissions,
      ...(editUserForm.password && { password: editUserForm.password })
    }

    setUsers(users.map(u => u.id === editingUser.id ? updatedUser : u))
    
    // Se o usuário editado é o usuário logado, atualizar também o currentUser
    if (currentUser?.id === editingUser.id) {
      setCurrentUser(updatedUser)
    }

    setIsEditDialogOpen(false)
    setEditingUser(null)
    setEditUserForm({ name: '', email: '', password: '', role: 'user', permissions: ['read', 'write'] })
    toast.success('Usuário atualizado com sucesso!')
  }

  const deleteUser = (userId: string) => {
    if (userId === currentUser?.id) {
      toast.error('Não é possível excluir o usuário logado')
      return
    }
    
    setUsers(users.filter(u => u.id !== userId))
    toast.success('Usuário excluído com sucesso!')
  }

  // Funções existentes
  const addBudget = () => {
    if (!newBudget.category || !newBudget.estimated) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    const budget: Budget = {
      id: Date.now().toString(),
      category: newBudget.category,
      estimated: parseFloat(newBudget.estimated),
      actual: 0,
      type: newBudget.type,
      month: selectedMonth,
      limit: parseFloat(newBudget.limit)
    }

    setBudgets([...budgets, budget])
    setNewBudget({ category: '', estimated: '', type: 'expense', limit: '20' })
    toast.success('Orçamento adicionado com sucesso!')
  }

  const addTransaction = () => {
    if (!newTransaction.description || !newTransaction.amount || !newTransaction.category) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      description: newTransaction.description,
      amount: newTransaction.type === 'expense' ? -parseFloat(newTransaction.amount) : parseFloat(newTransaction.amount),
      category: newTransaction.category,
      type: newTransaction.type,
      date: new Date().toISOString().split('T')[0],
      source: 'manual'
    }

    setTransactions([transaction, ...transactions])

    // Atualizar valor real no orçamento
    setBudgets(budgets.map(budget => {
      if (budget.category === newTransaction.category && budget.type === newTransaction.type) {
        return {
          ...budget,
          actual: budget.actual + Math.abs(parseFloat(newTransaction.amount))
        }
      }
      return budget
    }))

    setNewTransaction({ description: '', amount: '', category: '', type: 'expense' })
    toast.success('Transação registrada com sucesso!')
  }

  const simulateCSVImport = () => {
    const importedTransactions = [
      { description: 'Pagamento Cartão', amount: -378, category: 'Alimentação', type: 'expense' as const },
      { description: 'Transferência PIX', amount: 168, category: 'Freelances', type: 'income' as const },
      { description: 'Combustível', amount: -67, category: 'Transporte', type: 'expense' as const },
    ]

    importedTransactions.forEach(t => {
      const transaction: Transaction = {
        id: Date.now().toString() + Math.random(),
        description: t.description,
        amount: t.amount,
        category: t.category,
        type: t.type,
        date: new Date().toISOString().split('T')[0],
        source: 'imported'
      }
      setTransactions(prev => [transaction, ...prev])

      // Atualizar orçamento
      setBudgets(prev => prev.map(budget => {
        if (budget.category === t.category && budget.type === t.type) {
          return {
            ...budget,
            actual: budget.actual + Math.abs(t.amount)
          }
        }
        return budget
      }))
    })

    toast.success('3 transações importadas com sucesso!')
  }

  const exportToPDF = () => {
    toast.success('Relatório PDF gerado com sucesso!')
  }

  const exportToExcel = () => {
    toast.success('Relatório Excel gerado com sucesso!')
  }

  // Tela de login
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <PiggyBank className="h-8 w-8 text-emerald-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                FinanceControl
              </h1>
            </div>
            <CardTitle>Fazer Login</CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                placeholder="••••••••"
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              <LogIn className="h-4 w-4 mr-2" />
              Entrar
            </Button>
            <div className="text-center text-sm text-slate-500">
              <p>Usuário de teste:</p>
              <p>Admin: maria@email.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <PiggyBank className="h-8 w-8 text-emerald-600" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  FinanceControl
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowValues(!showValues)}
                className="text-slate-600 dark:text-slate-300"
              >
                {showValues ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-01">Jan 2024</SelectItem>
                  <SelectItem value="2023-12">Dez 2023</SelectItem>
                  <SelectItem value="2023-11">Nov 2023</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {currentUser?.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {currentUser?.name}
                </span>
                <Badge variant={currentUser?.role === 'admin' ? 'default' : 'secondary'}>
                  {currentUser?.role}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-slate-600 dark:text-slate-300"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Alertas */}
      {alerts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800 dark:text-orange-200">
              <strong>{alerts.length} categoria(s)</strong> com desvio acima do limite configurado:
              {alerts.map(alert => (
                <span key={alert.id} className="ml-2 font-medium">
                  {alert.category} ({((alert.actual - alert.estimated) / alert.estimated * 100).toFixed(1)}%)
                </span>
              ))}
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Receitas</CardTitle>
              <TrendingUp className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {showValues ? `€ ${totalIncome.toLocaleString('pt-BR')}` : '€ ••••'}
              </div>
              <p className="text-xs opacity-90">
                +12% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Despesas</CardTitle>
              <TrendingDown className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {showValues ? `€ ${totalExpenses.toLocaleString('pt-BR')}` : '€ ••••'}
              </div>
              <p className="text-xs opacity-90">
                +8% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Saldo Atual</CardTitle>
              <DollarSign className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {showValues ? `€ ${currentBalance.toLocaleString('pt-BR')}` : '€ ••••'}
              </div>
              <p className="text-xs opacity-90">
                {currentBalance > estimatedBalance ? 'Acima' : 'Abaixo'} do estimado
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Meta Mensal</CardTitle>
              <Target className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {showValues ? `€ ${estimatedBalance.toLocaleString('pt-BR')}` : '€ ••••'}
              </div>
              <p className="text-xs opacity-90">
                {((currentBalance / estimatedBalance) * 100).toFixed(0)}% atingido
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Principais */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="budgets">Orçamentos</TabsTrigger>
            <TabsTrigger value="transactions">Transações</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
            <TabsTrigger value="import">Importação</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Evolução Mensal */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Evolução Mensal</span>
                  </CardTitle>
                  <CardDescription>
                    Comparação de receitas, despesas e saldo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyEvolutionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`€ ${Number(value).toLocaleString('pt-BR')}`, '']} />
                      <Legend />
                      <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Receitas" />
                      <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Despesas" />
                      <Line type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={2} name="Saldo" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Distribuição de Despesas */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Despesas</CardTitle>
                  <CardDescription>
                    Percentual por categoria
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={expensesPieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {expensesPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`€ ${Number(value).toLocaleString('pt-BR')}`, '']} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Comparação Orçado vs Real */}
            <Card>
              <CardHeader>
                <CardTitle>Orçado vs Real</CardTitle>
                <CardDescription>
                  Comparação entre valores estimados e realizados por categoria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={budgetComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`€ ${Number(value).toLocaleString('pt-BR')}`, '']} />
                    <Legend />
                    <Bar dataKey="estimated" fill="#94a3b8" name="Estimado" />
                    <Bar dataKey="actual" fill="#3b82f6" name="Real" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orçamentos */}
          <TabsContent value="budgets" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestão de Orçamentos</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Orçamento
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Orçamento</DialogTitle>
                    <DialogDescription>
                      Defina uma estimativa para receitas ou despesas
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="category">Categoria</Label>
                      <Input
                        id="category"
                        value={newBudget.category}
                        onChange={(e) => setNewBudget({...newBudget, category: e.target.value})}
                        placeholder="Ex: Alimentação, Salário..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="estimated">Valor Estimado (€)</Label>
                      <Input
                        id="estimated"
                        type="number"
                        value={newBudget.estimated}
                        onChange={(e) => setNewBudget({...newBudget, estimated: e.target.value})}
                        placeholder="0,00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Tipo</Label>
                      <Select value={newBudget.type} onValueChange={(value: 'income' | 'expense') => setNewBudget({...newBudget, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="income">Receita</SelectItem>
                          <SelectItem value="expense">Despesa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="limit">Limite de Alerta (%)</Label>
                      <Input
                        id="limit"
                        type="number"
                        value={newBudget.limit}
                        onChange={(e) => setNewBudget({...newBudget, limit: e.target.value})}
                        placeholder="20"
                      />
                    </div>
                    <Button onClick={addBudget} className="w-full">
                      Adicionar Orçamento
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgets.map((budget) => {
                const variation = ((budget.actual - budget.estimated) / budget.estimated * 100)
                const isOverLimit = Math.abs(variation) > budget.limit
                
                return (
                  <Card key={budget.id} className={`${isOverLimit ? 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950' : ''}`}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{budget.category}</CardTitle>
                          <CardDescription>
                            {budget.type === 'income' ? 'Receita' : 'Despesa'}
                          </CardDescription>
                        </div>
                        {isOverLimit && <AlertTriangle className="h-5 w-5 text-orange-500" />}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Estimado:</span>
                          <span className="font-medium">€ {budget.estimated.toLocaleString('pt-BR')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Real:</span>
                          <span className="font-medium">€ {budget.actual.toLocaleString('pt-BR')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Variação:</span>
                          <span className={`font-medium ${variation > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {variation > 0 ? '+' : ''}{variation.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      
                      <Progress 
                        value={Math.min((budget.actual / budget.estimated) * 100, 100)} 
                        className="h-2"
                      />
                      
                      <div className="text-xs text-slate-500">
                        Limite de alerta: {budget.limit}%
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Transações */}
          <TabsContent value="transactions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Transações</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Transação
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Registrar Transação</DialogTitle>
                    <DialogDescription>
                      Adicione uma nova receita ou despesa
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Input
                        id="description"
                        value={newTransaction.description}
                        onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                        placeholder="Ex: Compra no supermercado"
                      />
                    </div>
                    <div>
                      <Label htmlFor="amount">Valor (€)</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={newTransaction.amount}
                        onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                        placeholder="0,00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Categoria</Label>
                      <Select value={newTransaction.category} onValueChange={(value) => setNewTransaction({...newTransaction, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {budgets.map(budget => (
                            <SelectItem key={budget.id} value={budget.category}>
                              {budget.category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="type">Tipo</Label>
                      <Select value={newTransaction.type} onValueChange={(value: 'income' | 'expense') => setNewTransaction({...newTransaction, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="income">Receita</SelectItem>
                          <SelectItem value="expense">Despesa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={addTransaction} className="w-full">
                      Registrar Transação
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Histórico de Transações</CardTitle>
                <CardDescription>
                  Últimas movimentações financeiras
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {transaction.type === 'income' ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-slate-500">{transaction.category} • {transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.amount > 0 ? '+' : ''}€ {Math.abs(transaction.amount).toLocaleString('pt-BR')}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {transaction.source === 'manual' ? 'Manual' : 
                           transaction.source === 'imported' ? 'Importado' : 'API'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Relatórios */}
          <TabsContent value="reports" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Relatórios e Análises</h2>
              <div className="flex space-x-2">
                <Button onClick={exportToPDF} variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Exportar PDF
                </Button>
                <Button onClick={exportToExcel} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Excel
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Análise de Variações */}
              <Card>
                <CardHeader>
                  <CardTitle>Análise de Variações</CardTitle>
                  <CardDescription>
                    Desvios entre orçado e realizado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {budgets.map((budget) => {
                      const variation = ((budget.actual - budget.estimated) / budget.estimated * 100)
                      return (
                        <div key={budget.id} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <p className="font-medium">{budget.category}</p>
                            <p className="text-sm text-slate-500">
                              € {budget.estimated.toLocaleString('pt-BR')} → € {budget.actual.toLocaleString('pt-BR')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${variation > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {variation > 0 ? '+' : ''}{variation.toFixed(1)}%
                            </p>
                            <p className="text-xs text-slate-500">
                              {Math.abs(variation) > budget.limit ? 'Acima do limite' : 'Dentro do limite'}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Projeções */}
              <Card>
                <CardHeader>
                  <CardTitle>Projeções</CardTitle>
                  <CardDescription>
                    Estimativas para os próximos meses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <h4 className="font-medium text-blue-900 dark:text-blue-100">Próximo Mês</h4>
                      <p className="text-2xl font-bold text-blue-600">
                        € {(currentBalance * 1.05).toLocaleString('pt-BR')}
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Baseado na tendência atual (+5%)
                      </p>
                    </div>
                    
                    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <h4 className="font-medium text-green-900 dark:text-green-100">Trimestre</h4>
                      <p className="text-2xl font-bold text-green-600">
                        € {(currentBalance * 3.2).toLocaleString('pt-BR')}
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Projeção conservadora
                      </p>
                    </div>
                    
                    <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                      <h4 className="font-medium text-purple-900 dark:text-purple-100">Anual</h4>
                      <p className="text-2xl font-bold text-purple-600">
                        € {(currentBalance * 12.8).toLocaleString('pt-BR')}
                      </p>
                      <p className="text-sm text-purple-700 dark:text-purple-300">
                        Meta de crescimento
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Importação */}
          <TabsContent value="import" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Importação de Dados</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* CSV/Excel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="h-5 w-5" />
                    <span>CSV/Excel</span>
                  </CardTitle>
                  <CardDescription>
                    Importe transações de arquivos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                    <p className="text-sm text-slate-600">
                      Arraste arquivos aqui ou clique para selecionar
                    </p>
                  </div>
                  <Button onClick={simulateCSVImport} className="w-full" variant="outline">
                    Simular Importação
                  </Button>
                </CardContent>
              </Card>

              {/* API Bancária */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>API Bancária</span>
                  </CardTitle>
                  <CardDescription>
                    Conecte com seu banco
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Button className="w-full" variant="outline">
                      <div className="w-6 h-6 bg-red-600 rounded mr-2"></div>
                      Santander
                    </Button>
                    <Button className="w-full" variant="outline">
                      <div className="w-6 h-6 bg-yellow-500 rounded mr-2"></div>
                      Banco do Brasil
                    </Button>
                    <Button className="w-full" variant="outline">
                      <div className="w-6 h-6 bg-blue-600 rounded mr-2"></div>
                      Caixa
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500">
                    Conexão segura via Open Banking
                  </p>
                </CardContent>
              </Card>

              {/* Sincronização */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>Configurações</span>
                  </CardTitle>
                  <CardDescription>
                    Automatização e alertas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-sync">Sincronização Automática</Label>
                      <input type="checkbox" id="auto-sync" className="rounded" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-alerts">Alertas por Email</Label>
                      <input type="checkbox" id="email-alerts" className="rounded" defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="alert-limit">Limite de Alerta Global (%)</Label>
                      <Input
                        id="alert-limit"
                        type="number"
                        value={alertLimit}
                        onChange={(e) => setAlertLimit(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Histórico de Importações */}
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Importações</CardTitle>
                <CardDescription>
                  Últimas sincronizações realizadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Importação CSV</p>
                        <p className="text-sm text-slate-500">3 transações • Hoje às 14:30</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-600">Sucesso</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">API Santander</p>
                        <p className="text-sm text-slate-500">12 transações • Ontem às 09:15</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-blue-600">Automático</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Planilha Excel</p>
                        <p className="text-sm text-slate-500">Erro na linha 15 • 2 dias atrás</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-orange-600">Erro</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Usuários */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestão de Usuários</h2>
              {currentUser?.role === 'admin' && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Usuário
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Criar Novo Usuário</DialogTitle>
                      <DialogDescription>
                        Adicione um novo usuário ao sistema
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input
                          id="name"
                          value={newUser.name}
                          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                          placeholder="Ex: João Silva"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                          placeholder="joao@email.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Senha</Label>
                        <Input
                          id="password"
                          type="password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                          placeholder="••••••••"
                        />
                      </div>
                      <div>
                        <Label htmlFor="role">Função</Label>
                        <Select value={newUser.role} onValueChange={(value: 'admin' | 'user') => setNewUser({...newUser, role: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="user">Usuário</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={createUser} className="w-full">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Criar Usuário
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <Card key={user.id}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{user.name}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Função:</span>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Permissões:</span>
                      <div className="flex flex-wrap gap-1">
                        {user.permissions.map((permission) => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permission === 'all' ? 'Todas' : 
                             permission === 'read' ? 'Leitura' : 
                             permission === 'write' ? 'Escrita' : permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {currentUser?.role === 'admin' && (
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => startEditUser(user)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 text-red-600 hover:text-red-700"
                          onClick={() => deleteUser(user.id)}
                          disabled={user.id === currentUser?.id}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Excluir
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Dialog para editar usuário */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Usuário</DialogTitle>
                  <DialogDescription>
                    Modifique as informações do usuário
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-name">Nome Completo</Label>
                    <Input
                      id="edit-name"
                      value={editUserForm.name}
                      onChange={(e) => setEditUserForm({...editUserForm, name: e.target.value})}
                      placeholder="Ex: João Silva"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editUserForm.email}
                      onChange={(e) => setEditUserForm({...editUserForm, email: e.target.value})}
                      placeholder="joao@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-password">Nova Senha (deixe em branco para manter atual)</Label>
                    <Input
                      id="edit-password"
                      type="password"
                      value={editUserForm.password}
                      onChange={(e) => setEditUserForm({...editUserForm, password: e.target.value})}
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-role">Função</Label>
                    <Select value={editUserForm.role} onValueChange={(value: 'admin' | 'user') => setEditUserForm({...editUserForm, role: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="user">Usuário</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={saveEditUser} className="flex-1">
                      Salvar Alterações
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Controle de Acesso */}
            <Card>
              <CardHeader>
                <CardTitle>Controle de Acesso</CardTitle>
                <CardDescription>
                  Configurações de segurança e permissões
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Configurações de Autenticação</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Autenticação de dois fatores</Label>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Login via OAuth2</Label>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Sessão automática (JWT)</Label>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Níveis de Permissão</h4>
                    <div className="space-y-3">
                      <div className="p-3 border rounded">
                        <p className="font-medium text-sm">Administrador</p>
                        <p className="text-xs text-slate-500">Acesso total ao sistema, pode criar/editar/excluir usuários</p>
                      </div>
                      <div className="p-3 border rounded">
                        <p className="font-medium text-sm">Usuário Padrão</p>
                        <p className="text-xs text-slate-500">Acesso às próprias contas e funcionalidades básicas</p>
                      </div>
                      <div className="p-3 border rounded">
                        <p className="font-medium text-sm">Visualizador</p>
                        <p className="text-xs text-slate-500">Apenas leitura dos dados</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}