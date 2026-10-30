# El Chamán — DoingLio

**El arte de vivir a tu manera.** Especialista independiente de DoingLio.

## Estado
Prototipo funcional de frontend en TEST: rama feat/chaman-despertar-1. **No publicar en producción hasta completar pruebas reales, aprobación explícita del usuario y gate CE-1.**

## Despertar 1 — Aprender a estar presente
Experiencia de 10:00 minutos (600 s) con seis momentos:
| Momento | Desde | Hasta |
|---|---|---|
| Umbral | 00:00 | 00:45 |
| Anclaje corporal | 00:45 | 02:15 |
| Reconocer la búsqueda | 02:15 | 04:15 |
| Pregunta central | 04:15 | 06:45 |
| Resonancia/silencio | 06:45 | 08:45 |
| Integración | 08:45 | 10:00 |

El cuaderno sucede **después**, fuera de los 600 segundos.

## Qué funciona en este prototipo
- Interfaz móvil y escritorio, universo/rostro abstracto CSS, respeto a prefers-reduced-motion.
- Catálogo basado en datos con Despertar 1 (no crea Despertares ficticios).
- Reloj con performance.now() para limitar el drift; pausa, reanuda, repite y sale.
- Voz opcional del navegador mediante Web Speech API; idioma español si existe una voz.
- Ambiente original sintetizado localmente mediante Web Audio API y controles separados.
- Bienvenida/nombre y cuaderno local **solo en este navegador**, con confirmación antes de guardar el cuaderno.
- Si el navegador no admite voz/audio, la meditación sigue visualmente y con texto.

## Limitaciones importantes, pendientes del ticket #100
- Todavía **no** hay autenticación, aislamiento por usuario, sincronización entre dispositivos ni almacenamiento remoto seguro. No usar el cuaderno en dispositivos compartidos.
- La voz del sistema depende del equipo; no hay aún pista de voz profesional pregrabada ni sincronización de subtítulos palabra por palabra.
- No se han completado pruebas de reproducción real de 600 s, accesibilidad móvil con usuarios, compatibilidad de browsers ni test independiente.
- La dirección GitHub Pages no constituye un despliegue confirmado hasta que Pages esté habilitado y comprobado.
- Es necesario verificar la publicación de la suite DoingLio y que el enlace de El Chamán resuelva correctamente.
- Despertar 2 está definido aparte en Trello #101 y **no se publica** con este MVP.

## Pruebas automáticas
Con Node 22+: node --test tests/smoke.test.mjs.

## Trazabilidad
- Trello #100: https://trello.com/c/GhvqpAC6
- Repositorio: https://github.com/DuilioMF/el-chaman
- Suite padre: https://github.com/DuilioMF/doinglio

## Criterio de cierre
PR revisado; test independiente en entorno de prueba, privacidad y accesibilidad validadas, URL real verificada; aprobación explícita y CE-1. Sin evidencia, mantener en desarrollo.
