import reorder from 'flagged-respawn/lib/reorder';
import v8flags from 'v8flags';
import spawn from 'cross-spawn';

function runMocha (executablePath, args = []) {
  return spawn.sync(executablePath, reorder(v8flags, args), {stdio: 'inherit'});
}

export default runMocha;
