import React, { Component } from 'react';
import './App.css';
import ReactTable from 'react-table';

class Table extends Component {

    render() {
      const columns = [{
        header: 'Name File',
        accessor: 'timestamp', // String-based value accessors!
        filterMethod: (filter, row) => (row[filter.id].includes(filter.value))
      }, {
        header: 'text',
        accessor: 'text',// Custom cell components!
        filterMethod: (filter, row) => (row[filter.id].includes(filter.value))
      },{
        header: 'likelihood',
        accessor: 'likelihood',
        filterMethod: (filter, row) => {
        console.log({filter, row});
        if("all" === filter.value.operation){
         return true;
         }
         if(row[filter.id] === "Empty text"){
           return false;
         }
         if("<=" === filter.value.operation){
           return row[filter.id] <= filter.value.value;
         }
         if(">" === filter.value.operation){
           return row[filter.id] > filter.value.value;
         }

         if(">=" === filter.value.operation){
           return row[filter.id] >= filter.value.value;
         }
         if("=" === filter.value.operation){
           return row[filter.id] === filter.value.value;
         }
         if("<" === filter.value.operation){
           return row[filter.id] < filter.value.value;
         }
  },
  filterRender: ({filter, onFilterChange}) =>{
    return (
    <div>
    <select
      onChange={
        event => {
          var value = event.target.value;
          onFilterChange({operation: value, value: (filter ? filter.value.value : 0) })
        }
      }
      value={filter ? filter.value.operation : 'all'}>
      <option value="all">All</option>
      <option value="=">=</option>
      <option value=">">&gt;</option>
      <option value="<=">&lt;=</option>


      <option value="<">&lt;</option>
      <option value=">=">&gt;=</option>
    </select>
    <input
      onChange={
        event => {
          var value = event.target.value;
          onFilterChange({operation: (filter ? filter.value.operation : 'all'), value: value})
        }
      }
      value={filter ? filter.value.value : 0}/>
    </div>
  )}
  }]
      return (
        <ReactTable
         showFilters={true}
          data={this.props.files}
          columns={columns}
          showPagination={true}
          showPageSizeOptions={false}
          defaultPageSize={13}
          getTdProps={(state, rowInfo, column, instance) => {
            return {
              onClick: e => {this.props.onRowClick(rowInfo.row.timestamp);}
            }
          }
        }
        />
      )
    }
  }
export default Table;
