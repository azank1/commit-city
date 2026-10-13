// One at a time, first come first served, for a bounded wait. Module state, so per process: Fluid compute runs
// concurrent requests in one process, and this orders the ones that share an instance.
export class Turns {
  private busy = false;
  private queue: (() => void)[] = [];

  /** Resolves true when it is this caller's turn, or false once waitMs pass without one. */
  take(waitMs: number): Promise<boolean> {
    if (!this.busy) { this.busy = true; return Promise.resolve(true); }
    return new Promise(resolve => {
      const go = () => { clearTimeout(timer); resolve(true); };
      const timer = setTimeout(() => {
        const i = this.queue.indexOf(go);
        if (i >= 0) this.queue.splice(i, 1);
        resolve(false);
      }, waitMs);
      this.queue.push(go);
    });
  }

  /** Ends the current turn, handing it straight to the longest waiter if there is one. */
  done(): void {
    const next = this.queue.shift();
    if (next) next(); else this.busy = false;
  }

  get waiting(): number { return this.queue.length; }
}
