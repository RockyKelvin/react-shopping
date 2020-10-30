import React from 'react'
import tab from './tab.less'
import icon from '../../assets/icon_font/iconfont.module.css';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
let $ = React.Component
// 选项卡数据;
const tabs = [
        {name:'首页',path:'/home',icon:"&#xe65f;"},
        {name:'分类',path:'/category',icon:'&#xe61e;'},
        {name:'购物车',path:'/cart',icon:'&#xe7e7;'},
        {name:'我的',path:'/mine',icon:'&#xe60b;'}
    ]
class Index extends ${
    constructor(){
        super()
        this.state={
            activeIndex:0
        }
    }
    clickChange(index,path){
        let {history} = this.props
        this.setState({
            activeIndex:index
        },()=>{
            history.push(path)
        })
    }
    render(){
        return <div className={tab.index}>
            <div className={tab.tab}>
                <ul>
                    {tabs.map((item,index)=>{
                        return <li key={item.name} className={index===this.state.activeIndex ? tab.ac : null} 
                                onClick={this.clickChange.bind(this,index,item.path)}>
                            <i className={icon.iconfont} dangerouslySetInnerHTML={{ __html:item.icon }}></i>
                            <span>{item.name}</span>
                            {index===2 && this.props.totalInCart ? <i className={tab.totalIcon}>{this.props.totalInCart}</i> : null}
                        </li>
                    })}
                </ul>
            </div>
        </div>
    }
}
//得到全局数据映射到props属性上
const mapStateToProps = (state)=>{
    return {
       totalInCart:state.totalInCart
    }
}
export default withRouter(connect(mapStateToProps)(Index))
