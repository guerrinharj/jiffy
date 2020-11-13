import React from 'react'
import Loader from "../src/images/loader.svg"
import ClearButton from "../src/images/close-icon.svg"

//Aqui sera o nosso componente Header, ele sera passado em App, por ele passara a função clearSearch e a variavel hasResults
class Header extends React.Component {
  render () {
      const {clearSearch, hasResults} = this.props
    return (
      <div className="user-hint">
        {/* Passamos um if statement onde  se tivermos hasResults maior que 0, aparece clearButton  */}
        {hasResults > 0 ? <button><img src={ClearButton} onClick={clearSearch}/></button> : <h1 className="title" onClick={clearSearch}>Jiffy</h1>  }  
      </div>
    ) 
  }
}


  //Aqui criamos um class component Gif que sera passado no componente App
  class Gif extends React.Component {
    constructor (props) {
      super (props)
    this.state = {
      loaded: false
    }
  }

    render () {
      const {images} = this.props
      const {loaded} = this.state
      return (
        <video className={`grid-item video ${loaded && 'loaded'}`} autoPlay loop onLoadedData={() => this.setState({loaded: true})} src={images.original.mp4}/>
      )
    }
  }


  //Aqui criamos nosso componente UserHint com as props loading e hintTerm, como ele esta entre render e return, ele pode ser passado como variavel com props no componente App
  class UserHint extends React.Component {
    render () {
        const {loading, hintTerm} = this.props
      return (
        <div className="user-hint">
      {loading ? <img className="block mx-auto" src={Loader}/> : hintTerm}   
        </div>
      ) 
    }
  }



  //Aqui passamos uma função que nos retornara um numero randomico
   const randomChoice = arr => {
      const randIndex = Math.floor(Math.random() * arr.length)
      return arr[randIndex]
    }



    
//Aqui criamos nosso class-component principal App
class App extends React.Component  {
  constructor (props) {
    super (props)
    //Aqui setamos o valor inicial dos nossos states, que serão nada (serão alterados via setState)
    this.state = {
      loading: false,
      searchTerm: '',
      hintTerm: '',
      gifs: []
      }
  }


  //Aqui criamos nossa função para quando o usuario passar de dois caracteres, aparecer o nome de sua pesquisa. Como estamos dentro de um class component, não usamos const, porque iremos fazer ela via this
  handleChange = event => {
    //Podemos tambem usar const {value} = event.target
    const {value} = event.target
    //Aqui mudamos o statede searchTerm e trocamos o valor de searchTerm a partir o valor de value
    this.setState(() => ({
      searchTerm: value,
      //Aqui passamos um operador ternario, se o tamanho do valor for maior que dois, mudara hintTerm
      hintTerm: value.length > 2 ? `Hit enter to search ${value}` : ``
      }))    
  }


  //Aqui criamos uma função para quando o usuario clicar Enter 
  handleKeyPress = event => {
    const value = event.target.value
    if (value.length > 2 && event.key === 'Enter') {
      //Aqui rodamos nossa função searchGiphy em this (nesse caso o class-component Search)
      this.searchGiphy(value)
    }
  } 

  clearSearch = () => {
    this.setState(() => ({
      searchTerm: '',
      hintTerm: '',
      gifs: []
      }))    
      //Aqui mandamos o cursor de volta para o input, criamos uma ref para esse input
      this.textInput.focus()
  }
  

  //Aqui aplicamos uma função async para acessar API de Giphy, como estamos dentro de um classcomponent, não usamos const/let/var 
   searchGiphy = async searchTerm => {
     //Aqui setamos o state de loading para ser true (ou seja, quando a função rodar, o loader vai ter um valor true e vai aparecer)
     this.setState ({
       loading: true
     })
    //Try funciona como uma espécie de if, ou seja, se data provinda da APIocorrer no nosso backend, nós aplicaremos uma mudança
    try { 
      //Pegamos da API a partir do codigo, como estamos em async, usamos await. Colocamos o state SearchTerm para alterarmos na API a procura
      const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=KOcf7fkg8MldVEFMCwwEz20h2K9ujNvc&q=${searchTerm}&limit=25&offset=0&rating=pg-13&lang=en`)
      //Convertemos o object response para json, tambem usamos await
      const responseJson = await response.json()
      //Aqui pegamos a data dentro do object response
      const data = responseJson.data


      //Aqui testamos se algo não encontrar em data, o throw joga para catch 
      if (!data.length) {
        throw `Nothing found for ${searchTerm}`
      }



      //Aqui passamos a variavel data por um numero randomico
      const randomGif = randomChoice(data)

      //mudamos o state de gif e gifs (utilizamos do prevState com spread operator para nos utilizarmos do antigo state que estavamos)
      this.setState (prevState => ({
        ...prevState,
        loading: false,
        gifs: [...prevState.gifs, randomGif],
        hintTerm: `Hit enter to search more ${searchTerm}`
      }))
     }

    //Catch funciona como o else, ou seja, se algo der errado no backend aplicamos uma função
     catch {
      this.setState (prevState => ({
        loading: false,
        hintTerm: `Nothing found for ${searchTerm}`
      })) 
     }
  }



//renderizamos todo o class component para que possa ser incluido no JSX
render() {

  //Criamos uma variavel para os states de gif
  const gifs = this.state.gifs
  //Criamos uma variavel para saber a quantidade de gifs
  const hasResults = gifs.length

  return (
    <div className="page">
      {/* Para passarmos uma função em um componente, precisamos passar dessa forma*/}
    <Header clearSearch={this.clearSearch} hasResults={hasResults}/>
    <div className="container">
        <div className="search grid"> 
          {gifs.map(GifComponentProps => <Gif {...GifComponentProps}/>)} 
          <div>
            <input className="input grid-item" placeholder="Type something" onChange={this.handleChange} onKeyPress={this.handleKeyPress} ref={input => {this.textInput = input}}/>
          </div>
        </div>
        <UserHint {...this.state}/>
    </div>
    </div>
      )
    } 
  }


  
  
//Aqui iremos exportar para index.js
export default App;
