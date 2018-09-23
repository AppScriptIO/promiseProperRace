// import assert from 'assert'
import path from 'path'
import { assert } from 'chai'
import configuration from '../setup/configuration'
import properRace from './entrypoint.js'

describe('function properRace: ', async function() {

    let p1 = new Promise(function(resolve) { // slowest
            setTimeout(function() { resolve('p1'); }, 30);
        }),
        p2 = new Promise(function(resolve) {
            setTimeout(function() { resolve('p2'); }, 20);
        }),
        p3 = new Promise(function(resolve, reject) { // fastest
            setTimeout(function() { reject('p3'); }, 10);
        }).catch(error => false /** prevent throwing */),        
        promiseArray = [p1, p2]
    
    describe('Native Promise.race behavior to throw if rejection encountered by any promise', function() {
        it('Throws on any rejection', async function() {
            let actual = await Promise.race(promiseArray.concat([p3]))
            assert.equal(actual, false)
        })
    })

    describe('Proper race will return the first promise that resolves, and ignore rejected promises (as different behaviour from native Promise.race)', function() {
        it('Should return resolved promise', async function() {
            let actual = await properRace(promiseArray)
            assert.equal(actual[0], 'p2')
        })
        it('Should ignore rejected promises', async function() {
            let actual = await properRace(promiseArray.concat([p3]))
            assert.equal(actual[0], 'p2')
        })
    })

})
