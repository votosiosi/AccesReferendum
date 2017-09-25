import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {List, ListItem} from 'material-ui/List'
import CensoredIcon from 'material-ui/svg-icons/av/not-interested'
import AvailableIcon from 'material-ui/svg-icons/navigation/check'
import Subheader from 'material-ui/Subheader'


const gateways = [
    'https://ipfs.io/:hash',
    'https://gateway.ipfs.io/:hash',
    'https://ipfs.infura.io/:hash',
    'http://rx14.co.uk/:hash',
    'https://xmine128.tk/:hash',
    'https://upload.global/:hash',
    'https://ipfs.jes.xxx/:hash',
    'https://example.com/:hash',
    'https://catalunya.network/:hash',
    'https://siderus.io/:hash',
    'https://eternum.io/:hash',
    'https://hardbin.com/:hash'
]
const total = gateways.length
const referendumHash = 'ipns/QmZxWEBJBVkGDGaKdYPQUXX4KC5TCWbvuR4iYZrTML8XCR'
const hashToTest = 'Qmaisz6NMhDB51cCvNWa1GMS7LU1pAxdF4Ld6Ft9kZEP2a'
const hashString = 'Hello from IPFS Gateway Checker'
class App extends Component {

    constructor()
    {
        super()

        this.state={
            censoredLinks:[],
            availableLink:" "
        }
        let checked = 0
        let found = false
        gateways.forEach((gateway) => {
            const gatewayAndHash = gateway.replace(':hash', referendumHash)
            fetch(gatewayAndHash)
                .then(res => res.text())
                .then((text) => {
                    if(found)
                        return
                    
                    console.warn(text.trim(), hashString.trim())

                    const matched = text.trim() === hashString.trim()

                    console.log(text.trim(), hashString.trim())
                    this.setState({
                        availableLink:gatewayAndHash
                    })
                   found = true

                }).catch((err) => {

                    console.warn(err)
                    this.addCensoredLink(gatewayAndHash)

                   
                })
        })
    }

    addCensoredLink=(url,censored=true)=>
    {
        let censoredLinks = this.state.censoredLinks
        censoredLinks.push(this.getCensoredItem(url,censored))
        this.setState({
            censoredLinks:censoredLinks
        })
    }

    setAvailableLink(url)
    {
        this.setState({
            censoredLinks:url
        })
    }

    getAvailableItem(url)
    {
        function onClick()
        {
            window.location.href = url
        }

        return(<h2 onClick = {onClick}> {url} </h2>)
    }

    getCensoredItem=(url, censored)=>
    {
        let secondaryText = ""

        if(censored)
            secondaryText = "Censored"

        function onClick()
        {
            window.location.href = url
        }

        return(
            <ListItem
                rightIcon={<CensoredIcon />}
                primaryText={url}
                secondaryText={secondaryText}
                onClick = {onClick}
                key={url}
                />)    
        
    }


      render() {

        let availableLink =  this.getAvailableItem(this.state.availableLink)

        return (

            <div>
                <MuiThemeProvider>
                <div>
                    <List>
                        <Subheader inset={true}>Censored links</Subheader>
                       {this.state.censoredLinks}
                    </List>
        
                    {availableLink}
                </div>
                </MuiThemeProvider>
            </div>
        )
      }
    }

export default App
