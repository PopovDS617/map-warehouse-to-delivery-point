import React from 'react';

const ListItem = (props) => {
  return (
    <div className="flex border-2 text-l border-blue-600 rounded-xl p-5 font-sans font-bold cursor-pointer   hover:translate-x-6   hover:shadow-2xl transition-all duration-100">
      <p>{props.name}</p>
    </div>
  );
};

export default ListItem;
