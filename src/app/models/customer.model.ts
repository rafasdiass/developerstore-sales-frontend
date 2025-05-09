/**
 * Representa um cliente do sistema.
 */
export interface Customer {
  /** ID único do cliente */
  id: string;
  /** Nome completo ou razão social */
  name: string;
  /** (Opcional) Documento do cliente (CPF/CNPJ) */
  document?: string;
  /** (Opcional) Email para contato */
  email?: string;
  /** (Opcional) Telefone do cliente */
  phone?: string;
  /** (Opcional) Indica se está ativo */
  isActive?: boolean;
}
