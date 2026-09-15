# Formato de capas

Una nota de este formato no explica un concepto. Usa el concepto como lente
sobre algo más grande. Tres capas, en este orden.

| Capa | Qué aporta | Obligatoria |
|---|---|---|
| 1. Apertura: incidente | Atrapa: "¿qué pasó acá?" | No |
| 2. Centro: analogía → mecanismo → regla | Explica por qué pasó. Es lo que se estudia. | Sí |
| 3. Tesis | La idea que queda. Es el título y el cierre. | Sí |

## 1. Apertura: incidente

- Un solo incidente real, con fecha. Verificado (ver SKILL.md, paso 2).
- Contá el hecho, no la moraleja. La moraleja llega en la capa 3.
- Si no hay un incidente que encaje de verdad, **no lo fuerces**: abrí con la analogía.
- Nunca un incidente inventado, "hipotético" o compuesto de varios casos.

## 2. Centro: analogía → mecanismo → regla

**Una sola analogía por nota.** Dos analogías compiten y ninguna se fija.

**Mapeo explícito.** Cada pieza de la analogía corresponde a una pieza del
mecanismo técnico. Si una pieza no mapea, sacala. Ejemplo (post "Tatuajes"):

| Memento | Agente |
|---|---|
| Leonard no forma recuerdos nuevos | El modelo es stateless |
| Tatuajes y polaroids | Bloque persistente de case facts |
| Notas que se reescriben y se contradicen | Sumarización progresiva que pierde números |

**Dónde se rompe la analogía.** Toda analogía falla en algún punto. Nombralo
en la nota. Protege al lector de sacar una conclusión falsa, y es la parte que
más sirve para estudiar.

**La regla del examen, en una línea.** Cerrá el centro con la regla tal como
la pide el examen, con su dominio. Usá un `Callout type="takeaway"`.

## 3. Tesis

- Una frase afirmativa que se puede discutir. No una pregunta ni un resumen.
- Es el título (o su base) y vuelve en el cierre.
- Tiene que estar respaldada por las capas 1 y 2. Si la nota no la sostiene, la tesis es un take y hay que bajarla.

## Valor de estudio

Cada nota de serie incluye, además:

- **Un escenario propio tipo examen** (situación + "¿qué hace el arquitecto?" + la trampa + por qué el distractor es un anti-patrón). Escrito desde cero, nunca copiado del examen.
- **La regla en una línea** (el takeaway de la capa 2).

## Anti-ejemplos

- Abrir con "¿Qué es un hook?" → es contenido explicativo. Abrí con el incidente o la analogía.
- Una analogía decorativa que aparece en el primer párrafo y no vuelve.
- Tres analogías "para que quede claro".
- Una tesis que la nota no demuestra.
