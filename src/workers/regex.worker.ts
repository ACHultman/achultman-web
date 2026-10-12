/// <reference lib="webworker" />
import { evaluateRegex, type RegexInput } from '../lib/tools/regex';

// A dedicated worker receives messages only through its creator's private port.
// Unlike window.postMessage, these events have no sender origin to validate.
const worker = self as unknown as DedicatedWorkerGlobalScope;
worker.onmessage = (event: MessageEvent<RegexInput>) => {
    worker.postMessage(evaluateRegex(event.data));
};
