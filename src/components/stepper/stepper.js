import React from 'react'
import style from './stepper.less'
import { connect } from 'react-redux'
import {
    addAmountAction,
    minusAmountAction
} from '../../store/actionCreate'

let $ = React.Component
class Stepper extends ${
    constructor(){
        super()
        Stepper._this = this
    }
    //init amount data to product_list
    componentDidMount(){
    }
    render(){
        return <div>
            <div className={style.stepper}>
               <div className={style.add} onClick={this.props.addAmount.bind(this)}> + </div>
               <div className={style.num}>{this.props.cartItem.amount}</div>
               <div className={style.min} onClick={this.props.minusAmount.bind(this)}> - </div>
            </div>
        </div>
    }
}
//得到全局数据映射到props属性上
const mapStateToProps = (state)=>{
    return {
        product_list:state.product_list,
        cart:state.cart
    }
}
// 把dispatch 方法映射到props属性上
const mapDispatchToProps = (dispatch)=>{
    return {
        addAmount(){
            let action = addAmountAction(this.props.cartItem)
            dispatch(action)
        },
        minusAmount(){
            if(this.props.cartItem.amount===0){
                return false
            }else{
                let action = minusAmountAction(this.props.cartItem)
                dispatch(action)
            }
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Stepper);
