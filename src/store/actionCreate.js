import {
    getProducts_Action,
    addAmount_Action,
    minusAmount_Action,
    changeCheckbox_Action,
    changeCheckedAll_Action
} from './actionType'

export const getProductsAction=(res)=>{
    return {
        type: getProducts_Action,
        value:res
    }
}
export const addAmountAction=(cartItem)=>{
    return {
        type: addAmount_Action,
        cartItem
    }
}
export const minusAmountAction=(cartItem)=>{
    return {
        type: minusAmount_Action,
        cartItem
    }
}
export const changeCheckboxAction=(index)=>{
    return {
        type: changeCheckbox_Action,
        index
    }
}
export const changeCheckedAllAction=()=>{
    return {
        type: changeCheckedAll_Action
    }
}