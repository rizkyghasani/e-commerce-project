const SearchBar = () => {
    return (
      <form className="flex-grow flex items-center justify-center mx-4">
        <input
          type="text"
          placeholder="Search Amazon"
          className="w-full max-w-xl p-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <button className="bg-yellow-400 p-2 rounded-r-md hover:bg-yellow-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>
    );
  };
  
  export default SearchBar;