import { evaluateRegex, type RegexInput } from '../lib/tools/regex';

self.onmessage = (event: MessageEvent<RegexInput>) => {
    self.postMessage(evaluateRegex(event.data));
};
