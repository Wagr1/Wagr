import web3 from './web3';
import WagerFactory from './build/WagerFactory';

const instance = new web3.eth.Contract(
  JSON.parse(WagerFactory.interface),
  '0xB0Beaffc28c7DF23b36AEF6fC6Ce5C36dE6bEF82'
);

export default instance;
