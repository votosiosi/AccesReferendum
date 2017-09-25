import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {List, ListItem} from 'material-ui/List'
import CensoredIcon from 'material-ui/svg-icons/av/not-interested'
import AvailableIcon from 'material-ui/svg-icons/navigation/check'
import Subheader from 'material-ui/Subheader'
import QueryString from 'query-string'

const gateways = [
    'https://gateway.ipfs.io/:hash',
    'https://catalunya.network/:hash',
    'https://ipfs.jes.xxx/:hash',
    'https://ipfs.io/:hash',
    'https://hardbin.com/:hash',
    'https://siderus.io/:hash',
    //'https://eternum.io/:hash', //Cors policy doesn't allow to check. It probably works
    'https://gateway.ipfs.io/:hash',
    'https://ipfs.infura.io/:hash',
]

const titleText = "Referèndum 2017"
const descriptionText = ""
const unavailableText = "unavailable"

const availableText = "Accessible"
const total = gateways.length
const hashToTest = 'Qmaisz6NMhDB51cCvNWa1GMS7LU1pAxdF4Ld6Ft9kZEP2a'
const textToFind = '</script><title>Inici - Referèndum 2017</title>'
class App extends Component {

    constructor()
    {
        super()

        this.state = {}
        let parsedHash = QueryString.parse(window.location.hash)
        this.state=this.getParams(parsedHash)
        this.state.unavailableLinks = []
        this.state.availableLink = []
        /*this.state={
            unavailableLinks:[],
            availableLink:" ",
            hash: "ipfs/Qmaisz6NMhDB51cCvNWa1GMS7LU1pAxdF4Ld6Ft9kZEP2a/",
            titleText : "I just return a public ipfs gateway",
            descriptionText : "",
            unavailableText : "Unavailable",
            availableText : "Available",
            textToFind:"Hello from IPFS Gateway Checker"
        }*/

       // let parsedHash = QueryString.parse(window.location.hash)

        //this.getParams(parsedHash)
        
    }

    componentWillMount=()=>
    {
        
        this.iterate()
    }

    iterate=()=>
    {
        let found = false
        gateways.forEach((gateway) => {
            let gatewayAndHash = gateway.replace(':hash', this.state.hash)
            fetch(gatewayAndHash)
                .then(res => res.text())
                .then((text) => {
                    if(found)
                        return

                    let matched = (text.indexOf(textToFind) !== -1) //This is not perfect. Just wants to be an extra check against 404 page
                    this.setState({
                        availableLink:gatewayAndHash
                    })
                   found = true

                }).catch((err) => {
                    this.addCensoredLink(gatewayAndHash)       
                })
        })
    }

    getParams=(params)=>
    {
        let page = QueryString.stringify(params)

        let newState = {}

        if(params.showUnavailable)
            newState.showUnavailable = params.showUnavailable
        else
            newState.showUnavailable = false

        if(params.hash)
            newState.hash= params.hash
        else
            newState.hash = "ipfs/Qmaisz6NMhDB51cCvNWa1GMS7LU1pAxdF4Ld6Ft9kZEP2a/"

        if(params.titleText)
            newState.titleText= params.titleText
        else
            newState.titleText = "I just return a public ipfs gateway"

        if(params.textToFind)
            newState.textToFind= params.textToFind
        else
            newState.textToFind = "</script><title>Inici - Referèndum 2017</title>"

        if(params.unavailableText)
            newState.unavailableText= params.unavailableText
        else
            newState.unavailableText = "Unavailable"

        if(params.availableText)
            newState.availableText= params.availableText
        else
            newState.availableText = "Available"

        return newState

    }

    addCensoredLink=(url, censored=true)=>
    {
        let unavailableLinks = this.state.unavailableLinks
        unavailableLinks.push(this.getCensoredItem(url,censored))
        this.setState({
            unavailableLinks:unavailableLinks
        })
    }

    getAvailableItem(url)
    {
        function onClick()
        {
            window.location.href = url
        }

        return(<h3
                    onClick = {onClick}
                    style = {{color:'#8BC34A', margin:15}}>
                    {url}
                </h3>
                )
    }

    getCensoredItem=(url, unavailable)=>
    {
        let secondaryText = ""

        function onClick()
        {
            window.location.href = url
        }

        return(
            <ListItem
                style = {{color:'light-grey'}}
                leftIcon={<CensoredIcon />}
                primaryText={url}
                secondaryText={this.state.unavailableText}
                onClick = {onClick}
                key={url}
                />)    
    }

    getUnavailable=()=>
    {
        let div = <div/>

        if(!this.state.showUnavailable)
            return div

        else return(
            <div>
                 <Subheader inset={false}>{this.state.unavailableText}</Subheader>

                 <List>
                    {this.state.unavailableLinks}
                 </List>
            </div>
        )
    }

      render() {

        let availableLink =  this.getAvailableItem(this.state.availableLink)
        return (

            <div>
                <MuiThemeProvider>
                <div style = {{margin:25}}>
                    <h2> {this.state.titleText} </h2>

                    <Subheader inset={false}>{this.state.availableText}</Subheader>
                    
                    {availableLink}


                    {this.getUnavailable()}
                    
        

                </div>
                </MuiThemeProvider>
            </div>
        )
      }
    }

export default App
