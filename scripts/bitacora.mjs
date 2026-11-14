#!/usr/bin/env node
// Revisa el tamaño de la bitácora entre IA y archiva las entradas viejas. Sin dependencias.
// Uso (desde la raíz del proyecto):
//   node scripts/bitacora.mjs check              -> falla (código 1) si pasa del tope
//   node scripts/bitacora.mjs archive [--dry-run] -> mueve las entradas viejas a docs/bitacora/AAAA-MM.md
// Nunca borra texto: lo que sale de la bitácora queda, tal cual, en el archivo del mes.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BITACORA = 'docs/bitacora-ia.md';
const CARPETA = 'docs/bitacora';
const TOPE = 60 * 1024; // arriba de esto, check avisa
const QUEDAN = 30 * 1024; // archive deja la bitácora por debajo de esto (margen para no archivar cada sesión)
const MINIMO = 5; // entradas recientes que siempre se quedan
const ENTRADA = /^## (\d{4})-(\d{2})-\d{2}/;

const [modo = 'check', ...opciones] = process.argv.slice(2);
const ensayo = opciones.includes('--dry-run');
const peso = (texto) => Buffer.byteLength(texto, 'utf8');
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

if (!existsSync(BITACORA)) {
    console.error(`No existe ${BITACORA}. Corre este comando desde la raíz del proyecto.`);
    process.exit(2);
}

const texto = readFileSync(BITACORA, 'utf8');
const lineas = texto.split('\n');

// Inicio de cada entrada con fecha real, fuera de bloques de código (el formato de ejemplo vive en uno).
const inicios = [];
let enCodigo = false;
lineas.forEach((linea, i) => {
    if (linea.startsWith('```')) {
        enCodigo = !enCodigo;
    } else if (!enCodigo && ENTRADA.test(linea)) {
        inicios.push(i);
    }
});

if (modo === 'check') {
    const total = peso(texto);
    if (total > TOPE) {
        console.error(
            `Bitácora: ${kb(total)} en ${inicios.length} entradas; pasa del tope de ${kb(TOPE)}.\n` +
                'Lleva a docs/estado.md los «Falta» y «No asumir» vigentes de las entradas viejas y luego corre:\n' +
                '  node scripts/bitacora.mjs archive',
        );
        process.exit(1);
    }
    console.log(`Bitácora: ${kb(total)} en ${inicios.length} entradas (tope ${kb(TOPE)}). Bien.`);
    process.exit(0);
}

if (modo !== 'archive') {
    console.error('Uso: node scripts/bitacora.mjs check | archive [--dry-run]');
    process.exit(2);
}

// Se quedan las entradas de arriba mientras quepan en QUEDAN (siempre al menos MINIMO).
let usados = peso(lineas.slice(0, inicios[0] ?? lineas.length).join('\n'));
let corte = 0;
while (corte < inicios.length) {
    const fin = inicios[corte + 1] ?? lineas.length;
    const tam = peso(lineas.slice(inicios[corte], fin).join('\n')) + 1;
    if (corte >= MINIMO && usados + tam > QUEDAN) break;
    usados += tam;
    corte++;
}

if (corte >= inicios.length) {
    console.log(`Nada que archivar: ${inicios.length} entradas, ${kb(peso(texto))}.`);
    process.exit(0);
}

// Agrupa por mes las que salen, en el mismo orden (lo más reciente primero).
const porMes = new Map();
for (let k = corte; k < inicios.length; k++) {
    const fin = inicios[k + 1] ?? lineas.length;
    const [, anio, mes] = lineas[inicios[k]].match(ENTRADA);
    const clave = `${anio}-${mes}`;
    const bloque = lineas.slice(inicios[k], fin).join('\n').trimEnd();
    porMes.set(clave, [...(porMes.get(clave) ?? []), bloque]);
}

const queda = lineas.slice(0, inicios[corte]).join('\n').trimEnd() + '\n';

for (const [clave, bloques] of porMes) {
    const destino = join(CARPETA, `${clave}.md`);
    const nuevo = bloques.join('\n\n') + '\n';
    let contenido;
    if (existsSync(destino)) {
        // Lo que se archiva ahora es más reciente que lo ya archivado: va arriba, debajo del encabezado.
        const actual = readFileSync(destino, 'utf8');
        const partes = actual.split('\n');
        const primera = partes.findIndex((l) => ENTRADA.test(l));
        const cabeza = primera === -1 ? actual.trimEnd() + '\n' : partes.slice(0, primera).join('\n').trimEnd() + '\n';
        const resto = primera === -1 ? '' : '\n' + partes.slice(primera).join('\n').trimEnd() + '\n';
        contenido = `${cabeza}\n${nuevo}${resto}`;
    } else {
        contenido =
            `# Bitácora archivada · ${clave}\n\n` +
            'Entradas movidas tal cual desde `docs/bitacora-ia.md` (lo más reciente arriba). ' +
            'Lo vigente está en `docs/estado.md`.\n\n' +
            nuevo;
    }
    console.log(`${ensayo ? '[ensayo] ' : ''}${bloques.length} entradas → ${destino}`);
    if (!ensayo) {
        mkdirSync(CARPETA, { recursive: true });
        writeFileSync(destino, contenido, 'utf8');
    }
}

console.log(
    `${ensayo ? '[ensayo] ' : ''}Quedan ${corte} entradas en ${BITACORA}: ${kb(peso(texto))} → ${kb(peso(queda))}.`,
);
if (!ensayo) {
    writeFileSync(BITACORA, queda, 'utf8');
}
