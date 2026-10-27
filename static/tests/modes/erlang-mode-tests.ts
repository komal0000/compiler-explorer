// Copyright (c) 2026, Compiler Explorer Authors
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright notice,
//       this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

import * as monaco from 'monaco-editor';
import {describe, expect, it} from 'vitest';

import '../../modes/erlang-mode.js';

/** Each line's tokens as [text, type], with the language suffix and whitespace-only tokens dropped. */
function tokens(source: string): [string, string][][] {
    const lines = source.split('\n');
    return monaco.editor
        .tokenize(source, 'erlang')
        .map((row, index) =>
            row
                .map((token, i): [string, string] => [
                    lines[index].slice(token.offset, row[i + 1]?.offset),
                    token.type.replace(/\.erlang$/, ''),
                ])
                .filter(([text]) => text.trim() !== ''),
        );
}

describe('erlang mode', () => {
    it('tokenizes binary literal delimiters as brackets and their contents normally', () => {
        expect(tokens('io:format(<<"fib(10) = ">>)')[0]).toEqual([
            ['io', 'identifier'],
            [':', 'source'],
            ['format', 'identifier'],
            ['(', 'delimiter.parenthesis'],
            ['<<', 'delimiter.bracket'],
            ['"fib(10) = "', 'string'],
            ['>>', 'delimiter.bracket'],
            [')', 'delimiter.parenthesis'],
        ]);
        expect(tokens('X = <<1, 2, "abc">>.')[0]).toEqual([
            ['X', 'identifier'],
            ['=', ''],
            ['<<', 'delimiter.bracket'],
            ['1', 'number'],
            [',', 'delimiter'],
            ['2', 'number'],
            [',', 'delimiter'],
            ['"abc"', 'string'],
            ['>>', 'delimiter.bracket'],
            ['.', 'delimiter'],
        ]);
    });
});
