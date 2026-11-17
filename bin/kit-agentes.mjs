#!/usr/bin/env node
// kit-agentes: deja un proyecto listo para trabajar con varios agentes de IA
// (Claude Code orquesta; Gemini, Codex y Copilot ejecutan). Sin dependencias.
//
//   npx github:devpolamx/kit-agentes instalar --stack laravel-react
//   npx github:devpolamx/kit-agentes ayuda
//
// Es seguro correrlo otra vez: crea lo que falta, actualiza lo que es del kit
// (skills propias y el bloque «Metodología común» de AGENTS.md) y no toca
// lo que ya escribiste tú (estado, bitácora, CLAUDE.md, GEMINI.md…).
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const KIT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const STACKS = ['laravel-react', 'laravel-blade', 'astro', 'django', 'ninguno'];
const INICIO = '<!-- metodologia-comun:inicio';
const FIN = '<!-- metodologia-comun:fin -->';
const HUECO = '<!-- Aquí va, tal cual, el bloque de plantillas/metodologia.md';

// ---------- argumentos ----------
const args = process.argv.slice(2);
const comando = args[0] && !args[0].startsWith('--') ? args.shift() : 'ayuda';
const opcion = (nombre) => {
    const i = args.indexOf(`--${nombre}`);
    return i === -1 ? undefined : (args[i + 1] ?? true);
};
const ensayo = args.includes('--ensayo');
const sinTerceros = args.includes('--sin-terceros');

if (['ayuda', 'help', '--help', '-h'].includes(comando)) {
    console.log(`kit-agentes — organiza un proyecto para trabajar con varios agentes de IA

Uso (desde la carpeta del proyecto):
  npx github:devpolamx/kit-agentes instalar [opciones]
  npx github:devpolamx/kit-agentes actualizar [opciones]   (lo mismo; nombre para cuando ya está instalado)

Opciones:
  --stack <${STACKS.join('|')}>  Paquete de skills de terceros (si no lo das, se adivina)
  --nombre "Mi proyecto"     Nombre para los encabezados (por omisión, el de la carpeta)
  --dir <ruta>               Carpeta del proyecto (por omisión, la actual)
  --sin-terceros             No instala skills de terceros
  --ensayo                   Solo muestra lo que haría, sin escribir nada`);
    process.exit(0);
}
if (!['instalar', 'actualizar'].includes(comando)) {
    console.error(`Comando desconocido: ${comando}. Usa «ayuda».`);
    process.exit(2);
}

const DIR = resolve(typeof opcion('dir') === 'string' ? opcion('dir') : process.cwd());
const NOMBRE = typeof opcion('nombre') === 'string' ? opcion('nombre') : basename(DIR);
const STACK = typeof opcion('stack') === 'string' ? opcion('stack') : adivinarStack();
if (!STACKS.includes(STACK)) {
    console.error(`Stack desconocido: ${STACK}. Opciones: ${STACKS.join(', ')}.`);
    process.exit(2);
}
const PYTHON = STACK === 'django' || (!existsSync(join(DIR, 'package.json')) && existsSync(join(DIR, 'pyproject.toml')));
const HOY = new Date().toLocaleDateString('en-CA'); // AAAA-MM-DD en hora local
const avisos = [];

function adivinarStack() {
    const hay = (f) => existsSync(join(DIR, f));
    if (hay('artisan')) {
        // Blade/Livewire si no hay Inertia ni React en el proyecto.
        const composer = hay('composer.json') ? readFileSync(join(DIR, 'composer.json'), 'utf8') : '';
        const pkg = hay('package.json') ? readFileSync(join(DIR, 'package.json'), 'utf8') : '';
        return /inertiajs/.test(composer + pkg) || /"react"/.test(pkg) ? 'laravel-react' : 'laravel-blade';
    }
    if (['astro.config.mjs', 'astro.config.ts', 'astro.config.js'].some(hay)) return 'astro';
    if (hay('manage.py')) return 'django';
    return 'ninguno';
}

// ---------- utilidades ----------
const plantilla = (archivo) => readFileSync(join(KIT, 'plantillas', archivo), 'utf8').replaceAll('__NOMBRE__', NOMBRE);
const rel = (p) => relative(DIR, p) || '.';
const log = (accion, p) => console.log(`${ensayo ? '[ensayo] ' : ''}${accion.padEnd(9)} ${rel(p)}`);

function escribir(p, contenido, accion) {
    log(accion, p);
    if (!ensayo) {
        mkdirSync(dirname(p), { recursive: true });
        writeFileSync(p, contenido, 'utf8');
    }
}

function crearSiFalta(rutaRel, contenido) {
    const p = join(DIR, rutaRel);
    if (existsSync(p)) {
        log('se queda', p);
        return false;
    }
    escribir(p, contenido, 'crea');
    return true;
}

// ---------- 1. skills propias del kit ----------
const metodologia = readFileSync(join(KIT, 'plantillas', 'metodologia.md'), 'utf8').trimEnd() + '\n';
for (const skill of readdirSync(join(KIT, 'skills'))) {
    for (const base of ['.agents/skills', '.claude/skills']) {
        const destino = join(DIR, base, skill);
        // Si es un enlace (p. ej. .claude/skills → .agents/skills), ya queda al día con el original.
        if (existsSync(destino) && lstatSync(destino).isSymbolicLink()) continue;
        // Una skill del kit marcada con «stacks:» solo se instala en esos stacks.
        const meta = readFileSync(join(KIT, 'skills', skill, 'SKILL.md'), 'utf8').match(/^\s*stacks:\s*(.+)$/m);
        if (meta && !meta[1].split(/[\s,]+/).includes(STACK)) continue;
        // Una skill propia del proyecto con el mismo nombre no se pisa.
        const suya = join(destino, 'SKILL.md');
        if (existsSync(suya) && !readFileSync(suya, 'utf8').includes('origen: kit-agentes')) {
            log('se queda', destino);
            avisos.push(`${rel(destino)} es una skill propia del proyecto con el mismo nombre que una del kit; no se tocó.`);
            continue;
        }
        log(existsSync(destino) ? 'actualiza' : 'crea', destino);
        if (!ensayo) cpSync(join(KIT, 'skills', skill), destino, { recursive: true, force: true });
    }
}

// ---------- 2. AGENTS.md: única fuente de reglas ----------
const agents = join(DIR, 'AGENTS.md');
// Un proyecto con reglas propias que aún no se alinea: solo se avisa, no se le crean archivos encima.
const sinAlinear = existsSync(agents) && !readFileSync(agents, 'utf8').includes(INICIO);
const eraNuevo = !existsSync(agents);
if (!existsSync(agents)) {
    const base = plantilla('agents-proyecto.md');
    const linea = base.split('\n').find((l) => l.startsWith(HUECO));
    escribir(agents, base.replace(linea + '\n', metodologia), 'crea');
    avisos.push('Llena las secciones del proyecto en AGENTS.md (o pídeselo a Claude con la skill organizar-proyecto-ia).');
} else {
    const actual = readFileSync(agents, 'utf8');
    const i = actual.indexOf(INICIO);
    const f = actual.indexOf(FIN);
    if (i === -1 || f === -1) {
        log('se queda', agents);
        avisos.push(
            'AGENTS.md no tiene el bloque «Metodología común». Pídele a Claude: «alinea este proyecto con la skill organizar-proyecto-ia».',
        );
    } else {
        const nuevo = actual.slice(0, i) + metodologia + actual.slice(f + FIN.length).replace(/^\n/, '');
        if (nuevo === actual) log('al día', agents);
        else escribir(agents, nuevo, 'actualiza');
    }
}

if (sinAlinear) {
    console.log('\n(No se crean CLAUDE.md, GEMINI.md, docs ni scripts hasta alinear AGENTS.md.)\n');
} else {
    // ---------- 3. puertas de entrada de cada agente ----------
    crearSiFalta('CLAUDE.md', `# ${NOMBRE}\n\n` + plantilla('claude.md'));
    crearSiFalta(
        'GEMINI.md',
        plantilla('gemini.md') +
            '- Comandos: `/antes-de-editar`, `/verificar` y `/traspaso` (`.gemini/commands/`). Usa `/traspaso` al terminar o cuando se acabe tu ventana de uso.\n',
    );
    crearSiFalta('.github/copilot-instructions.md', plantilla('copilot.md'));
    for (const archivo of readdirSync(join(KIT, 'plantillas', 'gemini-commands'))) {
        crearSiFalta(`.gemini/commands/${archivo}`, plantilla(`gemini-commands/${archivo}`));
    }
    for (const p of ['CLAUDE.md', 'GEMINI.md', '.github/copilot-instructions.md']) {
        const ruta = join(DIR, p);
        const enlace = existsSync(ruta) && lstatSync(ruta).isSymbolicLink(); // p. ej. CLAUDE.md → AGENTS.md
        if (existsSync(ruta) && !enlace && !readFileSync(ruta, 'utf8').includes('AGENTS.md')) {
            avisos.push(`${p} no menciona AGENTS.md: puede tener reglas copiadas que ya no coinciden.`);
        }
    }

    // ---------- 4. continuidad: estado, bitácora, arquitectura ----------
    crearSiFalta('docs/estado.md', plantilla('estado.md').replace('AAAA-MM-DD · quién', `${HOY} · kit-agentes`));
    crearSiFalta(
        'docs/bitacora-ia.md',
        plantilla('cabecera-bitacora.md').trimEnd() +
            `\n\n## ${HOY} · kit-agentes · Proyecto organizado para varios agentes\n` +
            '- **Hecho:** `AGENTS.md` (única fuente de reglas, con la «Metodología común»), `CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md`, `docs/estado.md`, esta bitácora, el script de la bitácora y las skills del kit.\n' +
            '- **Verificado:** solo documentación: sin pruebas.\n' +
            '- **Falta:** llenar las secciones del proyecto en `AGENTS.md` y el primer `docs/estado.md` real.\n' +
            '- **No asumir:** que `AGENTS.md` ya describe el proyecto: es la plantilla.\n' +
            '- **Ponytail:** Markdown y un script sin dependencias.\n',
    );
    // En un proyecto que ya existía, el mapa puede vivir en otro archivo: solo se crea en proyectos nuevos.
    if (eraNuevo) crearSiFalta(
        'docs/arquitectura.md',
        `# Arquitectura de ${NOMBRE}\n\nMapa del proyecto y decisiones vigentes. Se actualiza en la misma sesión en que cambia la estructura.\n\n## Qué es\n\n## Carpetas\n\n## Flujos clave\n\n## Decisiones vigentes\n`,
    );

    // ---------- 5. script de la bitácora ----------
    const script = PYTHON ? 'bitacora.py' : 'bitacora.mjs';
    const destinoScript = join(DIR, 'scripts', script);
    const delKit = readFileSync(join(KIT, 'scripts', script), 'utf8');
    if (!existsSync(destinoScript)) escribir(destinoScript, delKit, 'crea');
    else if (readFileSync(destinoScript, 'utf8') === delKit) log('al día', destinoScript);
    else log('se queda', destinoScript), avisos.push(`scripts/${script} es distinto al del kit (quizá ajustado a mano); no se tocó.`);

    const pkg = join(DIR, 'package.json');
    if (existsSync(pkg) && !PYTHON) {
        const texto = readFileSync(pkg, 'utf8');
        const datos = JSON.parse(texto);
        datos.scripts ??= {};
        if (datos.scripts['bitacora:check']) log('al día', pkg);
        else {
            datos.scripts['bitacora:check'] = 'node scripts/bitacora.mjs check';
            datos.scripts['bitacora:archivar'] = 'node scripts/bitacora.mjs archive';
            const sangria = texto.match(/\n( +)"/)?.[1].length ?? 2;
            escribir(pkg, JSON.stringify(datos, null, sangria) + '\n', 'actualiza');
        }
    }
}

// ---------- 6. modelo y esfuerzo de los subagentes revisores ----------
// Solo agrega `model` y `effort` si el subagente no los tiene: lo que ya decidiste se respeta.
const REVISORES = {
    'code-reviewer': { model: 'sonnet', effort: 'low' },
    'typescript-reviewer': { model: 'sonnet', effort: 'low' },
    'security-reviewer': { model: 'sonnet', effort: 'medium' },
};
for (const [nombre, { model, effort }] of Object.entries(REVISORES)) {
    const ruta = join(DIR, '.claude', 'agents', `${nombre}.md`);
    if (!existsSync(ruta)) continue;
    const texto = readFileSync(ruta, 'utf8');
    const m = texto.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!m) continue;
    const faltan = [];
    if (!/^model:/m.test(m[1])) faltan.push(`model: ${model}`);
    if (!/^effort:/m.test(m[1])) faltan.push(`effort: ${effort}`);
    if (!faltan.length) {
        log('al día', ruta);
        continue;
    }
    const salto = texto.includes('\r\n') ? '\r\n' : '\n';
    escribir(ruta, texto.replace(m[0], m[0].replace(/\r?\n---$/, salto + faltan.join(salto) + salto + '---')), 'actualiza');
}

// ---------- 7. skills de terceros ----------
const paquetes = JSON.parse(readFileSync(join(KIT, 'paquetes.json'), 'utf8'));
const elegidas = [...paquetes.comun, ...(paquetes[STACK] ?? [])];
const porFuente = new Map();
for (const { skill, fuente } of elegidas) {
    if (!porFuente.has(fuente)) porFuente.set(fuente, new Set());
    porFuente.get(fuente).add(skill);
}
console.log(`\nSkills de terceros (paquete «comun» + «${STACK}»):`);
for (const [fuente, skills] of porFuente) {
    const faltan = [...skills].filter((s) => !existsSync(join(DIR, '.agents', 'skills', s)));
    if (!faltan.length) {
        console.log(`  al día    ${fuente}`);
        continue;
    }
    const partes = ['-y', 'skills', 'add', fuente, ...faltan.flatMap((s) => ['--skill', s]), '-y'];
    console.log(`  ${sinTerceros || ensayo ? 'pendiente' : 'instala  '} npx ${partes.join(' ')}`);
    if (sinTerceros || ensayo) continue;
    const r = spawnSync('npx', partes, { cwd: DIR, stdio: 'inherit', shell: process.platform === 'win32' });
    if (r.status !== 0) avisos.push(`No se pudieron instalar las skills de ${fuente}; corre el comando de arriba a mano.`);
}

// ---------- resumen ----------
console.log(`\nProyecto: ${NOMBRE} · stack: ${STACK} · ${DIR}`);
if (avisos.length) console.log('\nRevisa:\n' + avisos.map((a) => `  - ${a}`).join('\n'));
console.log(
    '\nSiguiente: abre Claude Code en el proyecto y pide «revisa AGENTS.md y docs/estado.md con la skill organizar-proyecto-ia».',
);
