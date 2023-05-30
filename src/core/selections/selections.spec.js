import {
  selectionsFromQuoteAndString, generateSelection, getPrecedingText,
} from './selections';

describe('selectionsFromQuoteAndString', () => {
  it('phrase at beginning', () => {
    const input = {
      quote: 'ἐν ἀρχῇ ἦν',
      string: 'ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν Θεόν, καὶ Θεὸς ἦν ὁ λόγος.',
      occurrence: 1,
    };
    const output = selectionsFromQuoteAndString(input);
    const expected = [
      {
        text: 'ἐν', occurrence: 1, occurrences: 1,
      },
      {
        text: 'ἀρχῇ', occurrence: 1, occurrences: 1,
      },
      {
        text: 'ἦν', occurrence: 1, occurrences: 3,
      },
    ];
    expect(output).toStrictEqual(expected);
  });

  it('all occurrences -1', () => {
    const input = {
      quote: 'καὶ',
      string: 'διὰ τοῦτο, ἐὰν ἔλθω, ὑπομνήσω αὐτοῦ τὰ ἔργα, ἃ ποιεῖ, λόγοις πονηροῖς φλυαρῶν ἡμᾶς; καὶ μὴ ἀρκούμενος ἐπὶ τούτοις, οὔτε αὐτὸς ἐπιδέχεται τοὺς ἀδελφοὺς, καὶ τοὺς βουλομένους κωλύει, καὶ ἐκ τῆς ἐκκλησίας ἐκβάλλει.',
      occurrence: -1,
    };
    const output = selectionsFromQuoteAndString(input);
    const expected = [
      {
        text: 'καὶ', occurrence: 1, occurrences: 3,
      },
      {
        text: 'καὶ', occurrence: 2, occurrences: 3,
      },
      {
        text: 'καὶ', occurrence: 3, occurrences: 3,
      },
    ];
    expect(output).toStrictEqual(expected);
  });

  it('skip -1 with ellipsis', () => {
    const input = {
      quote: 'καὶ…μὴ',
      string: 'διὰ τοῦτο, ἐὰν ἔλθω, ὑπομνήσω αὐτοῦ τὰ ἔργα, ἃ ποιεῖ, λόγοις πονηροῖς φλυαρῶν ἡμᾶς; καὶ μὴ ἀρκούμενος ἐπὶ τούτοις, οὔτε αὐτὸς ἐπιδέχεται τοὺς ἀδελφοὺς, καὶ τοὺς βουλομένους κωλύει, καὶ ἐκ τῆς ἐκκλησίας ἐκβάλλει.',
      occurrence: -1,
    };
    const output = selectionsFromQuoteAndString(input);
    const expected = [];
    expect(output).toStrictEqual(expected);
  });

  it('ellipsis: repeated word', () => {
    const input = {
      quote: 'Θεοῦ…Θεοῦ',
      string: 'Παῦλος, δοῦλος Θεοῦ, ἀπόστολος δὲ Ἰησοῦ Χριστοῦ, κατὰ πίστιν ἐκλεκτῶν Θεοῦ, καὶ ἐπίγνωσιν ἀληθείας, τῆς κατ’ εὐσέβειαν',
      occurrence: 1,
    };
    const output = selectionsFromQuoteAndString(input);
    const expected = [
      {
        text: 'Θεοῦ', occurrence: 1, occurrences: 2,
      },
      {
        text: 'Θεοῦ', occurrence: 2, occurrences: 2,
      },
    ];
    expect(output).toStrictEqual(expected);
  });

  it('ellipsis: repeating ending word preceding first.', () => {
    const input = {
      quote: 'Θεὸς…λόγος',
      string: 'ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν Θεόν, καὶ Θεὸς ἦν ὁ λόγος.',
      occurrence: 1,
    };
    const output = selectionsFromQuoteAndString(input);
    const expected = [
      {
        text: 'Θεὸς', occurrence: 1, occurrences: 1,
      },
      {
        text: 'λόγος', occurrence: 3, occurrences: 3,
      },
    ];
    expect(output).toStrictEqual(expected);
  });

  it('ellipsis: repeating ending word preceding first.', () => {
    const input = {
      quote: 'Θεὸς…λόγος',
      string: 'ἐν ἀρχῇ ἦν ὁ λόγος, καὶ Θεὸς ὁ λόγος ἦν πρὸς τὸν Θεόν, καὶ Θεὸς ἦν ὁ λόγος.',
      occurrence: 2,
    };
    const output = selectionsFromQuoteAndString(input);
    const expected = [
      {
        text: 'Θεὸς', occurrence: 2, occurrences: 2,
      },
      {
        text: 'λόγος', occurrence: 3, occurrences: 3,
      },
    ];
    expect(output).toStrictEqual(expected);
  });

  it('ellipsis: simple, short', () => {
    const input = {
      quote: 'ὁ λόγος…πρὸς',
      string: 'ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν Θεόν, καὶ Θεὸς ἦν ὁ λόγος.',
      occurrence: 1,
    };
    const output = selectionsFromQuoteAndString(input);
    const expected = [
      {
        text: 'ὁ', occurrence: 1, occurrences: 3,
      },
      {
        text: 'λόγος', occurrence: 1, occurrences: 3,
      },
      {
        text: 'πρὸς', occurrence: 1, occurrences: 1,
      },
    ];
    expect(output).toStrictEqual(expected);
  });

  it('ellipsis: first occurrence of repeated quote', () => {
    const input = {
      quote: 'ὁ λόγος…Θεόν',
      string: 'ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν Θεόν, καὶ Θεὸς ἦν ὁ λόγος.',
      occurrence: 1,
    };
    const output = selectionsFromQuoteAndString(input);
    const expected = [
      {
        text: 'ὁ', occurrence: 1, occurrences: 3,
      },
      {
        text: 'λόγος', occurrence: 1, occurrences: 3,
      },
      {
        text: 'Θεόν', occurrence: 1, occurrences: 1,
      },
    ];
    expect(output).toStrictEqual(expected);
  });

  it('ellipsis: second occurrence of repeated quote', () => {
    const input = {
      quote: 'ὁ λόγος…Θεόν',
      string: 'ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν Θεόν, καὶ Θεὸς ἦν ὁ λόγος.',
      occurrence: 2,
    };
    const output = selectionsFromQuoteAndString(input);
    const expected = [
      {
        text: 'ὁ', occurrence: 2, occurrences: 3,
      },
      {
        text: 'λόγος', occurrence: 2, occurrences: 3,
      },
      {
        text: 'Θεόν', occurrence: 1, occurrences: 1,
      },
    ];
    expect(output).toStrictEqual(expected);
  });

  it('repeated phrase: first occurrence', () => {
    const input = {
      quote: 'ὁ λόγος',
      string: 'ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν Θεόν, καὶ Θεὸς ἦν ὁ λόγος.',
      occurrence: 1,
    };
    const output = selectionsFromQuoteAndString(input);
    const expected = [
      {
        text: 'ὁ', occurrence: 1, occurrences: 3,
      },
      {
        text: 'λόγος', occurrence: 1, occurrences: 3,
      },
    ];
    expect(output).toStrictEqual(expected);
  });

  it('repeated phrase: second occurrence', () => {
    const input = {
      quote: 'ὁ λόγος',
      string: 'ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν Θεόν, καὶ Θεὸς ἦν ὁ λόγος.',
      occurrence: 2,
    };
    const output = selectionsFromQuoteAndString(input);
    const expected = [
      {
        text: 'ὁ', occurrence: 2, occurrences: 3,
      },
      {
        text: 'λόγος', occurrence: 2, occurrences: 3,
      },
    ];
    expect(output).toStrictEqual(expected);
  });

  it('repeated phrase: last occurrence', () => {
    const input = {
      quote: 'ὁ λόγος',
      string: 'ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν Θεόν, καὶ Θεὸς ἦν ὁ λόγος.',
      occurrence: 3,
    };
    const output = selectionsFromQuoteAndString(input);
    const expected = [
      {
        text: 'ὁ', occurrence: 3, occurrences: 3,
      },
      {
        text: 'λόγος', occurrence: 3, occurrences: 3,
      },
    ];
    expect(output).toStrictEqual(expected);
  });
});

describe('generateSelection', () => {
  it('should only contain one occurrence for the given text', () => {
    const precedingText = 'ἐφανέρωσεν δὲ καιροῖς ἰδίοις τὸν λόγον αὐτοῦ ἐν κηρύγματι ὃ ἐπιστεύθην ἐγὼ κατ’ ἐπιταγὴν';
    const entireText = 'ἐφανέρωσεν δὲ καιροῖς ἰδίοις τὸν λόγον αὐτοῦ ἐν κηρύγματι ὃ ἐπιστεύθην ἐγὼ κατ’ ἐπιταγὴν τοῦ σωτῆρος ἡμῶν θεοῦ';
    const selectedText = `τοῦ`;
    const expectedSelection = {
      text: selectedText,
      occurrence: 1,
      occurrences: 1,
    };
    const selection = generateSelection({
      selectedText, precedingText, entireText,
    });
    expect(selection).toMatchObject(expectedSelection);
  });

  it('should return second occurrence for the given text', () => {
    const selectedText = 'ἡ';
    const precedingText = 'ὅτε δὲ ἡ χρηστότης καὶ ';
    const entireText = 'ὅτε δὲ ἡ χρηστότης καὶ ἡ φιλανθρωπία ἐπεφάνη τοῦ Σωτῆρος ἡμῶν, Θεοῦ,';
    const expectedSelection = {
      text: selectedText,
      occurrence: 2,
      occurrences: 2,
    };
    const selection = generateSelection({
      selectedText, precedingText, entireText,
    });
    expect(selection).toMatchObject(expectedSelection);
  });
});


describe('getPrecedingText', () => {
  it('should be nothing', () => {
    const string = `ὅτε δὲ ἡ χρηστότης καὶ ἡ φιλανθρωπία ἐπεφάνη τοῦ Σωτῆρος ἡμῶν, Θεοῦ,`;
    const subquote = `ὅτε δὲ ἡ χρηστότης καὶ ἡ φιλανθρωπία ἐπεφάνη τοῦ Σωτῆρος ἡμῶν, Θεοῦ`;
    const index = 0;
    const occurrence = 1;
    const precedingText = getPrecedingText(string, subquote, occurrence, index);
    expect(precedingText).toBe('');
  });
  it('should be nothing', () => {
    const string = `ὅτε δὲ ἡ χρηστότης καὶ ἡ φιλανθρωπία ἐπεφάνη τοῦ Σωτῆρος ἡμῶν, Θεοῦ,`;
    const subquote = `ὅτε`;
    const index = 0;
    const occurrence = 1;
    const precedingText = getPrecedingText(string, subquote, occurrence, index);
    expect(precedingText).toBe('');
  });
});