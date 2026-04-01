(() => {
  function freezeTokens(tokens) {
    return Object.freeze(tokens.map((token) => Object.freeze({ ...token })));
  }

  function createCell(definition) {
    const cell = {
      id: definition.id,
      units: definition.units,
      spoken: definition.spoken,
      tokens: freezeTokens(definition.tokens),
      family: definition.family,
      confidence: definition.confidence
    };

    if (definition.note) {
      cell.note = definition.note;
    }

    return Object.freeze(cell);
  }

  // Legacy phrase/cross datasets still power the current prototype UI.
  // They remain here so the engine can keep its existing phrase-scale behavior
  // while a more general exercise layer grows alongside it.
  const phraseScales = Object.freeze({
    5: Object.freeze({
      id: 'L5',
      family: 'phrase-scale',
      units: Object.freeze(['ta', 'ka', 'ta', 'ki', 'ta']),
      spoken: 'ta ka ta ki ta'
    }),
    6: Object.freeze({
      id: 'L6',
      family: 'phrase-scale',
      units: Object.freeze(['ta', 'ka', 'ta', 'ka', 'di', 'mi']),
      spoken: 'ta ka ta ka di mi'
    }),
    7: Object.freeze({
      id: 'L7',
      family: 'phrase-scale',
      units: Object.freeze(['ta', 'ki', 'ta', 'ta', 'ka', 'di', 'mi']),
      spoken: 'ta ki ta ta ka di mi'
    }),
    8: Object.freeze({
      id: 'L8',
      family: 'phrase-scale',
      units: Object.freeze(['ta', 'ka', 'di', 'mi', 'ta', 'ka', 'ju', 'no']),
      spoken: 'ta ka di mi ta ka ju no'
    })
  });

  const jathiSyllables = Object.freeze({
    3: Object.freeze({
      id: 'J3',
      family: 'jathi',
      units: Object.freeze(['ta', 'ki', 'ta']),
      spoken: 'ta ki ta'
    }),
    4: Object.freeze({
      id: 'J4',
      family: 'jathi',
      units: Object.freeze(['ta', 'ka', 'di', 'mi']),
      spoken: 'ta ka di mi'
    }),
    5: Object.freeze({
      id: 'J5',
      family: 'jathi',
      units: Object.freeze(['ta', 'di', 'ge', 'na', 'dom']),
      spoken: 'ta di ge na dom'
    }),
    7: Object.freeze({
      id: 'J7',
      family: 'jathi',
      units: Object.freeze(['ta', 'ka', 'ta', 'di', 'ge', 'na', 'dom']),
      spoken: 'ta ka ta di ge na dom'
    })
  });

  // New reusable abstract exercise cells. These are higher-level rhythm
  // building blocks and are intentionally separate from the legacy phrase-scale
  // arrays above.
  const cells = Object.freeze({
    C3: createCell({
      id: 'C3',
      units: 3,
      spoken: 'Ta ki ta',
      tokens: [
        { text: 'Ta', units: 1 },
        { text: 'ki', units: 1 },
        { text: 'ta', units: 1 }
      ],
      family: 'uniform',
      confidence: 'high'
    }),
    C4: createCell({
      id: 'C4',
      units: 4,
      spoken: 'Ta ka di mi',
      tokens: [
        { text: 'Ta', units: 1 },
        { text: 'ka', units: 1 },
        { text: 'di', units: 1 },
        { text: 'mi', units: 1 }
      ],
      family: 'uniform',
      confidence: 'high'
    }),
    C5: createCell({
      id: 'C5',
      units: 5,
      spoken: 'Ta di ge na dom',
      tokens: [
        { text: 'Ta', units: 1 },
        { text: 'di', units: 1 },
        { text: 'ge', units: 1 },
        { text: 'na', units: 1 },
        { text: 'dom', units: 1 }
      ],
      family: 'uniform',
      confidence: 'high'
    }),
    C6: createCell({
      id: 'C6',
      units: 6,
      spoken: 'Ta di- ge na dom',
      tokens: [
        { text: 'Ta', units: 1 },
        { text: 'di-', units: 2 },
        { text: 'ge', units: 1 },
        { text: 'na', units: 1 },
        { text: 'dom', units: 1 }
      ],
      family: 'extended',
      confidence: 'high'
    }),
    C7: createCell({
      id: 'C7',
      units: 7,
      spoken: 'Ta ka Ta di ge na dom',
      tokens: [
        { text: 'Ta', units: 1 },
        { text: 'ka', units: 1 },
        { text: 'Ta', units: 1 },
        { text: 'di', units: 1 },
        { text: 'ge', units: 1 },
        { text: 'na', units: 1 },
        { text: 'dom', units: 1 }
      ],
      family: 'uniform',
      confidence: 'high'
    }),
    C8: createCell({
      id: 'C8',
      units: 8,
      spoken: 'Ta tom- ta di ge na dom',
      tokens: [
        { text: 'Ta', units: 1 },
        { text: 'tom-', units: 2 },
        { text: 'ta', units: 1 },
        { text: 'di', units: 1 },
        { text: 'ge', units: 1 },
        { text: 'na', units: 1 },
        { text: 'dom', units: 1 }
      ],
      family: 'extended',
      confidence: 'high'
    }),
    C9: createCell({
      id: 'C9',
      units: 9,
      spoken: 'Ta ka di gu Ta di ge na dom',
      tokens: [
        { text: 'Ta', units: 1 },
        { text: 'ka', units: 1 },
        { text: 'di', units: 1 },
        { text: 'gu', units: 1 },
        { text: 'Ta', units: 1 },
        { text: 'di', units: 1 },
        { text: 'ge', units: 1 },
        { text: 'na', units: 1 },
        { text: 'dom', units: 1 }
      ],
      family: 'uniform',
      confidence: 'high'
    }),
    C10: createCell({
      id: 'C10',
      units: 10,
      spoken: 'Ta ki ta tom- Ta di ge na dom',
      tokens: [
        { text: 'Ta', units: 1 },
        { text: 'ki', units: 1 },
        { text: 'ta', units: 1 },
        { text: 'tom-', units: 2 },
        { text: 'Ta', units: 1 },
        { text: 'di', units: 1 },
        { text: 'ge', units: 1 },
        { text: 'na', units: 1 },
        { text: 'dom', units: 1 }
      ],
      family: 'extended',
      confidence: 'high'
    })
  });

  const cellsByUnits = Object.freeze({
    3: cells.C3,
    4: cells.C4,
    5: cells.C5,
    6: cells.C6,
    7: cells.C7,
    8: cells.C8,
    9: cells.C9,
    10: cells.C10
  });

  window.ADI_TALA_EXERCISE_CELLS = Object.freeze({
    version: '2026-04-01',
    phraseScales,
    jathiSyllables,
    cells,
    cellsByUnits
  });
})();
