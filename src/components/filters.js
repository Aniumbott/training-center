import React from "react";
import { useState, useEffect } from "react";

// components
import data from "../../data/data.yaml";
import Select from "react-select";

// styles
import "../styles/filters.css";

// markup
const Filters = ({ setTuts }) => {
  // search query state
  const [query, setQuery] = useState({
    text: "",
    status: [],
    language: [],
    video: false,
    curiculum: {},
    level: [],
  });

  // Define the options displayed in the filter UI elements
  // ------------------------------------------------------

  // status filter options
  const statusFilter = [
    { label: "Stable", value: "stable", isDefault: true },
    { label: "Beta", value: "beta" },
    { label: "Alpha", value: "alpha" },
  ];

  // level filter options
  const levelFilter = [
    { label: "Beginner", value: "beginner", isDefault: true },
    { label: "Advanced", value: "advanced", isDefault: true },
  ];
  // language filter options
  // We set the language fields to lowercase to avoid duplicates
  data.forEach((tut) => {
    if (tut.language) {
      tut.language.forEach((lang) => lang.toLowerCase());
    }
  });
  const allLanguages = data.reduce((acc, tut) => acc.concat(tut.language), []);
  let uniqueLanguages = allLanguages
    .filter(
      (lang, index, array) =>
        lang && array.findIndex((uLang) => uLang === lang) === index,
    )
    .map((lang) => ({
      label: lang.charAt(0).toUpperCase() + lang.slice(1),
      value: lang,
    }));
  const languageFilter = uniqueLanguages;

  // Given a query, filter the tutorials and update the state
  // --------------------------------------------------------
  useEffect(() => {
    let filteredTuts = data;

    if (query.text !== "") {
      filteredTuts = filteredTuts.filter((tut) => {
        return (
          tut.name.toLowerCase().includes(query.text.toLowerCase()) ||
          tut.description.toLowerCase().includes(query.text.toLowerCase())
        );
      });
    }

    if (query.status.length !== 0) {
      filteredTuts = filteredTuts.filter((tut) => {
        return query.status.includes(tut.status);
      });
    }

    if (query.language.length !== 0) {
      let just = [];
      filteredTuts.forEach((tut) => {
        query.language.forEach((qLang) => {
          if (tut.language && tut.language.includes(qLang)) {
            return just.push(tut);
          }
        });
      });
      filteredTuts = just;
    }

    if (query.video !== false) {
      filteredTuts = filteredTuts.filter((tut) => {
        return tut.videos !== "";
      });
    }

    if (query.curiculum.name !== undefined) {
      let just = [];
      filteredTuts.forEach((tut) => {
        query.curiculum.tuts.forEach((idtut) => {
          if (idtut.id === tut.id) {
            return just.push(tut);
          }
        });
      });
      filteredTuts = just;
    }

    if (query.level.length !== 0) {
      let just = [];
      filteredTuts.forEach((tut) => {
        query.level.forEach((qlevel) => {
          if (tut.level === undefined || tut.level.includes(qlevel)) {
            return just.push(tut);
          }
        });
      });
      filteredTuts = just;
    }

    setTuts(filteredTuts);
  }, [query, setTuts]);

  // Return HTML control elements
  // ----------------------------

  return (
    <div className="filters">
      <div className="container">
        {/* global-input */}
        <div className="text-input" title="Search Anything">
          <input
            type="text"
            placeholder="Search Anything..."
            onChange={(e) => {
              setQuery({ ...query, text: e.target.value });
            }}
          />
        </div>
      </div>
      <div className="container">
        <div className="container">
          {/* level-input */}
          <div className="level-input" title="Level">
            <Select
              className="select"
              closeMenuOnSelect={false}
              isMulti
              options={levelFilter}
              isClearable={true}
              placeholder="Level..."
              defaultValue={levelFilter.filter((option) => option.isDefault)}
              onChange={(e) => {
                setQuery({ ...query, level: e.map((e) => e.value) });
              }}
            />
          </div>

          {/* status-input */}
          <div className="status-input" title="Status">
            <Select
              className="select"
              closeMenuOnSelect={false}
              isMulti
              options={statusFilter}
              isClearable={true}
              placeholder="Status..."
              defaultValue={statusFilter.find((option) => option.isDefault)}
              onChange={(e) => {
                setQuery({ ...query, status: e.map((e) => e.value) });
              }}
            />
          </div>

          {/* language-input */}
          <div className="language-input" title="Language">
            <Select
              className="select"
              closeMenuOnSelect={false}
              isMulti
              options={languageFilter}
              isClearable={true}
              placeholder="Language..."
              onChange={(e) => {
                setQuery({ ...query, language: e.map((e) => e.value) });
              }}
            />
          </div>
        </div>

        {/* videos-input */}
        <div className="videos-input" title="Videos">
          <label htmlFor="videos">Videos</label>
          <input
            type="checkbox"
            id="videos"
            onChange={(e) => {
              if (e.target.checked) {
                setQuery({ ...query, video: true });
              } else {
                setQuery({ ...query, video: false });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Filters;
