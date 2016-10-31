import Watchpack from 'watchpack';

const watchpackOpts = {
  aggregateTimeout: 500,
  poll: false,
  ignored: /node_modules/
};

function mowatch(opts, args) {
  const wp = new Watchpack(defaults(opts, watchpackOpts));
}
