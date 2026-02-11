export const typeOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'maintenance', label: 'Manutenção' },
  { value: 'support', label: 'Suporte' },
  { value: 'lease', label: 'Leasing' },
  { value: 'warranty', label: 'Garantia' },
]

export const paymetFrequenceOptions = [ 
  { value: 'monthly', label: 'Mensal' },
  { value: 'quarterly', label: 'Trimestral' },
  { value: 'annually', label: 'Anual' },
  { value: 'one_time', label: 'Pagamento Unico' },
];

export const statusOptions = [ 
  { value: 'all', label: 'Todos' },
  { value: "active", label: 'Ativo'}, 
  { value: "expired", label: 'Expirado'}, 
  { value: "pending", label: 'Pendente'}, 
  { value: "cancelled", label: 'Cancelado'}
]