# Formato: mecanismo calculado

Una nota de este formato no explica un concepto. Construye o simula un
mecanismo real, lo rompe y muestra con números qué palanca lo arregla y
cuánto cuesta. Referentes: Discord "How Discord Stores Trillions of
Messages", samwho "Load Balancing", Anthropic "How we built our multi-agent
research system". Precedente propio: `the-quadratic-loop.mdx`.

## Qué tiene que tener

| Rasgo | Regla |
|---|---|
| **Un mecanismo real** | Un sistema, una API o un algoritmo con reglas documentadas. No una analogía ni un concepto suelto. |
| **La falla impulsa cada sección** | Cada sección abre con lo que la anterior no resolvió. |
| **Números con origen** | Cada número es **medido** (con fuente), **calculado** (fórmula + valor documentado) o **supuesto** (valor del lector). Nunca inventado. |
| **Un visual del mecanismo** | Una simulación o un diagrama que el lector puede manipular. No una metáfora. |
| **Honestidad** | Concesiones explícitas, supuestos declarados donde se usan, y un párrafo de límites. |

## Arco

1. **Apertura:** el mecanismo y por qué importa, en las primeras oraciones.
2. **El caso base:** el mecanismo en su forma más simple, con su número.
3. **La falla:** dónde el caso base se rompe o se encarece, con números.
4. **Cada palanca, en su propia sección:** qué resuelve, qué rompe, cuánto cuesta. Incluí la trampa si la doc la deja ver.
5. **Playground:** todas las perillas juntas (opcional).
6. **Qué me llevo:** 3–5 conclusiones con número, más la regla en un `Callout type="rule"`.
7. **Límites:** qué no modela la nota.
8. **Cierre:** la implicación, sin CTA.

## Números

- Cada número de la prosa sale de la herramienta que usa la nota (motor, script, fuente). Generalos con un script antes de escribir y copialos, no los calcules a mano.
- Si la prosa y el simulador usan el mismo caso, usan los mismos valores por defecto.
- Porcentajes: redondeá al entero y verificá el signo.

## Series

Una serie agrupa notas con el mismo tema de fondo (por ejemplo, el examen
CCA). Cada nota funciona sola y sigue este formato. Planificá la serie en
`docs/series/<id>-outline.md` y cada nota compleja en `docs/specs/<slug>.md`.

## Anti-ejemplos

- Explicar un concepto con una analogía y un quiz, sin mecanismo ni números propios.
- Curvas de acierto o latencia inventadas para que el gráfico "se vea bien".
- Un número en la prosa que no coincide con el simulador.
- Un supuesto sin declarar.
