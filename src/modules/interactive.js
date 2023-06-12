const clearCompletedItems = (myTasks) => {
  myTasks = JSON.parse(localStorage.getItem('myTasks')) || [];
  myTasks = myTasks.filter((task) => !task.completed);
  for (let i = 0; i < myTasks.length; i += 1) {
    myTasks[i].index = i + 1;
  }

  localStorage.setItem('myTasks', JSON.stringify(myTasks));

  window.location.reload();
};

const handleCheckboxClick = (event, _container, _myTasks, updateCompleted, storeItems) => {
  const isChecked = event.target.checked;
  const listItem = event.target.closest('.list');
  const index = Array.from(listItem.parentNode.children).indexOf(listItem);
  updateCompleted(index, isChecked);
  storeItems();
};

export { clearCompletedItems, handleCheckboxClick };