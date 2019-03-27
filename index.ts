import { of, fromEvent } from 'rxjs';
import { pipe, range, timer, zip } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { retryWhen, map, mergeMap, concatMap, switchMap, exhaustMap } from 'rxjs/operators';

const source = fromEvent(document, 'click');

const mergeMapContent = document.getElementById('content-mergeMap')

source.pipe(mergeMap(e => timer(1000))).subscribe(v => {
  const span = document.createElement('div');
  span.innerText = "observable done (mergeMap)";
  mergeMapContent.appendChild(span);
});

const concatMapContent = document.getElementById('content-concatMap')

source.pipe(concatMap(e => timer(1000))).subscribe(v => {
  const span = document.createElement('div');
  span.innerText = "observable done (concatMap)";
  concatMapContent.appendChild(span);
});

const switchMapContent = document.getElementById('content-switchMap')

source.pipe(switchMap(e => timer(1000))).subscribe(v => {
  const span = document.createElement('div');
  span.innerText = "observable done (switchMap)";
  switchMapContent.appendChild(span);
});

const exhaustMapContent = document.getElementById('content-exhaustMap')

source.pipe(exhaustMap(e => timer(1000))).subscribe(v => {
  const span = document.createElement('div');
  span.innerText = "observable done (exhaustMap)";
  exhaustMapContent.appendChild(span);
});



function backoff(maxTries, ms) {
  // Note the advantage of pipe, we can create a reuseable pipe
  return pipe(
    // retryWhen subscribes to the error of an observable
    // and trigger a retry on it after its inner observable emits
    // retryWhen get a stream of errors

    // zip emits a value containing the latest values from the two observables
    // passed to it, so it needs the two observables to emit in order to emit a value
    retryWhen(errors$ => 
      zip(range(1, maxTries), errors$)
      .pipe(
        map(([i]) => i * i),

        // mergeMap subscribes to the inner observable even if there is an already
        // subscribed observable
        mergeMap(i => timer(i * ms))
      )
    )
  );
}