// Convierte códigos de error de Firebase Auth en mensajes útiles para el usuario.
const MESSAGES = {
  'auth/invalid-email': 'Ese correo no tiene un formato válido.',
  'auth/user-disabled': 'Esta cuenta está deshabilitada.',
  'auth/user-not-found': 'No hay ninguna cuenta con ese correo.',
  'auth/wrong-password': 'Correo o contraseña incorrectos.',
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/email-already-in-use': 'Ya existe una cuenta con ese correo.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/popup-closed-by-user': 'Cerraste la ventana antes de terminar.',
  'auth/too-many-requests': 'Demasiados intentos. Prueba de nuevo en un rato.',
  'auth/network-request-failed': 'Sin conexión. Revisa tu internet.',
}

export function authError(err) {
  return MESSAGES[err?.code] || 'Algo ha fallado. Inténtalo de nuevo.'
}
