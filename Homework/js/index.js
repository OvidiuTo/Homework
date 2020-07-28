let todoItems = [];

/* da render la itemele de pe pagina */
function renderTodo(todo) {
	localStorage.setItem('todoItemsRef', JSON.stringify(todoItems));
	const list = document.querySelector('.js-todo-list');
	const item = document.querySelector(`[data-key='${todo.id}']`);
	
	/* verifica daca e sters item-ul */
	 if (todo.deleted) {
    item.remove();
	if(todoItems.length === 0) list.innerHTML = '';
    return
  }
	
	const isChecked = todo.checked ? "done": '';
	const node = document.createElement('li');               // node creaza o linie pt lista
	node.setAttribute('class',`todo-item ${isChecked}`);     // pt node se seteaza atributul "class"="todo-item + true/false (daca e bifat sau nu)
	node.setAttribute('data-key',todo.id);                   // pt node se seteaza atributul "data-key" si primeste id-ul item-ului
	// design-ul pt fiecare linie (daca nu gresesc) 
	node.innerHTML = `                                       
	<input id="${todo.id}" type="checkbox"/>
	<label for="${todo.id}" class="tick js-tick"></label>
	<span>${todo.text}</span>
	<button class="delete-todo js-delete-todo">
	<svg><use href="#delete-icon"></use></svg>
	</button>
	`;
	
	if(item) {   
		list.replaceChild(node, item);
	}
	else {
		list.append(node);
	}
}

// add a todo item function 
function addTodo(text) {
  const todo = {
    text,                // text-ul in sine
    checked: false,      // daca e checked sau nu
    id: Date.now(),      // id-ul item-ului
  };

  todoItems.push(todo); // "impinge" item-ul in array todoItems
  renderTodo(todo);
}
// functia e bifat(check) 
function toggleDone(key){
	
	const index = todoItems.findIndex(item => item.id === Number(key));
	todoItems[index].checked = !todoItems[index].checked;
	renderTodo(todoItems[index]);
}

// functia de sters iteme din array
function deleteTodo(key) {
  const index = todoItems.findIndex(item => item.id === Number(key));
  const todo = {
    deleted: true,
    ...todoItems[index]
  };
  todoItems = todoItems.filter(item => item.id !== Number(key));
  renderTodo(todo);
}

/* previne pagina din a da reload cand dai enter(input) la un item 
   (o face pentru un motiv anume :-?                               */
const form = document.querySelector('.jsForm');         // selecteaza "casuta" unde introduci 
form.addEventListener('submit', event => {             //adagua event-ul de submit(press enter)
  event.preventDefault();
  const input = document.querySelector('.jsFormInput');  //input ia valori din ce dam input 

  const text = input.value.trim();  //trim da remove la "white space" de la inceputul si sfarsitul cuvantului(string)
  
  if (text !== '') {
    addTodo(text);
    input.value = '';
    input.focus();
  }
});

/* eventul de bifat sau sters iteme din array  (check/delete)  */
const list = document.querySelector('.js-todo-list');           
list.addEventListener('click', event => {
	if(event.target.classList.contains('js-tick')){
		const itemKey = event.target.parentElement.dataset.key;
		toggleDone(itemKey);
	}
	
	if (event.target.classList.contains('js-delete-todo')) {
    const itemKey = event.target.parentElement.dataset.key;
    deleteTodo(itemKey);
  }
});

/* 
   salveaza itemele in web 
   in caz ca dai reload la pagina raman itemele acolo
*/

document.addEventListener('DOMContentLoaded', () => {
  const ref = localStorage.getItem('todoItemsRef');
  if (ref) {
    todoItems = JSON.parse(ref);
    todoItems.forEach(t => {
      renderTodo(t);
    });
  }
});

