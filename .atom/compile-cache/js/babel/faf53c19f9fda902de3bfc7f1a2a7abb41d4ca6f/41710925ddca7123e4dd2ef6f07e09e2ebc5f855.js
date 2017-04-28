'use babel';

describe('PHP grammar', function () {
  var grammar = null;

  beforeEach(function () {
    waitsForPromise(function () {
      return atom.packages.activatePackage('nuclide-language-hack');
    });
    runs(function () {
      return grammar = atom.grammars.grammarForScopeName('text.html.hack');
    });
  });

  it('parses the grammar', function () {
    expect(grammar).toBeTruthy();
    expect(grammar.scopeName).toBe('text.html.hack');
  });

  describe('operators', function () {
    it('should tokenize = correctly', function () {
      var tokens = grammar.tokenizeLines("<?hh\n$test = 2;");
      expect(tokens[1][0]).toEqual({
        value: '$',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'variable.other.php', 'punctuation.definition.variable.php']
      });
      expect(tokens[1][2]).toEqual({
        value: ' ',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
      });
      expect(tokens[1][3]).toEqual({
        value: '=',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'keyword.operator.assignment.php']
      });
      expect(tokens[1][4]).toEqual({
        value: ' ',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
      });
      expect(tokens[1][5]).toEqual({
        value: '2',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'constant.numeric.php']
      });
      expect(tokens[1][6]).toEqual({
        value: ';',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'punctuation.terminator.expression.php']
      });
    });

    it('should tokenize + correctly', function () {
      var tokens = grammar.tokenizeLines("<?hh\n1 + 2;");
      expect(tokens[1][0]).toEqual({
        value: '1',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'constant.numeric.php']
      });
      expect(tokens[1][1]).toEqual({
        value: ' ',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
      });
      expect(tokens[1][2]).toEqual({
        value: '+',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'keyword.operator.arithmetic.php']
      });
      expect(tokens[1][3]).toEqual({
        value: ' ',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
      });
      expect(tokens[1][4]).toEqual({
        value: '2',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'constant.numeric.php']
      });
      expect(tokens[1][5]).toEqual({
        value: ';',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'punctuation.terminator.expression.php']
      });
    });

    it('should tokenize - correctly', function () {
      var tokens = grammar.tokenizeLines("<?hh\n1 - 2;");
      expect(tokens[1][0]).toEqual({
        value: '1',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'constant.numeric.php']
      });
      expect(tokens[1][1]).toEqual({
        value: ' ',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
      });
      expect(tokens[1][2]).toEqual({
        value: '-',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'keyword.operator.arithmetic.php']
      });
      expect(tokens[1][3]).toEqual({
        value: ' ',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
      });
      expect(tokens[1][4]).toEqual({
        value: '2',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'constant.numeric.php']
      });
      expect(tokens[1][5]).toEqual({
        value: ';',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'punctuation.terminator.expression.php']
      });
    });

    it('should tokenize * correctly', function () {
      var tokens = grammar.tokenizeLines("<?hh\n1 * 2;");
      expect(tokens[1][0]).toEqual({
        value: '1',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'constant.numeric.php']
      });
      expect(tokens[1][1]).toEqual({
        value: ' ',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
      });
      expect(tokens[1][2]).toEqual({
        value: '*',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'keyword.operator.arithmetic.php']
      });
      expect(tokens[1][3]).toEqual({
        value: ' ',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
      });
      expect(tokens[1][4]).toEqual({
        value: '2',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'constant.numeric.php']
      });
      expect(tokens[1][5]).toEqual({
        value: ';',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'punctuation.terminator.expression.php']
      });
    });

    it('should tokenize / correctly', function () {
      var tokens = grammar.tokenizeLines("<?hh\n1 / 2;");
      expect(tokens[1][0]).toEqual({
        value: '1',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'constant.numeric.php']
      });
      expect(tokens[1][1]).toEqual({
        value: ' ',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
      });
      expect(tokens[1][2]).toEqual({
        value: '/',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'keyword.operator.arithmetic.php']
      });
      expect(tokens[1][3]).toEqual({
        value: ' ',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
      });
      expect(tokens[1][4]).toEqual({
        value: '2',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'constant.numeric.php']
      });
      expect(tokens[1][5]).toEqual({
        value: ';',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'punctuation.terminator.expression.php']
      });
    });

    it('should tokenize % correctly', function () {
      var tokens = grammar.tokenizeLines("<?hh\n1 % 2;");
      expect(tokens[1][0]).toEqual({
        value: '1',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'constant.numeric.php']
      });
      expect(tokens[1][1]).toEqual({
        value: ' ',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
      });
      expect(tokens[1][2]).toEqual({
        value: '%',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'keyword.operator.arithmetic.php']
      });
      expect(tokens[1][3]).toEqual({
        value: ' ',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
      });
      expect(tokens[1][4]).toEqual({
        value: '2',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'constant.numeric.php']
      });
      expect(tokens[1][5]).toEqual({
        value: ';',
        scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'punctuation.terminator.expression.php']
      });
    });

    describe('combined operators', function () {
      it('should tokenize += correctly', function () {
        var tokens = grammar.tokenizeLines("<?hh\n$test += 2;");
        expect(tokens[1][0]).toEqual({
          value: '$',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'variable.other.php', 'punctuation.definition.variable.php']
        });
        expect(tokens[1][1]).toEqual({
          value: 'test',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'variable.other.php']
        });
        expect(tokens[1][2]).toEqual({
          value: ' ',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
        });
        expect(tokens[1][3]).toEqual({
          value: '+=',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'keyword.operator.assignment.php']
        });
        expect(tokens[1][4]).toEqual({
          value: ' ',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
        });
        expect(tokens[1][5]).toEqual({
          value: '2',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'constant.numeric.php']
        });
        expect(tokens[1][6]).toEqual({
          value: ';',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'punctuation.terminator.expression.php']
        });
      });

      it('should tokenize -= correctly', function () {
        var tokens = grammar.tokenizeLines("<?hh\n$test -= 2;");
        expect(tokens[1][0]).toEqual({
          value: '$',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'variable.other.php', 'punctuation.definition.variable.php']
        });
        expect(tokens[1][1]).toEqual({
          value: 'test',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'variable.other.php']
        });
        expect(tokens[1][2]).toEqual({
          value: ' ',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
        });
        expect(tokens[1][3]).toEqual({
          value: '-=',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'keyword.operator.assignment.php']
        });
        expect(tokens[1][4]).toEqual({
          value: ' ',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
        });
        expect(tokens[1][5]).toEqual({
          value: '2',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'constant.numeric.php']
        });
        expect(tokens[1][6]).toEqual({
          value: ';',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'punctuation.terminator.expression.php']
        });
      });

      it('should tokenize *= correctly', function () {
        var tokens = grammar.tokenizeLines("<?hh\n$test *= 2;");
        expect(tokens[1][0]).toEqual({
          value: '$',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'variable.other.php', 'punctuation.definition.variable.php']
        });
        expect(tokens[1][1]).toEqual({
          value: 'test',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'variable.other.php']
        });
        expect(tokens[1][2]).toEqual({
          value: ' ',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
        });
        expect(tokens[1][3]).toEqual({
          value: '*=',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'keyword.operator.assignment.php']
        });
        expect(tokens[1][4]).toEqual({
          value: ' ',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
        });
        expect(tokens[1][5]).toEqual({
          value: '2',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'constant.numeric.php']
        });
        expect(tokens[1][6]).toEqual({
          value: ';',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'punctuation.terminator.expression.php']
        });
      });

      it('should tokenize /= correctly', function () {
        var tokens = grammar.tokenizeLines("<?hh\n$test /= 2;");
        expect(tokens[1][0]).toEqual({
          value: '$',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'variable.other.php', 'punctuation.definition.variable.php']
        });
        expect(tokens[1][1]).toEqual({
          value: 'test',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'variable.other.php']
        });
        expect(tokens[1][2]).toEqual({
          value: ' ',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
        });
        expect(tokens[1][3]).toEqual({
          value: '/=',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'keyword.operator.assignment.php']
        });
        expect(tokens[1][4]).toEqual({
          value: ' ',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
        });
        expect(tokens[1][5]).toEqual({
          value: '2',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'constant.numeric.php']
        });
        expect(tokens[1][6]).toEqual({
          value: ';',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'punctuation.terminator.expression.php']
        });
      });

      it('should tokenize %= correctly', function () {
        var tokens = grammar.tokenizeLines("<?hh\n$test %= 2;");
        expect(tokens[1][0]).toEqual({
          value: '$',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'variable.other.php', 'punctuation.definition.variable.php']
        });
        expect(tokens[1][1]).toEqual({
          value: 'test',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'variable.other.php']
        });
        expect(tokens[1][2]).toEqual({
          value: ' ',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
        });
        expect(tokens[1][3]).toEqual({
          value: '%=',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'keyword.operator.assignment.php']
        });
        expect(tokens[1][4]).toEqual({
          value: ' ',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
        });
        expect(tokens[1][5]).toEqual({
          value: '2',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'constant.numeric.php']
        });
        expect(tokens[1][6]).toEqual({
          value: ';',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'punctuation.terminator.expression.php']
        });
      });

      it('should tokenize .= correctly', function () {
        var tokens = grammar.tokenizeLines("<?hh\n$test .= 2;");
        expect(tokens[1][0]).toEqual({
          value: '$',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'variable.other.php', 'punctuation.definition.variable.php']
        });
        expect(tokens[1][1]).toEqual({
          value: 'test',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'variable.other.php']
        });
        expect(tokens[1][2]).toEqual({
          value: ' ',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
        });
        expect(tokens[1][3]).toEqual({
          value: '.=',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'keyword.operator.string.php']
        });
        expect(tokens[1][4]).toEqual({
          value: ' ',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
        });
        expect(tokens[1][5]).toEqual({
          value: '2',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'constant.numeric.php']
        });
        expect(tokens[1][6]).toEqual({
          value: ';',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'punctuation.terminator.expression.php']
        });
      });

      it('should tokenize &= correctly', function () {
        var tokens = grammar.tokenizeLines("<?hh\n$test &= 2;");
        expect(tokens[1][0]).toEqual({
          value: '$',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'variable.other.php', 'punctuation.definition.variable.php']
        });
        expect(tokens[1][1]).toEqual({
          value: 'test',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'variable.other.php']
        });
        expect(tokens[1][2]).toEqual({
          value: ' ',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
        });
        expect(tokens[1][3]).toEqual({
          value: '&=',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'keyword.operator.assignment.php']
        });
        expect(tokens[1][4]).toEqual({
          value: ' ',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
        });
        expect(tokens[1][5]).toEqual({
          value: '2',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'constant.numeric.php']
        });
        expect(tokens[1][6]).toEqual({
          value: ';',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'punctuation.terminator.expression.php']
        });
      });

      it('should tokenize |= correctly', function () {
        var tokens = grammar.tokenizeLines("<?hh\n$test |= 2;");
        expect(tokens[1][0]).toEqual({
          value: '$',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'variable.other.php', 'punctuation.definition.variable.php']
        });
        expect(tokens[1][1]).toEqual({
          value: 'test',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'variable.other.php']
        });
        expect(tokens[1][2]).toEqual({
          value: ' ',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
        });
        expect(tokens[1][3]).toEqual({
          value: '|=',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'keyword.operator.assignment.php']
        });
        expect(tokens[1][4]).toEqual({
          value: ' ',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
        });
        expect(tokens[1][5]).toEqual({
          value: '2',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'constant.numeric.php']
        });
        expect(tokens[1][6]).toEqual({
          value: ';',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'punctuation.terminator.expression.php']
        });
      });

      it('should tokenize ^= correctly', function () {
        var tokens = grammar.tokenizeLines("<?hh\n$test ^= 2;");
        expect(tokens[1][0]).toEqual({
          value: '$',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'variable.other.php', 'punctuation.definition.variable.php']
        });
        expect(tokens[1][1]).toEqual({
          value: 'test',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'variable.other.php']
        });
        expect(tokens[1][2]).toEqual({
          value: ' ',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
        });
        expect(tokens[1][3]).toEqual({
          value: '^=',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'keyword.operator.assignment.php']
        });
        expect(tokens[1][4]).toEqual({
          value: ' ',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
        });
        expect(tokens[1][5]).toEqual({
          value: '2',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'constant.numeric.php']
        });
        expect(tokens[1][6]).toEqual({
          value: ';',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'punctuation.terminator.expression.php']
        });
      });

      it('should tokenize <<= correctly', function () {
        var tokens = grammar.tokenizeLines("<?hh\n$test <<= 2;");
        expect(tokens[1][0]).toEqual({
          value: '$',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'variable.other.php', 'punctuation.definition.variable.php']
        });
        expect(tokens[1][1]).toEqual({
          value: 'test',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'variable.other.php']
        });
        expect(tokens[1][2]).toEqual({
          value: ' ',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
        });
        expect(tokens[1][3]).toEqual({
          value: '<<=',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'keyword.operator.assignment.php']
        });
        expect(tokens[1][4]).toEqual({
          value: ' ',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
        });
        expect(tokens[1][5]).toEqual({
          value: '2',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'constant.numeric.php']
        });
        expect(tokens[1][6]).toEqual({
          value: ';',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'punctuation.terminator.expression.php']
        });
      });

      it('should tokenize >>= correctly', function () {
        var tokens = grammar.tokenizeLines("<?hh\n$test >>= 2;");
        expect(tokens[1][0]).toEqual({
          value: '$',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'variable.other.php', 'punctuation.definition.variable.php']
        });
        expect(tokens[1][1]).toEqual({
          value: 'test',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'variable.other.php']
        });
        expect(tokens[1][2]).toEqual({
          value: ' ',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
        });
        expect(tokens[1][3]).toEqual({
          value: '>>=',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'keyword.operator.assignment.php']
        });
        expect(tokens[1][4]).toEqual({
          value: ' ',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
        });
        expect(tokens[1][5]).toEqual({
          value: '2',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'constant.numeric.php']
        });
        expect(tokens[1][6]).toEqual({
          value: ';',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'punctuation.terminator.expression.php']
        });
      });

      xit('should tokenize namespace at the same line as <?hh', function () {
        var tokens = grammar.tokenizeLines("<?hh namespace Test;");
        expect(tokens[0][1]).toEqual({
          value: ' ',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.namespace.php']
        });
        expect(tokens[0][2]).toEqual({
          value: 'namespace',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.namespace.php', 'keyword.other.namespace.php']
        });
        expect(tokens[0][3]).toEqual({
          value: ' ',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.namespace.php']
        });
        expect(tokens[0][4]).toEqual({
          value: 'Test',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.namespace.php', 'entity.name.type.namespace.php']
        });
        expect(tokens[0][5]).toEqual({
          value: ';',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'punctuation.terminator.expression.php']
        });
      });

      it('should tokenize namespace correctly', function () {
        var tokens = grammar.tokenizeLines("<?hh\nnamespace Test;");
        expect(tokens[1][0]).toEqual({
          value: 'namespace',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.namespace.php', 'keyword.other.namespace.php']
        });
        expect(tokens[1][1]).toEqual({
          value: ' ',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.namespace.php']
        });
        expect(tokens[1][2]).toEqual({
          value: 'Test',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.namespace.php', 'entity.name.type.namespace.php']
        });
        expect(tokens[1][3]).toEqual({
          value: ';',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'punctuation.terminator.expression.php']
        });
      });

      it('should tokenize default array type with old array value correctly', function () {
        var tokens = grammar.tokenizeLines("<?hh\nfunction array_test(array $value = array()) {}");
        expect(tokens[1][0]).toEqual({
          value: 'function',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.function.php', 'storage.type.function.php']
        });
        expect(tokens[1][1]).toEqual({
          value: ' ',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.function.php']
        });
        expect(tokens[1][2]).toEqual({
          value: 'array_test',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.function.php', 'entity.name.function.php']
        });
        expect(tokens[1][3]).toEqual({
          value: '(',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.function.php', 'punctuation.definition.parameters.begin.php']
        });
        expect(tokens[1][4]).toEqual({
          value: 'array',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.function.php', 'meta.function.arguments.php', 'meta.function.argument.array.php', 'storage.type.php']
        });
        expect(tokens[1][5]).toEqual({
          value: ' ',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.function.php', 'meta.function.arguments.php', 'meta.function.argument.array.php']
        });
        expect(tokens[1][6]).toEqual({
          value: '$',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.function.php', 'meta.function.arguments.php', 'meta.function.argument.array.php', 'variable.other.php', 'punctuation.definition.variable.php']
        });
        expect(tokens[1][7]).toEqual({
          value: 'value',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.function.php', 'meta.function.arguments.php', 'meta.function.argument.array.php', 'variable.other.php']
        });
        expect(tokens[1][8]).toEqual({
          value: ' ',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.function.php', 'meta.function.arguments.php', 'meta.function.argument.array.php']
        });
        expect(tokens[1][9]).toEqual({
          value: '=',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.function.php', 'meta.function.arguments.php', 'meta.function.argument.array.php', 'keyword.operator.assignment.php']
        });
        expect(tokens[1][10]).toEqual({
          value: ' ',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.function.php', 'meta.function.arguments.php', 'meta.function.argument.array.php']
        });
        expect(tokens[1][11]).toEqual({
          value: 'array',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.function.php', 'meta.function.arguments.php', 'meta.function.argument.array.php', 'support.function.construct.php']
        });
        expect(tokens[1][12]).toEqual({
          value: '(',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.function.php', 'meta.function.arguments.php', 'meta.function.argument.array.php', 'punctuation.definition.array.begin.php']
        });
        expect(tokens[1][13]).toEqual({
          value: ')',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.function.php', 'meta.function.arguments.php', 'meta.function.argument.array.php', 'punctuation.definition.array.end.php']
        });
        expect(tokens[1][14]).toEqual({
          value: ')',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.function.php', 'punctuation.definition.parameters.end.php']
        });
        expect(tokens[1][15]).toEqual({
          value: ' ',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
        });
        expect(tokens[1][16]).toEqual({
          value: '{',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'punctuation.section.scope.begin.php']
        });
        expect(tokens[1][17]).toEqual({
          value: '}',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'punctuation.section.scope.end.php']
        });
      });

      it('should tokenize default array type with short array value correctly', function () {
        var tokens = grammar.tokenizeLines("<?hh\nfunction array_test(array $value = []) {}");
        expect(tokens[1][0]).toEqual({
          value: 'function',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.function.php', 'storage.type.function.php']
        });
        expect(tokens[1][1]).toEqual({
          value: ' ',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.function.php']
        });
        expect(tokens[1][2]).toEqual({
          value: 'array_test',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.function.php', 'entity.name.function.php']
        });
        expect(tokens[1][3]).toEqual({
          value: '(',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.function.php', 'punctuation.definition.parameters.begin.php']
        });
        expect(tokens[1][4]).toEqual({
          value: 'array',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.function.php', 'meta.function.arguments.php', 'meta.function.argument.short.array.php', 'storage.type.php']
        });
        expect(tokens[1][5]).toEqual({
          value: ' ',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.function.php', 'meta.function.arguments.php', 'meta.function.argument.short.array.php']
        });
        expect(tokens[1][6]).toEqual({
          value: '$',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.function.php', 'meta.function.arguments.php', 'meta.function.argument.short.array.php', 'variable.other.php', 'punctuation.definition.variable.php']
        });
        expect(tokens[1][7]).toEqual({
          value: 'value',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.function.php', 'meta.function.arguments.php', 'meta.function.argument.short.array.php', 'variable.other.php']
        });
        expect(tokens[1][8]).toEqual({
          value: ' ',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.function.php', 'meta.function.arguments.php', 'meta.function.argument.short.array.php']
        });
        expect(tokens[1][9]).toEqual({
          value: '=',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.function.php', 'meta.function.arguments.php', 'meta.function.argument.short.array.php']
        });
        expect(tokens[1][10]).toEqual({
          value: ' ',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.function.php', 'meta.function.arguments.php', 'meta.function.argument.short.array.php']
        });
        expect(tokens[1][11]).toEqual({
          value: '[',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.function.php', 'meta.function.arguments.php', 'meta.function.argument.short.array.php', 'punctuation.definition.short.array.begin.php']
        });
        expect(tokens[1][12]).toEqual({
          value: ']',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.function.php', 'meta.function.arguments.php', 'meta.function.argument.short.array.php', 'punctuation.definition.short.array.end.php']
        });
        expect(tokens[1][13]).toEqual({
          value: ')',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'meta.function.php', 'punctuation.definition.parameters.end.php']
        });
        expect(tokens[1][14]).toEqual({
          value: ' ',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack']
        });
        expect(tokens[1][15]).toEqual({
          value: '{',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'punctuation.section.scope.begin.php']
        });
        expect(tokens[1][16]).toEqual({
          value: '}',
          scopes: ['text.html.hack', 'meta.embedded.block.php', 'source.hack', 'punctuation.section.scope.end.php']
        });
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy96aGFuZ3hpYW90aWFuLy5hdG9tL3BhY2thZ2VzL251Y2xpZGUtbGFuZ3VhZ2UtaGFjay9zcGVjL2hhY2stc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7O0FBR1osUUFBUSxDQUFDLGFBQWEsRUFBRSxZQUFNO0FBQzVCLE1BQUksT0FBTyxHQUFHLElBQUksQ0FBQzs7QUFFbkIsWUFBVSxDQUFDLFlBQU07QUFDZixtQkFBZSxDQUFDO2FBQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsdUJBQXVCLENBQUM7S0FBQSxDQUFDLENBQUM7QUFDOUUsUUFBSSxDQUFDO2FBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLENBQUM7S0FBQSxDQUFDLENBQUM7R0FDM0UsQ0FBQyxDQUFDOztBQUVILElBQUUsQ0FBQyxvQkFBb0IsRUFBRSxZQUFNO0FBQzdCLFVBQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUM3QixVQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0dBQ2xELENBQUMsQ0FBQzs7QUFFSCxVQUFRLENBQUMsV0FBVyxFQUFFLFlBQU07QUFDMUIsTUFBRSxDQUFDLDZCQUE2QixFQUFFLFlBQU07QUFDdEMsVUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3pELFlBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7QUFDM0IsYUFBSyxFQUFFLEdBQUc7QUFDVixjQUFNLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSx5QkFBeUIsRUFBRSxhQUFhLEVBQUUsb0JBQW9CLEVBQUUscUNBQXFDLENBQUM7T0FDbEksQ0FBQyxDQUFDO0FBQ0gsWUFBTSxDQUFDLE1BQU0s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QUFtQyxDQUFDO1NBQzFHLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvemhhbmd4aWFvdGlhbi8uYXRvbS9wYWNrYWdlcy9udWNsaWRlLWxhbmd1YWdlLWhhY2svc3BlYy9oYWNrLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcbi8qIEBmbG93ICovXG5cbmRlc2NyaWJlKCdQSFAgZ3JhbW1hcicsICgpID0+IHtcbiAgbGV0IGdyYW1tYXIgPSBudWxsO1xuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnbnVjbGlkZS1sYW5ndWFnZS1oYWNrJykpO1xuICAgIHJ1bnMoKCkgPT4gZ3JhbW1hciA9IGF0b20uZ3JhbW1hcnMuZ3JhbW1hckZvclNjb3BlTmFtZSgndGV4dC5odG1sLmhhY2snKSk7XG4gIH0pO1xuXG4gIGl0KCdwYXJzZXMgdGhlIGdyYW1tYXInLCAoKSA9PiB7XG4gICAgZXhwZWN0KGdyYW1tYXIpLnRvQmVUcnV0aHkoKTtcbiAgICBleHBlY3QoZ3JhbW1hci5zY29wZU5hbWUpLnRvQmUoJ3RleHQuaHRtbC5oYWNrJyk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdvcGVyYXRvcnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB0b2tlbml6ZSA9IGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIGNvbnN0IHRva2VucyA9IGdyYW1tYXIudG9rZW5pemVMaW5lcyhcIjw/aGhcXG4kdGVzdCA9IDI7XCIpO1xuICAgICAgZXhwZWN0KHRva2Vuc1sxXVswXSkudG9FcXVhbCh7XG4gICAgICAgIHZhbHVlOiAnJCcsXG4gICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICd2YXJpYWJsZS5vdGhlci5waHAnLCAncHVuY3R1YXRpb24uZGVmaW5pdGlvbi52YXJpYWJsZS5waHAnXSxcbiAgICAgIH0pO1xuICAgICAgZXhwZWN0KHRva2Vuc1sxXVsyXSkudG9FcXVhbCh7XG4gICAgICAgIHZhbHVlOiAnICcsXG4gICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjayddLFxuICAgICAgfSk7XG4gICAgICBleHBlY3QodG9rZW5zWzFdWzNdKS50b0VxdWFsKHtcbiAgICAgICAgdmFsdWU6ICc9JyxcbiAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ2tleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5waHAnXSxcbiAgICAgIH0pO1xuICAgICAgZXhwZWN0KHRva2Vuc1sxXVs0XSkudG9FcXVhbCh7XG4gICAgICAgIHZhbHVlOiAnICcsXG4gICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjayddLFxuICAgICAgfSk7XG4gICAgICBleHBlY3QodG9rZW5zWzFdWzVdKS50b0VxdWFsKHtcbiAgICAgICAgdmFsdWU6ICcyJyxcbiAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ2NvbnN0YW50Lm51bWVyaWMucGhwJ10sXG4gICAgICB9KTtcbiAgICAgIGV4cGVjdCh0b2tlbnNbMV1bNl0pLnRvRXF1YWwoe1xuICAgICAgICB2YWx1ZTogJzsnLFxuICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAncHVuY3R1YXRpb24udGVybWluYXRvci5leHByZXNzaW9uLnBocCddLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHRva2VuaXplICsgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgY29uc3QgdG9rZW5zID0gZ3JhbW1hci50b2tlbml6ZUxpbmVzKFwiPD9oaFxcbjEgKyAyO1wiKTtcbiAgICAgIGV4cGVjdCh0b2tlbnNbMV1bMF0pLnRvRXF1YWwoe1xuICAgICAgICB2YWx1ZTogJzEnLFxuICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAnY29uc3RhbnQubnVtZXJpYy5waHAnXSxcbiAgICAgIH0pO1xuICAgICAgZXhwZWN0KHRva2Vuc1sxXVsxXSkudG9FcXVhbCh7XG4gICAgICAgIHZhbHVlOiAnICcsXG4gICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjayddLFxuICAgICAgfSk7XG4gICAgICBleHBlY3QodG9rZW5zWzFdWzJdKS50b0VxdWFsKHtcbiAgICAgICAgdmFsdWU6ICcrJyxcbiAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ2tleXdvcmQub3BlcmF0b3IuYXJpdGhtZXRpYy5waHAnXSxcbiAgICAgIH0pO1xuICAgICAgZXhwZWN0KHRva2Vuc1sxXVszXSkudG9FcXVhbCh7XG4gICAgICAgIHZhbHVlOiAnICcsXG4gICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjayddLFxuICAgICAgfSk7XG4gICAgICBleHBlY3QodG9rZW5zWzFdWzRdKS50b0VxdWFsKHtcbiAgICAgICAgdmFsdWU6ICcyJyxcbiAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ2NvbnN0YW50Lm51bWVyaWMucGhwJ10sXG4gICAgICB9KTtcbiAgICAgIGV4cGVjdCh0b2tlbnNbMV1bNV0pLnRvRXF1YWwoe1xuICAgICAgICB2YWx1ZTogJzsnLFxuICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAncHVuY3R1YXRpb24udGVybWluYXRvci5leHByZXNzaW9uLnBocCddLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHRva2VuaXplIC0gY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgY29uc3QgdG9rZW5zID0gZ3JhbW1hci50b2tlbml6ZUxpbmVzKFwiPD9oaFxcbjEgLSAyO1wiKTtcbiAgICAgIGV4cGVjdCh0b2tlbnNbMV1bMF0pLnRvRXF1YWwoe1xuICAgICAgICB2YWx1ZTogJzEnLFxuICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAnY29uc3RhbnQubnVtZXJpYy5waHAnXSxcbiAgICAgIH0pO1xuICAgICAgZXhwZWN0KHRva2Vuc1sxXVsxXSkudG9FcXVhbCh7XG4gICAgICAgIHZhbHVlOiAnICcsXG4gICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjayddLFxuICAgICAgfSk7XG4gICAgICBleHBlY3QodG9rZW5zWzFdWzJdKS50b0VxdWFsKHtcbiAgICAgICAgdmFsdWU6ICctJyxcbiAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ2tleXdvcmQub3BlcmF0b3IuYXJpdGhtZXRpYy5waHAnXSxcbiAgICAgIH0pO1xuICAgICAgZXhwZWN0KHRva2Vuc1sxXVszXSkudG9FcXVhbCh7XG4gICAgICAgIHZhbHVlOiAnICcsXG4gICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjayddLFxuICAgICAgfSk7XG4gICAgICBleHBlY3QodG9rZW5zWzFdWzRdKS50b0VxdWFsKHtcbiAgICAgICAgdmFsdWU6ICcyJyxcbiAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ2NvbnN0YW50Lm51bWVyaWMucGhwJ10sXG4gICAgICB9KTtcbiAgICAgIGV4cGVjdCh0b2tlbnNbMV1bNV0pLnRvRXF1YWwoe1xuICAgICAgICB2YWx1ZTogJzsnLFxuICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAncHVuY3R1YXRpb24udGVybWluYXRvci5leHByZXNzaW9uLnBocCddLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHRva2VuaXplICogY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgY29uc3QgdG9rZW5zID0gZ3JhbW1hci50b2tlbml6ZUxpbmVzKFwiPD9oaFxcbjEgKiAyO1wiKTtcbiAgICAgIGV4cGVjdCh0b2tlbnNbMV1bMF0pLnRvRXF1YWwoe1xuICAgICAgICB2YWx1ZTogJzEnLFxuICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAnY29uc3RhbnQubnVtZXJpYy5waHAnXSxcbiAgICAgIH0pO1xuICAgICAgZXhwZWN0KHRva2Vuc1sxXVsxXSkudG9FcXVhbCh7XG4gICAgICAgIHZhbHVlOiAnICcsXG4gICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjayddLFxuICAgICAgfSk7XG4gICAgICBleHBlY3QodG9rZW5zWzFdWzJdKS50b0VxdWFsKHtcbiAgICAgICAgdmFsdWU6ICcqJyxcbiAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ2tleXdvcmQub3BlcmF0b3IuYXJpdGhtZXRpYy5waHAnXSxcbiAgICAgIH0pO1xuICAgICAgZXhwZWN0KHRva2Vuc1sxXVszXSkudG9FcXVhbCh7XG4gICAgICAgIHZhbHVlOiAnICcsXG4gICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjayddLFxuICAgICAgfSk7XG4gICAgICBleHBlY3QodG9rZW5zWzFdWzRdKS50b0VxdWFsKHtcbiAgICAgICAgdmFsdWU6ICcyJyxcbiAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ2NvbnN0YW50Lm51bWVyaWMucGhwJ10sXG4gICAgICB9KTtcbiAgICAgIGV4cGVjdCh0b2tlbnNbMV1bNV0pLnRvRXF1YWwoe1xuICAgICAgICB2YWx1ZTogJzsnLFxuICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAncHVuY3R1YXRpb24udGVybWluYXRvci5leHByZXNzaW9uLnBocCddLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHRva2VuaXplIC8gY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgY29uc3QgdG9rZW5zID0gZ3JhbW1hci50b2tlbml6ZUxpbmVzKFwiPD9oaFxcbjEgLyAyO1wiKTtcbiAgICAgIGV4cGVjdCh0b2tlbnNbMV1bMF0pLnRvRXF1YWwoe1xuICAgICAgICB2YWx1ZTogJzEnLFxuICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAnY29uc3RhbnQubnVtZXJpYy5waHAnXSxcbiAgICAgIH0pO1xuICAgICAgZXhwZWN0KHRva2Vuc1sxXVsxXSkudG9FcXVhbCh7XG4gICAgICAgIHZhbHVlOiAnICcsXG4gICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjayddLFxuICAgICAgfSk7XG4gICAgICBleHBlY3QodG9rZW5zWzFdWzJdKS50b0VxdWFsKHtcbiAgICAgICAgdmFsdWU6ICcvJyxcbiAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ2tleXdvcmQub3BlcmF0b3IuYXJpdGhtZXRpYy5waHAnXSxcbiAgICAgIH0pO1xuICAgICAgZXhwZWN0KHRva2Vuc1sxXVszXSkudG9FcXVhbCh7XG4gICAgICAgIHZhbHVlOiAnICcsXG4gICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjayddLFxuICAgICAgfSk7XG4gICAgICBleHBlY3QodG9rZW5zWzFdWzRdKS50b0VxdWFsKHtcbiAgICAgICAgdmFsdWU6ICcyJyxcbiAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ2NvbnN0YW50Lm51bWVyaWMucGhwJ10sXG4gICAgICB9KTtcbiAgICAgIGV4cGVjdCh0b2tlbnNbMV1bNV0pLnRvRXF1YWwoe1xuICAgICAgICB2YWx1ZTogJzsnLFxuICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAncHVuY3R1YXRpb24udGVybWluYXRvci5leHByZXNzaW9uLnBocCddLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHRva2VuaXplICUgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgY29uc3QgdG9rZW5zID0gZ3JhbW1hci50b2tlbml6ZUxpbmVzKFwiPD9oaFxcbjEgJSAyO1wiKTtcbiAgICAgIGV4cGVjdCh0b2tlbnNbMV1bMF0pLnRvRXF1YWwoe1xuICAgICAgICB2YWx1ZTogJzEnLFxuICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAnY29uc3RhbnQubnVtZXJpYy5waHAnXSxcbiAgICAgIH0pO1xuICAgICAgZXhwZWN0KHRva2Vuc1sxXVsxXSkudG9FcXVhbCh7XG4gICAgICAgIHZhbHVlOiAnICcsXG4gICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjayddLFxuICAgICAgfSk7XG4gICAgICBleHBlY3QodG9rZW5zWzFdWzJdKS50b0VxdWFsKHtcbiAgICAgICAgdmFsdWU6ICclJyxcbiAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ2tleXdvcmQub3BlcmF0b3IuYXJpdGhtZXRpYy5waHAnXSxcbiAgICAgIH0pO1xuICAgICAgZXhwZWN0KHRva2Vuc1sxXVszXSkudG9FcXVhbCh7XG4gICAgICAgIHZhbHVlOiAnICcsXG4gICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjayddLFxuICAgICAgfSk7XG4gICAgICBleHBlY3QodG9rZW5zWzFdWzRdKS50b0VxdWFsKHtcbiAgICAgICAgdmFsdWU6ICcyJyxcbiAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ2NvbnN0YW50Lm51bWVyaWMucGhwJ10sXG4gICAgICB9KTtcbiAgICAgIGV4cGVjdCh0b2tlbnNbMV1bNV0pLnRvRXF1YWwoe1xuICAgICAgICB2YWx1ZTogJzsnLFxuICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAncHVuY3R1YXRpb24udGVybWluYXRvci5leHByZXNzaW9uLnBocCddLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnY29tYmluZWQgb3BlcmF0b3JzJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCB0b2tlbml6ZSArPSBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHRva2VucyA9IGdyYW1tYXIudG9rZW5pemVMaW5lcyhcIjw/aGhcXG4kdGVzdCArPSAyO1wiKTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVswXSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICckJyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAndmFyaWFibGUub3RoZXIucGhwJywgJ3B1bmN0dWF0aW9uLmRlZmluaXRpb24udmFyaWFibGUucGhwJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzFdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJ3Rlc3QnLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICd2YXJpYWJsZS5vdGhlci5waHAnXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bMl0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnICcsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzNdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJys9JyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAna2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnBocCddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVs0XSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICcgJyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bNV0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnMicsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ2NvbnN0YW50Lm51bWVyaWMucGhwJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzZdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJzsnLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICdwdW5jdHVhdGlvbi50ZXJtaW5hdG9yLmV4cHJlc3Npb24ucGhwJ10sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgdG9rZW5pemUgLT0gY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgICBjb25zdCB0b2tlbnMgPSBncmFtbWFyLnRva2VuaXplTGluZXMoXCI8P2hoXFxuJHRlc3QgLT0gMjtcIik7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bMF0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnJCcsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ3ZhcmlhYmxlLm90aGVyLnBocCcsICdwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnZhcmlhYmxlLnBocCddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVsxXSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICd0ZXN0JyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAndmFyaWFibGUub3RoZXIucGhwJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzJdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJyAnLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjayddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVszXSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICctPScsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ2tleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5waHAnXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bNF0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnICcsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzVdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJzInLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICdjb25zdGFudC5udW1lcmljLnBocCddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVs2XSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICc7JyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAncHVuY3R1YXRpb24udGVybWluYXRvci5leHByZXNzaW9uLnBocCddLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIHRva2VuaXplICo9IGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgICAgY29uc3QgdG9rZW5zID0gZ3JhbW1hci50b2tlbml6ZUxpbmVzKFwiPD9oaFxcbiR0ZXN0ICo9IDI7XCIpO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzBdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJyQnLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICd2YXJpYWJsZS5vdGhlci5waHAnLCAncHVuY3R1YXRpb24uZGVmaW5pdGlvbi52YXJpYWJsZS5waHAnXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bMV0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAndGVzdCcsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ3ZhcmlhYmxlLm90aGVyLnBocCddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVsyXSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICcgJyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bM10pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnKj0nLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICdrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQucGhwJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzRdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJyAnLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjayddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVs1XSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICcyJyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAnY29uc3RhbnQubnVtZXJpYy5waHAnXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bNl0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnOycsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ3B1bmN0dWF0aW9uLnRlcm1pbmF0b3IuZXhwcmVzc2lvbi5waHAnXSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCB0b2tlbml6ZSAvPSBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHRva2VucyA9IGdyYW1tYXIudG9rZW5pemVMaW5lcyhcIjw/aGhcXG4kdGVzdCAvPSAyO1wiKTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVswXSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICckJyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAndmFyaWFibGUub3RoZXIucGhwJywgJ3B1bmN0dWF0aW9uLmRlZmluaXRpb24udmFyaWFibGUucGhwJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzFdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJ3Rlc3QnLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICd2YXJpYWJsZS5vdGhlci5waHAnXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bMl0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnICcsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzNdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJy89JyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAna2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnBocCddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVs0XSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICcgJyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bNV0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnMicsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ2NvbnN0YW50Lm51bWVyaWMucGhwJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzZdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJzsnLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICdwdW5jdHVhdGlvbi50ZXJtaW5hdG9yLmV4cHJlc3Npb24ucGhwJ10sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgdG9rZW5pemUgJT0gY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgICBjb25zdCB0b2tlbnMgPSBncmFtbWFyLnRva2VuaXplTGluZXMoXCI8P2hoXFxuJHRlc3QgJT0gMjtcIik7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bMF0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnJCcsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ3ZhcmlhYmxlLm90aGVyLnBocCcsICdwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnZhcmlhYmxlLnBocCddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVsxXSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICd0ZXN0JyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAndmFyaWFibGUub3RoZXIucGhwJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzJdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJyAnLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjayddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVszXSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICclPScsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ2tleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5waHAnXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bNF0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnICcsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzVdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJzInLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICdjb25zdGFudC5udW1lcmljLnBocCddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVs2XSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICc7JyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAncHVuY3R1YXRpb24udGVybWluYXRvci5leHByZXNzaW9uLnBocCddLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIHRva2VuaXplIC49IGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgICAgY29uc3QgdG9rZW5zID0gZ3JhbW1hci50b2tlbml6ZUxpbmVzKFwiPD9oaFxcbiR0ZXN0IC49IDI7XCIpO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzBdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJyQnLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICd2YXJpYWJsZS5vdGhlci5waHAnLCAncHVuY3R1YXRpb24uZGVmaW5pdGlvbi52YXJpYWJsZS5waHAnXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bMV0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAndGVzdCcsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ3ZhcmlhYmxlLm90aGVyLnBocCddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVsyXSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICcgJyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bM10pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnLj0nLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICdrZXl3b3JkLm9wZXJhdG9yLnN0cmluZy5waHAnXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bNF0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnICcsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzVdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJzInLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICdjb25zdGFudC5udW1lcmljLnBocCddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVs2XSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICc7JyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAncHVuY3R1YXRpb24udGVybWluYXRvci5leHByZXNzaW9uLnBocCddLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIHRva2VuaXplICY9IGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgICAgY29uc3QgdG9rZW5zID0gZ3JhbW1hci50b2tlbml6ZUxpbmVzKFwiPD9oaFxcbiR0ZXN0ICY9IDI7XCIpO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzBdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJyQnLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICd2YXJpYWJsZS5vdGhlci5waHAnLCAncHVuY3R1YXRpb24uZGVmaW5pdGlvbi52YXJpYWJsZS5waHAnXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bMV0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAndGVzdCcsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ3ZhcmlhYmxlLm90aGVyLnBocCddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVsyXSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICcgJyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bM10pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnJj0nLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICdrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQucGhwJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzRdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJyAnLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjayddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVs1XSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICcyJyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAnY29uc3RhbnQubnVtZXJpYy5waHAnXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bNl0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnOycsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ3B1bmN0dWF0aW9uLnRlcm1pbmF0b3IuZXhwcmVzc2lvbi5waHAnXSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCB0b2tlbml6ZSB8PSBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHRva2VucyA9IGdyYW1tYXIudG9rZW5pemVMaW5lcyhcIjw/aGhcXG4kdGVzdCB8PSAyO1wiKTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVswXSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICckJyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAndmFyaWFibGUub3RoZXIucGhwJywgJ3B1bmN0dWF0aW9uLmRlZmluaXRpb24udmFyaWFibGUucGhwJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzFdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJ3Rlc3QnLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICd2YXJpYWJsZS5vdGhlci5waHAnXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bMl0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnICcsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzNdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJ3w9JyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAna2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnBocCddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVs0XSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICcgJyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bNV0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnMicsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ2NvbnN0YW50Lm51bWVyaWMucGhwJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzZdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJzsnLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICdwdW5jdHVhdGlvbi50ZXJtaW5hdG9yLmV4cHJlc3Npb24ucGhwJ10sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgdG9rZW5pemUgXj0gY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgICBjb25zdCB0b2tlbnMgPSBncmFtbWFyLnRva2VuaXplTGluZXMoXCI8P2hoXFxuJHRlc3QgXj0gMjtcIik7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bMF0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnJCcsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ3ZhcmlhYmxlLm90aGVyLnBocCcsICdwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnZhcmlhYmxlLnBocCddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVsxXSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICd0ZXN0JyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAndmFyaWFibGUub3RoZXIucGhwJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzJdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJyAnLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjayddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVszXSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICdePScsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ2tleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5waHAnXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bNF0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnICcsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzVdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJzInLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICdjb25zdGFudC5udW1lcmljLnBocCddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVs2XSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICc7JyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAncHVuY3R1YXRpb24udGVybWluYXRvci5leHByZXNzaW9uLnBocCddLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIHRva2VuaXplIDw8PSBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHRva2VucyA9IGdyYW1tYXIudG9rZW5pemVMaW5lcyhcIjw/aGhcXG4kdGVzdCA8PD0gMjtcIik7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bMF0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnJCcsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ3ZhcmlhYmxlLm90aGVyLnBocCcsICdwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnZhcmlhYmxlLnBocCddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVsxXSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICd0ZXN0JyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAndmFyaWFibGUub3RoZXIucGhwJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzJdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJyAnLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjayddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVszXSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICc8PD0nLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICdrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQucGhwJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzRdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJyAnLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjayddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVs1XSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICcyJyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAnY29uc3RhbnQubnVtZXJpYy5waHAnXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bNl0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnOycsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ3B1bmN0dWF0aW9uLnRlcm1pbmF0b3IuZXhwcmVzc2lvbi5waHAnXSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCB0b2tlbml6ZSA+Pj0gY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgICBjb25zdCB0b2tlbnMgPSBncmFtbWFyLnRva2VuaXplTGluZXMoXCI8P2hoXFxuJHRlc3QgPj49IDI7XCIpO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzBdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJyQnLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICd2YXJpYWJsZS5vdGhlci5waHAnLCAncHVuY3R1YXRpb24uZGVmaW5pdGlvbi52YXJpYWJsZS5waHAnXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bMV0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAndGVzdCcsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ3ZhcmlhYmxlLm90aGVyLnBocCddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVsyXSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICcgJyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bM10pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnPj49JyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAna2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnBocCddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVs0XSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICcgJyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bNV0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnMicsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ2NvbnN0YW50Lm51bWVyaWMucGhwJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzZdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJzsnLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICdwdW5jdHVhdGlvbi50ZXJtaW5hdG9yLmV4cHJlc3Npb24ucGhwJ10sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHhpdCgnc2hvdWxkIHRva2VuaXplIG5hbWVzcGFjZSBhdCB0aGUgc2FtZSBsaW5lIGFzIDw/aGgnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHRva2VucyA9IGdyYW1tYXIudG9rZW5pemVMaW5lcyhcIjw/aGggbmFtZXNwYWNlIFRlc3Q7XCIpO1xuICAgICAgICBleHBlY3QodG9rZW5zWzBdWzFdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJyAnLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICdtZXRhLm5hbWVzcGFjZS5waHAnXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMF1bMl0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnbmFtZXNwYWNlJyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAnbWV0YS5uYW1lc3BhY2UucGhwJywgJ2tleXdvcmQub3RoZXIubmFtZXNwYWNlLnBocCddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1swXVszXSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICcgJyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAnbWV0YS5uYW1lc3BhY2UucGhwJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodG9rZW5zWzBdWzRdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJ1Rlc3QnLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICdtZXRhLm5hbWVzcGFjZS5waHAnLCAnZW50aXR5Lm5hbWUudHlwZS5uYW1lc3BhY2UucGhwJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodG9rZW5zWzBdWzVdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJzsnLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICdwdW5jdHVhdGlvbi50ZXJtaW5hdG9yLmV4cHJlc3Npb24ucGhwJ10sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgdG9rZW5pemUgbmFtZXNwYWNlIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgICAgY29uc3QgdG9rZW5zID0gZ3JhbW1hci50b2tlbml6ZUxpbmVzKFwiPD9oaFxcbm5hbWVzcGFjZSBUZXN0O1wiKTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVswXSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICduYW1lc3BhY2UnLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICdtZXRhLm5hbWVzcGFjZS5waHAnLCAna2V5d29yZC5vdGhlci5uYW1lc3BhY2UucGhwJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzFdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJyAnLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICdtZXRhLm5hbWVzcGFjZS5waHAnXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bMl0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnVGVzdCcsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ21ldGEubmFtZXNwYWNlLnBocCcsICdlbnRpdHkubmFtZS50eXBlLm5hbWVzcGFjZS5waHAnXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bM10pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnOycsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ3B1bmN0dWF0aW9uLnRlcm1pbmF0b3IuZXhwcmVzc2lvbi5waHAnXSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCB0b2tlbml6ZSBkZWZhdWx0IGFycmF5IHR5cGUgd2l0aCBvbGQgYXJyYXkgdmFsdWUgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgICBjb25zdCB0b2tlbnMgPSBncmFtbWFyLnRva2VuaXplTGluZXMoXCI8P2hoXFxuZnVuY3Rpb24gYXJyYXlfdGVzdChhcnJheSAkdmFsdWUgPSBhcnJheSgpKSB7fVwiKTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVswXSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICdmdW5jdGlvbicsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ21ldGEuZnVuY3Rpb24ucGhwJywgJ3N0b3JhZ2UudHlwZS5mdW5jdGlvbi5waHAnXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bMV0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnICcsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ21ldGEuZnVuY3Rpb24ucGhwJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzJdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJ2FycmF5X3Rlc3QnLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICdtZXRhLmZ1bmN0aW9uLnBocCcsICdlbnRpdHkubmFtZS5mdW5jdGlvbi5waHAnXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bM10pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnKCcsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ21ldGEuZnVuY3Rpb24ucGhwJywgJ3B1bmN0dWF0aW9uLmRlZmluaXRpb24ucGFyYW1ldGVycy5iZWdpbi5waHAnXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bNF0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnYXJyYXknLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICdtZXRhLmZ1bmN0aW9uLnBocCcsICdtZXRhLmZ1bmN0aW9uLmFyZ3VtZW50cy5waHAnLCAnbWV0YS5mdW5jdGlvbi5hcmd1bWVudC5hcnJheS5waHAnLCAnc3RvcmFnZS50eXBlLnBocCddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVs1XSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICcgJyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAnbWV0YS5mdW5jdGlvbi5waHAnLCAnbWV0YS5mdW5jdGlvbi5hcmd1bWVudHMucGhwJywgJ21ldGEuZnVuY3Rpb24uYXJndW1lbnQuYXJyYXkucGhwJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzZdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJyQnLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICdtZXRhLmZ1bmN0aW9uLnBocCcsICdtZXRhLmZ1bmN0aW9uLmFyZ3VtZW50cy5waHAnLCAnbWV0YS5mdW5jdGlvbi5hcmd1bWVudC5hcnJheS5waHAnLCAndmFyaWFibGUub3RoZXIucGhwJywgJ3B1bmN0dWF0aW9uLmRlZmluaXRpb24udmFyaWFibGUucGhwJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzddKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJ3ZhbHVlJyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAnbWV0YS5mdW5jdGlvbi5waHAnLCAnbWV0YS5mdW5jdGlvbi5hcmd1bWVudHMucGhwJywgJ21ldGEuZnVuY3Rpb24uYXJndW1lbnQuYXJyYXkucGhwJywgJ3ZhcmlhYmxlLm90aGVyLnBocCddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVs4XSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICcgJyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAnbWV0YS5mdW5jdGlvbi5waHAnLCAnbWV0YS5mdW5jdGlvbi5hcmd1bWVudHMucGhwJywgJ21ldGEuZnVuY3Rpb24uYXJndW1lbnQuYXJyYXkucGhwJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzldKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJz0nLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICdtZXRhLmZ1bmN0aW9uLnBocCcsICdtZXRhLmZ1bmN0aW9uLmFyZ3VtZW50cy5waHAnLCAnbWV0YS5mdW5jdGlvbi5hcmd1bWVudC5hcnJheS5waHAnLCAna2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnBocCddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVsxMF0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnICcsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ21ldGEuZnVuY3Rpb24ucGhwJywgJ21ldGEuZnVuY3Rpb24uYXJndW1lbnRzLnBocCcsICdtZXRhLmZ1bmN0aW9uLmFyZ3VtZW50LmFycmF5LnBocCddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVsxMV0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnYXJyYXknLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICdtZXRhLmZ1bmN0aW9uLnBocCcsICdtZXRhLmZ1bmN0aW9uLmFyZ3VtZW50cy5waHAnLCAnbWV0YS5mdW5jdGlvbi5hcmd1bWVudC5hcnJheS5waHAnLCAnc3VwcG9ydC5mdW5jdGlvbi5jb25zdHJ1Y3QucGhwJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzEyXSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICcoJyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAnbWV0YS5mdW5jdGlvbi5waHAnLCAnbWV0YS5mdW5jdGlvbi5hcmd1bWVudHMucGhwJywgJ21ldGEuZnVuY3Rpb24uYXJndW1lbnQuYXJyYXkucGhwJywgJ3B1bmN0dWF0aW9uLmRlZmluaXRpb24uYXJyYXkuYmVnaW4ucGhwJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzEzXSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICcpJyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAnbWV0YS5mdW5jdGlvbi5waHAnLCAnbWV0YS5mdW5jdGlvbi5hcmd1bWVudHMucGhwJywgJ21ldGEuZnVuY3Rpb24uYXJndW1lbnQuYXJyYXkucGhwJywgJ3B1bmN0dWF0aW9uLmRlZmluaXRpb24uYXJyYXkuZW5kLnBocCddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVsxNF0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnKScsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ21ldGEuZnVuY3Rpb24ucGhwJywgJ3B1bmN0dWF0aW9uLmRlZmluaXRpb24ucGFyYW1ldGVycy5lbmQucGhwJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzE1XSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICcgJyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bMTZdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJ3snLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICdwdW5jdHVhdGlvbi5zZWN0aW9uLnNjb3BlLmJlZ2luLnBocCddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVsxN10pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnfScsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ3B1bmN0dWF0aW9uLnNlY3Rpb24uc2NvcGUuZW5kLnBocCddLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIHRva2VuaXplIGRlZmF1bHQgYXJyYXkgdHlwZSB3aXRoIHNob3J0IGFycmF5IHZhbHVlIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgICAgY29uc3QgdG9rZW5zID0gZ3JhbW1hci50b2tlbml6ZUxpbmVzKFwiPD9oaFxcbmZ1bmN0aW9uIGFycmF5X3Rlc3QoYXJyYXkgJHZhbHVlID0gW10pIHt9XCIpO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzBdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJ2Z1bmN0aW9uJyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAnbWV0YS5mdW5jdGlvbi5waHAnLCAnc3RvcmFnZS50eXBlLmZ1bmN0aW9uLnBocCddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVsxXSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICcgJyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAnbWV0YS5mdW5jdGlvbi5waHAnXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bMl0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnYXJyYXlfdGVzdCcsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ21ldGEuZnVuY3Rpb24ucGhwJywgJ2VudGl0eS5uYW1lLmZ1bmN0aW9uLnBocCddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVszXSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICcoJyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAnbWV0YS5mdW5jdGlvbi5waHAnLCAncHVuY3R1YXRpb24uZGVmaW5pdGlvbi5wYXJhbWV0ZXJzLmJlZ2luLnBocCddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVs0XSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICdhcnJheScsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ21ldGEuZnVuY3Rpb24ucGhwJywgJ21ldGEuZnVuY3Rpb24uYXJndW1lbnRzLnBocCcsICdtZXRhLmZ1bmN0aW9uLmFyZ3VtZW50LnNob3J0LmFycmF5LnBocCcsICdzdG9yYWdlLnR5cGUucGhwJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzVdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJyAnLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICdtZXRhLmZ1bmN0aW9uLnBocCcsICdtZXRhLmZ1bmN0aW9uLmFyZ3VtZW50cy5waHAnLCAnbWV0YS5mdW5jdGlvbi5hcmd1bWVudC5zaG9ydC5hcnJheS5waHAnXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bNl0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnJCcsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ21ldGEuZnVuY3Rpb24ucGhwJywgJ21ldGEuZnVuY3Rpb24uYXJndW1lbnRzLnBocCcsICdtZXRhLmZ1bmN0aW9uLmFyZ3VtZW50LnNob3J0LmFycmF5LnBocCcsICd2YXJpYWJsZS5vdGhlci5waHAnLCAncHVuY3R1YXRpb24uZGVmaW5pdGlvbi52YXJpYWJsZS5waHAnXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bN10pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAndmFsdWUnLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICdtZXRhLmZ1bmN0aW9uLnBocCcsICdtZXRhLmZ1bmN0aW9uLmFyZ3VtZW50cy5waHAnLCAnbWV0YS5mdW5jdGlvbi5hcmd1bWVudC5zaG9ydC5hcnJheS5waHAnLCAndmFyaWFibGUub3RoZXIucGhwJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzhdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJyAnLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICdtZXRhLmZ1bmN0aW9uLnBocCcsICdtZXRhLmZ1bmN0aW9uLmFyZ3VtZW50cy5waHAnLCAnbWV0YS5mdW5jdGlvbi5hcmd1bWVudC5zaG9ydC5hcnJheS5waHAnXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bOV0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnPScsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ21ldGEuZnVuY3Rpb24ucGhwJywgJ21ldGEuZnVuY3Rpb24uYXJndW1lbnRzLnBocCcsICdtZXRhLmZ1bmN0aW9uLmFyZ3VtZW50LnNob3J0LmFycmF5LnBocCddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVsxMF0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnICcsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ21ldGEuZnVuY3Rpb24ucGhwJywgJ21ldGEuZnVuY3Rpb24uYXJndW1lbnRzLnBocCcsICdtZXRhLmZ1bmN0aW9uLmFyZ3VtZW50LnNob3J0LmFycmF5LnBocCddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVsxMV0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnWycsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ21ldGEuZnVuY3Rpb24ucGhwJywgJ21ldGEuZnVuY3Rpb24uYXJndW1lbnRzLnBocCcsICdtZXRhLmZ1bmN0aW9uLmFyZ3VtZW50LnNob3J0LmFycmF5LnBocCcsICdwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnNob3J0LmFycmF5LmJlZ2luLnBocCddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVsxMl0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnXScsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJywgJ21ldGEuZnVuY3Rpb24ucGhwJywgJ21ldGEuZnVuY3Rpb24uYXJndW1lbnRzLnBocCcsICdtZXRhLmZ1bmN0aW9uLmFyZ3VtZW50LnNob3J0LmFycmF5LnBocCcsICdwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnNob3J0LmFycmF5LmVuZC5waHAnXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bMTNdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJyknLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICdtZXRhLmZ1bmN0aW9uLnBocCcsICdwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnBhcmFtZXRlcnMuZW5kLnBocCddLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXVsxNF0pLnRvRXF1YWwoe1xuICAgICAgICAgIHZhbHVlOiAnICcsXG4gICAgICAgICAgc2NvcGVzOiBbJ3RleHQuaHRtbC5oYWNrJywgJ21ldGEuZW1iZWRkZWQuYmxvY2sucGhwJywgJ3NvdXJjZS5oYWNrJ10sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodG9rZW5zWzFdWzE1XSkudG9FcXVhbCh7XG4gICAgICAgICAgdmFsdWU6ICd7JyxcbiAgICAgICAgICBzY29wZXM6IFsndGV4dC5odG1sLmhhY2snLCAnbWV0YS5lbWJlZGRlZC5ibG9jay5waHAnLCAnc291cmNlLmhhY2snLCAncHVuY3R1YXRpb24uc2VjdGlvbi5zY29wZS5iZWdpbi5waHAnXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV1bMTZdKS50b0VxdWFsKHtcbiAgICAgICAgICB2YWx1ZTogJ30nLFxuICAgICAgICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwuaGFjaycsICdtZXRhLmVtYmVkZGVkLmJsb2NrLnBocCcsICdzb3VyY2UuaGFjaycsICdwdW5jdHVhdGlvbi5zZWN0aW9uLnNjb3BlLmVuZC5waHAnXSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==
//# sourceURL=/Users/zhangxiaotian/.atom/packages/nuclide-language-hack/spec/hack-spec.js
