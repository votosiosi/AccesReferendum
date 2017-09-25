import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


const gateways = [
    'https://ipfs.io/ipfs/:hash',
    'https://gateway.ipfs.io/ipfs/:hash',
    'https://ipfs.infura.io/ipfs/:hash',
    'http://rx14.co.uk/ipfs/:hash',
    'https://xmine128.tk/ipfs/:hash',
    'https://upload.global/ipfs/:hash',
    'https://ipfs.jes.xxx/ipfs/:hash',
    'https://example.com/ipfs/:hash',
    'https://catalunya.network/ipfs/:hash',
    'https://siderus.io/ipfs/:hash',
    'https://eternum.io/ipfs/:hash',
    'https://hardbin.com/ipfs/:hash'
]
const total = gateways.length
const referendumHash = 'ipns/QmZxWEBJBVkGDGaKdYPQUXX4KC5TCWbvuR4iYZrTML8XCR'
const hashToTest = 'Qmaisz6NMhDB51cCvNWa1GMS7LU1pAxdF4Ld6Ft9kZEP2a'
const hashString = 'Hello from IPFS Gateway Checker'
class App extends Component {

    constructor()
    {
        super()
        let checked = 0
        gateways.forEach((gateway) => {
            const gatewayAndHash = gateway.replace(':hash', hashToTest)
            fetch(gatewayAndHash)
                .then(res => res.text())
                .then((text) => {
                    const matched = text.trim() === hashString.trim()
                    this.addNode(gatewayAndHash, matched, matched ? 'All good' : 'Output did not match expected output')
                    checked++
                    this.updateStats(total, checked)
                }).catch((err) => {
                    window.err = err
                    this.addNode(gatewayAndHash, false, err)
                    checked++
                    this.updateStats(total, checked)
                })
        })
    }

    addNode = (gateway, online, title)=> {
        const para = document.createElement('div')
        let node
        if (online) {
            node = document.createElement('strong')
            node.innerText = '✅ - Online - ' + gateway
        } else {
            node = document.createElement('div')
            node.innerText = '❌ - Offline -  ' + gateway
        }
        node.setAttribute('title', title)
        para.appendChild(node)
        document.body.appendChild(para)
    }

    updateStats = (total, checked)=> {
        document.getElementById('stats').innerText = checked + '/' + total + ' gateways checked'
    }

      render() {
        return (
          <div className="App">
            <div className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h2>Welcome to React</h2>
            </div>
            <p className="App-intro">
              To get started, edit <code>src/App.js</code> and save to reload.
            </p>
          </div>
        );
      }
    }

export default App;
