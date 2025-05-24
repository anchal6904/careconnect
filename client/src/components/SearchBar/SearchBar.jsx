import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { diseaseData } from '../../assets/diseaseData';
import './SearchBar.css';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDiseases, setFilteredDiseases] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const wrapperRef = useRef(null);
  const searchTimeout = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    handleClear();
  }, [location.pathname]);

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

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (!searchTerm.trim()) {
      setFilteredDiseases([]);
      setShowDropdown(false);
      return;
    }

    searchTimeout.current = setTimeout(() => {
      const term = searchTerm.toLowerCase();
      const filtered = diseaseData
        .filter(disease => {
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
        })
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 5);

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
    handleClear();
    // Close the navbar by dispatching a custom event
    const closeNavbarEvent = new CustomEvent('closeNavbar');
    document.dispatchEvent(closeNavbarEvent);
    navigate(`/diseases/${disease.slug}`);
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
            setTimeout(() => {
              setIsSearchFocused(false);
            }, 200);
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