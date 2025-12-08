import React from 'react';

const FilterForm = ({ searchPerson, handleSearchChange }) => {
  return (
    <div>
      filter shown with 
      <input 
        id="searchInput"
        type="text"
        value={searchPerson}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default FilterForm;