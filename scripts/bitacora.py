"""Revisa el tamaño de la bitácora entre IA y archiva las entradas viejas. Sin dependencias.

Uso (desde la raíz del proyecto):
    python scripts/bitacora.py check               -> falla (código 1) si pasa del tope
    python scripts/bitacora.py archive [--dry-run] -> mueve las viejas a docs/bitacora/AAAA-MM.md

Nunca borra texto: lo que sale de la bitácora queda, tal cual, en el archivo del mes.
"""

import re
import sys
from pathlib import Path

BITACORA = Path("docs/bitacora-ia.md")
ESTADO = "docs/estado.md"  # dónde se anota lo vigente antes de archivar
CARPETA = Path("docs/bitacora")
TOPE = 60 * 1024  # arriba de esto, check avisa
QUEDAN = 30 * 1024  # archive deja la bitácora por debajo de esto
MINIMO = 5  # entradas recientes que siempre se quedan
ENTRADA = re.compile(r"^## (\d{4})-(\d{2})-\d{2}")


def peso(texto: str) -> int:
    return len(texto.encode("utf-8"))


def kb(n: int) -> str:
    return f"{n / 1024:.1f} KB"


def main() -> int:
    modo = sys.argv[1] if len(sys.argv) > 1 else "check"
    ensayo = "--dry-run" in sys.argv[2:]
    if not BITACORA.exists():
        print(f"No existe {BITACORA}. Córrelo desde la raíz del proyecto.", file=sys.stderr)
        return 2

    texto = BITACORA.read_text(encoding="utf-8")
    lineas = texto.split("\n")

    # Inicio de cada entrada con fecha, fuera de bloques de código (ahí vive el formato de ejemplo).
    inicios = []
    en_codigo = False
    for i, linea in enumerate(lineas):
        if linea.startswith("```"):
            en_codigo = not en_codigo
        elif not en_codigo and ENTRADA.match(linea):
            inicios.append(i)

    if modo == "check":
        total = peso(texto)
        if total > TOPE:
            print(
                f"Bitácora: {kb(total)} en {len(inicios)} entradas; pasa del tope de {kb(TOPE)}.\n"
                f"Lleva a {ESTADO} los «Falta» y «No asumir» vigentes de las entradas viejas\n"
                "y luego corre:\n"
                "  python scripts/bitacora.py archive",
                file=sys.stderr,
            )
            return 1
        print(f"Bitácora: {kb(total)} en {len(inicios)} entradas (tope {kb(TOPE)}). Bien.")
        return 0

    if modo != "archive":
        print("Uso: python scripts/bitacora.py check | archive [--dry-run]", file=sys.stderr)
        return 2

    # Se quedan las entradas de arriba mientras quepan en QUEDAN (siempre al menos MINIMO).
    fin_de = lambda k: inicios[k + 1] if k + 1 < len(inicios) else len(lineas)  # noqa: E731
    usados = peso("\n".join(lineas[: inicios[0] if inicios else len(lineas)]))
    corte = 0
    while corte < len(inicios):
        tam = peso("\n".join(lineas[inicios[corte] : fin_de(corte)])) + 1
        if corte >= MINIMO and usados + tam > QUEDAN:
            break
        usados += tam
        corte += 1

    if corte >= len(inicios):
        print(f"Nada que archivar: {len(inicios)} entradas, {kb(peso(texto))}.")
        return 0

    # Agrupa por mes las que salen, en el mismo orden (lo más reciente primero).
    por_mes: dict[str, list[str]] = {}
    for k in range(corte, len(inicios)):
        anio, mes = ENTRADA.match(lineas[inicios[k]]).groups()
        bloque = "\n".join(lineas[inicios[k] : fin_de(k)]).rstrip()
        por_mes.setdefault(f"{anio}-{mes}", []).append(bloque)

    queda = "\n".join(lineas[: inicios[corte]]).rstrip() + "\n"

    for clave, bloques in por_mes.items():
        destino = CARPETA / f"{clave}.md"
        nuevo = "\n\n".join(bloques) + "\n"
        if destino.exists():
            # Lo que se archiva ahora es más reciente que lo ya archivado: va arriba.
            partes = destino.read_text(encoding="utf-8").split("\n")
            primera = next((i for i, l in enumerate(partes) if ENTRADA.match(l)), None)
            if primera is None:
                contenido = "\n".join(partes).rstrip() + "\n\n" + nuevo
            else:
                cabeza = "\n".join(partes[:primera]).rstrip() + "\n"
                resto = "\n".join(partes[primera:]).rstrip() + "\n"
                contenido = f"{cabeza}\n{nuevo}\n{resto}"
        else:
            contenido = (
                f"# Bitácora archivada · {clave}\n\n"
                "Entradas movidas tal cual desde `docs/bitacora-ia.md` (lo más reciente arriba). "
                f"Lo vigente está en `{ESTADO}`.\n\n" + nuevo
            )
        print(f"{'[ensayo] ' if ensayo else ''}{len(bloques)} entradas → {destino}")
        if not ensayo:
            CARPETA.mkdir(parents=True, exist_ok=True)
            destino.write_text(contenido, encoding="utf-8", newline="\n")

    prefijo = "[ensayo] " if ensayo else ""
    print(f"{prefijo}Quedan {corte} entradas en {BITACORA}: {kb(peso(texto))} → {kb(peso(queda))}.")
    if not ensayo:
        BITACORA.write_text(queda, encoding="utf-8", newline="\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
