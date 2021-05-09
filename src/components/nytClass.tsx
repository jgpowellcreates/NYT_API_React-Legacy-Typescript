import React, { useState } from 'react';
//import NYTDisplay from './nytDisplayFunctional';
import {IArticle, DocsEntity, MultimediaEntity} from '../types/ArticleResponse';
import "./nytClass.css";

//Types Set for Search Terms
interface searchState {
    searchTerm: string,
    pageNumber: number,
    results?: DocsEntity[] | null | undefined,
    startDate?: string,
    endDate?: string,
}

//Class Component Start

export default class NYTClass extends React.Component <{}, searchState>{
    constructor(props : any) {
        super(props)
        this.state = {
            searchTerm: '',
            startDate: '',
            endDate: '',
            pageNumber: 0,
            results: [],
        }

    }

    changeHandler(event: React.ChangeEvent<HTMLInputElement>) {
        //console.log(event, event.target.name, event.target.value);
        switch (event.target.name) {
            case "searchTerm":
                this.setState({searchTerm: event.target.value})
                //console.log(this.state.searchTerm);
                break;
            case "startDate":
                this.setState({startDate: event.target.value})
                break;
            case "endDate":
                this.setState({endDate: event.target.value})
                break;
            default:
                return;
        }
    }

    changePage(event : React.MouseEvent<HTMLButtonElement>, direction : string) {
        //event.preventDefault()
        if (direction === 'down') {
            if (this.state.pageNumber > 0) {
                this.setState({pageNumber: this.state.pageNumber - 1}, this.fetchAPI);                
            }
        }
        if (direction === 'up') {
            this.setState({pageNumber: this.state.pageNumber + 1}, this.fetchAPI);
        }
    }

    baseURL: string = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    key : string = "A8Cl06sW0uRJQe4yMt69qpsIZ31GUrM3"; 

    fetchAPI() {
        let url = `${this.baseURL}?api-key=${this.key}&page=${this.state.pageNumber}&q=${this.state.searchTerm}`;
        url = this.state.startDate ? url + `&begin_date=${this.state.startDate}` : url;
        url = this.state.endDate ? url + `&end_date=${this.state.endDate}` : url;
        console.log(url)

        fetch(url)
        .then(res => res.json())
        .then((data : IArticle) => {
            //if (data.response.docs) {
                this.setState({results: data.response.docs})
            //}
        })
    }

    searchResults() {
        this.setState({pageNumber: 0});
        console.log(this.state.pageNumber);
        this.fetchAPI()
    }

    render(){
        //console.log(this.state.results) //state isn't set yet. Need to revisit? or check results elsewhere independently?
        return(
            <>
                <h4>Search the New York Times</h4>
                <form>
                    <label htmlFor="searchTerm" >Enter a Search Term:</label> <br />
                    <input type="text" value={this.state.searchTerm} placeholder="Search Me!" name="searchTerm"
                         onChange={(e:React.ChangeEvent<HTMLInputElement>) => this.changeHandler(e)} />
                    <br />
                    <label htmlFor="startDate">Start Date</label>
                    <br />
                    <input type="date" value={this.state.startDate} name="startDate"
                        onChange={(e:React.ChangeEvent<HTMLInputElement>) => this.changeHandler(e)}></input>
                    <br />
                    <label htmlFor="endDate">End Date</label>
                    <br />
                    <input type="date" value={this.state.endDate} name="endDate"
                        onChange={(e:React.ChangeEvent<HTMLInputElement>) => this.changeHandler(e)}></input>
                    <br />
                </form>
                <button id="submitBtn" onClick={() => this.searchResults()}>Find Results</button>
                <br />
                    {this.state.pageNumber !== 0 
                        ? <button className="pageBtn"
                            onClick={(e:React.MouseEvent<HTMLButtonElement>) => this.changePage(e,'down')}>Previous 10</button>
                        : <></>}
                    {/* <span>{this.state.pageNumber}</span> */}
                    {this.state.results?.length !== undefined && this.state.results.length >= 10
                        ? <button className="pageBtn"
                            onClick={(e:React.MouseEvent<HTMLButtonElement>) => this.changePage(e,'up')}>Next 10</button>
                        : <></>}
                <NYTDisplay results={this.state.results} />
            </>
        )
    }
}

interface ResultsProps {
    results: DocsEntity[] | null | undefined
}

const NYTDisplay = (props : ResultsProps) => {
    let {results} = props;

    console.log(results, /* results.headline.main */)

    return(
        <div id="resultsContainer">
            
            {results ? results?.map((result: DocsEntity | null | undefined) => {
                return(
                    <div className="articleCard" key={result?._id}>
                        <h3>{result?.headline.main}</h3>
                        {/* {result?.multimedia !== undefined || null
                        ? <img alt="article" src={`http://www.nytimes.com/${result!.multimedia[1]!.url}`} />
                        : ''} */}
                        <p>
                            {result?.snippet}
                            <br />
                            {result?.keywords !== undefined ? ' Keywords: ' : ''}
                        </p>
                        <p>
                            {result?.keywords !== undefined || null
                            ? result?.keywords?.map(keyword => <span className="articleKeyword" key={keyword?.value}>{keyword?.value}</span>)
                            : <></>}
                        </p>
                        <a href={result?.web_url}><button>Read the Full Article</button></a>
                    </div>
                )
            }) : <></> }
        </div>
    )
}
