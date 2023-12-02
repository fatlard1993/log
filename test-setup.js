import { mock } from 'bun:test';

// expose mock
// - wasn't available otherwise and importing in the test files that need mocks breaks the rest of the file
global.mock = mock;
