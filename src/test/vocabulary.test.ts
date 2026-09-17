import * as assert from 'assert';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import * as path from 'node:path';

import vocabulary from '../language/vocabulary.json';

/**
 * ctt-server owns the language vocabulary; every client vendors a byte-identical copy so
 * that local statistics merge the same languages the server does. These assertions pin both
 * the exact bytes and the shape, so a stale or hand-edited copy fails here instead of
 * silently splitting one language into several buckets in the local view.
 *
 * Refresh procedure and the authoritative source are documented in
 * `memory-bank/domains/server-api/references.md` under "语言词表".
 */

const EXPECTED_SHA256 = 'be7de60211d7604b68a70bcb399b8252f5d4a51576a88100f995fb9a43a8ea04';
const EXPECTED_BYTES = 39845;

/** `__dirname` is the compiled `out/test`, so the vendored file sits two levels up. */
const VOCABULARY_FILE = path.resolve(__dirname, '../../src/language/vocabulary.json');

/** Categories GitHub Linguist defines; anything else means the vocabulary was hand-edited. */
const LINGUIST_CATEGORIES: Record<string, true> = {
	programming: true,
	markup: true,
	data: true,
	prose: true,
};

/** Languages the v1 vocabulary lacked because it was derived from one machine's file types. */
const V2_ONLY_LANGUAGES = [
	'Astro', 'Elixir', 'Erlang', 'Haskell', 'OCaml', 'Scala', 'Solidity', 'Svelte',
	'Nix', 'Zig', 'Nim', 'Fortran', 'COBOL', 'Pascal', 'Ada',
];

suite('Language vocabulary', () => {
	test('should match the checksum published with the v2 revision', () => {
		const bytes = readFileSync(VOCABULARY_FILE);

		assert.strictEqual(bytes.length, EXPECTED_BYTES, 'size drifted');
		assert.strictEqual(
			createHash('sha256').update(bytes).digest('hex'),
			EXPECTED_SHA256,
			'content drifted from the server copy',
		);
	});

	test('should carry the full v2 language set', () => {
		assert.strictEqual(vocabulary.version, 2);
		assert.strictEqual(Object.keys(vocabulary.canonical).length, 842);
		assert.strictEqual(Object.keys(vocabulary.aliases).length, 489);
		assert.strictEqual(vocabulary.nonLanguages.length, 76);
	});

	test('should include every language the v1 vocabulary was missing', () => {
		for (const language of V2_ONLY_LANGUAGES) {
			assert.ok(language in vocabulary.canonical, `${language} is missing from the canonical set`);
		}
	});

	test('should classify every canonical language with a Linguist category', () => {
		for (const [language, category] of Object.entries(vocabulary.canonical)) {
			assert.ok(
				LINGUIST_CATEGORIES[category],
				`${language} carries an unrecognized category "${category}"`,
			);
		}
	});
});
