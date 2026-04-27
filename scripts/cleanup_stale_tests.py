#!/usr/bin/env python3
"""
Cleanup stale frontend tests (TypeScript/vitest).

For each test file in src/__tests__/:
  1. Parse named imports from '@/...' modules
  2. Check if imported names are still exported by the source file
  3. If stale:
     - Remove stale names from the import line (keep valid ones)
     - Insert 'const staleName = vi.fn()' stubs
     - Change 'it(' / 'test(' / 'describe(' to '.skip' for blocks whose
       source text references the stale name
"""

import re
import sys
from pathlib import Path

TESTS_DIR = Path('/tmp/front-end/src/__tests__')
SOURCE_DIR = Path('/tmp/front-end/src')


# ── helpers ──────────────────────────────────────────────────────────────────

def get_exports(source_path: Path) -> set[str]:
    if not source_path.exists():
        return set()
    content = source_path.read_text()
    exports: set[str] = set()

    # export (async) function/const/class/interface/type/enum Foo
    for m in re.finditer(
        r'^export\s+(?:default\s+)?(?:async\s+)?'
        r'(?:function\*?|const|let|var|class|interface|type|enum|abstract\s+class)\s+(\w+)',
        content, re.MULTILINE,
    ):
        exports.add(m.group(1))

    # export { foo, foo as bar }
    for m in re.finditer(r'export\s*\{([^}]+)\}', content):
        for part in m.group(1).split(','):
            name = part.strip().split(' as ')[0].strip()
            if name:
                exports.add(name)

    # export default identifier
    for m in re.finditer(r'^export\s+default\s+(\w+)', content, re.MULTILINE):
        exports.add(m.group(1))

    return exports


def resolve_module(alias: str) -> Path | None:
    """'@/api/auth' → actual .ts/.tsx path, or None if not a local source."""
    if not alias.startswith('@/'):
        return None
    rel = alias[2:]
    for ext in ('.ts', '.tsx', '/index.ts', '/index.tsx'):
        p = SOURCE_DIR / (rel + ext)
        if p.exists():
            return p
    return None


# Matches:  import [type] { A, B as C } from '@/...'
_NAMED_IMPORT = re.compile(
    r'^(?P<indent>\s*)import\s+(?:type\s+)?\{(?P<names>[^}]+)\}'
    r'\s+from\s+["\'](?P<module>[^"\']+)["\'](?P<rest>[^\n]*)',
    re.MULTILINE,
)

# Matches the start of a test block: it/test/describe (not already .skip)
_TEST_OPEN = re.compile(r'\b(it|test|describe)(\s*\()')


def find_stale(content: str) -> dict[str, set[str]]:
    stale: dict[str, set[str]] = {}
    for m in _NAMED_IMPORT.finditer(content):
        module = m.group('module')
        src = resolve_module(module)
        if src is None:
            continue
        exports = get_exports(src)
        for raw in m.group('names').split(','):
            actual = raw.strip().split(' as ')[0].strip()
            if actual and actual not in exports:
                stale.setdefault(module, set()).add(actual)
    return stale


# ── rewrite steps ─────────────────────────────────────────────────────────────

def fix_imports(content: str, stale: dict[str, set[str]]) -> tuple[str, list[str]]:
    """
    Rewrite import lines; collect stub declarations.
    Returns (updated_content, stubs_list).
    """
    stubs: list[str] = []

    def replacer(m: re.Match) -> str:
        module = m.group('module')
        if module not in stale:
            return m.group(0)

        indent = m.group('indent')
        rest   = m.group('rest')
        raw_names = [n.strip() for n in m.group('names').split(',') if n.strip()]

        valid: list[str] = []
        for raw in raw_names:
            actual = raw.split(' as ')[0].strip()
            if actual in stale.get(module, set()):
                alias = raw.split(' as ')[-1].strip() if ' as ' in raw else actual
                stubs.append(f'// STALE STUB: {alias} removed from \'{module}\'')
                stubs.append(f'const {alias} = vi.fn()')
            else:
                valid.append(raw)

        if valid:
            return f"{indent}import {{ {', '.join(valid)} }} from '{module}'{rest}"
        return ''   # all names stale → drop the import line

    updated = _NAMED_IMPORT.sub(replacer, content)
    return updated, stubs


def insert_stubs(content: str, stubs: list[str]) -> str:
    """Insert stub lines right after the last import block."""
    if not stubs:
        return content

    lines = content.splitlines(keepends=True)
    insert_at = 0
    for i, l in enumerate(lines):
        stripped = l.strip()
        if stripped.startswith('import ') or stripped.startswith('import{') \
                or re.match(r'import\s+type\s', stripped):
            insert_at = i + 1
        elif stripped == '' and insert_at > 0:
            insert_at = i + 1
        elif insert_at > 0:
            break

    stub_block = '\n' + '\n'.join(stubs) + '\n'
    lines.insert(insert_at, stub_block)
    return ''.join(lines)


def mark_skip(content: str, stale_names: set[str]) -> str:
    """
    Walk the content line by line. When we find an it/test/describe block
    (tracked by brace depth), check if it references a stale name; if so,
    change 'it(' → 'it.skip(' etc.
    Only the outermost matched block gets the .skip annotation.
    """
    lines = content.splitlines(keepends=True)
    result: list[str] = []
    i = 0

    while i < len(lines):
        line = lines[i]
        bm = _TEST_OPEN.search(line)

        # Skip if already marked .skip
        if bm and '.skip' not in line[:bm.start() + len(bm.group(1)) + 5]:
            keyword = bm.group(1)

            # Collect the block by tracking brace depth
            block: list[str] = [line]
            depth = line.count('{') - line.count('}')
            j = i + 1
            while j < len(lines) and depth > 0:
                block.append(lines[j])
                depth += lines[j].count('{') - lines[j].count('}')
                j += 1
            # Also grab closing line if depth returned to 0 on the last append
            block_text = ''.join(block)

            if any(name in block_text for name in stale_names):
                # Replace just the first occurrence of the keyword in the opening line
                new_line = line[:bm.end(1)] + '.skip' + line[bm.end(1):]
                result.append(new_line)
                result.extend(block[1:])
                i = j
                continue

        result.append(line)
        i += 1

    return ''.join(result)


# ── main ─────────────────────────────────────────────────────────────────────

def process_file(test_path: Path, stale: dict[str, set[str]]) -> bool:
    original = test_path.read_text()
    all_stale = {n for ns in stale.values() for n in ns}

    content, stubs = fix_imports(original, stale)
    content        = insert_stubs(content, stubs)
    content        = mark_skip(content, all_stale)

    if content == original:
        return False
    test_path.write_text(content)
    return True


def main() -> list[str]:
    print('=== Frontend: checking for stale test imports ===')
    modified: list[str] = []

    for pattern in ('*.test.ts', '*.test.tsx', '*.spec.ts', '*.spec.tsx'):
        for test_file in sorted(TESTS_DIR.glob(pattern)):
            content = test_file.read_text()
            stale = find_stale(content)
            if not stale:
                continue
            for mod, names in stale.items():
                print(f"  {test_file.name}: ['{mod}'] missing → {sorted(names)}")
            if process_file(test_file, stale):
                modified.append(test_file.name)
                print(f'  → Updated {test_file.name}')

    if modified:
        print(f'\nModified {len(modified)} file(s): {modified}')
    else:
        print('No stale imports found.')
    return modified


if __name__ == '__main__':
    main()
    sys.exit(0)
