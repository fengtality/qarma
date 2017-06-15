import React, { Component } from 'react';
import { Button } from '../Buttons';
import { Table } from '../Tables';
import { Search } from '../Search';
import { withLoading } from '../Loading';

import './index.css';
import {
  DEFAULT_QUERY,
  DEFAULT_PAGE,
  DEFAULT_HPP,
  PATH_BASE,
  PATH_SEARCH,
  PARAM_SEARCH,
  PARAM_PAGE,
  PARAM_HPP,
} from '../../constants';

const ButtonWithLoading = withLoading(Button);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      isLoading: false,
      sortKey: 'NONE',
      isSortReverse: false,
    };
    this.needsToSearchTopstories = this.needsToSearchTopstories.bind(this);
    this.setSearchTopstories = this.setSearchTopstories.bind(this); this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSort = this.onSort.bind(this);
  }
  needsToSearchTopstories(searchTerm) {
    return !this.state.results[searchTerm];
  }
  setSearchTopstories(result) {
    const { hits, page } = result;
    const { searchKey, results } = this.state;
    const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : [];
    const updatedHits = [
      ...oldHits,
      ...hits
    ];
    this.setState({ 
      results: {
        ...results,
        [searchKey]: {hits: updatedHits, page }
      },
      isLoading: false,
    });
  }
  fetchSearchTopstories(searchTerm, page) {
    this.setState({ isLoading: true });
    const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`;
    console.log(url);
    fetch(url)
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result))
      .catch((error) => {
        console.error(error);
      });
  }
  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState( { searchKey: searchTerm });
    this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
  }
  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }
  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState( { searchKey: searchTerm });
    if (this.needsToSearchTopstories(searchTerm)) {
      this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE)
    }
    event.preventDefault();
  }
  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];
    const isNotId = (item) => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);
    this.setState({ 
      // result: Object.assign({}, this.state.result, { hits: updatedHits })  // ES 5
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page } 
      }
    });
  }
  onSort(sortKey) {
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
  }

  render() {
    const { 
      searchTerm,
      results, 
      searchKey,
      isLoading,
      sortKey,
      isSortReverse,
    } = this.state;
    const page = ( 
      results && 
      results[searchKey] &&
      results[searchKey].page  
    ) || 0;
    const list = (
      results &&
      results[searchKey] &&
      results[searchKey].hits
    ) || [];

    return (
      <div className="page">
        <div className="interactions">
          <Search value={searchTerm}
                  onChange={this.onSearchChange}
                  onSubmit={this.onSearchSubmit}>
            Search
          </Search>
        </div>
        <Table  list={list}
                sortKey={sortKey}
                isSortReverse={isSortReverse} 
                onSort={this.onSort}
                onDismiss={this.onDismiss} />
        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => this.fetchSearchTopstories(searchKey, page + 1)}>
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }
}

export default App;