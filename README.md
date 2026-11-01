# El Chamán — DoingLio

**El arte de vivir a tu manera.** Cuarto especialista de DoingLio, independiente de los demás repositorios.

## Estado — 0.3.0-test (1 de noviembre de 2026)

Rama de prueba `feat/chaman-despertar-1`, PR #1: https://github.com/DuilioMF/el-chaman/pull/1

**No fusionado ni publicado en producción.** La tarjeta #100 se cierra solo tras QA independiente en TEST, revisión del usuario y gate CE-1. Integración madre en https://github.com/DuilioMF/doinglio/pull/18, igualmente en borrador.

## Despertar 1 — Aprender a estar presente

Meditación libre de 10:00 minutos (600 s), con seis fases:
- 00:00–00:45 Umbral (45 s).
- 00:45–02:15 Anclaje corporal (90 s).
- 02:15–04:15 Reconocer la búsqueda (120 s).
- 04:15–06:45 Pregunta central (150 s).
- 06:45–08:45 Resonancia y silencio (120 s).
- 08:45–10:00 Integración (75 s).

El Cuaderno empieza **después** de los 600 segundos, opcional, sin tiempo límite.

## Implementado en la rama

- Rostro/universo CSS original, acceso móvil/escritorio y preferencias de movimiento reducido.
- Catálogo extensible sin límite artificial; solo Despertar 1 publicado en datos.
- Cronómetro de tiempo transcurrido, reproducir/pausar/reanudar/repetir/salir; voz opcional del navegador (Web Speech) y ambiente original Web Audio por separado.
- **Modo web alojado:** acceso con enlace de correo (OTP/magic link) de Supabase Auth, igual que Rubén; la cuenta nueva queda pendiente en `chaman_access` con `active=false`. Solo `active=true` muestra el especialista y habilita perfil y Cuaderno. No requiere contraseña ni una cuenta separada de los otros especialistas.
- **Modo demo local (localhost / archivo):** mantiene almacenamiento local aislado para pruebas históricas; nunca se utiliza ese modo en un sitio alojado.
- Base Supabase del ecosistema: `public.chaman_access(email,user_id,active)` con `active=false` inicial y acceso de consulta solamente al propio correo. Las tablas `chaman_profiles` y `chaman_reflections` requieren `auth.uid()` propietario Y un permiso `chaman_access.active=true` en sus políticas RLS. Migraciones: `chaman_private_accounts_and_journal` y `chaman_email_otp_active_gate`. El usuario puede registrar su propia solicitud **inactiva**, nunca activarla.
- Cliente web con clave **publishable**; nunca se incorpora una service-role ni clave secreta al HTML.

## Validación efectuada

- Pruebas previas: cronómetro acelerado, controles, móvil, bienvenida y Cuaderno del prototipo local.
- 01/11/2026: CI Chromium de la rama pasó, incluida simulación de inicio de sesión, guardado remoto, borrado y salida; evidencia https://github.com/DuilioMF/el-chaman/actions/runs/41277061528
- 01/11/2026: prueba SQL transaccional de autorización `active=false` (sin acceso al Cuaderno), `active=true` (acceso al Cuaderno propio), aislamiento entre cuentas y rollback sin conservar datos de test.
- Evidencia de integración DoingLio (PR #18) conserva los enlaces y nodos de los otros especialistas.

## Pendientes antes de aprobación

1. Probar con cuenta real, registro/confirmación por correo y acceso con la misma cuenta desde dos dispositivos. Los tests de interfaz remota usan un cliente simulado; no equivalen a prueba integral real.
2. Acreditar voz/subtítulos en dispositivos, audio sin cortes y los diez minutos *reales*, sin reloj virtual.
3. Revisar privacidad y accesibilidad con tester independiente en un despliegue TEST cuya URL funcione. GitHub Pages no ha sido acreditado como desplegado.
4. Revisión humana, aprobación explícita CE-1; **después** fusionar PR #1 y PR #18 y verificar DoingLio en producción.

## Desarrollo

`node --test tests/smoke.test.mjs` valida estructura. Con Playwright, `node --test tests/browser.test.mjs` valida UI local y el modo seguro con Supabase simulado. La variante de prueba segura se habilita **solo en localhost** con `?secure-test=1`. No es un bypass disponible en producción.

Trello #100: https://trello.com/c/GhvqpAC6 — Despertar 2 es independiente (#101): https://trello.com/c/3IHFHYHQ
