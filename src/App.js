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

class App extends Component {

    constructor()
    {
        super()

        this.state = {}
        let parsedHash = QueryString.parse(window.location.hash)
        this.state=this.getParams(parsedHash)
        this.state.unavailableLinks = []
        this.state.availableLink = []
        this.state.runOut=false
        this.state.found=false
    }

    componentWillMount=()=>
    {
        this.iterate(0)
    }

    iterate=(index)=>
    {
        if(index>=gateways.length)
        {
            this.setState(
            {
                runOut:true 
            })
            return
        }
        let found = false

        console.log(index)
        let gateway = gateways[index]
        let gatewayAndHash = gateway.replace(':hash', this.state.hash)
        console.log("Checking: "+ gatewayAndHash)
        fetch(gatewayAndHash)
            .then(res => res.text())
            .then((text) => {
                console.log(this.state.textToFind, text.indexOf(this.state.textToFind) !== -1)
                let matched = (text.trim().indexOf(this.state.textToFind.trim()) !== -1) //This is not perfect. Just wants to be an extra check against 404 page
                console.log(matched)
                if(matched)
                {
                    this.setState({
                        availableLink:gatewayAndHash,
                        found:true
                    })
                }
                else
                {
                    this.iterate(index+1) 
                }
        
            }).catch((err) => {
                this.addCensoredLink(gatewayAndHash) 
                this.iterate(index+1)      
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
            newState.hash = "ipns/QmZxWEBJBVkGDGaKdYPQUXX4KC5TCWbvuR4iYZrTML8XCR/"

        if(params.titleText)
            newState.titleText= params.titleText
        else
            newState.titleText = "Accés a la web del Referèndum 2017"

        if(params.textToFind)
            newState.textToFind= params.textToFind
        else
            newState.textToFind = "Referèndum"

        if(params.unavailableText)
            newState.unavailableText= params.unavailableText
        else
            newState.unavailableText = "No disponible"

        if(params.availableText)
            newState.availableText= params.availableText
        else
            newState.availableText = "Accés disponible!"

        if(params.searchText)
            newState.searchText= params.searchText
        else
            newState.searchText = "Buscan accessos no censorats"


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

    getStatus=()=>
    {

        if(this.state.found)
            return (<Subheader inset={false}>{this.state.availableText}</Subheader>)
        else if (this.state.runOut)
            return (<Subheader inset={false}>{"Nothing found"}</Subheader>)
        else
            return(<Subheader inset={false}>{this.state.searchText}</Subheader>)
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

                    {this.getStatus()}
                    
                    {availableLink}

                    {this.getUnavailable()}

                </div>
                </MuiThemeProvider>
            </div>
        )
      }
    }

export default App
