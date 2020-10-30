import {
    getProducts_Action,
    addAmount_Action,
    minusAmount_Action,
    changeCheckbox_Action,
    changeCheckedAll_Action
} from './actionType'

const defaultState = {
        list:[],
        product_list:[],
        cart:[],
        totalInCart:0,
        checkedAll:true
    }
const updateCart = (newState)=>{
    let product_list = [...newState.product_list]
    let cart = [...newState.cart]

    product_list.forEach(element => {
       let index = cart.findIndex(item=>{
            return item.id === element.id
        })
        if(index>=0){
            element.amount = cart[index].amount
        }
        else{
            element.amount = 0
        }
    })
    let totalInCart = 0
    cart.forEach(item=>{
        totalInCart += item.amount
    })

    newState.product_list = product_list
    newState.cart = cart
    newState.totalInCart = totalInCart

    return newState
}
let reducer= (state = defaultState,action)=>{
    if(action.type===getProducts_Action){
        let newState = JSON.parse(JSON.stringify(state))
        newState.product_list = [...action.value]

        let updateState = updateCart(newState)
        return updateState;
    }
    if(action.type===addAmount_Action){
        let newState = JSON.parse(JSON.stringify(state))
        let cartItem = action.cartItem
        let index = newState.cart.findIndex((element)=>{
            return element.id===cartItem.id
        })
        if(index>=0){
            newState.cart[index].amount+=1
        } 
        else{
            cartItem.amount=1
            cartItem.checked=true
            newState.cart.push(cartItem)
        }  
        let updateState = updateCart(newState)
        return updateState;
    }
    if(action.type===minusAmount_Action){
        let newState = JSON.parse(JSON.stringify(state))
        let cartItem = action.cartItem
        let index = newState.cart.findIndex((element)=>{
            return element.id===cartItem.id
        })
        if(--newState.cart[index].amount===0){
            newState.cart.splice(index,1)
        }
        let updateState = updateCart(newState)
        return updateState;
    }
    if(action.type===changeCheckbox_Action){
        let newState = JSON.parse(JSON.stringify(state))
        newState.cart[action.index].checked = !newState.cart[action.index].checked

        let flag = newState.cart.every(item=>{
            return item.checked===true
        })
        newState.checkedAll=flag
        return newState
    }
    if(action.type===changeCheckedAll_Action){
        let newState = JSON.parse(JSON.stringify(state))
        newState.checkedAll = !newState.checkedAll
        newState.cart.forEach(item=>{
            item.checked = newState.checkedAll
        })
        return newState
    }
    return state
};

export default  reducer 