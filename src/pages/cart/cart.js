import React from 'react'
import HomeStyle from '../home/home.less'
import cartStyle from './cart.less'
import { connect } from 'react-redux'
import Stepper from '../../components/stepper/stepper.js'
import {changeCheckboxAction,changeCheckedAllAction} from '../../store/actionCreate'
let $ = React.Component
class Cart extends ${
    render(){
        return <div className={cartStyle.wrap}>
                <div className={HomeStyle.header}>购物车</div>
                <div className={cartStyle.cart_list}>
                    <ul>
                        {this.props.cart.map((item,index)=>{
                            return <li key={item.id}>
                                <div className={cartStyle.checkbox}>
                                    <input name="checkbox" 
                                           type="checkbox" 
                                           className={cartStyle.cart_checkbox} 
                                           checked={item.checked}
                                           onChange={this.props.changeCheckbox.bind(this,index)}
                                           />
                                </div>
                                <div className={cartStyle.img}>{item.cover_url && <img src={item.cover_url} alt={item.description}/>}</div>
                                <div className={cartStyle.context}>
                                    <div className={cartStyle.title}>{item.title}</div>
                                    <div className={cartStyle.price}>{item.price} <span>元/斤</span></div>
                                    <div className={cartStyle.stepper}><Stepper cartItem={item}/></div>
                                </div>
                            </li>
                        })}
                    </ul>
                    <div className={cartStyle.footer}>
                        <div className={cartStyle.checkedAll}>
                            <input name="checkAll" 
                                    type="checkbox" 
                                    id="checkAll"
                                    className={cartStyle.cart_checkbox} 
                                    checked={this.props.checkedAll}
                                    onChange={this.props.changeCheckedAll.bind(this)}
                                    />
                            <label htmlFor="checkAll">全选</label>
                        </div>
                        <p>不含运费 合计：</p>
                        <div className={cartStyle.buyAll}>去结算</div>
                    </div>
                </div>
            </div>
    }
}
const mapStateToProps = (state)=>{
    return {
        cart:state.cart,
        checkedAll:state.checkedAll
    }
}

// 把dispatch 方法映射到props属性上
const mapDispatchToProps = (dispatch)=>{
    return {
        changeCheckbox(index){
            let action =  changeCheckboxAction(index)
            dispatch(action)
        },
        changeCheckedAll(){
            let action =  changeCheckedAllAction()
            dispatch(action)
        }
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Cart)