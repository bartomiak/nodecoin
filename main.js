const SHA256 = require('crypto-js/sha256')

class Block {
    constructor(index, data, previousHash = '') {
        this.index = index;
        this.timestamp = new Date();
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.genesisBlock()];
    }

    genesisBlock() {
        return new Block(0, 'genesis', '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i]
            const previousBlock = this.chain[i - 1]

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }

        }

        return true;
    }
}

let nodecoin = new Blockchain()
nodecoin.addBlock(new Block(0, { amount: 5 }))
nodecoin.addBlock(new Block(1, { amount: 55 }))

console.log(nodecoin)
console.log(`Is valid?`, nodecoin.isChainValid())

nodecoin.chain[1].data = { amount: 6 }
console.log(`Is valid?`, nodecoin.isChainValid())

nodecoin.chain[1].data = { amount: 50 }
console.log(`Is valid?`, nodecoin.isChainValid())