// AD39 desktop host: the prompt() stand-in shows game text as text, never markup.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const { promptPage, PROMPT_RESULT } = createRequire(import.meta.url)('../desktop/prompt_page.cjs');

test('escapes message and default value', () => {
    const html = promptPage('<img src=x onerror=alert(1)> & "reset"', '"><script>bad()</script>');
    assert.ok(!html.includes('<img'));
    assert.ok(!html.includes('<script>bad'));
    assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt; &amp; &quot;reset&quot;'));
    assert.ok(html.includes(JSON.stringify(PROMPT_RESULT)));
});
