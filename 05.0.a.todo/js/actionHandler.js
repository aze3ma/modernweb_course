(function main(global) {
  let Observer = $injector.get('Observer')
  // state management logic
  let state = {};

  Observer.subscribe('action', function HandleActions(action){
    let items, item;
    let new_state = Object.assign({}, state) // create a shallow copy of the state
    switch(action.type) {
      case 'LOAD_STATE':
        new_state = action.state
      break;
      case 'ADD_LIST':
        if(state.todo_list_list.length<0) {
          new_state.selected_list = 0
        }
        new_state.todo_list_list = actions.ADD_LIST(state.todo_list_list, action)
      break;
      case 'SELECT_LIST':
        new_state = actions.SELECT_LIST(state, action)
      break;
      case 'REMOVE_LIST':
        new_state.todo_list_list  = actions.REMOVE_LIST(state.todo_list_list , action)
        if(new_state.todo_list_list.length<=state.selected_list) {
          new_state.selected_list = new_state.todo_list_list.length - 1
        }
      break;
      case 'ADD_ITEM':
        list = state.todo_list_list[state.selected_list]
        new_state.todo_list_list[state.selected_list] = actions.ADD_ITEM(list, action)
      break;
      case 'REMOVE_ITEM':
        list = state.todo_list_list[state.selected_list]
        new_state.todo_list_list[state.selected_list] = actions.REMOVE_ITEM(list, action)
      break;
      case 'TOGGLE_DONE_ITEM':
        items = new_state.todo_list_list[state.selected_list].items
        item = items[action.index]
        items[action.index] = actions.TOGGLE_DONE_ITEM(item, action)
      break;
      default: new_state = old_state
    }
    state = new_state
    Observer.publish('state.update', new_state)
  })


  let actions = {
    ADD_LIST(todo_list_list = [], action){
      // equivilant to todo_list_list.push(action.list) but creates a new list
      // that is the concatination of the todo_list_list and the new list
      return todo_list_list.concat([action.list])
    },
    REMOVE_LIST(todo_list_list = [], action){
      let list = todo_list_list
      // create 2 new arrays one before the index
      // and concat it with one after the index by 1 element
      return list.slice(0, action.index).concat(list.slice(action.index + 1))
    },
    SELECT_LIST(state = {}, action){
      // create a new state {}, then shallow copy the old state in it, then overide selected_list
      return Object.assign({}, state, { selected_list: action.index })
    },
    ADD_ITEM(todo_list = { items: [] }, action){
      // create a new list state with new item array
      return Object.assign({}, todo_list, {
        // this is equivilant to items.concat([action.item])
        items: [...todo_list.items, action.item]
      })
    },
    REMOVE_ITEM(todo_list = { items: [] }, { index }){
      return Object.assign({}, todo_list, {
        // equivilant to: items.slice(0, index).concat(items.slice(index + 1))
        items: [...todo_list.items.slice(0, index), ...todo_list.items.slice(index + 1)]
      })
    },
    TOGGLE_DONE_ITEM(item = {}, { done }){
      // create a new item {}, then copy the old item in it, then overide done
      return Object.assign({}, item, { done })
    }
  }

})(window)
