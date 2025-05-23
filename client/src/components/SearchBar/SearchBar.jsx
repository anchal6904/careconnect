import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { diseaseData } from '../../data/diseaseData';
import './SearchBar.css';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDiseases, setFilteredDiseases] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const wrapperRef = useRef(null);
  const searchTimeout = useRef(null);

  // Handle click outside to close dropdown only if search is not focused
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        if (!isSearchFocused) {
          setShowDropdown(false);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchFocused]);

  // Handle hover events
  const handleMouseEnter = () => {
    if (searchTerm.trim().length > 0) {
      setShowDropdown(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isSearchFocused) {
      setShowDropdown(false);
    }
  };

  // Filter diseases based on search term
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      const term = searchTerm.toLowerCase().trim();
      
      if (term.length === 0) {
        setFilteredDiseases([]);
        if (!isSearchFocused) setShowDropdown(false);
        return;
      }

      const filtered = diseaseData.filter(disease => {
        const nameMatch = disease.name.toLowerCase().includes(term);
        const synonymMatch = disease.synonyms.some(synonym => 
          synonym.toLowerCase().includes(term)
        );
        
        const exactNameMatch = disease.name.toLowerCase() === term;
        const exactSynonymMatch = disease.synonyms.some(synonym => 
          synonym.toLowerCase() === term
        );
        
        disease.matchScore = exactNameMatch ? 3 : exactSynonymMatch ? 2 : (nameMatch || synonymMatch) ? 1 : 0;
        
        return nameMatch || synonymMatch;
      }).sort((a, b) => b.matchScore - a.matchScore);

      setFilteredDiseases(filtered);
      if (filtered.length > 0) setShowDropdown(true);
    }, 150);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchTerm]);

  const handleSelect = (disease) => {
    setSearchTerm(disease.name);
    setShowDropdown(false);
    setIsSearchFocused(false);
    
    // Create a URL-friendly slug from the disease name
    const slug = disease.name.toLowerCase().replace(/\s+/g, '-');
    // Navigate to the disease page using history API
    window.history.pushState({}, '', `/diseases/${slug}`);
    // Dispatch a custom event to notify the app of navigation
    window.dispatchEvent(new CustomEvent('navigationChange', { 
      detail: { path: `/diseases/${slug}`, disease } 
    }));
  };

  const handleClear = () => {
    setSearchTerm('');
    setFilteredDiseases([]);
    setShowDropdown(false);
    setIsSearchFocused(false);
  };

  return (
    <div 
      className="search-container" 
      ref={wrapperRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`search-input-wrapper ${isSearchFocused ? 'focused' : ''}`}>
        <FaSearch className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search diseases..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            setIsSearchFocused(true);
            if (searchTerm.trim().length > 0) {
              setShowDropdown(true);
            }
          }}
          onBlur={() => {
            setIsSearchFocused(false);
          }}
        />
        {searchTerm && (
          <button
            className="clear-button"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <IoMdClose />
          </button>
        )}
      </div>
      
      {showDropdown && filteredDiseases.length > 0 && (
        <div className={`search-dropdown ${isSearchFocused ? 'focused' : ''}`}>
          {filteredDiseases.map((disease) => (
            <div
              key={disease.id}
              className="dropdown-item"
              onClick={() => handleSelect(disease)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSelect(disease);
                }
              }}
            >
              <div className="disease-name">
                <FaSearch className="mini-search-icon" />
                {disease.name}
              </div>
              <div className="disease-description">{disease.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar; 