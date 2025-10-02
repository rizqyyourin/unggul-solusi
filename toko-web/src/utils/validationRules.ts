interface ValidationRule {
  pattern: RegExp
  message: string
}

interface ValidationOptions {
  prefix: string
  label: string
}

export function createIdValidation({ prefix, label }: ValidationOptions): ValidationRule {
  return {
    pattern: new RegExp(`^${prefix}_\\d+$`),
    message: `Format ID harus ${prefix}_XXX (contoh: ${prefix}_1, ${prefix}_10)`
  }
}

export function createRequiredRule(label: string) {
  return {
    required: true,
    message: `${label} wajib diisi`
  }
}

export function createMaxLengthRule(length: number) {
  return {
    max: length,
    message: `Maksimal ${length} karakter`
  }
}

export function createMinRule(min: number, label: string = 'Nilai') {
  return {
    min,
    message: `${label} minimal ${min}`
  }
}