(() => {
  function freezeTokens(tokens) {
    return Object.freeze(tokens.map((token) => Object.freeze({ ...token })));
  }

  function freezeValue(value) {
    if (Array.isArray(value)) {
      return Object.freeze(value.map((item) => freezeValue(item)));
    }

    if (value && typeof value === 'object') {
      const result = {};
      Object.keys(value).forEach((key) => {
        result[key] = freezeValue(value[key]);
      });
      return Object.freeze(result);
    }

    return value;
  }

  function sum(numbers) {
    return numbers.reduce((total, value) => total + value, 0);
  }

  const exerciseCells = window.ADI_TALA_EXERCISE_CELLS?.cells ?? {};
  const exerciseTemplate = Object.freeze({
    id: 'descending_duration_ladder',
    label: 'Descending Duration Ladder',
    category: 'exercise-template',
    ladder: Object.freeze([4, 3, 2, 1]),
    windowUnits: 32,
    windowBeats: 8,
    playback: 'windowed-continuous',
    endingModes: Object.freeze({
      aligned: Object.freeze({
        id: 'aligned',
        label: 'Aligned',
        description: 'Uses a prescribed token ending that closes against a larger Adi Tala horizon.'
      }),
      cadential: Object.freeze({
        id: 'cadential',
        label: 'Cadential',
        description: 'Uses an explicit cadence tail and may cross sam.'
      })
    })
  });

  function getCell(cellRef) {
    return exerciseCells[cellRef] ?? null;
  }

  function computeCoreUnits(cellRef, ladder) {
    const cell = getCell(cellRef);
    if (!cell || !Array.isArray(ladder)) return null;
    return cell.units * sum(ladder);
  }

  function createEnding(id, mode, tokens, note) {
    return freezeValue({
      id,
      mode,
      tail: freezeTokens(tokens),
      tailUnits: sum(tokens.map((token) => token.units)),
      confidence: 'high',
      note
    });
  }

  const endingLibrary = Object.freeze({
    aligned_C3: createEnding('aligned_C3', 'aligned', [
      { text: 'Tang', units: 3 }
    ]),
    aligned_C4: createEnding('aligned_C4', 'aligned', [
      { text: 'Ta', units: 4 }
    ]),
    aligned_C5: createEnding('aligned_C5', 'aligned', [
      { text: 'Ta', units: 2 },
      { text: 'Tang', units: 3 }
    ]),
    aligned_C6: createEnding('aligned_C6', 'aligned', [
      { text: 'Tang', units: 3 },
      { text: 'Tang', units: 3 }
    ]),
    aligned_C7: createEnding('aligned_C7', 'aligned', [
      { text: 'Ta', units: 2 },
      { text: 'Ta', units: 2 },
      { text: 'Tang', units: 3 }
    ]),
    aligned_C8: createEnding('aligned_C8', 'aligned', [
      { text: 'Dim', units: 4 },
      { text: 'Dim', units: 4 }
    ]),
    aligned_C9: createEnding('aligned_C9', 'aligned', [
      { text: 'Ding', units: 3 },
      { text: 'Tang', units: 3 },
      { text: 'Ding', units: 3 }
    ]),
    aligned_C10: createEnding('aligned_C10', 'aligned', [
      { text: 'Ta', units: 2 },
      { text: 'Tang', units: 3 },
      { text: 'Ta', units: 2 },
      { text: 'Tang', units: 3 }
    ]),
    cadential_C3_tang: createEnding('cadential_C3_tang', 'cadential', [
      { text: 'Tang', units: 3 }
    ], 'Explicit cadential variant that crosses sam.')
  });

  function getEnding(endingRef) {
    return endingLibrary[endingRef] ?? null;
  }

  function createAlignedPattern({ id, label, cellRef, endingRef, description, fullCycleWindows, notes }) {
    const ladder = exerciseTemplate.ladder;
    const coreUnits = computeCoreUnits(cellRef, ladder);
    const ending = getEnding(endingRef);
    const phraseUnits = coreUnits === null || !ending ? null : coreUnits + ending.tailUnits;

    return freezeValue({
      id,
      label,
      category: 'exercise',
      templateRef: exerciseTemplate.id,
      cellRef,
      ladder,
      coreUnits,
      endingRef,
      phraseUnits,
      fullCycleWindows: fullCycleWindows ?? null,
      resolvesToSam: fullCycleWindows ? true : 'pending-window-confirmation',
      description,
      notes
    });
  }

  function createCadentialPattern({ id, label, cellRef, endingRef, description, notes }) {
    const ladder = exerciseTemplate.ladder;
    const coreUnits = computeCoreUnits(cellRef, ladder);
    const ending = getEnding(endingRef);
    const phraseUnits = coreUnits === null || !ending ? null : coreUnits + ending.tailUnits;

    return freezeValue({
      id,
      label,
      category: 'exercise',
      templateRef: exerciseTemplate.id,
      cellRef,
      ladder,
      coreUnits,
      endingRef,
      phraseUnits,
      fullCycleWindows: null,
      resolvesToSam: 'crossesSam',
      description,
      notes
    });
  }

  const phrasePatterns = Object.freeze({
    5: Object.freeze({
      id: 'phrase_l5',
      cellId: 'L5',
      ladder: Object.freeze([2, 3]),
      endingRule: 'resolve-on-beat-8'
    }),
    6: Object.freeze({
      id: 'phrase_l6',
      cellId: 'L6',
      ladder: Object.freeze([2, 4]),
      endingRule: 'resolve-on-beat-8'
    }),
    7: Object.freeze({
      id: 'phrase_l7',
      cellId: 'L7',
      ladder: Object.freeze([3, 4]),
      endingRule: 'resolve-on-beat-8'
    }),
    8: Object.freeze({
      id: 'phrase_l8',
      cellId: 'L8',
      ladder: Object.freeze([4, 4]),
      endingRule: 'resolve-on-beat-8'
    })
  });

  const exercisePatterns = Object.freeze({
    ex3_aligned: createAlignedPattern({
      id: 'ex3_aligned',
      label: 'C3 Aligned Ladder',
      cellRef: 'C3',
      endingRef: 'aligned_C3',
      fullCycleWindows: 3,
      description: 'C3 descending-duration ladder with Tang ending unfolding across 3 Adi Tala windows.',
      notes: 'This full-cycle horizon is explicitly confirmed and should render as Window 1/3 through Window 3/3.'
    }),
    ex3_tang: createCadentialPattern({
      id: 'ex3_tang',
      label: 'C3 Tang Cadence',
      cellRef: 'C3',
      endingRef: 'cadential_C3_tang',
      description: 'C3 descending-duration ladder with explicit Tang cadence.',
      notes: 'Cadential pattern remains preview-only until cross-sam runtime support is added.'
    }),
    ex4_aligned: createAlignedPattern({
      id: 'ex4_aligned',
      label: 'C4 Aligned Ladder',
      cellRef: 'C4',
      endingRef: 'aligned_C4',
      fullCycleWindows: 4,
      description: 'C4 descending-duration ladder with prescribed aligned ending.',
      notes: 'Full-cycle windows inferred from the confirmed aligned ending length pattern.'
    }),
    ex5_aligned: createAlignedPattern({
      id: 'ex5_aligned',
      label: 'C5 Aligned Ladder',
      cellRef: 'C5',
      endingRef: 'aligned_C5',
      fullCycleWindows: 5,
      description: 'C5 descending-duration ladder with prescribed aligned ending.',
      notes: 'Full-cycle windows inferred from the confirmed aligned ending length pattern.'
    }),
    ex6_aligned: createAlignedPattern({
      id: 'ex6_aligned',
      label: 'C6 Aligned Ladder',
      cellRef: 'C6',
      endingRef: 'aligned_C6',
      fullCycleWindows: 6,
      description: 'C6 descending-duration ladder with prescribed aligned ending.',
      notes: 'Full-cycle windows inferred from the confirmed aligned ending length pattern.'
    }),
    ex7_aligned: createAlignedPattern({
      id: 'ex7_aligned',
      label: 'C7 Aligned Ladder',
      cellRef: 'C7',
      endingRef: 'aligned_C7',
      fullCycleWindows: 7,
      description: 'C7 descending-duration ladder with prescribed aligned ending.',
      notes: 'Full-cycle windows inferred from the confirmed aligned ending length pattern.'
    }),
    ex8_aligned: createAlignedPattern({
      id: 'ex8_aligned',
      label: 'C8 Aligned Ladder',
      cellRef: 'C8',
      endingRef: 'aligned_C8',
      fullCycleWindows: 8,
      description: 'C8 descending-duration ladder with prescribed aligned ending.',
      notes: 'Full-cycle windows inferred from the confirmed aligned ending length pattern.'
    }),
    ex9_aligned: createAlignedPattern({
      id: 'ex9_aligned',
      label: 'C9 Aligned Ladder',
      cellRef: 'C9',
      endingRef: 'aligned_C9',
      fullCycleWindows: 9,
      description: 'C9 descending-duration ladder with prescribed aligned ending.',
      notes: 'Full-cycle windows inferred from the confirmed aligned ending length pattern.'
    }),
    ex10_aligned: createAlignedPattern({
      id: 'ex10_aligned',
      label: 'C10 Aligned Ladder',
      cellRef: 'C10',
      endingRef: 'aligned_C10',
      fullCycleWindows: 10,
      description: 'C10 descending-duration ladder with prescribed aligned ending.',
      notes: 'Full-cycle windows inferred from the confirmed aligned ending length pattern.'
    })
  });

  window.ADI_TALA_EXERCISE_PATTERNS = Object.freeze({
    version: '2026-04-01',
    tala: Object.freeze({
      beats: 8,
      beatData: Object.freeze([
        Object.freeze({ index: 0, group: 'Laghu', gesture: 'Clap', type: 'samam' }),
        Object.freeze({ index: 1, group: 'Laghu', gesture: 'Little', type: 'normal' }),
        Object.freeze({ index: 2, group: 'Laghu', gesture: 'Ring', type: 'normal' }),
        Object.freeze({ index: 3, group: 'Laghu', gesture: 'Middle', type: 'normal' }),
        Object.freeze({ index: 4, group: 'Drutam', gesture: 'Clap', type: 'sub-accent' }),
        Object.freeze({ index: 5, group: 'Drutam', gesture: 'Wave', type: 'normal' }),
        Object.freeze({ index: 6, group: 'Drutam', gesture: 'Clap', type: 'sub-accent' }),
        Object.freeze({ index: 7, group: 'Drutam', gesture: 'Wave', type: 'normal' })
      ])
    }),
    phrasePatterns,
    uiPresets: Object.freeze({
      phraseScales: Object.freeze([8, 7, 6, 5]),
      phraseMultipliers: Object.freeze([1, 2, 3, 4]),
      crossValues: Object.freeze([3, 4, 5, 7])
    }),
    templates: Object.freeze({
      descending_duration_ladder: exerciseTemplate
    }),
    endingLibrary,
    exercisePatterns
  });
})();
