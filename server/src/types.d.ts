export interface response<T> {
  success?: boolean,
  data?: T,
  message?: string,
  error?: string
}