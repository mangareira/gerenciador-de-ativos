export const typeOptions = [
  { value: 'all', label: 'Todos os Tipos' },
  { value: 'admin', label: 'Administrador' },
  { value: 'manager', label: 'Gerente' },
  { value: 'technician', label: 'Técnico' },
  { value: 'user', label: 'Usuário' },
]

export const UsersTypeOptions = typeOptions.filter(o => o.value !== 'all');